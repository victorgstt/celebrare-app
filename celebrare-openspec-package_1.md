# Pacote OpenSpec — Celebrare MVP

Copie cada seção abaixo para o arquivo correspondente na estrutura de pastas indicada.
Estrutura esperada pelo OpenSpec:

```
openspec/
├── project.md
└── changes/
    └── add-celebrare-mvp-core/
        ├── proposal.md
        ├── design.md
        ├── tasks.md
        └── specs/
            ├── user-management/spec.md
            ├── event-management/spec.md
            ├── guest-rsvp/spec.md
            ├── gift-registry/spec.md
            └── event-content/spec.md
```

---

## ARQUIVO: openspec/project.md

```markdown
# Celebrare

## Contexto
Celebrare é uma plataforma SaaS que permite a organizadores de eventos
(casamentos, aniversários, chás de bebê, eventos corporativos) criar um site
personalizável para seu evento sem conhecimento técnico, gerenciar
confirmações de presença (RSVP), receber presentes com pagamento via Pix, e
oferecer uma experiência interativa aos convidados (mural de recados,
galeria de fotos).

## Stack
- Backend: Java 21, Spring Boot 3.x, Spring Data JPA, Spring Security (JWT)
- Banco de dados: PostgreSQL 16 (Docker local)
- Frontend: React
- Pagamentos: Mercado Pago (Pix)
- Build: Maven

## Convenções
- Pacote raiz: `com.celebrare.api`
- Estrutura por feature (não por camada): `com.celebrare.api.<feature>`
- Entidades: PascalCase singular (`Event`), tabelas: snake_case plural (`events`)
- Enums: `@Enumerated(EnumType.STRING)`, valores em inglês maiúsculo
- IDs: UUID (não Long autoincremental), gerados via `GenerationType.UUID`
- Timestamps de criação: `@CreationTimestamp` (Hibernate) nos campos `createdAt`
- Nenhum setter público para `id` e `createdAt` — imutáveis após persistência
- Sem Lombok neste projeto (decisão deliberada, fins de aprendizado)
- `ddl-auto=update` apenas em ambiente local; produção usará Flyway (futuro)

## Restrição de processo (importante)
Este projeto é usado como estudo prático por um desenvolvedor júnior em
transição para pleno. Specs e tasks devem detalhar o *o quê* e o *por quê*,
mas a *implementação de código* é feita manualmente pelo desenvolvedor,
task por task, com revisão humana (mentoria) entre cada etapa — não deve
ser gerada em lote por um agente.
```

---

## ARQUIVO: openspec/changes/add-celebrare-mvp-core/proposal.md

```markdown
# Proposal: Celebrare MVP Core Domain

## Why
Precisamos do núcleo de domínio do Celebrare: usuários (organizadores),
eventos, convidados com RSVP, lista de presentes com pagamento, e conteúdo
interativo (mural de recados, galeria). Este é o alicerce sobre o qual a
API REST, autenticação e integração de pagamento serão construídas.

## What Changes
- ADD: entidade `User` (organizador do evento)
- ADD: entidade `Event` (o "site" do evento, com tema customizável)
- ADD: entidades `Guest` e `Rsvp` (convidado e confirmação de presença)
- ADD: entidades `Gift` e `GiftContribution` (lista de presentes + pagamento)
- ADD: entidades `GuestMessage` e `GalleryPhoto` (mural + galeria)
- ADD: enums `EventType`, `EventStatus`, `GiftType`, `PaymentStatus`

## Impact
- Capabilities afetadas: user-management, event-management, guest-rsvp,
  gift-registry, event-content
- Sem impacto em specs existentes (projeto greenfield)
- Não inclui ainda: Controllers REST, autenticação JWT, integração real
  com Mercado Pago, editor de tema (themeConfig) — ficam para changes
  futuras (`add-celebrare-auth`, `add-celebrare-payments`,
  `add-celebrare-theme-editor`)
```

---

## ARQUIVO: openspec/changes/add-celebrare-mvp-core/design.md

```markdown
# Design: Celebrare MVP Core Domain

## Decisões técnicas

### Multi-tenancy
Estratégia de coluna discriminadora (`event_id` como FK em todas as tabelas
filhas), não schema-per-tenant. Toda query de convidado/presente/recado/foto
deve filtrar por `event_id`, e a camada de segurança (futura) deve validar
que o usuário autenticado é o `owner` do evento antes de qualquer operação.

### Acesso do convidado sem autenticação
`Guest` não terá login/senha. Cada convidado recebe um `inviteToken` (UUID)
único, usado como parâmetro na URL do convite. Isso evita fricção de conta
para quem só vai confirmar presença ou deixar um recado.

### Pagamento de presentes
`GiftContribution.paymentStatus` começa em `PENDING`. A confirmação para
`APPROVED` deve vir apenas via webhook do Mercado Pago (change futura),
nunca setada diretamente na resposta síncrona da criação da contribuição.

### Relacionamentos e fetch strategy
- `Event.owner` (`@ManyToOne` para `User`): LAZY. Justificativa: listagens
  de eventos não devem carregar o usuário dono automaticamente; isso deve
  ser buscado explicitamente quando necessário (evita N+1 e overfetching).
- `Rsvp.guest` (`@OneToOne`): LAZY.
- Coleções (`Guest.rsvp`, `Gift.contributions`): não mapear o lado inverso
  como coleção JPA neste momento — buscar via Repository com query
  dedicada (`findByEventId`), evitando coleções gigantes carregadas por
  engano.

### Enums
Todos mapeados com `@Enumerated(EnumType.STRING)`. Justificativa: `ORDINAL`
quebra silenciosamente se a ordem/declaração dos valores mudar no futuro
(ex: inserir um novo tipo no meio do enum desloca todos os valores já
salvos no banco). `STRING` é mais verboso no banco, mas seguro.

### themeConfig fora de escopo
O campo de customização visual do site (JSON schema-driven) será tratado
em change separada, pois requer um `AttributeConverter` customizado
(JPA `@Convert`) — conteúdo ainda não estudado no plano de aprendizado.
```

---

## ARQUIVO: openspec/changes/add-celebrare-mvp-core/tasks.md

```markdown
# Tasks: Celebrare MVP Core Domain

## 1. User
- [x] 1.1 Criar entidade `User` (id UUID, name, email único, passwordHash, createdAt)
- [x] 1.2 Criar `UserRepository extends JpaRepository<User, UUID>`

## 2. Event
- [ ] 2.1 Criar enum `EventType` (WEDDING, BIRTHDAY, BABY_SHOWER, CORPORATE, OTHER)
- [ ] 2.2 Criar enum `EventStatus` (DRAFT, PUBLISHED)
- [ ] 2.3 Criar entidade `Event` (id, owner [ManyToOne LAZY], slug único,
      eventType, status default DRAFT, eventDate, venueName, venueAddress, createdAt)
- [ ] 2.4 Criar `EventRepository extends JpaRepository<Event, UUID>`

## 3. Guest & Rsvp
- [ ] 3.1 Criar entidade `Guest` (id, eventId, name, email, phone, inviteToken UUID, guestGroup opcional)
- [ ] 3.2 Criar entidade `Rsvp` (id, guest [OneToOne LAZY], confirmed, adultsCount,
      childrenCount, dietaryRestriction, respondedAt)
- [ ] 3.3 Criar `GuestRepository` com query `findByEventId(UUID eventId)`
- [ ] 3.4 Criar `RsvpRepository`

## 4. Gift & GiftContribution
- [ ] 4.1 Criar enum `GiftType` (PHYSICAL_ITEM, CASH_CONTRIBUTION, FREE_PIX)
- [ ] 4.2 Criar enum `PaymentStatus` (PENDING, APPROVED, REJECTED)
- [ ] 4.3 Criar entidade `Gift` (id, eventId, name, description, photoUrl,
      suggestedAmount, giftType, status)
- [ ] 4.4 Criar entidade `GiftContribution` (id, gift [ManyToOne LAZY],
      guest opcional, amount, message, paymentStatus default PENDING, externalPaymentId)
- [ ] 4.5 Criar `GiftRepository` e `GiftContributionRepository`

## 5. Event Content (mural + galeria)
- [ ] 5.1 Criar entidade `GuestMessage` (id, eventId, guest opcional, message, createdAt)
- [ ] 5.2 Criar entidade `GalleryPhoto` (id, eventId, guest opcional, url, createdAt)
- [ ] 5.3 Criar `GuestMessageRepository` e `GalleryPhotoRepository`

## 6. Validação manual (checkpoint de aprendizado)
- [ ] 6.1 Escrever teste manual (ou uso do `CommandLineRunner`) validando que
      um `User` com `name` em branco lança `ConstraintViolationException` ao salvar
- [ ] 6.2 Explicar por escrito (comentário/README) a escolha LAZY vs EAGER
      feita em `Event.owner`
- [ ] 6.3 Explicar por escrito a escolha `STRING` vs `ORDINAL` nos enums
```

---

## ARQUIVO: openspec/changes/add-celebrare-mvp-core/specs/user-management/spec.md

```markdown
# Spec: User Management

## ADDED Requirements

### Requirement: User Registration Data
O sistema DEVE armazenar organizadores de evento com nome, e-mail único,
hash de senha e data de criação.

#### Scenario: E-mail duplicado
- **WHEN** um novo usuário tenta ser persistido com um e-mail já existente
- **THEN** o sistema DEVE rejeitar a operação (constraint de unicidade)

#### Scenario: Campos obrigatórios ausentes
- **WHEN** um usuário é persistido com `name`, `email` ou `passwordHash` em branco
- **THEN** o sistema DEVE lançar `ConstraintViolationException` antes do INSERT
```

---

## ARQUIVO: openspec/changes/add-celebrare-mvp-core/specs/event-management/spec.md

```markdown
# Spec: Event Management

## ADDED Requirements

### Requirement: Event Ownership
Todo evento DEVE pertencer a exatamente um `User` (owner).

#### Scenario: Evento sem slug único
- **WHEN** um evento é criado com um `slug` já utilizado por outro evento
- **THEN** o sistema DEVE rejeitar a operação

### Requirement: Event Default Status
Todo evento novo DEVE nascer com status `DRAFT`, exceto quando explicitamente
definido como `PUBLISHED`.

#### Scenario: Criação sem status explícito
- **WHEN** um evento é instanciado sem status definido
- **THEN** o status DEVE ser `DRAFT` por padrão
```

---

## ARQUIVO: openspec/changes/add-celebrare-mvp-core/specs/guest-rsvp/spec.md

```markdown
# Spec: Guest RSVP

## ADDED Requirements

### Requirement: Guest Access Without Account
Convidados DEVEM poder confirmar presença sem necessidade de criar conta,
usando um token único de convite.

#### Scenario: Acesso via token
- **WHEN** um convidado acessa o link de RSVP com seu `inviteToken`
- **THEN** o sistema DEVE identificar o convidado sem exigir login

### Requirement: RSVP Response
Cada convidado DEVE poder registrar confirmação (sim/não), número de
adultos, número de crianças e restrição alimentar.
```

---

## ARQUIVO: openspec/changes/add-celebrare-mvp-core/specs/gift-registry/spec.md

```markdown
# Spec: Gift Registry

## ADDED Requirements

### Requirement: Gift Contribution Payment Flow
Toda contribuição de presente DEVE iniciar com status `PENDING` e só DEVE
transicionar para `APPROVED` mediante confirmação assíncrona (webhook) do
provedor de pagamento.

#### Scenario: Confirmação de pagamento
- **WHEN** o provedor de pagamento notifica aprovação via webhook
- **THEN** o sistema DEVE atualizar `paymentStatus` para `APPROVED`

#### Scenario: Contribuição anônima
- **WHEN** uma contribuição é registrada sem `guest` associado
- **THEN** o sistema DEVE aceitar a contribuição como anônima
```

---

## ARQUIVO: openspec/changes/add-celebrare-mvp-core/specs/event-content/spec.md

```markdown
# Spec: Event Content

## ADDED Requirements

### Requirement: Guest Messages and Gallery
Convidados DEVEM poder deixar mensagens no mural e enviar fotos para a
galeria do evento, de forma opcionalmente identificada.

#### Scenario: Mensagem anônima
- **WHEN** uma mensagem é registrada sem `guest` associado
- **THEN** o sistema DEVE aceitar a mensagem como anônima
```

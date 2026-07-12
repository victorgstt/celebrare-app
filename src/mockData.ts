import type { User, Event, Guest, Rsvp, Gift, GiftContribution, GuestMessage, GalleryPhoto } from './types';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Ana Silva',
    email: 'ana@example.com',
    createdAt: '2026-06-01T10:00:00Z',
  }
];

export const mockEvents: Event[] = [
  {
    id: 'event-1',
    ownerId: 'user-1',
    slug: 'mariana-gustavo-2026',
    title: 'Mariana & Gustavo',
    eventType: 'WEDDING',
    status: 'PUBLISHED',
    eventDate: '2026-10-17T17:00:00Z',
    venueName: 'Espaço das Flores',
    venueAddress: 'Av. das Hortênsias, 1200 - Gramado, RS',
    createdAt: '2026-06-05T14:30:00Z',
    themeConfig: {
      primaryColor: '#6B1D2F', // Burgundy
      secondaryColor: '#D4AF37', // Gold
      backgroundColor: '#FAF7F2', // Soft ivory
      layoutTheme: 'classic',
      fontTitle: 'Playfair Display',
      fontBody: 'Outfit',
      backgroundImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200',
      welcomeText: 'Sejam bem-vindos ao site do nosso casamento! Aqui vocês encontrarão todas as informações sobre o RSVP, nossa lista de presentes e poderão compartilhar mensagens conosco.',
      showCountdown: true,
      showMural: true,
      showGallery: true,
      schedule: [
        { id: 'sch-1', time: '17:00', activity: 'Cerimônia Religiosa' },
        { id: 'sch-2', time: '18:30', activity: 'Recepção e Coquetel' },
        { id: 'sch-3', time: '20:00', activity: 'Jantar dos Convidados' },
        { id: 'sch-4', time: '22:00', activity: 'Abertura da Pista de Dança' }
      ],
      // Website Builder additions
      headerStyle: 'classic_hero',
      cardStyle: 'frosted',
      borderStyle: 'rounded',
      bgPattern: 'leaves',
      showStory: true,
      storyTitle: 'Nossa História',
      storyText: 'Nos conhecemos na faculdade em 2018. O que começou com grupos de estudos logo virou uma grande amizade e, em seguida, um amor para a vida inteira. Hoje damos o passo mais feliz de nossas vidas!',
      storyTimeline: [
        { id: 'st-1', year: '2018', title: 'O Encontro', desc: 'Nos conhecemos nas aulas de física da faculdade.' },
        { id: 'st-2', year: '2020', title: 'O Namoro', desc: 'O pedido oficial em uma viagem no topo da serra.' },
        { id: 'st-3', year: '2025', title: 'O Pedido', desc: 'Dissemos "sim" ao noivado sob o pôr do sol na praia.' }
      ],
      rsvpHeading: 'Confirmação de Presença',
      rsvpIntro: 'Sua presença é essencial para nós! Por favor, confirme até dia 30 de setembro.',
      giftsHeading: 'Lista de Presentes Pix',
      giftsIntro: 'Quer nos presentear? Escolha uma das cotas abaixo. Os valores serão transferidos diretamente para nossa conta e convertidos em nossa viagem de lua de mel.',
      muralHeading: 'Mural de Carinho',
      muralIntro: 'Escreva um recado especial! Suas palavras significam muito para nós.',
      galleryHeading: 'Galeria Coletiva',
      galleryIntro: 'Suba aqui as fotos que você tirar durante nossa festa para montarmos um lindo álbum!',
      sectionOrder: ['welcome', 'location', 'story', 'schedule', 'rsvp', 'gifts', 'mural', 'gallery']
    }
  },
  {
    id: 'event-2',
    ownerId: 'user-1',
    slug: 'leo-30-anos',
    title: 'De Repente 30 do Léo',
    eventType: 'BIRTHDAY',
    status: 'DRAFT',
    eventDate: '2026-11-05T20:00:00Z',
    venueName: 'Rooftop Lounge 84',
    venueAddress: 'Rua Augusta, 450 - Consolação, São Paulo, SP',
    createdAt: '2026-07-01T09:00:00Z',
    themeConfig: {
      primaryColor: '#10B981', // Emerald green
      secondaryColor: '#3B82F6', // Cobalt blue
      backgroundColor: '#090A0F', // Dark theme background
      layoutTheme: 'neon',
      fontTitle: 'Outfit',
      fontBody: 'Inter',
      backgroundImageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=1200',
      welcomeText: 'Trintando com estilo! Venha comemorar comigo essa nova década com muito open bar, música boa e ótimas risadas.',
      showCountdown: true,
      showMural: true,
      showGallery: false,
      schedule: [
        { id: 'sch-5', time: '20:00', activity: 'Recepção e Welcome Drinks' },
        { id: 'sch-6', time: '21:30', activity: 'Início do Open Bar & DJ' },
        { id: 'sch-7', time: '00:00', activity: 'Parabéns e Corte do Bolo' }
      ],
      // Website Builder additions
      headerStyle: 'split_hero',
      cardStyle: 'glass',
      borderStyle: 'pill',
      bgPattern: 'none',
      showStory: true,
      storyTitle: 'Sobre Mim',
      storyText: '30 anos se passaram e eu só tenho a agradecer! Cheguei na melhor fase da minha vida e quero celebrar com todos os amigos que fizeram parte dessa jornada.',
      storyTimeline: [],
      rsvpHeading: 'Confirmar Presença',
      rsvpIntro: 'Garanta seu nome na lista! Confirme até 1º de novembro.',
      giftsHeading: 'Presentes para o Aniversariante',
      giftsIntro: 'Se quiser me dar um presente, separei algumas cotas divertidas de cerveja, churrasco e viagens abaixo!',
      muralHeading: 'Deixe seus Parabéns',
      muralIntro: 'Escreva um recado de aniversário aqui!',
      galleryHeading: 'Fotos da Festa',
      galleryIntro: 'Envie as fotos do rolê direto para mim.',
      sectionOrder: ['welcome', 'location', 'story', 'schedule', 'rsvp', 'gifts', 'mural', 'gallery']
    }
  }
];

export const mockGuests: Guest[] = [
  {
    id: 'guest-1',
    eventId: 'event-1',
    name: 'Carlos Santos',
    email: 'carlos@example.com',
    phone: '(11) 99999-1111',
    inviteToken: 'token-carlos',
    guestGroup: 'Família Noivo',
  },
  {
    id: 'guest-2',
    eventId: 'event-1',
    name: 'Beatriz Costa',
    email: 'beatriz@example.com',
    phone: '(11) 99999-2222',
    inviteToken: 'token-beatriz',
    guestGroup: 'Padrinhos',
  },
  {
    id: 'guest-3',
    eventId: 'event-1',
    name: 'Ricardo Almeida',
    email: 'ricardo@example.com',
    phone: '(21) 98888-3333',
    inviteToken: 'token-ricardo',
    guestGroup: 'Amigos Facul',
  },
  {
    id: 'guest-4',
    eventId: 'event-1',
    name: 'Juliana Pires',
    email: 'juliana@example.com',
    phone: '(51) 97777-4444',
    inviteToken: 'token-juliana',
    guestGroup: 'Trabalho Noiva',
  }
];

export const mockRsvps: Rsvp[] = [
  {
    id: 'rsvp-1',
    guestId: 'guest-1',
    confirmed: true,
    adultsCount: 2,
    childrenCount: 1,
    dietaryRestriction: 'Sem glúten para o filho',
    respondedAt: '2026-06-10T15:20:00Z',
  },
  {
    id: 'rsvp-2',
    guestId: 'guest-2',
    confirmed: true,
    adultsCount: 2,
    childrenCount: 0,
    dietaryRestriction: 'Vegetariana',
    respondedAt: '2026-06-12T10:05:00Z',
  },
  {
    id: 'rsvp-3',
    guestId: 'guest-3',
    confirmed: false,
    adultsCount: 0,
    childrenCount: 0,
    respondedAt: '2026-06-15T18:45:00Z',
  }
];

export const mockGifts: Gift[] = [
  {
    id: 'gift-1',
    eventId: 'event-1',
    name: 'Jogo de Jantar Oxford 30 Peças',
    description: 'Um lindo conjunto de porcelana para nossas refeições em família.',
    photoUrl: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=400',
    suggestedAmount: 450,
    giftType: 'PHYSICAL_ITEM',
    status: 'ACTIVE',
  },
  {
    id: 'gift-2',
    eventId: 'event-1',
    name: 'Cota de Lua de Mel em Paris - Jantar Romântico',
    description: 'Contribua com nosso jantar especial de frente para a Torre Eiffel.',
    photoUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=400',
    suggestedAmount: 200,
    giftType: 'CASH_CONTRIBUTION',
    status: 'ACTIVE',
  },
  {
    id: 'gift-3',
    eventId: 'event-1',
    name: 'Smart TV 55" 4K UHD',
    description: 'Para nossas sessões de cinema de fim de semana na casa nova.',
    photoUrl: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80&w=400',
    suggestedAmount: 2200,
    giftType: 'PHYSICAL_ITEM',
    status: 'ACTIVE',
  },
  {
    id: 'gift-4',
    eventId: 'event-1',
    name: 'Pix Livre para os Noivos',
    description: 'Quer nos presentear com qualquer outro valor? Use esta opção livre!',
    photoUrl: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&q=80&w=400',
    giftType: 'FREE_PIX',
    status: 'ACTIVE',
  },
  {
    id: 'gift-birthday-1',
    eventId: 'event-2',
    name: 'Cota de Cerveja Artesanal para o Rolê',
    description: 'Pague uma rodada de chopp para o aniversariante comemorar!',
    photoUrl: 'https://images.unsplash.com/photo-1532634922-8fe0b757fb13?auto=format&fit=crop&q=80&w=400',
    suggestedAmount: 50,
    giftType: 'CASH_CONTRIBUTION',
    status: 'ACTIVE',
  },
  {
    id: 'gift-birthday-2',
    eventId: 'event-2',
    name: 'Cota para o Jantar de Comemoração',
    description: 'Ajude a pagar o rodízio de pizza ou comida japonesa do aniversariante.',
    photoUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400',
    suggestedAmount: 120,
    giftType: 'CASH_CONTRIBUTION',
    status: 'ACTIVE',
  },
  {
    id: 'gift-birthday-3',
    eventId: 'event-2',
    name: 'Pix de Aniversário (Valor Livre)',
    description: 'Quer mandar um agrado em dinheiro? Qualquer valor é super bem-vindo!',
    photoUrl: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&q=80&w=400',
    giftType: 'FREE_PIX',
    status: 'ACTIVE',
  }
];

export const mockGiftContributions: GiftContribution[] = [
  {
    id: 'contrib-1',
    giftId: 'gift-1',
    guestName: 'Carlos Santos',
    amount: 450,
    message: 'Parabéns ao casal! Que Deus abençoe essa união.',
    paymentStatus: 'APPROVED',
    externalPaymentId: 'mp-pay-999202029',
    createdAt: '2026-06-10T15:25:00Z',
  },
  {
    id: 'contrib-2',
    giftId: 'gift-2',
    guestName: 'Beatriz Costa',
    amount: 200,
    message: 'Aproveitem muito Paris! Vocês merecem.',
    paymentStatus: 'APPROVED',
    externalPaymentId: 'mp-pay-888373711',
    createdAt: '2026-06-12T10:10:00Z',
  },
  {
    id: 'contrib-3',
    giftId: 'gift-3',
    guestName: 'Tia Lurdes (Anônimo)',
    amount: 500,
    message: 'Um ajuda para a TV de vocês. Com amor, tia Lurdes.',
    paymentStatus: 'PENDING',
    externalPaymentId: 'mp-pay-111192934',
    createdAt: '2026-07-10T19:00:00Z',
  }
];

export const mockGuestMessages: GuestMessage[] = [
  {
    id: 'msg-1',
    eventId: 'event-1',
    guestName: 'Marta Ribeiro',
    message: 'Estou muito ansiosa para esse grande dia! Que vocês sejam imensamente felizes.',
    createdAt: '2026-06-08T09:15:00Z',
    approved: true,
  },
  {
    id: 'msg-2',
    eventId: 'event-1',
    guestName: 'Felipe & Carol',
    message: 'Vai ser a festa do ano! Preparem o fígado, estamos chegando!',
    createdAt: '2026-06-09T14:40:00Z',
    approved: true,
  },
  {
    id: 'msg-3',
    eventId: 'event-1',
    guestName: 'Pedro Souza',
    message: 'Infelizmente não poderei comparecer devido a uma viagem de trabalho, mas desejo tudo de melhor pra vocês!',
    createdAt: '2026-06-11T11:20:00Z',
    approved: false, // pending approval in dashboard
  }
];

export const mockGalleryPhotos: GalleryPhoto[] = [
  {
    id: 'photo-1',
    eventId: 'event-1',
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=400',
    guestName: 'Beatriz Costa',
    createdAt: '2026-06-12T10:15:00Z',
    approved: true,
  },
  {
    id: 'photo-2',
    eventId: 'event-1',
    url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=400',
    guestName: 'Carlos Santos',
    createdAt: '2026-06-13T16:00:00Z',
    approved: true,
  },
  {
    id: 'photo-3',
    eventId: 'event-1',
    url: 'https://images.unsplash.com/photo-1519225495810-7517c24a2ed3?auto=format&fit=crop&q=80&w=400',
    guestName: 'Juliana Pires',
    createdAt: '2026-07-11T20:30:00Z',
    approved: false, // pending approval in dashboard
  }
];

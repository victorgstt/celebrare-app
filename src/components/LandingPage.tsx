import React, { useState } from 'react';
import { Sparkles, ArrowRight, Gift, Calendar, Users, MessageSquare, Search, ChevronRight, Sun, Moon } from 'lucide-react';
import type { Event } from '../types';

interface LandingPageProps {
  events: Event[];
  onNavigateToDashboard: () => void;
  onNavigateToEvent: (slug: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  events,
  onNavigateToDashboard,
  onNavigateToEvent,
  theme,
  toggleTheme
}) => {
  const [slugSearch, setSlugSearch] = useState('');
  const [searchError, setSearchError] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSlug = slugSearch.trim().toLowerCase();
    const eventExists = events.some(evt => evt.slug === cleanSlug);
    
    if (eventExists) {
      onNavigateToEvent(cleanSlug);
      setSearchError('');
    } else {
      setSearchError('Evento não encontrado. Tente "mariana-gustavo-2026".');
    }
  };

  return (
    <div className="animate-fade-in" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header / Navbar */}
      <header className="glass-panel" style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderRadius: 0,
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        padding: '16px 0',
        background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', backdropFilter: 'blur(var(--blur-glass))', WebkitBackdropFilter: 'blur(var(--blur-glass))'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            <Sparkles size={24} color="#6366f1" />
            <span>Celebrare</span>
            <span style={{ fontSize: '0.65rem', background: 'var(--primary)', color: '#fff', padding: '2px 6px', borderRadius: 4, alignSelf: 'flex-start' }}>MVP</span>
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <button 
              onClick={toggleTheme}
              className="btn btn-secondary"
              style={{ padding: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}
              title={theme === 'light' ? 'Mudar para Tema Escuro' : 'Mudar para Tema Claro'}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button 
              onClick={onNavigateToDashboard}
              className="btn btn-secondary" 
              style={{ padding: '8px 16px', fontSize: '0.9rem' }}
            >
              Área do Organizador
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '100px 0 80px 0',
        background: 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.12), transparent 40%), radial-gradient(circle at bottom left, rgba(236, 72, 153, 0.08), transparent 40%)'
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
          <div className="badge badge-primary animate-fade-in-up" style={{ marginBottom: 20 }}>
            ✨ Crie o site perfeito para o seu momento
          </div>
          
          <h1 className="animate-fade-in-up hero-title-gradient" style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            marginBottom: 24
          }}>
            Celebrar nunca foi tão prático.
          </h1>
          
          <p className="animate-fade-in-up" style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
            color: 'var(--text-secondary)',
            marginBottom: 40,
            lineHeight: 1.6
          }}>
            Crie um site de casamento ou aniversário personalizável, gerencie RSVP sem fricção, receba presentes convertidos em dinheiro e crie uma experiência inesquecível para seus convidados.
          </p>

          <div className="animate-fade-in-up" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
            marginBottom: 48
          }}>
            <button 
              onClick={onNavigateToDashboard}
              className="btn btn-primary" 
              style={{ fontSize: '1.05rem', padding: '14px 32px' }}
            >
              Criar Meu Evento Grátis <ArrowRight size={18} />
            </button>

            {/* Quick Access Search */}
            <form onSubmit={handleSearch} style={{
              width: '100%',
              maxWidth: '480px',
              marginTop: 12
            }}>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  placeholder="Acessar site de convidado (ex: mariana-gustavo-2026)"
                  value={slugSearch}
                  onChange={(e) => {
                    setSlugSearch(e.target.value);
                    if (searchError) setSearchError('');
                  }}
                  className="glass-input"
                  style={{
                    paddingLeft: 44,
                    paddingRight: 100,
                    borderRadius: '50px',
                    borderColor: searchError ? 'var(--error)' : 'var(--border-color)'
                  }}
                />
                <Search size={18} className="text-secondary" style={{
                  position: 'absolute',
                  left: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-secondary)'
                }} />
                <button type="submit" className="btn btn-primary" style={{
                  position: 'absolute',
                  right: 4,
                  top: 4,
                  bottom: 4,
                  padding: '0 16px',
                  borderRadius: '50px',
                  fontSize: '0.85rem'
                }}>
                  Buscar
                </button>
              </div>
              {searchError && (
                <div style={{ color: 'var(--error)', fontSize: '0.85rem', marginTop: 8, textAlign: 'left', paddingLeft: 16 }}>
                  {searchError}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="section-padding" style={{ borderTop: '1px solid var(--border-color)', background: 'rgba(255, 255, 255, 0.01)' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: 48, fontSize: '2rem', fontWeight: 700 }}>
            Tudo o que você precisa para o seu evento
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24
          }}>
            {/* Feature 1 */}
            <div className="glass-panel" style={{ padding: 32 }}>
              <div style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifySelf: 'start', justifyContent: 'center', marginBottom: 20 }}>
                <Calendar size={24} />
              </div>
              <h3 style={{ marginBottom: 12, fontSize: '1.25rem' }}>Sites Personalizados</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Crie um site elegante com as cores, fotos e detalhes do seu evento em poucos cliques, sem código.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-panel" style={{ padding: 32 }}>
              <div style={{ background: 'rgba(236, 72, 153, 0.1)', color: 'var(--accent)', width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifySelf: 'start', justifyContent: 'center', marginBottom: 20 }}>
                <Users size={24} />
              </div>
              <h3 style={{ marginBottom: 12, fontSize: '1.25rem' }}>RSVP Sem Fricção</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Convidados confirmam presença via link com token único. Sem necessidade de logins complicados.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-panel" style={{ padding: 32 }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifySelf: 'start', justifyContent: 'center', marginBottom: 20 }}>
                <Gift size={24} />
              </div>
              <h3 style={{ marginBottom: 12, fontSize: '1.25rem' }}>Lista de Presentes Pix</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Crie uma lista de presentes fictícia e receba o valor integral diretamente na sua conta bancária via Pix.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="glass-panel" style={{ padding: 32 }}>
              <div style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifySelf: 'start', justifyContent: 'center', marginBottom: 20 }}>
                <MessageSquare size={24} />
              </div>
              <h3 style={{ marginBottom: 12, fontSize: '1.25rem' }}>Mural de Recados & Galeria</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Permita que os convidados publiquem fotos tiradas no dia e deixem recados carinhosos direto no site.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Events List */}
      <section className="section-padding" style={{ borderTop: '1px solid var(--border-color)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: 32, fontSize: '1.75rem' }}>Exemplo de Evento Disponível</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 24 }}>
            Explore o portal público (vista do convidado) clicando no link abaixo:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {events.filter(e => e.status === 'PUBLISHED').map(evt => (
              <div 
                key={evt.id} 
                className="glass-panel"
                style={{ 
                  padding: 20, 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
                onClick={() => onNavigateToEvent(evt.slug)}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{evt.title}</span>
                    <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>{evt.eventType}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                    Slug: <code>{evt.slug}</code> | Data: {new Date(evt.eventDate).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>
                  Acessar Site Convidado <ChevronRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass-panel" style={{
        marginTop: 'auto',
        borderRadius: 0,
        borderBottom: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        padding: '32px 0',
        background: 'var(--bg-card)',
        textAlign: 'center',
        fontSize: '0.85rem',
        color: 'var(--text-muted)'
      }}>
        <div className="container">
          <p>© {new Date().getFullYear()} Celebrare Platform. Feito para organizar momentos memoráveis.</p>
          <p style={{ marginTop: 8 }}>Estudo prático desenvolvido com base na OpenSpec.</p>
        </div>
      </footer>
    </div>
  );
};

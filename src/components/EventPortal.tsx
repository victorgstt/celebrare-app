import React, { useState, useEffect } from 'react';
import { 
  Calendar, MapPin, Gift, MessageSquare, Camera, 
  Info, Heart, Clipboard, QrCode, X, CheckCircle2, Palette, Sparkles
} from 'lucide-react';
import type { 
  Event, Guest, Rsvp, Gift as GiftItem, GiftContribution, GuestMessage, GalleryPhoto 
} from '../types';

interface EventPortalProps {
  event: Event;
  guests: Guest[];
  rsvps: Rsvp[];
  gifts: GiftItem[];
  messages: GuestMessage[];
  photos: GalleryPhoto[];
  inviteToken?: string;
  onAddRsvp: (rsvp: Omit<Rsvp, 'id' | 'respondedAt'>) => void;
  onAddContribution: (contrib: Omit<GiftContribution, 'id' | 'createdAt' | 'paymentStatus' | 'externalPaymentId'>) => void;
  onAddMessage: (msg: Omit<GuestMessage, 'id' | 'createdAt' | 'approved'>) => void;
  onAddPhoto: (photo: Omit<GalleryPhoto, 'id' | 'createdAt' | 'approved'>) => void;
  onBackToHome: () => void;
  onUpdateEventTheme?: (eventId: string, themeConfig: NonNullable<Event['themeConfig']>) => void;
}

export const EventPortal: React.FC<EventPortalProps> = ({
  event,
  guests,
  rsvps,
  gifts,
  messages,
  photos,
  inviteToken,
  onAddRsvp,
  onAddContribution,
  onAddMessage,
  onAddPhoto,
  onBackToHome,
  onUpdateEventTheme
}) => {
  // Visual Builder states
  const [isBuilderMode, setIsBuilderMode] = useState<boolean>(false);
  const [editableTheme, setEditableTheme] = useState<NonNullable<Event['themeConfig']>>({
    primaryColor: event.themeConfig?.primaryColor || '#6B1D2F',
    secondaryColor: event.themeConfig?.secondaryColor || '#D4AF37',
    ...event.themeConfig
  });
  const [isSaveSuccess, setIsSaveSuccess] = useState<boolean>(false);

  useEffect(() => {
    setEditableTheme({
      primaryColor: event.themeConfig?.primaryColor || '#6B1D2F',
      secondaryColor: event.themeConfig?.secondaryColor || '#D4AF37',
      ...event.themeConfig
    });
  }, [event.themeConfig]);

  const handleEditBanner = () => {
    if (!isBuilderMode) return;
    const newVal = prompt(`Editar URL da imagem de capa:`, editableTheme.backgroundImageUrl || '');
    if (newVal !== null) {
      setEditableTheme(prev => ({
        ...prev,
        backgroundImageUrl: newVal
      }));
    }
  };

  const moveSection = (key: string, direction: 'up' | 'down') => {
    const currentOrder = editableTheme?.sectionOrder || ['welcome', 'location', 'story', 'schedule', 'rsvp', 'gifts', 'mural', 'gallery'];
    const index = currentOrder.indexOf(key);
    if (index === -1) return;
    const newOrder = [...currentOrder];
    
    if (direction === 'up' && index > 0) {
      const temp = newOrder[index - 1];
      newOrder[index - 1] = newOrder[index];
      newOrder[index] = temp;
    } else if (direction === 'down' && index < newOrder.length - 1) {
      const temp = newOrder[index + 1];
      newOrder[index + 1] = newOrder[index];
      newOrder[index] = temp;
    }
    
    setEditableTheme(prev => ({
      ...prev,
      sectionOrder: newOrder
    }));
  };

  const preventEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      (e.target as HTMLElement).blur();
    }
  };

  // Theme styling helpers reading from editableTheme (for live preview!)
  const primaryColor = editableTheme?.primaryColor || '#6B1D2F';
  const secondaryColor = editableTheme?.secondaryColor || '#D4AF37';
  const backgroundColor = editableTheme?.backgroundColor || '#faf7f2';
  const titleFont = editableTheme?.fontTitle || 'Playfair Display';
  const bodyFont = editableTheme?.fontBody || 'Outfit';

  // Builder settings
  const headerStyle = editableTheme?.headerStyle || 'classic_hero';
  const cardStyle = editableTheme?.cardStyle || 'frosted';
  const borderStyle = editableTheme?.borderStyle || 'rounded';
  const bgPattern = editableTheme?.bgPattern || 'none';

  // Section strings for editing
  const welcomeText = editableTheme?.welcomeText || '';
  const storyTitle = editableTheme?.storyTitle || 'Nossa História';
  const storyText = editableTheme?.storyText || '';
  const rsvpHeading = editableTheme?.rsvpHeading || 'Confirmação de Presença';
  const rsvpIntro = editableTheme?.rsvpIntro || '';
  const giftsHeading = editableTheme?.giftsHeading || 'Lista de Presentes';
  const giftsIntro = editableTheme?.giftsIntro || '';
  const muralHeading = editableTheme?.muralHeading || 'Mural de Recados';
  const muralIntro = editableTheme?.muralIntro || '';
  const galleryHeading = editableTheme?.galleryHeading || 'Galeria de Lembranças';
  const galleryIntro = editableTheme?.galleryIntro || '';

  // Identify guest if token is present
  const guestByToken = inviteToken ? guests.find(g => g.inviteToken === inviteToken) : null;
  const guestRsvp = guestByToken ? rsvps.find(r => r.guestId === guestByToken.id) : null;

  // RSVP Form state
  const [rsvpConfirmed, setRsvpConfirmed] = useState<boolean>(guestRsvp?.confirmed ?? true);
  const [rsvpAdults, setRsvpAdults] = useState<number>(guestRsvp?.adultsCount ?? 1);
  const [rsvpChildren, setRsvpChildren] = useState<number>(guestRsvp?.childrenCount ?? 0);
  const [rsvpDietary, setRsvpDietary] = useState<string>(guestRsvp?.dietaryRestriction ?? '');
  const [rsvpSuccessMessage, setRsvpSuccessMessage] = useState<string>('');
  
  // Custom manual token search state (if accessed directly)
  const [typedToken, setTypedToken] = useState('');
  const [searchGuestError, setSearchGuestError] = useState('');
  const [activeGuest, setActiveGuest] = useState<Guest | null>(guestByToken || null);

  useEffect(() => {
    if (guestByToken) {
      setActiveGuest(guestByToken);
    }
  }, [guestByToken]);

  const handleSearchGuest = (e: React.FormEvent) => {
    e.preventDefault();
    const guest = guests.find(g => g.inviteToken === typedToken.trim() && g.eventId === event.id);
    if (guest) {
      setActiveGuest(guest);
      const existingRsvp = rsvps.find(r => r.guestId === guest.id);
      if (existingRsvp) {
        setRsvpConfirmed(existingRsvp.confirmed);
        setRsvpAdults(existingRsvp.adultsCount);
        setRsvpChildren(existingRsvp.childrenCount);
        setRsvpDietary(existingRsvp.dietaryRestriction || '');
      }
      setSearchGuestError('');
    } else {
      setSearchGuestError('Código de convite não encontrado. Use o link do organizador.');
    }
  };

  // Gift contribution flow state
  const [selectedGift, setSelectedGift] = useState<GiftItem | null>(null);
  const [donorName, setDonorName] = useState(activeGuest?.name || '');
  const [contributionAmount, setContributionAmount] = useState('');
  const [contributionMessage, setContributionMessage] = useState('');
  const [pixModalStep, setPixModalStep] = useState<'details' | 'pix'>('details');
  const [simulatedPaymentSuccess, setSimulatedPaymentSuccess] = useState(false);

  // Sync donor name when activeGuest changes
  useEffect(() => {
    if (activeGuest) {
      setDonorName(activeGuest.name);
    }
  }, [activeGuest]);

  // Guestbook & Photo upload state
  const [guestMessageText, setGuestMessageText] = useState('');
  const [guestMessageName, setGuestMessageName] = useState('');
  const [guestMessageIsAnonymous, setGuestMessageIsAnonymous] = useState(false);
  const [guestMessageSuccess, setGuestMessageSuccess] = useState(false);

  const [guestPhotoUrl, setGuestPhotoUrl] = useState('');
  const [guestPhotoName, setGuestPhotoName] = useState('');
  const [guestPhotoSuccess, setGuestPhotoSuccess] = useState(false);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(event.eventDate) - +new Date();
      let newTimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

      if (difference > 0) {
        newTimeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      setTimeLeft(newTimeLeft);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [event.eventDate]);

  // Handle RSVP Submit
  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGuest) return;

    onAddRsvp({
      guestId: activeGuest.id,
      confirmed: rsvpConfirmed,
      adultsCount: rsvpConfirmed ? rsvpAdults : 0,
      childrenCount: rsvpConfirmed ? rsvpChildren : 0,
      dietaryRestriction: rsvpDietary || undefined
    });

    setRsvpSuccessMessage(
      rsvpConfirmed 
        ? 'Presença confirmada com sucesso! Mal podemos esperar por você.' 
        : 'Confirmação registrada. Sentiremos sua falta!'
    );
    setTimeout(() => setRsvpSuccessMessage(''), 5000);
  };

  // Handle Gift contribution generate Pix
  const handleGeneratePix = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGift) return;
    
    const amount = parseFloat(contributionAmount) || selectedGift.suggestedAmount || 0;
    if (amount <= 0) return;

    setPixModalStep('pix');
  };

  // Confirm Contribution
  const handleConfirmContribution = () => {
    if (!selectedGift) return;
    const amount = parseFloat(contributionAmount) || selectedGift.suggestedAmount || 0;

    onAddContribution({
      giftId: selectedGift.id,
      guestName: guestMessageIsAnonymous ? 'Anônimo' : donorName || activeGuest?.name || 'Convidado',
      amount,
      message: contributionMessage || undefined
    });

    setSimulatedPaymentSuccess(true);
    setTimeout(() => {
      setSelectedGift(null);
      setPixModalStep('details');
      setContributionAmount('');
      setContributionMessage('');
      setSimulatedPaymentSuccess(false);
    }, 3000);
  };

  // Handle write message
  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestMessageText.trim()) return;

    onAddMessage({
      eventId: event.id,
      guestName: guestMessageIsAnonymous ? 'Anônimo' : guestMessageName || activeGuest?.name || 'Convidado',
      message: guestMessageText
    });

    setGuestMessageText('');
    setGuestMessageSuccess(true);
    setTimeout(() => setGuestMessageSuccess(false), 4000);
  };

  // Handle mock photo upload
  const handlePhotoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestPhotoUrl.trim()) return;

    onAddPhoto({
      eventId: event.id,
      url: guestPhotoUrl,
      guestName: guestPhotoName || activeGuest?.name || 'Convidado'
    });

    setGuestPhotoUrl('');
    setGuestPhotoName('');
    setGuestPhotoSuccess(true);
    setTimeout(() => setGuestPhotoSuccess(false), 4000);
  };

  // Theme-specific styles
  const isBirthday = event.eventType === 'BIRTHDAY';
  const isBabyShower = event.eventType === 'BABY_SHOWER';
  const isCorporate = event.eventType === 'CORPORATE';
  const isOther = event.eventType === 'OTHER';
  
  const themeClass = 
    isBirthday ? 'theme-birthday' : 
    isBabyShower ? 'theme-baby_shower' : 
    isCorporate ? 'theme-corporate' : 
    isOther ? 'theme-other' : 'theme-wedding';

  const renderEventIcon = (size: number = 28, style: React.CSSProperties = { display: 'block', margin: '0 auto 16px auto' }) => {
    switch (event.eventType) {
      case 'WEDDING':
        return <Heart color={primaryColor} fill={primaryColor} size={size} style={style} />;
      case 'BIRTHDAY':
        return <Sparkles color={primaryColor} size={size} style={style} />;
      case 'BABY_SHOWER':
        return <Gift color={primaryColor} size={size} style={style} />;
      case 'CORPORATE':
        return <Calendar color={primaryColor} size={size} style={style} />;
      default:
        return <Palette color={primaryColor} size={size} style={style} />;
    }
  };

  // Check dark theme
  const isDarkTheme = backgroundColor === '#090A0F' || backgroundColor === '#090a0f' || backgroundColor === '#000000';

  // Card styles & Border styles
  const cardBorderRadius = borderStyle === 'rounded' ? '16px' : borderStyle === 'pill' ? '32px' : '0px';
  const cardShadow = cardStyle === 'solid' ? '0 4px 20px rgba(0,0,0,0.06)' : 'none';
  const cardBg = cardStyle === 'frosted' 
    ? (isDarkTheme ? 'rgba(20, 23, 36, 0.75)' : 'rgba(255, 255, 255, 0.85)')
    : cardStyle === 'glass'
      ? (isDarkTheme ? 'rgba(10, 10, 15, 0.5)' : 'rgba(255, 255, 255, 0.35)')
      : (isDarkTheme ? '#141724' : '#ffffff');
  const cardBackdropFilter = cardStyle === 'solid' ? 'none' : (cardStyle === 'glass' ? 'blur(20px)' : 'blur(10px)');

  // Background Pattern setup
  let backgroundPatternStyle: React.CSSProperties = {};
  const patternColor = isDarkTheme ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)';
  if (bgPattern === 'dots') {
    backgroundPatternStyle = {
      backgroundImage: `radial-gradient(${patternColor} 1.5px, transparent 1.5px)`,
      backgroundSize: '24px 24px'
    };
  } else if (bgPattern === 'leaves') {
    backgroundPatternStyle = {
      backgroundImage: `linear-gradient(45deg, ${patternColor} 25%, transparent 25%), linear-gradient(-45deg, ${patternColor} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${patternColor} 75%), linear-gradient(-45deg, transparent 75%, ${patternColor} 75%)`,
      backgroundSize: '40px 40px',
      backgroundPosition: '0 0, 0 20px, 20px -20px, -20px 0px'
    };
  } else if (bgPattern === 'swirls') {
    backgroundPatternStyle = {
      backgroundImage: `radial-gradient(circle at 100% 150%, transparent 24%, ${patternColor} 24%, ${patternColor} 28%, transparent 28%), radial-gradient(circle at 0% 150%, transparent 24%, ${patternColor} 24%, ${patternColor} 28%, transparent 28%)`,
      backgroundSize: '30px 30px'
    };
  }

  return (
    <div 
      className={`event-portal-theme ${themeClass}`} 
      style={{
        minHeight: '100vh',
        fontFamily: bodyFont === 'Outfit' ? 'Outfit, sans-serif' : bodyFont === 'Inter' ? 'Inter, sans-serif' : 'Georgia, serif',
        backgroundColor: backgroundColor,
        '--event-primary': primaryColor,
        '--event-secondary': secondaryColor,
        '--event-primary-hover': primaryColor + 'dd',
        '--e-bg': backgroundColor,
        '--e-text': isDarkTheme ? '#f1f3f9' : '#2c2523',
        '--e-text-muted': isDarkTheme ? '#8e96aa' : '#72625e',
        '--e-card-bg': cardBg,
        '--e-radius': cardBorderRadius,
        '--e-card-shadow': cardShadow,
        '--e-card-backdrop': cardBackdropFilter,
        '--e-border': isDarkTheme ? 'rgba(255,255,255,0.08)' : '#e8e2d9',
        ...backgroundPatternStyle
      } as React.CSSProperties}
    >
      {/* Return button */}
      <div style={{ position: 'fixed', top: 20, left: 20, zIndex: 100 }}>
        <button 
          onClick={onBackToHome}
          className="btn"
          style={{ 
            background: 'rgba(255,255,255,0.85)', 
            color: '#000', 
            borderRadius: '50px', 
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            padding: '8px 16px',
            fontSize: '0.85rem'
          }}
        >
          ← Painel Geral
        </button>
      </div>

      {/* Render Header based on headerStyle */}
      {headerStyle === 'split_hero' ? (
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          minHeight: '65vh',
          background: isDarkTheme ? '#141724' : '#ffffff',
          borderBottom: '1px solid var(--e-border)',
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '60px 40px',
            color: 'var(--e-text)'
          }}>
            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
              fontFamily: titleFont === 'Playfair Display' ? 'Playfair Display, serif' : 'Outfit, sans-serif',
              marginBottom: 16,
              color: 'var(--e-text)'
            }}>
              {event.title}
            </h1>
            <div style={{
              fontSize: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              fontWeight: 700,
              color: secondaryColor,
              marginBottom: 24
            }}>
              {new Date(event.eventDate).toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            
            {event.themeConfig?.showCountdown !== false && (
              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                {[
                  { label: 'Dias', val: timeLeft.days },
                  { label: 'Horas', val: timeLeft.hours },
                  { label: 'Mins', val: timeLeft.minutes },
                  { label: 'Segs', val: timeLeft.seconds }
                ].map((t, idx) => (
                  <div key={idx} style={{
                    background: isDarkTheme ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                    border: '1px solid var(--e-border)',
                    width: 72,
                    padding: '10px 4px',
                    borderRadius: 8,
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--e-text)' }}>{t.val}</div>
                    <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--e-text-muted)' }}>{t.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{
            backgroundImage: `url(${event.themeConfig?.backgroundImageUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '320px'
          }} />
        </section>
      ) : headerStyle === 'minimalist' ? (
        <section style={{
          padding: '80px 24px 40px 24px',
          textAlign: 'center',
          color: 'var(--e-text)'
        }}>
          <h1 style={{
            fontSize: 'clamp(2.8rem, 7vw, 5rem)',
            fontFamily: titleFont === 'Playfair Display' ? 'Playfair Display, serif' : 'Outfit, sans-serif',
            marginBottom: 20,
            color: 'var(--e-text)',
            letterSpacing: '-0.02em',
            fontWeight: 300
          }}>
            {event.title}
          </h1>
          <div style={{
            fontSize: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            fontWeight: 600,
            color: secondaryColor,
            marginBottom: 32
          }}>
            {new Date(event.eventDate).toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          {event.themeConfig?.showCountdown !== false && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 16 }}>
              {[
                { label: 'Dias', val: timeLeft.days },
                { label: 'Horas', val: timeLeft.hours },
                { label: 'Mins', val: timeLeft.minutes },
                { label: 'Segs', val: timeLeft.seconds }
              ].map((t, idx) => (
                <div key={idx} style={{
                  padding: '8px 16px',
                  borderBottom: `2px solid ${secondaryColor}`,
                  minWidth: 60
                }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--e-text)' }}>{t.val}</div>
                  <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--e-text-muted)', letterSpacing: '0.05em' }}>{t.label}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      ) : (
        /* Classic full size cover hero */
        <section style={{
          height: '60vh',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.65)), url(${event.themeConfig?.backgroundImageUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#fff',
          padding: '0 24px'
        }}>
          <div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.3)', marginBottom: 12 }}>
              {event.title}
            </h1>
            
            <div style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600, color: secondaryColor }}>
              {new Date(event.eventDate).toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>

            {event.themeConfig?.showCountdown !== false && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 32 }}>
                {[
                  { label: 'Dias', val: timeLeft.days },
                  { label: 'Horas', val: timeLeft.hours },
                  { label: 'Mins', val: timeLeft.minutes },
                  { label: 'Segs', val: timeLeft.seconds }
                ].map((t, idx) => (
                  <div key={idx} style={{ 
                    background: 'rgba(255,255,255,0.12)', 
                    backdropFilter: 'blur(8px)',
                    width: 80, 
                    padding: '12px 6px', 
                    borderRadius: 8, 
                    border: '1px solid rgba(255,255,255,0.2)' 
                  }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{t.val}</div>
                    <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#e5e7eb' }}>{t.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* CSS Stylesheet Injector */}
      <style>{`
        .builder-section-active {
          border: 2px dashed rgba(99, 102, 241, 0.5) !important;
          padding: 12px !important;
          border-radius: var(--e-radius, 16px) !important;
          position: relative !important;
          transition: all 0.2s ease !important;
        }
        .builder-section-active:hover {
          border-color: var(--event-primary) !important;
          box-shadow: 0 0 15px rgba(99, 102, 241, 0.1) !important;
        }
        .builder-section-controls {
          position: absolute !important;
          top: -14px !important;
          right: 20px !important;
          background: var(--event-primary) !important;
          color: white !important;
          padding: 4px 12px !important;
          border-radius: 20px !important;
          font-size: 0.75rem !important;
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
          z-index: 100 !important;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2) !important;
        }
        .builder-section-controls button {
          color: white !important;
          font-weight: bold !important;
          padding: 0 6px !important;
          border-radius: 4px !important;
          cursor: pointer !important;
          transition: background 0.2s !important;
        }
        .builder-section-controls button:hover {
          background: rgba(255,255,255,0.25) !important;
        }
        .builder-section-label {
          font-weight: 700 !important;
          margin-left: 4px !important;
          border-left: 1px solid rgba(255,255,255,0.3) !important;
          padding-left: 8px !important;
          text-transform: uppercase !important;
          font-size: 0.65rem !important;
          letter-spacing: 0.05em !important;
        }
        .builder-editable-text {
          cursor: pointer !important;
          position: relative !important;
          transition: background 0.2s !important;
          border-radius: 6px !important;
          padding: 4px 8px !important;
        }
        .builder-editable-text:hover {
          background: rgba(99, 102, 241, 0.08) !important;
          outline: 1.5px dashed var(--event-primary) !important;
        }
        .builder-editable-text::after {
          content: '✏️' !important;
          position: absolute !important;
          top: 50% !important;
          right: -24px !important;
          transform: translateY(-50%) !important;
          font-size: 0.8rem !important;
          opacity: 0 !important;
          transition: opacity 0.2s !important;
        }
        .builder-editable-text:hover::after {
          opacity: 1 !important;
        }
      `}</style>

      {/* Main Container */}
      <div className="container" style={{ maxWidth: '1000px', padding: '60px 24px 120px 24px', display: 'flex', flexDirection: 'column', gap: 60 }}>
        
        {/* Dynamic Section Ordering */}
        {((editableTheme?.sectionOrder) || ['welcome', 'location', 'story', 'schedule', 'rsvp', 'gifts', 'mural', 'gallery'])
          .filter(sectionKey => {
            // Oculta lista de presentes em eventos corporativos
            if (sectionKey === 'gifts' && event.eventType === 'CORPORATE') return false;
            return true;
          })
          .map((sectionKey) => {
          
          // WELCOME SECTION
          if (sectionKey === 'welcome') {
            return (
              <div 
                key="welcome" 
                className={isBuilderMode ? 'builder-section-active' : ''}
                style={{ position: 'relative' }}
              >
                {isBuilderMode && (
                  <div className="builder-section-controls">
                    <button type="button" onClick={() => moveSection('welcome', 'up')}>▲</button>
                    <button type="button" onClick={() => moveSection('welcome', 'down')}>▼</button>
                    <span className="builder-section-label">Boas-vindas</span>
                  </div>
                )}
                <section className="event-card" style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
                  {renderEventIcon(28)}
                  <h2 style={{ fontSize: '2rem', marginBottom: 16, fontFamily: titleFont === 'Playfair Display' ? 'Playfair Display, serif' : 'Outfit, sans-serif' }}>Sejam Bem-vindos!</h2>
                  <p 
                    contentEditable={isBuilderMode}
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      const newVal = e.currentTarget.innerText || '';
                      setEditableTheme(prev => ({ ...prev, welcomeText: newVal }));
                    }}
                    className={isBuilderMode ? 'builder-editable-text' : ''}
                    style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--e-text-muted)', outline: 'none' }}
                  >
                    {welcomeText || 'Escreva aqui suas boas-vindas...'}
                  </p>
                </section>
              </div>
            );
          }

          // LOCATION SECTION
          if (sectionKey === 'location') {
            return (
              <div 
                key="location" 
                className={isBuilderMode ? 'builder-section-active' : ''}
                style={{ position: 'relative' }}
              >
                {isBuilderMode && (
                  <div className="builder-section-controls">
                    <button type="button" onClick={() => moveSection('location', 'up')}>▲</button>
                    <button type="button" onClick={() => moveSection('location', 'down')}>▼</button>
                    <span className="builder-section-label">Quando & Onde</span>
                  </div>
                )}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
                  <div className="event-card" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <div style={{ background: `${primaryColor}15`, color: primaryColor, padding: 12, borderRadius: 12 }}>
                      <Calendar size={24} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', marginBottom: 6 }}>Quando</h3>
                      <div style={{ fontWeight: 600 }}>{new Date(event.eventDate).toLocaleDateString('pt-BR')} às {new Date(event.eventDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>
                      <div style={{ color: 'var(--e-text-muted)', fontSize: '0.9rem', marginTop: 4 }}>Adicione à sua agenda para não esquecer!</div>
                    </div>
                  </div>

                  <div className="event-card" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <div style={{ background: `${primaryColor}15`, color: primaryColor, padding: 12, borderRadius: 12 }}>
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', marginBottom: 6 }}>Onde</h3>
                      <div style={{ fontWeight: 600 }}>{event.venueName}</div>
                      <div style={{ color: 'var(--e-text-muted)', fontSize: '0.9rem', marginTop: 4 }}>{event.venueAddress}</div>
                    </div>
                  </div>
                </section>
              </div>
            );
          }

          // STORY SECTION
          if (sectionKey === 'story') {
            if (editableTheme.showStory === false) return null;
            return (
              <div 
                key="story" 
                className={isBuilderMode ? 'builder-section-active' : ''}
                style={{ position: 'relative' }}
              >
                {isBuilderMode && (
                  <div className="builder-section-controls">
                    <button type="button" onClick={() => moveSection('story', 'up')}>▲</button>
                    <button type="button" onClick={() => moveSection('story', 'down')}>▼</button>
                    <span className="builder-section-label">História</span>
                  </div>
                )}
                <section className="event-card" style={{ maxWidth: '720px', margin: '0 auto', width: '100%' }}>
                  <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    {renderEventIcon(28)}
                     <h2 
                      contentEditable={isBuilderMode}
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        const newVal = e.currentTarget.innerText || '';
                        setEditableTheme(prev => ({ ...prev, storyTitle: newVal }));
                      }}
                      onKeyDown={preventEnter}
                      className={isBuilderMode ? 'builder-editable-text' : ''}
                      style={{ fontSize: '2rem', marginBottom: 12, fontFamily: titleFont === 'Playfair Display' ? 'Playfair Display, serif' : 'Outfit, sans-serif', outline: 'none' }}
                    >
                      {storyTitle}
                    </h2>
                    <p 
                      contentEditable={isBuilderMode}
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        const newVal = e.currentTarget.innerText || '';
                        setEditableTheme(prev => ({ ...prev, storyText: newVal }));
                      }}
                      className={isBuilderMode ? 'builder-editable-text' : ''}
                      style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--e-text-muted)', outline: 'none' }}
                    >
                      {storyText || 'Nossa história de amor...'}
                    </p>
                  </div>

                  {/* Milestones timeline */}
                  {editableTheme.storyTimeline && editableTheme.storyTimeline.length > 0 && (
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: 28, 
                      position: 'relative', 
                      paddingLeft: 32, 
                      borderLeft: `2px dashed ${secondaryColor}60`,
                      marginTop: 40,
                      marginLeft: 16
                    }}>
                      {editableTheme.storyTimeline
                        .sort((a, b) => a.year.localeCompare(b.year))
                        .map((milestone) => (
                          <div key={milestone.id} style={{ position: 'relative' }} className="animate-fade-in-up">
                            <div style={{
                              position: 'absolute',
                              left: -44,
                              top: 2,
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              background: backgroundColor,
                              border: `2px solid ${primaryColor}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: primaryColor,
                              fontSize: '0.65rem',
                              fontWeight: 700
                            }}>
                              ♥
                            </div>

                            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: primaryColor, display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span>{milestone.year}</span>
                              <span style={{ color: 'var(--e-text)', fontWeight: 500, fontSize: '0.95rem' }}>— {milestone.title}</span>
                            </div>
                            <p style={{ color: 'var(--e-text-muted)', fontSize: '0.9rem', marginTop: 4, lineHeight: 1.6 }}>
                              {milestone.desc}
                            </p>
                          </div>
                        ))}
                    </div>
                  )}
                </section>
              </div>
            );
          }

          // SCHEDULE SECTION
          if (sectionKey === 'schedule') {
            if (!editableTheme.schedule || editableTheme.schedule.length === 0) return null;
            return (
              <div 
                key="schedule" 
                className={isBuilderMode ? 'builder-section-active' : ''}
                style={{ position: 'relative' }}
              >
                {isBuilderMode && (
                  <div className="builder-section-controls">
                    <button type="button" onClick={() => moveSection('schedule', 'up')}>▲</button>
                    <button type="button" onClick={() => moveSection('schedule', 'down')}>▼</button>
                    <span className="builder-section-label">Cronograma</span>
                  </div>
                )}
                <section className="event-card" style={{ maxWidth: '720px', margin: '0 auto', width: '100%' }}>
                  <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: 8, fontFamily: titleFont === 'Playfair Display' ? 'Playfair Display, serif' : 'Outfit, sans-serif' }}>
                      Cronograma do Dia
                    </h2>
                    <p style={{ color: 'var(--e-text-muted)', fontSize: '0.95rem' }}>Confira a programação completa para não perder nenhum momento.</p>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'relative', paddingLeft: 24, borderLeft: `2px solid ${secondaryColor}40` }}>
                    {editableTheme.schedule
                      .sort((a, b) => a.time.localeCompare(b.time))
                      .map((item) => (
                        <div key={item.id} style={{ position: 'relative', display: 'flex', gap: 16 }}>
                          <div style={{
                            position: 'absolute',
                            left: -33,
                            top: 4,
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            background: primaryColor,
                            border: `4px solid ${backgroundColor}`
                          }} />
                          
                          <div style={{ fontWeight: 700, color: primaryColor, minWidth: '60px' }}>{item.time}</div>
                          <div style={{ color: 'var(--e-text)', fontSize: '0.95rem' }}>{item.activity}</div>
                        </div>
                      ))}
                  </div>
                </section>
              </div>
            );
          }

          // RSVP SECTION
          if (sectionKey === 'rsvp') {
            return (
              <div 
                key="rsvp" 
                className={isBuilderMode ? 'builder-section-active' : ''}
                style={{ position: 'relative' }}
              >
                {isBuilderMode && (
                  <div className="builder-section-controls">
                    <button type="button" onClick={() => moveSection('rsvp', 'up')}>▲</button>
                    <button type="button" onClick={() => moveSection('rsvp', 'down')}>▼</button>
                    <span className="builder-section-label">Confirmação (RSVP)</span>
                  </div>
                )}
                <section id="rsvp" className="event-card">
                  <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <h2 
                      contentEditable={isBuilderMode}
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        const newVal = e.currentTarget.innerText || '';
                        setEditableTheme(prev => ({ ...prev, rsvpHeading: newVal }));
                      }}
                      onKeyDown={preventEnter}
                      className={isBuilderMode ? 'builder-editable-text' : ''}
                      style={{ fontSize: '2rem', marginBottom: 8, fontFamily: titleFont === 'Playfair Display' ? 'Playfair Display, serif' : 'Outfit, sans-serif', outline: 'none' }}
                    >
                      {rsvpHeading}
                    </h2>
                    <p 
                      contentEditable={isBuilderMode}
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        const newVal = e.currentTarget.innerText || '';
                        setEditableTheme(prev => ({ ...prev, rsvpIntro: newVal }));
                      }}
                      className={isBuilderMode ? 'builder-editable-text' : ''}
                      style={{ color: 'var(--e-text-muted)', outline: 'none' }}
                    >
                      {rsvpIntro || 'Por favor, confirme sua presença até 15 dias antes do evento.'}
                    </p>
                  </div>

                  {!activeGuest ? (
                    <div style={{ maxWidth: '440px', margin: '0 auto', textAlign: 'center' }}>
                      <Info size={36} color={secondaryColor} style={{ display: 'block', margin: '0 auto 16px auto' }} />
                      <p style={{ fontSize: '0.95rem', color: 'var(--e-text-muted)', marginBottom: 20 }}>
                        Para confirmar sua presença, digite abaixo o código de convite enviado pelo organizador.
                      </p>
                      
                      <form onSubmit={handleSearchGuest} style={{ display: 'flex', gap: 8 }}>
                        <input 
                          type="text" 
                          placeholder="Ex: token-carlos" 
                          value={typedToken}
                          onChange={(e) => setTypedToken(e.target.value)}
                          className="event-input"
                          style={{ textTransform: 'lowercase' }}
                          required
                        />
                        <button type="submit" className="event-btn-primary btn">Buscar</button>
                      </form>
                      {searchGuestError && <div style={{ color: 'var(--error)', fontSize: '0.85rem', marginTop: 10 }}>{searchGuestError}</div>}
                    </div>
                  ) : (
                    <div style={{ maxWidth: '520px', margin: '0 auto' }}>
                      <div style={{ background: `${primaryColor}08`, border: `1px solid ${primaryColor}20`, padding: 16, borderRadius: 12, marginBottom: 24, textAlign: 'center' }}>
                        Convidado identificado: <strong style={{ color: primaryColor }}>{activeGuest.name}</strong> ({activeGuest.guestGroup})
                      </div>
                      
                      {rsvpSuccessMessage && (
                        <div style={{ background: '#d1fae5', color: '#065f46', border: '1px solid #10b981', padding: 12, borderRadius: 8, fontSize: '0.85rem', marginBottom: 20, textAlign: 'center' }}>
                          {rsvpSuccessMessage}
                        </div>
                      )}

                      <form onSubmit={handleRsvpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8 }}>Você comparecerá?</label>
                          <div style={{ display: 'flex', gap: 12 }}>
                            <button 
                              type="button" 
                              onClick={() => setRsvpConfirmed(true)}
                              className={`btn ${rsvpConfirmed ? 'event-btn-primary' : 'btn-secondary'}`}
                              style={{ flex: 1 }}
                            >
                              ✓ Sim, irei!
                            </button>
                            <button 
                              type="button" 
                              onClick={() => setRsvpConfirmed(false)}
                              className={`btn ${!rsvpConfirmed ? 'btn-danger' : 'btn-secondary'}`}
                              style={{ flex: 1 }}
                            >
                              ✗ Não poderei ir
                            </button>
                          </div>
                        </div>

                        {rsvpConfirmed && (
                          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {event.eventType === 'CORPORATE' ? (
                              <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 6 }}>Quantidade de Credenciais/Ingressos</label>
                                <input type="number" min={1} max={10} value={rsvpAdults} onChange={(e) => setRsvpAdults(parseInt(e.target.value) || 1)} className="event-input" style={{ maxWidth: '120px' }} />
                              </div>
                            ) : (
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div>
                                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 6 }}>Adultos (incluindo você)</label>
                                  <input type="number" min={1} max={10} value={rsvpAdults} onChange={(e) => setRsvpAdults(parseInt(e.target.value) || 1)} className="event-input" />
                                </div>
                                <div>
                                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 6 }}>Crianças</label>
                                  <input type="number" min={0} max={10} value={rsvpChildren} onChange={(e) => setRsvpChildren(parseInt(e.target.value) || 0)} className="event-input" />
                                </div>
                              </div>
                            )}

                            <div>
                              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 6 }}>Restrições Alimentares (Opcional)</label>
                              <input type="text" placeholder="Ex: Vegano, sem glúten, alergia a camarão" value={rsvpDietary} onChange={(e) => setRsvpDietary(e.target.value)} className="event-input" />
                            </div>
                          </div>
                        )}

                        <button type="submit" className="event-btn-primary btn" style={{ width: '100%', padding: '14px' }}>
                          Enviar Confirmação
                        </button>
                      </form>
                    </div>
                  )}
                </section>
              </div>
            );
          }

          // GIFTS SECTION
          if (sectionKey === 'gifts') {
            return (
              <div 
                key="gifts" 
                className={isBuilderMode ? 'builder-section-active' : ''}
                style={{ position: 'relative' }}
              >
                {isBuilderMode && (
                  <div className="builder-section-controls">
                    <button type="button" onClick={() => moveSection('gifts', 'up')}>▲</button>
                    <button type="button" onClick={() => moveSection('gifts', 'down')}>▼</button>
                    <span className="builder-section-label">Presentes</span>
                  </div>
                )}
                <section id="gifts">
                  <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <h2 
                      style={{ fontSize: '2rem', marginBottom: 8, fontFamily: titleFont === 'Playfair Display' ? 'Playfair Display, serif' : 'Outfit, sans-serif' }}
                    >
                      <Gift size={24} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
                      <span
                        contentEditable={isBuilderMode}
                        suppressContentEditableWarning
                        onBlur={(e) => {
                          const newVal = e.currentTarget.innerText || '';
                          setEditableTheme(prev => ({ ...prev, giftsHeading: newVal }));
                        }}
                        onKeyDown={preventEnter}
                        className={isBuilderMode ? 'builder-editable-text' : ''}
                        style={{ outline: 'none' }}
                      >
                        {giftsHeading}
                      </span>
                    </h2>
                    <p 
                      contentEditable={isBuilderMode}
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        const newVal = e.currentTarget.innerText || '';
                        setEditableTheme(prev => ({ ...prev, giftsIntro: newVal }));
                      }}
                      className={isBuilderMode ? 'builder-editable-text' : ''}
                      style={{ color: 'var(--e-text-muted)', maxWidth: '600px', margin: '0 auto', outline: 'none' }}
                    >
                      {giftsIntro || 'Selecionamos alguns itens simbólicos. Os presentes comprados nesta lista são convertidos em cotas em dinheiro enviadas via Pix para nós!'}
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 24 }}>
                    {gifts.filter(g => g.status === 'ACTIVE' && g.eventId === event.id).map(gift => (
                      <div key={gift.id} className="event-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <img style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginBottom: 16 }} alt={gift.name} src={gift.photoUrl} />
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: 8, color: 'var(--e-text)' }}>{gift.name}</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--e-text-muted)', flex: 1, marginBottom: 16 }}>{gift.description}</p>
                        {gift.suggestedAmount && (
                          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: primaryColor, marginBottom: 12 }}>
                            {gift.suggestedAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </div>
                        )}
                        <button type="button" onClick={() => setSelectedGift(gift)} className="event-btn-primary btn" style={{ fontSize: '0.9rem', padding: '10px 16px', marginTop: 'auto', width: '100%' }}>
                          Presentear
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            );
          }

          // MURAL SECTION
          if (sectionKey === 'mural') {
            if (editableTheme.showMural === false) return null;
            return (
              <div 
                key="mural" 
                className={isBuilderMode ? 'builder-section-active' : ''}
                style={{ position: 'relative' }}
              >
                {isBuilderMode && (
                  <div className="builder-section-controls">
                    <button type="button" onClick={() => moveSection('mural', 'up')}>▲</button>
                    <button type="button" onClick={() => moveSection('mural', 'down')}>▼</button>
                    <span className="builder-section-label">Mural de Recados</span>
                  </div>
                )}
                <section id="guestbook" className="event-card">
                  <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <h2 
                      style={{ fontSize: '2rem', marginBottom: 8, fontFamily: titleFont === 'Playfair Display' ? 'Playfair Display, serif' : 'Outfit, sans-serif' }}
                    >
                      <MessageSquare size={24} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
                      <span
                        contentEditable={isBuilderMode}
                        suppressContentEditableWarning
                        onBlur={(e) => {
                          const newVal = e.currentTarget.innerText || '';
                          setEditableTheme(prev => ({ ...prev, muralHeading: newVal }));
                        }}
                        onKeyDown={preventEnter}
                        className={isBuilderMode ? 'builder-editable-text' : ''}
                        style={{ outline: 'none' }}
                      >
                        {muralHeading}
                      </span>
                    </h2>
                    <p 
                      contentEditable={isBuilderMode}
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        const newVal = e.currentTarget.innerText || '';
                        setEditableTheme(prev => ({ ...prev, muralIntro: newVal }));
                      }}
                      className={isBuilderMode ? 'builder-editable-text' : ''}
                      style={{ color: 'var(--e-text-muted)', outline: 'none' }}
                    >
                      {muralIntro || 'Deixe uma linda mensagem de carinho para comemorar conosco.'}
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 32 }}>
                    {messages.filter(m => m.approved).length === 0 ? (
                      <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--e-text-muted)', padding: '24px 0', fontStyle: 'italic' }}>
                        Ainda não há recados no mural. Seja o primeiro a escrever!
                      </div>
                    ) : (
                      messages.filter(m => m.approved).map(msg => (
                        <div key={msg.id} className="event-card animate-fade-in-up" style={{ background: 'rgba(0,0,0,0.01)', borderColor: 'var(--e-border)', boxShadow: 'none', borderRadius: 12, padding: 20 }}>
                          <p style={{ fontSize: '0.95rem', fontStyle: 'italic', marginBottom: 12 }}>"{msg.message}"</p>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', justifyContent: 'space-between', color: primaryColor }}>
                            <span>- {msg.guestName || 'Anônimo'}</span>
                            <span style={{ color: 'var(--e-text-muted)' }}>{new Date(msg.createdAt).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Form to leave message */}
                  <div style={{ borderTop: '1px solid var(--e-border)', paddingTop: 24, maxWidth: '520px', margin: '0 auto' }}>
                    <h3 style={{ fontSize: '1.15rem', marginBottom: 16, textAlign: 'center' }}>Deixe seu Recado</h3>
                    {guestMessageSuccess && (
                      <div style={{ background: '#d1fae5', color: '#065f46', border: '1px solid #10b981', padding: 12, borderRadius: 8, fontSize: '0.85rem', marginBottom: 16, textAlign: 'center' }}>
                        ✓ Mensagem enviada com sucesso! Ela aparecerá no mural após moderação.
                      </div>
                    )}
                    <form onSubmit={handleMessageSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {!guestMessageIsAnonymous && (
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>Seu Nome</label>
                          <input type="text" placeholder="Como quer ser identificado" value={guestMessageName} onChange={(e) => setGuestMessageName(e.target.value)} className="event-input" />
                        </div>
                      )}
                      <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', cursor: 'pointer', marginBottom: 8 }}>
                          <input type="checkbox" checked={guestMessageIsAnonymous} onChange={(e) => setGuestMessageIsAnonymous(e.target.checked)} style={{ accentColor: primaryColor }} />
                          Enviar como Anônimo
                        </label>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>Mensagem</label>
                        <textarea placeholder="Escreva algo carinhoso..." value={guestMessageText} onChange={(e) => setGuestMessageText(e.target.value)} className="event-input" rows={3} style={{ resize: 'none' }} required />
                      </div>
                      <button type="submit" className="event-btn-primary btn">Enviar Recado</button>
                    </form>
                  </div>
                </section>
              </div>
            );
          }

          // GALLERY SECTION
          if (sectionKey === 'gallery') {
            if (editableTheme.showGallery === false) return null;
            return (
              <div 
                key="gallery" 
                className={isBuilderMode ? 'builder-section-active' : ''}
                style={{ position: 'relative' }}
              >
                {isBuilderMode && (
                  <div className="builder-section-controls">
                    <button type="button" onClick={() => moveSection('gallery', 'up')}>▲</button>
                    <button type="button" onClick={() => moveSection('gallery', 'down')}>▼</button>
                    <span className="builder-section-label">Galeria de Fotos</span>
                  </div>
                )}
                <section id="gallery" className="event-card">
                  <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <h2 
                      style={{ fontSize: '2rem', marginBottom: 8, fontFamily: titleFont === 'Playfair Display' ? 'Playfair Display, serif' : 'Outfit, sans-serif' }}
                    >
                      <Camera size={24} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
                      <span
                        contentEditable={isBuilderMode}
                        suppressContentEditableWarning
                        onBlur={(e) => {
                          const newVal = e.currentTarget.innerText || '';
                          setEditableTheme(prev => ({ ...prev, galleryHeading: newVal }));
                        }}
                        onKeyDown={preventEnter}
                        className={isBuilderMode ? 'builder-editable-text' : ''}
                        style={{ outline: 'none' }}
                      >
                        {galleryHeading}
                      </span>
                    </h2>
                    <p 
                      contentEditable={isBuilderMode}
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        const newVal = e.currentTarget.innerText || '';
                        setEditableTheme(prev => ({ ...prev, galleryIntro: newVal }));
                      }}
                      className={isBuilderMode ? 'builder-editable-text' : ''}
                      style={{ color: 'var(--e-text-muted)', outline: 'none' }}
                    >
                      {galleryIntro || 'Compartilhe seus cliques do evento conosco.'}
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16, marginBottom: 32 }}>
                    {photos.filter(p => p.approved).length === 0 ? (
                      <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--e-text-muted)', padding: '24px 0', fontStyle: 'italic' }}>
                        Ainda não há fotos na galeria. Envie uma foto abaixo!
                      </div>
                    ) : (
                      photos.filter(p => p.approved).map(photo => (
                        <div key={photo.id} className="animate-fade-in" style={{ height: 160, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--e-border)' }}>
                          <img src={photo.url} alt="Upload Convidado" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ))
                    )}
                  </div>

                  {/* Form to submit photo */}
                  <div style={{ borderTop: '1px solid var(--e-border)', paddingTop: 24, maxWidth: '520px', margin: '0 auto' }}>
                    <h3 style={{ fontSize: '1.15rem', marginBottom: 16, textAlign: 'center' }}>Compartilhe uma Foto</h3>
                    {guestPhotoSuccess && (
                      <div style={{ background: '#d1fae5', color: '#065f46', border: '1px solid #10b981', padding: 12, borderRadius: 8, fontSize: '0.85rem', marginBottom: 16, textAlign: 'center' }}>
                        ✓ Foto enviada para aprovação do organizador!
                      </div>
                    )}
                    <form onSubmit={handlePhotoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>URL da Imagem (simulado)</label>
                        <input type="text" placeholder="Cole o link de uma imagem da internet" value={guestPhotoUrl} onChange={(e) => setGuestPhotoUrl(e.target.value)} className="event-input" required />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>Seu Nome</label>
                        <input type="text" placeholder="Seu nome completo" value={guestPhotoName} onChange={(e) => setGuestPhotoName(e.target.value)} className="event-input" />
                      </div>
                      <button type="submit" className="event-btn-primary btn">Enviar Foto</button>
                    </form>
                  </div>
                </section>
              </div>
            );
          }

          return null;
        })}
      </div>

      {/* Website Builder Side Style Drawer */}
      {isBuilderMode && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '360px',
          height: '100vh',
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(20px)',
          borderLeft: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          color: '#fff',
          animation: 'slideInRight 0.3s ease-out'
        }}>
          {/* Header */}
          <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'sans-serif', fontWeight: 700 }}>
              <Palette size={18} color="#818cf8" /> Visual Builder
            </h3>
            <button type="button" onClick={() => setIsBuilderMode(false)} style={{ color: '#9ca3af' }}><X size={18} /></button>
          </div>

          {/* Scrollable Content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* Palettes */}
            <div>
              <h4 style={{ fontSize: '0.85rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Paletas Suaves</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  { name: 'Lilás 🪻', primary: '#7C3AED', secondary: '#A78BFA', bg: '#F5F3FF' },
                  { name: 'Sálvia 🌿', primary: '#059669', secondary: '#6EE7B7', bg: '#F0FDF4' },
                  { name: 'Quartz 🌸', primary: '#DB2777', secondary: '#F472B6', bg: '#FFF5F7' },
                  { name: 'Oceano 🌊', primary: '#0284C7', secondary: '#7DD3FC', bg: '#F0F9FF' },
                  { name: 'Champagne 🥂', primary: '#854D0E', secondary: '#FDE047', bg: '#FAF9F0' },
                  { name: 'Midnight 🌌', primary: '#10B981', secondary: '#3B82F6', bg: '#090A0F' }
                ].map((pal, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setEditableTheme(prev => ({
                        ...prev,
                        primaryColor: pal.primary,
                        secondaryColor: pal.secondary,
                        backgroundColor: pal.bg
                      }));
                    }}
                    style={{
                      padding: '8px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 6,
                      fontSize: '0.75rem',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer'
                    }}
                  >
                    <span>{pal.name}</span>
                    <div style={{ display: 'flex', gap: 3 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: pal.primary }} />
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: pal.secondary }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Layout parameters */}
            <div>
              <h4 style={{ fontSize: '0.85rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Estilos Gerais</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af', marginBottom: 4 }}>Cabeçalho</label>
                  <select 
                    value={headerStyle} 
                    onChange={(e) => setEditableTheme(prev => ({ ...prev, headerStyle: e.target.value as any }))}
                    style={{ width: '100%', padding: '8px', background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, color: '#fff', fontSize: '0.8rem' }}
                  >
                    <option value="classic_hero">Capa Cheia</option>
                    <option value="split_hero">Split Banner</option>
                    <option value="minimalist">Minimalista</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af', marginBottom: 4 }}>Cartões</label>
                  <select 
                    value={cardStyle} 
                    onChange={(e) => setEditableTheme(prev => ({ ...prev, cardStyle: e.target.value as any }))}
                    style={{ width: '100%', padding: '8px', background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, color: '#fff', fontSize: '0.8rem' }}
                  >
                    <option value="frosted">Frosted Glass</option>
                    <option value="glass">Dark Glass</option>
                    <option value="solid">Sólido</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af', marginBottom: 4 }}>Borda</label>
                  <select 
                    value={borderStyle} 
                    onChange={(e) => setEditableTheme(prev => ({ ...prev, borderStyle: e.target.value as any }))}
                    style={{ width: '100%', padding: '8px', background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, color: '#fff', fontSize: '0.8rem' }}
                  >
                    <option value="rounded">Arredondado</option>
                    <option value="sharp">Sharp (Reto)</option>
                    <option value="pill">Pill (Curvado)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af', marginBottom: 4 }}>Textura</label>
                  <select 
                    value={bgPattern} 
                    onChange={(e) => setEditableTheme(prev => ({ ...prev, bgPattern: e.target.value as any }))}
                    style={{ width: '100%', padding: '8px', background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, color: '#fff', fontSize: '0.8rem' }}
                  >
                    <option value="none">Nenhuma</option>
                    <option value="dots">Pontilhado</option>
                    <option value="leaves">Folhas</option>
                    <option value="swirls">Ondulações</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Visibility checks */}
            <div>
              <h4 style={{ fontSize: '0.85rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Ativar Seções</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={editableTheme.showCountdown !== false} 
                    onChange={(e) => setEditableTheme(prev => ({ ...prev, showCountdown: e.target.checked }))}
                    style={{ accentColor: '#818cf8' }}
                  />
                  Contagem Regressiva
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={editableTheme.showStory !== false} 
                    onChange={(e) => setEditableTheme(prev => ({ ...prev, showStory: e.target.checked }))}
                    style={{ accentColor: '#818cf8' }}
                  />
                  Nossa História
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={editableTheme.showMural !== false} 
                    onChange={(e) => setEditableTheme(prev => ({ ...prev, showMural: e.target.checked }))}
                    style={{ accentColor: '#818cf8' }}
                  />
                  Mural de Recados
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={editableTheme.showGallery !== false} 
                    onChange={(e) => setEditableTheme(prev => ({ ...prev, showGallery: e.target.checked }))}
                    style={{ accentColor: '#818cf8' }}
                  />
                  Galeria de Fotos
                </label>
              </div>
            </div>

            {/* Quick banner selector */}
            <div>
              <h4 style={{ fontSize: '0.85rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Imagem de Capa</h4>
              <button 
                type="button"
                onClick={handleEditBanner}
                className="btn btn-secondary"
                style={{ width: '100%', fontSize: '0.8rem', padding: '10px' }}
              >
                Alterar URL da Capa
              </button>
            </div>

            {/* Drag & drop sections reordering instruction */}
            <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
              <span style={{ fontSize: '0.75rem', color: '#a5b4fc', display: 'block', fontWeight: 600, marginBottom: 4 }}>💡 Dica do Construtor</span>
              <p style={{ fontSize: '0.7rem', color: '#9ca3af', lineHeight: 1.4 }}>
                Você pode reordenar as seções diretamente na página! Use os botões de subir/descer (▲/▼) que aparecem sobre cada seção. Clique em qualquer texto para editá-lo inline.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* Save Success Alert Banner */}
      {isSaveSuccess && (
        <div style={{
          position: 'fixed',
          top: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(16, 185, 129, 0.95)',
          color: '#fff',
          padding: '16px 32px',
          borderRadius: '50px',
          zIndex: 99999,
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          animation: 'fadeInUp 0.3s ease-out'
        }}>
          <CheckCircle2 size={20} />
          <span style={{ fontWeight: 600 }}>Site Publicado com Sucesso! 🚀</span>
        </div>
      )}

      {/* Visual Builder Sticky Controls Capsule */}
      <div style={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        background: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '12px 24px',
        borderRadius: '50px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        color: '#fff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: isBuilderMode ? '#10b981' : '#64748b', boxShadow: isBuilderMode ? '0 0 10px #10b981' : 'none' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Modo Edição Visual</span>
        </div>
        <button 
          type="button"
          onClick={() => {
            if (isBuilderMode) {
              setEditableTheme({
                primaryColor: event.themeConfig?.primaryColor || '#6B1D2F',
                secondaryColor: event.themeConfig?.secondaryColor || '#D4AF37',
                ...event.themeConfig
              });
            }
            setIsBuilderMode(!isBuilderMode);
          }}
          className="btn"
          style={{
            background: isBuilderMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: isBuilderMode ? '#ef4444' : '#fff',
            borderRadius: '20px',
            padding: '6px 14px',
            fontSize: '0.8rem'
          }}
        >
          {isBuilderMode ? 'Descartar' : 'Ativar Editor'}
        </button>
        {isBuilderMode && (
          <button
            type="button"
            onClick={() => {
              if (onUpdateEventTheme) {
                onUpdateEventTheme(event.id, editableTheme);
                setIsSaveSuccess(true);
                setTimeout(() => setIsSaveSuccess(false), 4000);
              }
              setIsBuilderMode(false);
            }}
            className="btn"
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#fff',
              borderRadius: '20px',
              padding: '6px 14px',
              fontSize: '0.8rem',
              boxShadow: '0 0 12px rgba(16,185,129,0.3)'
            }}
          >
            Salvar & Publicar
          </button>
        )}
      </div>

      {/* GIFT PIX MODAL */}
      {selectedGift && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          color: 'var(--e-text)'
        }} className="animate-fade-in">
          <div style={{ background: 'var(--e-card-bg)', width: '100%', maxWidth: '480px', padding: 32, borderRadius: 16, border: '1px solid var(--e-border)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', color: 'var(--e-text)' }}>Presentear: {selectedGift.name}</h3>
              <button onClick={() => { setSelectedGift(null); setPixModalStep('details'); }} style={{ color: 'var(--e-text-muted)' }}><X size={20} /></button>
            </div>

            {simulatedPaymentSuccess ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }} className="animate-fade-in">
                <CheckCircle2 size={60} color="#10b981" style={{ display: 'block', margin: '0 auto 16px auto' }} />
                <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--e-text)', marginBottom: 8 }}>Pix Confirmado!</h4>
                <p style={{ color: 'var(--e-text-muted)', fontSize: '0.9rem' }}>
                  Agradecemos imensamente o seu presente e carinho. O organizador já foi notificado!
                </p>
              </div>
            ) : pixModalStep === 'details' ? (
              <form onSubmit={handleGeneratePix} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                
                {selectedGift.giftType !== 'FREE_PIX' && selectedGift.suggestedAmount && (
                  <div style={{ background: `${secondaryColor}08`, border: `1px solid ${secondaryColor}20`, padding: 12, borderRadius: 8, fontSize: '0.9rem' }}>
                    Valor sugerido: <strong>{selectedGift.suggestedAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>Seu Nome</label>
                  <input 
                    type="text" 
                    placeholder="Como quer ser identificado na lista" 
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="event-input"
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>Valor do Presente (R$)</label>
                  <input 
                    type="number" 
                    min={5} 
                    placeholder={selectedGift.suggestedAmount?.toString() || "Digite o valor"} 
                    value={contributionAmount}
                    onChange={(e) => setContributionAmount(e.target.value)}
                    className="event-input"
                    required={selectedGift.giftType === 'FREE_PIX'}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>Mensagem de carinho (opcional)</label>
                  <textarea 
                    placeholder="Deixe um recado especial junto ao presente..." 
                    value={contributionMessage}
                    onChange={(e) => setContributionMessage(e.target.value)}
                    className="event-input" 
                    rows={3}
                    style={{ resize: 'none' }}
                  />
                </div>

                <button type="submit" className="event-btn-primary btn" style={{ width: '100%', marginTop: 8 }}>
                  Confirmar e Gerar Pix
                </button>
              </form>
            ) : (
              /* PIX STEP */
              <div style={{ textAlign: 'center' }} className="animate-fade-in">
                <p style={{ fontSize: '0.9rem', color: 'var(--e-text-muted)', marginBottom: 20 }}>
                  Escaneie o QR Code abaixo com o aplicativo do seu banco para fazer o pagamento de{' '}
                  <strong style={{ color: primaryColor }}>
                    {((parseFloat(contributionAmount) || selectedGift.suggestedAmount || 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </strong>:
                </p>

                {/* Simulated QR Code */}
                <div style={{ 
                  background: '#fff', 
                  padding: 16, 
                  borderRadius: 12, 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  marginBottom: 20,
                  border: '1px solid #e2e8f0'
                }}>
                  <QrCode size={180} color="#000" />
                </div>

                {/* Copia e Cola Key */}
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--e-text-muted)', marginBottom: 6 }}>Pix Copia e Cola</label>
                  <div style={{ 
                    display: 'flex', 
                    background: 'rgba(0,0,0,0.03)', 
                    border: '1px solid var(--e-border)', 
                    borderRadius: 8, 
                    padding: '8px 12px',
                    fontSize: '0.8rem'
                  }}>
                    <code style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left' }}>
                      00020101021226830014br.gov.bcb.pix2561api.mercadopago.com/v1/payments/{Math.floor(Math.random() * 100000000)}
                    </code>
                    <button 
                      onClick={() => navigator.clipboard.writeText(`00020101021226830014br.gov.bcb.pix2561api.mercadopago.com/v1/payments/${Math.floor(Math.random() * 100000000)}`)}
                      style={{ color: primaryColor, display: 'flex', alignItems: 'center', marginLeft: 8 }}
                      title="Copiar Pix Copia e Cola"
                    >
                      <Clipboard size={16} />
                    </button>
                  </div>
                </div>

                {/* Simulated payment button */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <button 
                    onClick={handleConfirmContribution}
                    className="btn btn-primary"
                    style={{ width: '100%', background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: 'none' }}
                  >
                    Simular Pix Pago
                  </button>
                  <p style={{ fontSize: '0.75rem', color: 'var(--e-text-muted)' }}>
                    Em produção real, a aprovação é processada de forma assíncrona (webhook) após a leitura do QR Code.
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

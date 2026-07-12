import { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { EventPortal } from './components/EventPortal';
import type { 
  Event, Guest, Rsvp, Gift, GiftContribution, GuestMessage, GalleryPhoto, User 
} from './types';
import { 
  mockEvents, mockGuests, mockRsvps, mockGifts, mockGiftContributions, mockGuestMessages, mockGalleryPhotos 
} from './mockData';

type ViewType = 'landing' | 'auth' | 'dashboard' | 'event-portal';

function App() {
  // Views and routing
  const [view, setView] = useState<ViewType>('landing');
  const [activeEventSlug, setActiveEventSlug] = useState<string | null>(null);
  const [inviteToken, setInviteToken] = useState<string | undefined>(undefined);
  
  // Organizer user state
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('celebrare_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Database list states (persisted in LocalStorage)
  const [events, setEvents] = useState<Event[]>(() => {
    const saved = localStorage.getItem('celebrare_events');
    return saved ? JSON.parse(saved) : mockEvents;
  });

  const [guests, setGuests] = useState<Guest[]>(() => {
    const saved = localStorage.getItem('celebrare_guests');
    return saved ? JSON.parse(saved) : mockGuests;
  });

  const [rsvps, setRsvps] = useState<Rsvp[]>(() => {
    const saved = localStorage.getItem('celebrare_rsvps');
    return saved ? JSON.parse(saved) : mockRsvps;
  });

  const [gifts, setGifts] = useState<Gift[]>(() => {
    const saved = localStorage.getItem('celebrare_gifts');
    return saved ? JSON.parse(saved) : mockGifts;
  });

  const [contributions, setContributions] = useState<GiftContribution[]>(() => {
    const saved = localStorage.getItem('celebrare_contributions');
    return saved ? JSON.parse(saved) : mockGiftContributions;
  });

  const [messages, setMessages] = useState<GuestMessage[]>(() => {
    const saved = localStorage.getItem('celebrare_messages');
    return saved ? JSON.parse(saved) : mockGuestMessages;
  });

  const [photos, setPhotos] = useState<GalleryPhoto[]>(() => {
    const saved = localStorage.getItem('celebrare_photos');
    return saved ? JSON.parse(saved) : mockGalleryPhotos;
  });

  // Theme state (default to light per user's request)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('celebrare_app_theme');
    return (saved === 'dark' || saved === 'light') ? saved : 'light';
  });

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('celebrare_app_theme', theme);
  }, [theme]);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('celebrare_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('celebrare_guests', JSON.stringify(guests));
  }, [guests]);

  useEffect(() => {
    localStorage.setItem('celebrare_rsvps', JSON.stringify(rsvps));
  }, [rsvps]);

  useEffect(() => {
    localStorage.setItem('celebrare_gifts', JSON.stringify(gifts));
  }, [gifts]);

  useEffect(() => {
    localStorage.setItem('celebrare_contributions', JSON.stringify(contributions));
  }, [contributions]);

  useEffect(() => {
    localStorage.setItem('celebrare_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('celebrare_photos', JSON.stringify(photos));
  }, [photos]);

  // Read URL parameters for Guest Token RSVP access
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const eventParam = params.get('event');
    const tokenParam = params.get('token');

    if (eventParam) {
      const eventExists = events.some(e => e.slug === eventParam);
      if (eventExists) {
        setActiveEventSlug(eventParam);
        setView('event-portal');
        if (tokenParam) {
          setInviteToken(tokenParam);
        }
      }
    }
  }, [events]);

  // Auth actions
  const handleLogin = (name: string, email: string) => {
    const loggedUser: User = {
      id: `user-${Math.floor(Math.random() * 1000)}`,
      name,
      email,
      createdAt: new Date().toISOString()
    };
    setCurrentUser(loggedUser);
    localStorage.setItem('celebrare_user', JSON.stringify(loggedUser));
    setView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('celebrare_user');
    setView('landing');
  };

  // Event handlers
  const handleAddEvent = (newEventData: Omit<Event, 'id' | 'ownerId' | 'createdAt'>) => {
    const newEventId = `event-${Math.floor(Math.random() * 10000)}`;
    const newEvent: Event = {
      ...newEventData,
      id: newEventId,
      ownerId: currentUser?.id || 'user-1',
      createdAt: new Date().toISOString()
    };
    setEvents(prev => [...prev, newEvent]);

    // Seed default gifts based on event type
    const defaultGifts: Gift[] = [];
    if (newEventData.eventType === 'WEDDING') {
      defaultGifts.push(
        {
          id: `gift-${Math.floor(Math.random() * 10000)}`,
          eventId: newEventId,
          name: 'Jogo de Jantar Oxford 30 Peças',
          description: 'Um lindo conjunto de porcelana para nossas refeições em família.',
          photoUrl: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=400',
          suggestedAmount: 450,
          giftType: 'PHYSICAL_ITEM',
          status: 'ACTIVE'
        },
        {
          id: `gift-${Math.floor(Math.random() * 10000)}`,
          eventId: newEventId,
          name: 'Cota de Lua de Mel em Paris - Jantar Romântico',
          description: 'Contribua com nosso jantar especial de frente para a Torre Eiffel.',
          photoUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=400',
          suggestedAmount: 200,
          giftType: 'CASH_CONTRIBUTION',
          status: 'ACTIVE'
        },
        {
          id: `gift-${Math.floor(Math.random() * 10000)}`,
          eventId: newEventId,
          name: 'Pix Livre para os Noivos',
          description: 'Quer nos presentear com qualquer outro valor? Use esta opção livre!',
          photoUrl: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&q=80&w=400',
          giftType: 'FREE_PIX',
          status: 'ACTIVE'
        }
      );
    } else if (newEventData.eventType === 'BIRTHDAY') {
      defaultGifts.push(
        {
          id: `gift-${Math.floor(Math.random() * 10000)}`,
          eventId: newEventId,
          name: 'Cota de Cerveja Artesanal para o Rolê',
          description: 'Pague uma rodada de chopp para o aniversariante comemorar!',
          photoUrl: 'https://images.unsplash.com/photo-1532634922-8fe0b757fb13?auto=format&fit=crop&q=80&w=400',
          suggestedAmount: 50,
          giftType: 'CASH_CONTRIBUTION',
          status: 'ACTIVE'
        },
        {
          id: `gift-${Math.floor(Math.random() * 10000)}`,
          eventId: newEventId,
          name: 'Cota para o Jantar de Comemoração',
          description: 'Ajude a pagar o rodízio de pizza ou comida japonesa do aniversariante.',
          photoUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400',
          suggestedAmount: 120,
          giftType: 'CASH_CONTRIBUTION',
          status: 'ACTIVE'
        },
        {
          id: `gift-${Math.floor(Math.random() * 10000)}`,
          eventId: newEventId,
          name: 'Pix de Aniversário (Valor Livre)',
          description: 'Quer mandar um agrado em dinheiro? Qualquer valor é super bem-vindo!',
          photoUrl: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&q=80&w=400',
          giftType: 'FREE_PIX',
          status: 'ACTIVE'
        }
      );
    } else if (newEventData.eventType === 'BABY_SHOWER') {
      defaultGifts.push(
        {
          id: `gift-${Math.floor(Math.random() * 10000)}`,
          eventId: newEventId,
          name: 'Pacote de Fraldas Descartáveis M',
          description: 'Ajude a manter o estoque de fraldas confortáveis para o bebê.',
          photoUrl: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&q=80&w=400',
          suggestedAmount: 60,
          giftType: 'PHYSICAL_ITEM',
          status: 'ACTIVE'
        },
        {
          id: `gift-${Math.floor(Math.random() * 10000)}`,
          eventId: newEventId,
          name: 'Cota para o Carrinho de Bebê Passeio',
          description: 'Contribuição para nos ajudar a comprar o carrinho dos sonhos do bebê.',
          photoUrl: 'https://images.unsplash.com/photo-1591938424262-b41316b119dc?auto=format&fit=crop&q=80&w=400',
          suggestedAmount: 150,
          giftType: 'CASH_CONTRIBUTION',
          status: 'ACTIVE'
        },
        {
          id: `gift-${Math.floor(Math.random() * 10000)}`,
          eventId: newEventId,
          name: 'Pix Mimos para o Bebê (Valor Livre)',
          description: 'Ajude a montar o quartinho e comprar os últimos detalhes do enxoval.',
          photoUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77ebf?auto=format&fit=crop&q=80&w=400',
          giftType: 'FREE_PIX',
          status: 'ACTIVE'
        }
      );
    } else if (newEventData.eventType === 'OTHER') {
      defaultGifts.push(
        {
          id: `gift-${Math.floor(Math.random() * 10000)}`,
          eventId: newEventId,
          name: 'Cota de Contribuição para a Festa',
          description: 'Ajude a patrocinar o buffet, decoração ou som da nossa comemoração!',
          photoUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=400',
          suggestedAmount: 100,
          giftType: 'CASH_CONTRIBUTION',
          status: 'ACTIVE'
        },
        {
          id: `gift-${Math.floor(Math.random() * 10000)}`,
          eventId: newEventId,
          name: 'Pix de Celebração (Valor Livre)',
          description: 'Contribua com qualquer valor para nos apoiar nessa ocasião especial.',
          photoUrl: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&q=80&w=400',
          giftType: 'FREE_PIX',
          status: 'ACTIVE'
        }
      );
    }

    if (defaultGifts.length > 0) {
      setGifts(prev => [...prev, ...defaultGifts]);
    }
  };

  const handleUpdateEventStatus = (eventId: string, status: 'DRAFT' | 'PUBLISHED') => {
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, status } : e));
  };

  const handleUpdateEventTheme = (eventId: string, themeConfig: NonNullable<Event['themeConfig']>) => {
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, themeConfig } : e));
  };

  // Guest & RSVP handlers
  const handleAddGuest = (newGuestData: Omit<Guest, 'id'>) => {
    const newGuest: Guest = {
      ...newGuestData,
      id: `guest-${Math.floor(Math.random() * 10000)}`
    };
    setGuests(prev => [...prev, newGuest]);
  };

  const handleAddRsvp = (newRsvpData: Omit<Rsvp, 'id' | 'respondedAt'>) => {
    setRsvps(prev => {
      // Remove existing rsvp for guest if present to overwrite
      const filtered = prev.filter(r => r.guestId !== newRsvpData.guestId);
      const newRsvp: Rsvp = {
        ...newRsvpData,
        id: `rsvp-${Math.floor(Math.random() * 10000)}`,
        respondedAt: new Date().toISOString()
      };
      return [...filtered, newRsvp];
    });
  };

  // Gifts & Contributions
  const handleAddGift = (newGiftData: Omit<Gift, 'id' | 'status'>) => {
    const newGift: Gift = {
      ...newGiftData,
      id: `gift-${Math.floor(Math.random() * 10000)}`,
      status: 'ACTIVE'
    };
    setGifts(prev => [...prev, newGift]);
  };

  const handleAddContribution = (newContribData: Omit<GiftContribution, 'id' | 'createdAt' | 'paymentStatus' | 'externalPaymentId'>) => {
    const newContrib: GiftContribution = {
      ...newContribData,
      id: `contrib-${Math.floor(Math.random() * 10000)}`,
      paymentStatus: 'PENDING', // Initial status is always PENDING per OpenSpec
      createdAt: new Date().toISOString(),
      externalPaymentId: `mp-pay-${Math.floor(Math.random() * 100000000)}`
    };
    setContributions(prev => [...prev, newContrib]);
  };

  const handleApproveContribution = (contribId: string) => {
    // Simulates the payment webhook by setting status to APPROVED
    setContributions(prev => prev.map(c => c.id === contribId ? { ...c, paymentStatus: 'APPROVED' } : c));
  };

  // Guest Messages Approval
  const handleAddMessage = (newMsgData: Omit<GuestMessage, 'id' | 'createdAt' | 'approved'>) => {
    const newMsg: GuestMessage = {
      ...newMsgData,
      id: `msg-${Math.floor(Math.random() * 10000)}`,
      approved: false, // Moderated by default
      createdAt: new Date().toISOString()
    };
    setMessages(prev => [...prev, newMsg]);
  };

  const handleApproveMessage = (messageId: string) => {
    setMessages(prev => prev.map(m => m.id === messageId ? { ...m, approved: true } : m));
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(m => m.id !== messageId));
  };

  // Guest Photo Gallery Approval
  const handleAddPhoto = (newPhotoData: Omit<GalleryPhoto, 'id' | 'createdAt' | 'approved'>) => {
    const newPhoto: GalleryPhoto = {
      ...newPhotoData,
      id: `photo-${Math.floor(Math.random() * 10000)}`,
      approved: false, // Moderated by default
      createdAt: new Date().toISOString()
    };
    setPhotos(prev => [...prev, newPhoto]);
  };

  const handleApprovePhoto = (photoId: string) => {
    setPhotos(prev => prev.map(p => p.id === photoId ? { ...p, approved: true } : p));
  };

  const handleDeletePhoto = (photoId: string) => {
    setPhotos(prev => prev.filter(p => p.id !== photoId));
  };

  // Navigation handlers
  const handleViewEventPage = (slug: string) => {
    setActiveEventSlug(slug);
    // Add event param to browser history without reloading
    window.history.pushState(null, '', `?event=${slug}`);
    setView('event-portal');
  };

  const handleBackToHome = () => {
    setActiveEventSlug(null);
    setInviteToken(undefined);
    // Clear URL parameters
    window.history.pushState(null, '', window.location.pathname);
    if (currentUser) {
      setView('dashboard');
    } else {
      setView('landing');
    }
  };

  // Render current view
  const renderView = () => {
    switch (view) {
      case 'landing':
        return (
          <LandingPage 
            events={events}
            onNavigateToDashboard={() => setView(currentUser ? 'dashboard' : 'auth')}
            onNavigateToEvent={handleViewEventPage}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        );
      
      case 'auth':
        return (
          <Auth 
            onLogin={handleLogin}
            onBack={() => setView('landing')}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        );
      
      case 'dashboard':
        if (!currentUser) {
          setView('auth');
          return null;
        }
        return (
          <Dashboard 
            userName={currentUser.name}
            events={events}
            guests={guests}
            rsvps={rsvps}
            gifts={gifts}
            contributions={contributions}
            messages={messages}
            photos={photos}
            onAddEvent={handleAddEvent}
            onUpdateEventStatus={handleUpdateEventStatus}
            onAddGuest={handleAddGuest}
            onAddGift={handleAddGift}
            onApproveContribution={handleApproveContribution}
            onApproveMessage={handleApproveMessage}
            onDeleteMessage={handleDeleteMessage}
            onApprovePhoto={handleApprovePhoto}
            onDeletePhoto={handleDeletePhoto}
            onLogout={handleLogout}
            onViewEventPage={handleViewEventPage}
            onUpdateEventTheme={handleUpdateEventTheme}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        );
      
      case 'event-portal':
        const event = events.find(e => e.slug === activeEventSlug);
        if (!event) {
          setView('landing');
          return null;
        }
        return (
          <EventPortal 
            event={event}
            guests={guests}
            rsvps={rsvps}
            gifts={gifts}
            messages={messages}
            photos={photos}
            inviteToken={inviteToken}
            onAddRsvp={handleAddRsvp}
            onAddContribution={handleAddContribution}
            onAddMessage={handleAddMessage}
            onAddPhoto={handleAddPhoto}
            onBackToHome={handleBackToHome}
            onUpdateEventTheme={handleUpdateEventTheme}
          />
        );
      
      default:
        return (
          <LandingPage 
            events={events} 
            onNavigateToDashboard={() => setView('auth')} 
            onNavigateToEvent={handleViewEventPage} 
            theme={theme}
            toggleTheme={toggleTheme}
          />
        );
    }
  };

  return <>{renderView()}</>;
}

export default App;

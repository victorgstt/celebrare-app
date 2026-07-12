import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, Gift, MessageSquare, Plus, Check, X, 
  ExternalLink, Copy, CheckCircle2, AlertCircle, LogOut, Settings, Calendar, MapPin, Sparkles, Palette, Eye, Heart, Sun, Moon
} from 'lucide-react';
import type { 
  Event, Guest, Rsvp, Gift as GiftItem, GiftContribution, GuestMessage, GalleryPhoto, EventType, GiftType
} from '../types';

interface DashboardProps {
  userName: string;
  events: Event[];
  guests: Guest[];
  rsvps: Rsvp[];
  gifts: GiftItem[];
  contributions: GiftContribution[];
  messages: GuestMessage[];
  photos: GalleryPhoto[];
  onAddEvent: (event: Omit<Event, 'id' | 'ownerId' | 'createdAt'>) => void;
  onUpdateEventStatus: (eventId: string, status: 'DRAFT' | 'PUBLISHED') => void;
  onAddGuest: (guest: Omit<Guest, 'id'>) => void;
  onAddGift: (gift: Omit<GiftItem, 'id' | 'status'>) => void;
  onApproveContribution: (contribId: string) => void;
  onApproveMessage: (messageId: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onApprovePhoto: (photoId: string) => void;
  onDeletePhoto: (photoId: string) => void;
  onLogout: () => void;
  onViewEventPage: (slug: string) => void;
  onUpdateEventTheme: (eventId: string, themeConfig: NonNullable<Event['themeConfig']>) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

type TabType = 'overview' | 'guests' | 'gifts' | 'content' | 'customize';

export const Dashboard: React.FC<DashboardProps> = ({
  userName,
  events,
  guests,
  rsvps,
  gifts,
  contributions,
  messages,
  photos,
  onAddEvent,
  onUpdateEventStatus,
  onAddGuest,
  onAddGift,
  onApproveContribution,
  onApproveMessage,
  onDeleteMessage,
  onApprovePhoto,
  onDeletePhoto,
  onLogout,
  onViewEventPage,
  onUpdateEventTheme,
  theme,
  toggleTheme
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || '');

  // Customizer form states
  const [themeLayout, setThemeLayout] = useState<'classic' | 'modern' | 'neon' | 'pastel'>('classic');
  const [themePrimary, setThemePrimary] = useState('#6B1D2F');
  const [themeSecondary, setThemeSecondary] = useState('#D4AF37');
  const [themeBg, setThemeBg] = useState('#FAF7F2');
  const [themeFontTitle, setThemeFontTitle] = useState('Playfair Display');
  const [themeFontBody, setThemeFontBody] = useState('Outfit');
  const [themeWelcome, setThemeWelcome] = useState('');
  const [themeBannerUrl, setThemeBannerUrl] = useState('');
  const [themeShowCountdown, setThemeShowCountdown] = useState(true);
  const [themeShowMural, setThemeShowMural] = useState(true);
  const [themeShowGallery, setThemeShowGallery] = useState(true);
  const [themeSchedule, setThemeSchedule] = useState<Array<{ id: string; time: string; activity: string }>>([]);

  // Website Builder Additions States
  const [themeHeaderStyle, setThemeHeaderStyle] = useState<'classic_hero' | 'split_hero' | 'minimalist'>('classic_hero');
  const [themeCardStyle, setThemeCardStyle] = useState<'glass' | 'solid' | 'frosted'>('frosted');
  const [themeBorderStyle, setThemeBorderStyle] = useState<'rounded' | 'sharp' | 'pill'>('rounded');
  const [themeBgPattern, setThemeBgPattern] = useState<'none' | 'dots' | 'leaves' | 'swirls'>('none');

  const [themeShowStory, setThemeShowStory] = useState(true);
  const [themeStoryTitle, setThemeStoryTitle] = useState('Nossa História');
  const [themeStoryText, setThemeStoryText] = useState('');
  const [themeStoryTimeline, setThemeStoryTimeline] = useState<Array<{ id: string; year: string; title: string; desc: string }>>([]);

  const [themeRsvpHeading, setThemeRsvpHeading] = useState('Confirmação de Presença');
  const [themeRsvpIntro, setThemeRsvpIntro] = useState('');
  const [themeGiftsHeading, setThemeGiftsHeading] = useState('Lista de Presentes');
  const [themeGiftsIntro, setThemeGiftsIntro] = useState('');
  const [themeMuralHeading, setThemeMuralHeading] = useState('Mural de Recados');
  const [themeMuralIntro, setThemeMuralIntro] = useState('');
  const [themeGalleryHeading, setThemeGalleryHeading] = useState('Galeria de Lembranças');
  const [themeGalleryIntro, setThemeGalleryIntro] = useState('');

  // Timeline story milestone form state
  const [newMilestoneYear, setNewMilestoneYear] = useState('');
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneDesc, setNewMilestoneDesc] = useState('');

  const [newActivityTime, setNewActivityTime] = useState('');
  const [newActivityDesc, setNewActivityDesc] = useState('');
  const [customizeSuccessMessage, setCustomizeSuccessMessage] = useState('');

  // Sync state with selected event
  useEffect(() => {
    const actEvt = events.find(e => e.id === selectedEventId);
    if (actEvt) {
      const tc = actEvt.themeConfig;
      setThemeLayout(tc?.layoutTheme || 'classic');
      setThemePrimary(tc?.primaryColor || '#6B1D2F');
      setThemeSecondary(tc?.secondaryColor || '#D4AF37');
      setThemeBg(tc?.backgroundColor || '#FAF7F2');
      setThemeFontTitle(tc?.fontTitle || 'Playfair Display');
      setThemeFontBody(tc?.fontBody || 'Outfit');
      setThemeWelcome(tc?.welcomeText || '');
      setThemeBannerUrl(tc?.backgroundImageUrl || '');
      setThemeShowCountdown(tc?.showCountdown ?? true);
      setThemeShowMural(tc?.showMural ?? true);
      setThemeShowGallery(tc?.showGallery ?? true);
      setThemeSchedule(tc?.schedule || []);

      setThemeHeaderStyle(tc?.headerStyle || 'classic_hero');
      setThemeCardStyle(tc?.cardStyle || 'frosted');
      setThemeBorderStyle(tc?.borderStyle || 'rounded');
      setThemeBgPattern(tc?.bgPattern || 'none');
      setThemeShowStory(tc?.showStory ?? true);
      setThemeStoryTitle(tc?.storyTitle || 'Nossa História');
      setThemeStoryText(tc?.storyText || '');
      setThemeStoryTimeline(tc?.storyTimeline || []);
      setThemeRsvpHeading(tc?.rsvpHeading || 'Confirmação de Presença');
      setThemeRsvpIntro(tc?.rsvpIntro || '');
      setThemeGiftsHeading(tc?.giftsHeading || 'Lista de Presentes');
      setThemeGiftsIntro(tc?.giftsIntro || '');
      setThemeMuralHeading(tc?.muralHeading || 'Mural de Recados');
      setThemeMuralIntro(tc?.muralIntro || '');
      setThemeGalleryHeading(tc?.galleryHeading || 'Galeria de Lembranças');
      setThemeGalleryIntro(tc?.galleryIntro || '');

      setCustomizeSuccessMessage('');
    }
  }, [selectedEventId, events]);

  // States for forms
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [eventCreationStep, setEventCreationStep] = useState<1 | 2>(1);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventSlug, setNewEventSlug] = useState('');
  const [newEventType, setNewEventType] = useState<EventType>('WEDDING');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventVenueName, setNewEventVenueName] = useState('');
  const [newEventVenueAddress, setNewEventVenueAddress] = useState('');
  const [newEventWelcomeText, setNewEventWelcomeText] = useState('');
  const [eventFormError, setEventFormError] = useState('');

  const [showAddGuestModal, setShowAddGuestModal] = useState(false);
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestEmail, setNewGuestEmail] = useState('');
  const [newGuestPhone, setNewGuestPhone] = useState('');
  const [newGuestGroup, setNewGuestGroup] = useState('');

  const [showAddGiftModal, setShowAddGiftModal] = useState(false);
  const [newGiftName, setNewGiftName] = useState('');
  const [newGiftDesc, setNewGiftDesc] = useState('');
  const [newGiftPhotoUrl, setNewGiftPhotoUrl] = useState('');
  const [newGiftAmount, setNewGiftAmount] = useState('');
  const [newGiftType, setNewGiftType] = useState<GiftType>('PHYSICAL_ITEM');

  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const activeEvent = events.find(e => e.id === selectedEventId) || events[0];

  // Helper selectors
  const activeEventGuests = guests.filter(g => g.eventId === selectedEventId);
  const activeEventGifts = gifts.filter(g => g.eventId === selectedEventId);
  const activeEventMessages = messages.filter(m => m.eventId === selectedEventId);
  const activeEventPhotos = photos.filter(p => p.eventId === selectedEventId);

  const getRsvpForGuest = (guestId: string) => {
    return rsvps.find(r => r.guestId === guestId);
  };

  // Copy simulated link
  const copyInviteLink = (guest: Guest) => {
    const mockUrl = `${window.location.origin}/?event=${activeEvent?.slug}&token=${guest.inviteToken}`;
    navigator.clipboard.writeText(mockUrl);
    setCopiedToken(guest.id);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  // Calculate RSVP stats
  const totalGuests = activeEventGuests.length;
  const rsvpResponses = activeEventGuests.map(g => getRsvpForGuest(g.id)).filter(Boolean) as Rsvp[];
  const confirmedCount = rsvpResponses.filter(r => r.confirmed).length;
  const declinedCount = rsvpResponses.filter(r => !r.confirmed).length;
  const noResponseCount = totalGuests - rsvpResponses.length;
  
  const totalAdults = rsvpResponses.filter(r => r.confirmed).reduce((sum, r) => sum + r.adultsCount, 0);
  const totalChildren = rsvpResponses.filter(r => r.confirmed).reduce((sum, r) => sum + r.childrenCount, 0);
  const totalConfirmedAttendees = totalAdults + totalChildren;

  // Calculate gift stats
  const totalGiftsValue = contributions
    .filter(c => c.paymentStatus === 'APPROVED' && activeEventGifts.some(g => g.id === c.giftId))
    .reduce((sum, c) => sum + c.amount, 0);

  const pendingContributions = contributions
    .filter(c => c.paymentStatus === 'PENDING' && activeEventGifts.some(g => g.id === c.giftId));

  // Form handlers
  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    setEventFormError('');

    if (!newEventTitle || !newEventSlug || !newEventDate || !newEventVenueName) {
      setEventFormError('Por favor, preencha os campos obrigatórios.');
      return;
    }

    const slugPattern = /^[a-z0-9-]+$/;
    if (!slugPattern.test(newEventSlug)) {
      setEventFormError('O slug deve conter apenas letras minúsculas, números e hífens.');
      return;
    }

    if (events.some(evt => evt.slug === newEventSlug)) {
      setEventFormError('Já existe um evento com este link amigável (slug).');
      return;
    }

    // Presets based on event type
    let primaryColor = '#6B1D2F';
    let secondaryColor = '#D4AF37';
    let backgroundColor = '#faf7f2';
    let fontTitle = 'Playfair Display';
    let fontBody = 'Inter';
    let backgroundImageUrl = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200';
    let layoutTheme: 'classic' | 'modern' | 'neon' | 'pastel' = 'classic';
    let headerStyle: 'classic_hero' | 'split_hero' | 'minimalist' = 'classic_hero';
    let cardStyle: 'glass' | 'solid' | 'frosted' = 'frosted';
    let borderStyle: 'rounded' | 'sharp' | 'pill' = 'rounded';
    let bgPattern: 'none' | 'dots' | 'leaves' | 'swirls' = 'none';

    let storyTitle = 'Nossa História';
    let rsvpHeading = 'Confirmação de Presença';
    let giftsHeading = 'Lista de Presentes';
    let muralHeading = 'Mural de Recados';
    let galleryHeading = 'Galeria de Lembranças';

    if (newEventType === 'BIRTHDAY') {
      primaryColor = '#6366f1'; // Indigo
      secondaryColor = '#f59e0b'; // Amber
      backgroundColor = '#0b0f19'; // Matte slate
      fontTitle = 'Outfit';
      fontBody = 'Outfit';
      backgroundImageUrl = 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=1200';
      layoutTheme = 'modern';
      headerStyle = 'split_hero';
      cardStyle = 'glass';
      borderStyle = 'pill';
      bgPattern = 'dots';
      storyTitle = 'Minha História';
      rsvpHeading = 'Confirme sua Presença';
      giftsHeading = 'Lista de Lembranças / Mimos';
      muralHeading = 'Mural de Parabéns';
      galleryHeading = 'Fotos da Minha Vida';
    } else if (newEventType === 'BABY_SHOWER') {
      primaryColor = '#0d9488'; // Teal
      secondaryColor = '#f43f5e'; // Coral
      backgroundColor = '#f5fafd'; // Soft light blue
      fontTitle = 'Outfit';
      fontBody = 'Inter';
      backgroundImageUrl = 'https://images.unsplash.com/photo-1519689680058-324335c77ebf?auto=format&fit=crop&q=80&w=1200';
      layoutTheme = 'pastel';
      headerStyle = 'split_hero';
      cardStyle = 'frosted';
      borderStyle = 'rounded';
      bgPattern = 'dots';
      storyTitle = 'À Espera do Bebê';
      rsvpHeading = 'Confirmar Presença';
      giftsHeading = 'Chá de Fraldas & Enxoval';
      muralHeading = 'Desejos para o Bebê';
      galleryHeading = 'Galeria de Fotos';
    } else if (newEventType === 'CORPORATE') {
      primaryColor = '#1e3a8a'; // Corporate Blue
      secondaryColor = '#475569'; // Slate Grey
      backgroundColor = '#f8fafc'; // Clean White Grey
      fontTitle = 'Inter';
      fontBody = 'Inter';
      backgroundImageUrl = 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1200';
      layoutTheme = 'classic';
      headerStyle = 'minimalist';
      cardStyle = 'solid';
      borderStyle = 'sharp';
      bgPattern = 'none';
      storyTitle = 'Sobre a Convenção';
      rsvpHeading = 'Credenciamento / Inscrição';
      giftsHeading = 'Lista de Apoios / Cotas';
      muralHeading = 'Feedbacks e Comentários';
      galleryHeading = 'Galeria do Evento';
    } else if (newEventType === 'OTHER') {
      primaryColor = '#059669'; // Emerald
      secondaryColor = '#0f766e'; // Dark Teal
      backgroundColor = '#fafafa'; // Light neutral
      fontTitle = 'Outfit';
      fontBody = 'Inter';
      backgroundImageUrl = 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=1200';
      layoutTheme = 'classic';
      headerStyle = 'classic_hero';
      cardStyle = 'frosted';
      borderStyle = 'rounded';
      bgPattern = 'none';
      storyTitle = 'Sobre a Celebração';
      rsvpHeading = 'Confirmação de RSVP';
      giftsHeading = 'Lista de Lembranças';
      muralHeading = 'Mural de Mensagens';
      galleryHeading = 'Galeria de Recordações';
    }

    onAddEvent({
      title: newEventTitle,
      slug: newEventSlug,
      eventType: newEventType,
      status: 'DRAFT',
      eventDate: new Date(newEventDate).toISOString(),
      venueName: newEventVenueName,
      venueAddress: newEventVenueAddress,
      themeConfig: {
        primaryColor,
        secondaryColor,
        backgroundColor,
        fontTitle,
        fontBody,
        backgroundImageUrl,
        layoutTheme,
        headerStyle,
        cardStyle,
        borderStyle,
        bgPattern,
        welcomeText: newEventWelcomeText || 'Sejam bem-vindos ao site do nosso evento!',
        showCountdown: true,
        showMural: true,
        showGallery: true,
        storyTitle,
        storyText: newEventType === 'WEDDING' ? 'Aqui contamos um pouco da nossa jornada juntos...' : 'Venha fazer parte desse dia especial conosco...',
        rsvpHeading,
        giftsHeading,
        muralHeading,
        galleryHeading,
        sectionOrder: ['welcome', 'location', 'story', 'schedule', 'rsvp', 'gifts', 'mural', 'gallery']
      }
    });

    // Reset fields
    setNewEventTitle('');
    setNewEventSlug('');
    setNewEventDate('');
    setNewEventVenueName('');
    setNewEventVenueAddress('');
    setNewEventWelcomeText('');
    setShowAddEventModal(false);
    setEventCreationStep(1);
  };

  const handleCreateGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName || !newGuestEmail) return;

    onAddGuest({
      eventId: selectedEventId,
      name: newGuestName,
      email: newGuestEmail,
      phone: newGuestPhone,
      guestGroup: newGuestGroup || undefined,
      inviteToken: `token-${newGuestName.toLowerCase().replace(/\s+/g, '-')}-${Math.floor(Math.random() * 1000)}`
    });

    setNewGuestName('');
    setNewGuestEmail('');
    setNewGuestPhone('');
    setNewGuestGroup('');
    setShowAddGuestModal(false);
  };

  const handleCreateGift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGiftName) return;

    onAddGift({
      eventId: selectedEventId,
      name: newGiftName,
      description: newGiftDesc,
      photoUrl: newGiftPhotoUrl || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=400',
      suggestedAmount: newGiftAmount ? parseFloat(newGiftAmount) : undefined,
      giftType: newGiftType
    });

    setNewGiftName('');
    setNewGiftDesc('');
    setNewGiftPhotoUrl('');
    setNewGiftAmount('');
    setShowAddGiftModal(false);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-app)' }} className="animate-fade-in">
      {/* Sidebar Navigation */}
      <aside className="glass-panel" style={{
        width: '280px',
        borderRadius: 0,
        borderTop: 'none',
        borderLeft: 'none',
        borderBottom: 'none',
        padding: '32px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 40,
        zIndex: 10
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, fontSize: '1.4rem', color: 'var(--text-primary)' }}>
          <Sparkles size={24} color="#6366f1" />
          <span>Celebrare</span>
        </div>

        {/* User Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
            {userName.charAt(0).toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userName}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Organizador</div>
          </div>
        </div>

        {/* Event Select Dropdown */}
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 8 }}>
            Selecione o Evento
          </label>
          <select 
            value={selectedEventId} 
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="glass-input"
            style={{ padding: '8px 12px', fontSize: '0.85rem' }}
          >
            {events.map(evt => (
              <option key={evt.id} value={evt.id} style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>
                {evt.title}
              </option>
            ))}
          </select>
        </div>

        {/* Menu Links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button 
            onClick={() => setActiveTab('overview')}
            className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ justifyContent: 'flex-start', padding: '10px 16px', fontSize: '0.9rem' }}
          >
            <LayoutDashboard size={18} /> Painel Geral
          </button>
          
          <button 
            onClick={() => setActiveTab('guests')}
            className={`btn ${activeTab === 'guests' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ justifyContent: 'flex-start', padding: '10px 16px', fontSize: '0.9rem' }}
          >
            <Users size={18} /> Convidados & RSVP
          </button>

          <button 
            onClick={() => setActiveTab('gifts')}
            className={`btn ${activeTab === 'gifts' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ justifyContent: 'flex-start', padding: '10px 16px', fontSize: '0.9rem' }}
          >
            <Gift size={18} /> Lista de Presentes
          </button>

          <button 
            onClick={() => setActiveTab('content')}
            className={`btn ${activeTab === 'content' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ justifyContent: 'flex-start', padding: '10px 16px', fontSize: '0.9rem' }}
          >
            <MessageSquare size={18} /> Mural & Fotos
            {(messages.filter(m => !m.approved && m.eventId === selectedEventId).length + 
              photos.filter(p => !p.approved && p.eventId === selectedEventId).length) > 0 && (
              <span style={{ 
                marginLeft: 'auto', 
                background: 'var(--accent)', 
                color: 'var(--text-primary)', 
                fontSize: '0.7rem', 
                padding: '2px 6px', 
                borderRadius: '50px',
                fontWeight: 700
              }}>
                {messages.filter(m => !m.approved && m.eventId === selectedEventId).length + 
                 photos.filter(p => !p.approved && p.eventId === selectedEventId).length}
              </span>
            )}
          </button>

          <button 
            onClick={() => setActiveTab('customize')}
            className={`btn ${activeTab === 'customize' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ justifyContent: 'flex-start', padding: '10px 16px', fontSize: '0.9rem' }}
          >
            <Palette size={18} /> Personalizar Site
          </button>
        </nav>

        {/* Footer Actions */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button 
            onClick={toggleTheme}
            className="btn btn-secondary" 
            style={{ padding: '10px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 8 }}
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            {theme === 'light' ? 'Tema Escuro' : 'Tema Claro'}
          </button>

          {activeEvent && (
            <button 
              onClick={() => onViewEventPage(activeEvent.slug)}
              className="btn btn-secondary" 
              style={{ padding: '10px 16px', fontSize: '0.85rem', color: 'var(--primary)', borderColor: 'var(--border-color)' }}
            >
              <ExternalLink size={16} /> Ver Site Convidado
            </button>
          )}

          <button 
            onClick={onLogout} 
            className="btn btn-secondary" 
            style={{ padding: '10px 16px', fontSize: '0.85rem', color: 'var(--error)', borderColor: 'rgba(220, 38, 38, 0.1)' }}
          >
            <LogOut size={16} /> Sair do Sistema
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '40px 48px', overflowY: 'auto', maxHeight: '100vh' }}>
        
        {/* Top Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
              {activeTab === 'overview' && 'Painel Geral do Evento'}
              {activeTab === 'guests' && 'Gestão de Convidados & RSVP'}
              {activeTab === 'gifts' && 'Lista de Presentes Pix'}
              {activeTab === 'content' && 'Moderação de Conteúdo Interativo'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 4 }}>
              Gerenciando: <strong>{activeEvent?.title}</strong> ({activeEvent?.eventType})
            </p>
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            <button onClick={() => { setEventCreationStep(1); setShowAddEventModal(true); }} className="btn btn-primary">
              <Plus size={18} /> Novo Evento
            </button>
          </div>
        </header>

        {/* WARNING FOR DRAFT STATUS */}
        {activeEvent?.status === 'DRAFT' && (
          <div className="glass-panel" style={{
            background: 'var(--warning-glow)',
            borderColor: 'rgba(245, 158, 11, 0.2)',
            padding: 16,
            borderRadius: 'var(--radius-md)',
            marginBottom: 32,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <AlertCircle color="var(--warning)" size={24} />
              <div>
                <strong style={{ color: 'var(--warning)' }}>Evento em Rascunho (Draft)</strong>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                  Este site está invisível para convidados. Publique-o para permitir RSVPs e recebimento de presentes.
                </div>
              </div>
            </div>
            <button 
              onClick={() => onUpdateEventStatus(activeEvent.id, 'PUBLISHED')} 
              className="btn btn-secondary"
              style={{ background: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.3)', color: 'var(--warning)', padding: '6px 12px', fontSize: '0.8rem' }}
            >
              Publicar Agora
            </button>
          </div>
        )}

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && activeEvent && (
          <div className="animate-fade-in-up">
            {/* Quick Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24, marginBottom: 40 }}>
              <div className="glass-panel" style={{ padding: 24 }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Convidados Confirmados</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 8 }}>{confirmedCount}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  {totalConfirmedAttendees} pessoas no total (incl. crianças)
                </div>
              </div>

              <div className="glass-panel" style={{ padding: 24 }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Pendente de Resposta</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 8 }}>{noResponseCount}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  De {totalGuests} convidados cadastrados
                </div>
              </div>

              <div className="glass-panel" style={{ padding: 24 }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Total Recebido (Pix)</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)', marginTop: 8 }}>
                  {totalGiftsValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  {contributions.filter(c => c.paymentStatus === 'APPROVED' && activeEventGifts.some(g => g.id === c.giftId)).length} presentes pagos
                </div>
              </div>

              <div className="glass-panel" style={{ padding: 24 }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Pendentes Moderar</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)', marginTop: 8 }}>
                  {activeEventMessages.filter(m => !m.approved).length + activeEventPhotos.filter(p => !p.approved).length}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  Recados e Fotos enviados por convidados
                </div>
              </div>
            </div>

            {/* Event Info Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32 }}>
              <div className="glass-panel" style={{ padding: 32 }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}><Calendar size={18} /> Detalhes do Evento</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Nome da Celebração</label>
                    <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{activeEvent.title}</div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Data e Hora</label>
                      <div>{new Date(activeEvent.eventDate).toLocaleString('pt-BR')}</div>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Link do Site (Slug)</label>
                      <div><code>/{activeEvent.slug}</code></div>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}><MapPin size={12} /> Local e Endereço</label>
                    <div>{activeEvent.venueName} - <span style={{ color: 'var(--text-secondary)' }}>{activeEvent.venueAddress}</span></div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Texto de Boas-vindas</label>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: 12, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                      {activeEvent.themeConfig?.welcomeText}
                    </div>
                  </div>
                </div>
              </div>

              {/* Theme Settings Widget */}
              <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
                <h3 style={{ fontSize: '1.1rem' }}><Settings size={16} /> Estilo Visual</h3>
                
                <div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ width: 16, height: 16, borderRadius: 4, background: activeEvent.themeConfig?.primaryColor }} />
                    <span style={{ fontSize: '0.85rem' }}>Cor Primária: <code>{activeEvent.themeConfig?.primaryColor}</code></span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
                    <span style={{ width: 16, height: 16, borderRadius: 4, background: activeEvent.themeConfig?.secondaryColor }} />
                    <span style={{ fontSize: '0.85rem' }}>Cor Secundária: <code>{activeEvent.themeConfig?.secondaryColor}</code></span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Imagem de Capa</span>
                  {activeEvent.themeConfig?.backgroundImageUrl && (
                    <img 
                      src={activeEvent.themeConfig.backgroundImageUrl} 
                      alt="Capa" 
                      style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} 
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: GUESTS & RSVP */}
        {activeTab === 'guests' && (
          <div className="animate-fade-in-up">
            {/* Action Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ display: 'flex', gap: 16 }}>
                <div className="glass-panel" style={{ padding: '10px 20px', borderRadius: 40, display: 'flex', gap: 24, fontSize: '0.85rem' }}>
                  <span>Cadastrados: <strong>{totalGuests}</strong></span>
                  <span style={{ color: 'var(--success)' }}>Confirmados: <strong>{confirmedCount}</strong></span>
                  <span style={{ color: 'var(--error)' }}>Recusados: <strong>{declinedCount}</strong></span>
                  <span style={{ color: 'var(--warning)' }}>Sem Resposta: <strong>{noResponseCount}</strong></span>
                </div>
              </div>
              
              <button onClick={() => setShowAddGuestModal(true)} className="btn btn-primary" style={{ padding: '10px 20px' }}>
                <Plus size={16} /> Cadastrar Convidado
              </button>
            </div>

            {/* Guest Table */}
            <div className="glass-panel" style={{ overflowX: 'auto', borderRadius: 'var(--radius-md)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.01)' }}>
                    <th style={{ padding: '16px 20px', color: 'var(--text-secondary)' }}>Convidado</th>
                    <th style={{ padding: '16px 20px', color: 'var(--text-secondary)' }}>Grupo</th>
                    <th style={{ padding: '16px 20px', color: 'var(--text-secondary)' }}>RSVP Status</th>
                    <th style={{ padding: '16px 20px', color: 'var(--text-secondary)' }}>Acompanhantes</th>
                    <th style={{ padding: '16px 20px', color: 'var(--text-secondary)' }}>Restrições</th>
                    <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', textAlign: 'right' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {activeEventGuests.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>
                        Nenhum convidado cadastrado. Clique em "Cadastrar Convidado" para iniciar.
                      </td>
                    </tr>
                  ) : (
                    activeEventGuests.map(guest => {
                      const rsvp = getRsvpForGuest(guest.id);
                      return (
                        <tr key={guest.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '16px 20px' }}>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{guest.name}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{guest.email} • {guest.phone}</div>
                          </td>
                          <td style={{ padding: '16px 20px' }}>
                            {guest.guestGroup ? (
                              <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: 4 }}>
                                {guest.guestGroup}
                              </span>
                            ) : '-'}
                          </td>
                          <td style={{ padding: '16px 20px' }}>
                            {rsvp ? (
                              rsvp.confirmed ? (
                                <span className="badge badge-success">Confirmado</span>
                              ) : (
                                <span className="badge badge-danger">Recusado</span>
                              )
                            ) : (
                              <span className="badge badge-warning">Sem Resposta</span>
                            )}
                          </td>
                          <td style={{ padding: '16px 20px' }}>
                            {rsvp?.confirmed ? (
                              <span style={{ fontSize: '0.85rem' }}>
                                {rsvp.adultsCount} Adulto(s) {rsvp.childrenCount > 0 ? `+ ${rsvp.childrenCount} Criança(s)` : ''}
                              </span>
                            ) : '-'}
                          </td>
                          <td style={{ padding: '16px 20px', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {rsvp?.dietaryRestriction ? (
                              <span style={{ color: 'var(--warning)', fontSize: '0.85rem' }} title={rsvp.dietaryRestriction}>
                                ⚠️ {rsvp.dietaryRestriction}
                              </span>
                            ) : '-'}
                          </td>
                          <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                            <button 
                              onClick={() => copyInviteLink(guest)} 
                              className="btn btn-secondary" 
                              style={{ padding: '6px 12px', fontSize: '0.75rem', gap: 4 }}
                              title="Copiar Link RSVP do Convidado"
                            >
                              {copiedToken === guest.id ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
                              {copiedToken === guest.id ? 'Copiado!' : 'Copiar Link'}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: GIFT REGISTRY */}
        {activeTab === 'gifts' && (
          <div className="animate-fade-in-up">
            {/* Top Submenu tabs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 32 }}>
              
              {/* Gifts list configuration */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.1rem' }}>Itens Disponíveis</h3>
                  <button onClick={() => setShowAddGiftModal(true)} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem', gap: 4 }}>
                    <Plus size={14} /> Novo Presente
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {activeEventGifts.map(gift => (
                    <div key={gift.id} className="glass-panel" style={{ padding: 16, display: 'flex', gap: 12 }}>
                      <img 
                        src={gift.photoUrl} 
                        alt={gift.name} 
                        style={{ width: 60, height: 60, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} 
                      />
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{gift.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          Tipo: {gift.giftType === 'FREE_PIX' ? 'Pix Livre' : gift.giftType === 'CASH_CONTRIBUTION' ? 'Cota Dinheiro' : 'Item Físico'}
                        </div>
                        {gift.suggestedAmount && (
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--success)', marginTop: 4 }}>
                            {gift.suggestedAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contributions & Webhook Simulator */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem' }}>Contribuições de Presente</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: 4 }}>
                    Histórico de pagamentos recebidos dos convidados.
                  </p>
                </div>

                {/* Simulated Webhook Warning */}
                {pendingContributions.length > 0 && (
                  <div className="glass-panel" style={{
                    background: 'var(--primary-glow)',
                    borderColor: 'rgba(99, 102, 241, 0.2)',
                    padding: 16,
                    borderRadius: 'var(--radius-md)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <CheckCircle2 color="var(--primary)" size={20} />
                      <div style={{ flex: 1 }}>
                        <strong style={{ color: 'var(--primary)', fontSize: '0.85rem' }}>Simulador de Webhook de Pagamento (Mercado Pago)</strong>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                          Você possui {pendingContributions.length} pagamento(s) PENDENTE(s). Em produção, a aprovação vem do Mercado Pago via webhook. Simule a resposta do webhook clicando em "Simular Webhook Pix".
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="glass-panel" style={{ overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.01)' }}>
                        <th style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>Doador</th>
                        <th style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>Presente / Mensagem</th>
                        <th style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>Valor</th>
                        <th style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>Status</th>
                        <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', textAlign: 'right' }}>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contributions.filter(c => activeEventGifts.some(g => g.id === c.giftId)).length === 0 ? (
                        <tr>
                          <td colSpan={5} style={{ padding: 30, textAlign: 'center', color: 'var(--text-secondary)' }}>
                            Nenhuma contribuição recebida ainda.
                          </td>
                        </tr>
                      ) : (
                        contributions
                          .filter(c => activeEventGifts.some(g => g.id === c.giftId))
                          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                          .map(contrib => {
                            const gift = gifts.find(g => g.id === contrib.giftId);
                            return (
                              <tr key={contrib.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '14px 16px' }}>
                                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{contrib.guestName || 'Anônimo'}</div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                    {new Date(contrib.createdAt).toLocaleDateString('pt-BR')}
                                  </div>
                                </td>
                                <td style={{ padding: '14px 16px', maxWidth: '240px' }}>
                                  <div style={{ fontWeight: 500, fontSize: '0.85rem' }}>{gift?.name}</div>
                                  {contrib.message && (
                                    <div style={{ fontStyle: 'italic', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                                      "{contrib.message}"
                                    </div>
                                  )}
                                </td>
                                <td style={{ padding: '14px 16px', fontWeight: 600, color: contrib.paymentStatus === 'APPROVED' ? 'var(--success)' : 'var(--text-secondary)' }}>
                                  {contrib.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </td>
                                <td style={{ padding: '14px 16px' }}>
                                  {contrib.paymentStatus === 'APPROVED' ? (
                                    <span className="badge badge-success">Aprovado</span>
                                  ) : contrib.paymentStatus === 'PENDING' ? (
                                    <span className="badge badge-warning">Pendente</span>
                                  ) : (
                                    <span className="badge badge-danger">Recusado</span>
                                  )}
                                </td>
                                <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                                  {contrib.paymentStatus === 'PENDING' && (
                                    <button 
                                      onClick={() => onApproveContribution(contrib.id)}
                                      className="btn btn-secondary animate-pulse-glow"
                                      style={{ padding: '4px 10px', fontSize: '0.7rem', color: 'var(--success)', borderColor: 'rgba(16, 185, 129, 0.3)', background: 'rgba(16, 185, 129, 0.05)' }}
                                    >
                                      Simular Webhook Pix
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: CONTENT MODERATION (MURAL & GALLERY) */}
        {activeTab === 'content' && (
          <div className="animate-fade-in-up">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
              
              {/* Column 1: Messages Mural */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem' }}><MessageSquare size={18} /> Moderação de Mensagens (Mural)</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: 2 }}>
                    Aprove mensagens dos convidados para que apareçam no mural público.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {activeEventMessages.length === 0 ? (
                    <div className="glass-panel" style={{ padding: 24, textAlign: 'center', color: 'var(--text-secondary)' }}>
                      Nenhuma mensagem enviada para este evento.
                    </div>
                  ) : (
                    activeEventMessages.map(msg => (
                      <div key={msg.id} className="glass-panel" style={{ padding: 20, borderLeft: msg.approved ? '4px solid var(--success)' : '4px solid var(--warning)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{msg.guestName || 'Anônimo'}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            {new Date(msg.createdAt).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.9rem', fontStyle: 'italic', color: 'var(--text-secondary)', marginBottom: 12 }}>
                          "{msg.message}"
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                          {!msg.approved && (
                            <button 
                              onClick={() => onApproveMessage(msg.id)} 
                              className="btn btn-secondary" 
                              style={{ padding: '6px 12px', fontSize: '0.75rem', color: 'var(--success)', borderColor: 'rgba(16, 185, 129, 0.2)' }}
                            >
                              <Check size={12} /> Aprovar
                            </button>
                          )}
                          <button 
                            onClick={() => onDeleteMessage(msg.id)} 
                            className="btn btn-secondary" 
                            style={{ padding: '6px 12px', fontSize: '0.75rem', color: 'var(--error)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                          >
                            <X size={12} /> Excluir
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Column 2: Photos Gallery */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem' }}><Plus size={18} /> Moderação de Fotos (Galeria)</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: 2 }}>
                    Aprove fotos enviadas pelos convidados para que apareçam na galeria.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {activeEventPhotos.length === 0 ? (
                    <div className="glass-panel" style={{ padding: 24, textAlign: 'center', color: 'var(--text-secondary)' }}>
                      Nenhuma foto enviada para este evento.
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
                      {activeEventPhotos.map(photo => (
                        <div key={photo.id} className="glass-panel" style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                          <div style={{ position: 'relative', width: '100%', height: '110px', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                            <img 
                              src={photo.url} 
                              alt="Upload Convidado" 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                            {!photo.approved && (
                              <span style={{ position: 'absolute', top: 6, right: 6, background: 'var(--warning)', color: '#000', fontSize: '0.65rem', fontWeight: 700, padding: '2px 6px', borderRadius: 4 }}>
                                Pendente
                              </span>
                            )}
                          </div>
                          
                          <div style={{ fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            Por: <strong>{photo.guestName || 'Anônimo'}</strong>
                          </div>

                          <div style={{ display: 'flex', gap: 4, marginTop: 'auto' }}>
                            {!photo.approved ? (
                              <button 
                                onClick={() => onApprovePhoto(photo.id)} 
                                className="btn btn-secondary" 
                                style={{ flex: 1, padding: '4px', fontSize: '0.7rem', color: 'var(--success)' }}
                              >
                                <Check size={12} style={{ display: 'block', margin: 'auto' }} />
                              </button>
                            ) : null}
                            <button 
                              onClick={() => onDeletePhoto(photo.id)} 
                              className="btn btn-secondary" 
                              style={{ flex: 1, padding: '4px', fontSize: '0.7rem', color: 'var(--error)' }}
                            >
                              <X size={12} style={{ display: 'block', margin: 'auto' }} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 5: SITE CUSTOMIZER */}
        {activeTab === 'customize' && activeEvent && (
          <div className="animate-fade-in-up">
            {customizeSuccessMessage && (
              <div className="glass-panel" style={{
                background: 'var(--success-glow)',
                borderColor: 'rgba(16, 185, 129, 0.2)',
                color: 'var(--success)',
                padding: 16,
                borderRadius: 'var(--radius-md)',
                marginBottom: 24,
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}>
                <CheckCircle2 size={18} /> {customizeSuccessMessage}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 32 }}>
              
              {/* Form Configurator Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                
                {/* 1. Cores e Paletas */}
                <div className="glass-panel" style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Palette size={20} color="var(--primary)" /> Cores & Paletas Suaves
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    Escolha uma de nossas paletas suaves criadas por designers ou configure suas próprias cores personalizadas.
                  </p>

                  {/* Soft Palettes Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 10 }}>
                    {[
                      { name: 'Lavender Mist 🪻', primary: '#7C3AED', secondary: '#A78BFA', bg: '#F5F3FF', desc: 'Suave & Romântico' },
                      { name: 'Sage Garden 🌿', primary: '#059669', secondary: '#6EE7B7', bg: '#F0FDF4', desc: 'Natural & Orgânico' },
                      { name: 'Rose Quartz 🌸', primary: '#DB2777', secondary: '#F472B6', bg: '#FFF5F7', desc: 'Clássico Delicado' },
                      { name: 'Ocean Breeze 🌊', primary: '#0284C7', secondary: '#7DD3FC', bg: '#F0F9FF', desc: 'Fresco & Calmo' },
                      { name: 'Champagne Luxe 🥂', primary: '#854D0E', secondary: '#FDE047', bg: '#FAF9F0', desc: 'Elegante & Nobre' },
                      { name: 'Sand Dunes 🏜️', primary: '#B45309', secondary: '#FCD34D', bg: '#FFFDF5', desc: 'Quente & Rústico' },
                      { name: 'Midnight Neon 🌌', primary: '#10B981', secondary: '#3B82F6', bg: '#090A0F', desc: 'Moderno Escuro' }
                    ].map((pal, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setThemePrimary(pal.primary);
                          setThemeSecondary(pal.secondary);
                          setThemeBg(pal.bg);
                        }}
                        className="btn btn-secondary animate-fade-in"
                        style={{ 
                          padding: 12, 
                          textAlign: 'left', 
                          display: 'flex', 
                          flexDirection: 'column', 
                          gap: 6,
                          background: 'rgba(255,255,255,0.02)',
                          borderColor: themeBg === pal.bg ? 'var(--primary)' : 'var(--border-color)'
                        }}
                      >
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{pal.name}</span>
                        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                          <span style={{ width: 14, height: 14, borderRadius: '50%', background: pal.primary }} title="Primária" />
                          <span style={{ width: 14, height: 14, borderRadius: '50%', background: pal.secondary }} title="Secundária" />
                          <span style={{ width: 14, height: 14, borderRadius: '50%', background: pal.bg, border: '1px solid rgba(255,255,255,0.2)' }} title="Fundo" />
                        </div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{pal.desc}</span>
                      </button>
                    ))}
                  </div>

                  {/* Manual Color Pickers */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, borderTop: '1px solid var(--border-color)', paddingTop: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Cor Primária</label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input type="color" value={themePrimary} onChange={(e) => setThemePrimary(e.target.value)} style={{ width: 40, height: 40, border: 'none', background: 'none', cursor: 'pointer', borderRadius: 4 }} />
                        <input type="text" value={themePrimary} onChange={(e) => setThemePrimary(e.target.value)} className="glass-input" style={{ padding: 6, fontSize: '0.8rem' }} />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Cor Secundária</label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input type="color" value={themeSecondary} onChange={(e) => setThemeSecondary(e.target.value)} style={{ width: 40, height: 40, border: 'none', background: 'none', cursor: 'pointer', borderRadius: 4 }} />
                        <input type="text" value={themeSecondary} onChange={(e) => setThemeSecondary(e.target.value)} className="glass-input" style={{ padding: 6, fontSize: '0.8rem' }} />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Cor de Fundo</label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input type="color" value={themeBg} onChange={(e) => setThemeBg(e.target.value)} style={{ width: 40, height: 40, border: 'none', background: 'none', cursor: 'pointer', borderRadius: 4 }} />
                        <input type="text" value={themeBg} onChange={(e) => setThemeBg(e.target.value)} className="glass-input" style={{ padding: 6, fontSize: '0.8rem' }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Layout & Estrutura Visual */}
                <div className="glass-panel" style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Settings size={20} color="var(--primary)" /> Layout & Estilo Visual
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Estilo do Cabeçalho</label>
                      <select value={themeHeaderStyle} onChange={(e) => setThemeHeaderStyle(e.target.value as any)} className="glass-input">
                        <option value="classic_hero" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>Capa Cheia (Centralizado)</option>
                        <option value="split_hero" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>Split Banner (Imagem + Texto Lado a Lado)</option>
                        <option value="minimalist" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>Minimalista (Tipografia Focada)</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Estilo dos Cartões</label>
                      <select value={themeCardStyle} onChange={(e) => setThemeCardStyle(e.target.value as any)} className="glass-input">
                        <option value="frosted" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>Frosted Glass (Branco Translúcido)</option>
                        <option value="glass" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>Dark Glass (Vidro Escuro)</option>
                        <option value="solid" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>Sólido (Cor Opaca)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Formato dos Elementos (Borda)</label>
                      <select value={themeBorderStyle} onChange={(e) => setThemeBorderStyle(e.target.value as any)} className="glass-input">
                        <option value="rounded" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>Arredondado Padrão</option>
                        <option value="sharp" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>Reto / Moderno Retrô</option>
                        <option value="pill" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>Super Curvado (Pill)</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Textura de Fundo</label>
                      <select value={themeBgPattern} onChange={(e) => setThemeBgPattern(e.target.value as any)} className="glass-input">
                        <option value="none" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>Sem Textura (Fundo Liso)</option>
                        <option value="dots" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>Pontilhados Sutis</option>
                        <option value="leaves" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>Folhagens Botânicas (Delicado)</option>
                        <option value="swirls" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>Swirls Elegantes</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Estilo da Fonte (Títulos)</label>
                      <select value={themeFontTitle} onChange={(e) => setThemeFontTitle(e.target.value)} className="glass-input">
                        <option value="Playfair Display" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>Playfair Display (Serifada Elegante)</option>
                        <option value="Outfit" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>Outfit (Moderna Geométrica)</option>
                        <option value="Inter" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>Inter (Clean Minimalista)</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Estilo da Fonte (Corpo)</label>
                      <select value={themeFontBody} onChange={(e) => setThemeFontBody(e.target.value)} className="glass-input">
                        <option value="Outfit" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>Outfit (Arredondada/Acolhedora)</option>
                        <option value="Inter" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>Inter (Focada em Leitura)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Imagem de Capa (URL)</label>
                    <input type="text" placeholder="URL da imagem da capa" value={themeBannerUrl} onChange={(e) => setThemeBannerUrl(e.target.value)} className="glass-input" />
                    <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                      {[
                        { label: 'Casamento 🌹', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600' },
                        { label: 'Aniversário 🎉', url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=600' },
                        { label: 'Chá Pastel 🍼', url: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=600' }
                      ].map((preset, idx) => (
                        <button key={idx} type="button" onClick={() => setThemeBannerUrl(preset.url)} className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: 4 }}>
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. Editor de Conteúdo de Seções */}
                <div className="glass-panel" style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Plus size={20} color="var(--primary)" /> Editor de Conteúdo do Site
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    Personalize os títulos e os parágrafos de introdução de cada seção da página inicial.
                  </p>

                  {/* Welcome Section Editor */}
                  <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: 20 }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>Seção de Boas-vindas (Capa)</h4>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 6 }}>Mensagem Receptiva</label>
                    <textarea value={themeWelcome} onChange={(e) => setThemeWelcome(e.target.value)} className="glass-input" rows={3} style={{ resize: 'none' }} placeholder="Texto de boas-vindas..." />
                  </div>

                  {/* Story Section Editor */}
                  <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>Seção "Nossa História" / "Sobre Mim"</h4>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', cursor: 'pointer' }}>
                        <input type="checkbox" checked={themeShowStory} onChange={(e) => setThemeShowStory(e.target.checked)} style={{ accentColor: 'var(--primary)' }} />
                        Exibir Seção
                      </label>
                    </div>
                    {themeShowStory && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} className="animate-fade-in">
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 6 }}>Título da Seção</label>
                          <input type="text" value={themeStoryTitle} onChange={(e) => setThemeStoryTitle(e.target.value)} className="glass-input" placeholder="Ex: Nossa História" />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 6 }}>Texto da História</label>
                          <textarea value={themeStoryText} onChange={(e) => setThemeStoryText(e.target.value)} className="glass-input" rows={4} style={{ resize: 'none' }} placeholder="Conte sua história para seus convidados..." />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* RSVP Section Editor */}
                  <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: 20 }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>Seção RSVP</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 6 }}>Título do RSVP</label>
                        <input type="text" value={themeRsvpHeading} onChange={(e) => setThemeRsvpHeading(e.target.value)} className="glass-input" />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 6 }}>Texto de Introdução</label>
                        <input type="text" value={themeRsvpIntro} onChange={(e) => setThemeRsvpIntro(e.target.value)} className="glass-input" placeholder="Parágrafo de ajuda ou instruções para o convidado..." />
                      </div>
                    </div>
                  </div>

                  {/* Gifts Section Editor */}
                  <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: 20 }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>Seção Lista de Presentes</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 6 }}>Título da Seção de Presentes</label>
                        <input type="text" value={themeGiftsHeading} onChange={(e) => setThemeGiftsHeading(e.target.value)} className="glass-input" />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 6 }}>Texto de Introdução</label>
                        <textarea value={themeGiftsIntro} onChange={(e) => setThemeGiftsIntro(e.target.value)} className="glass-input" rows={2} style={{ resize: 'none' }} placeholder="Explique aos convidados sobre a conversão de presentes em dinheiro via Pix..." />
                      </div>
                    </div>
                  </div>

                  {/* Mural & Gallery Toggles */}
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>Interatividade dos Módulos</h4>
                    <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', cursor: 'pointer' }}>
                        <input type="checkbox" checked={themeShowCountdown} onChange={(e) => setThemeShowCountdown(e.target.checked)} style={{ accentColor: 'var(--primary)' }} />
                        Contagem Regressiva
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', cursor: 'pointer' }}>
                        <input type="checkbox" checked={themeShowMural} onChange={(e) => setThemeShowMural(e.target.checked)} style={{ accentColor: 'var(--primary)' }} />
                        Mural Ativo
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', cursor: 'pointer' }}>
                        <input type="checkbox" checked={themeShowGallery} onChange={(e) => setThemeShowGallery(e.target.checked)} style={{ accentColor: 'var(--primary)' }} />
                        Galeria Ativa
                      </label>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      {themeShowMural && (
                        <div className="animate-fade-in">
                          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 6 }}>Título do Mural</label>
                          <input type="text" value={themeMuralHeading} onChange={(e) => setThemeMuralHeading(e.target.value)} className="glass-input" />
                        </div>
                      )}
                      {themeShowGallery && (
                        <div className="animate-fade-in">
                          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 6 }}>Título da Galeria</label>
                          <input type="text" value={themeGalleryHeading} onChange={(e) => setThemeGalleryHeading(e.target.value)} className="glass-input" />
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                <button 
                  onClick={() => {
                    onUpdateEventTheme(activeEvent.id, {
                      primaryColor: themePrimary,
                      secondaryColor: themeSecondary,
                      backgroundColor: themeBg,
                      layoutTheme: themeLayout,
                      fontTitle: themeFontTitle,
                      fontBody: themeFontBody,
                      welcomeText: themeWelcome,
                      backgroundImageUrl: themeBannerUrl,
                      showCountdown: themeShowCountdown,
                      showMural: themeShowMural,
                      showGallery: themeShowGallery,
                      schedule: themeSchedule,
                      
                      // Builder additions
                      headerStyle: themeHeaderStyle,
                      cardStyle: themeCardStyle,
                      borderStyle: themeBorderStyle,
                      bgPattern: themeBgPattern,
                      showStory: themeShowStory,
                      storyTitle: themeStoryTitle,
                      storyText: themeStoryText,
                      storyTimeline: themeStoryTimeline,
                      rsvpHeading: themeRsvpHeading,
                      rsvpIntro: themeRsvpIntro,
                      giftsHeading: themeGiftsHeading,
                      giftsIntro: themeGiftsIntro,
                      muralHeading: themeMuralHeading,
                      muralIntro: themeMuralIntro,
                      galleryHeading: themeGalleryHeading,
                      galleryIntro: themeGalleryIntro
                    });
                    setCustomizeSuccessMessage('Configurações visuais salvas com sucesso! As alterações já estão disponíveis no site público.');
                    setTimeout(() => setCustomizeSuccessMessage(''), 4000);
                  }}
                  className="btn btn-primary animate-pulse-glow"
                  style={{ width: '100%', padding: 16, fontSize: '1rem' }}
                >
                  Salvar Personalização Completa do Site
                </button>
              </div>

              {/* Timelines and Live Preview Column (Right Side) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
                
                {/* 1. Previa da Capa */}
                <div className="glass-panel" style={{ padding: 24, borderStyle: 'dashed' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Eye size={16} /> Prévia Visual da Capa
                  </h3>
                  
                  <div style={{
                    width: '100%',
                    height: 180,
                    borderRadius: themeBorderStyle === 'rounded' ? '12px' : themeBorderStyle === 'pill' ? '24px' : '0px',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.7)), url(${themeBannerUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=400'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    textAlign: 'center',
                    padding: 16
                  }}>
                    <div>
                      <h4 style={{ 
                        fontFamily: themeFontTitle === 'Playfair Display' ? 'Playfair Display, serif' : 'Outfit, sans-serif',
                        fontSize: '1.5rem',
                        color: 'var(--text-primary)',
                        marginBottom: 4
                      }}>
                        {activeEvent.title}
                      </h4>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: 600, 
                        color: themeSecondary, 
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em'
                      }}>
                        {new Date(activeEvent.eventDate).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Cronograma Editor */}
                <div className="glass-panel" style={{ padding: 24 }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Calendar size={16} /> Cronograma do Evento
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: 16 }}>
                    Crie um itinerário com horário para os convidados saberem a programação.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                    {themeSchedule.length === 0 ? (
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '12px 0' }}>
                        Nenhuma atividade cadastrada.
                      </div>
                    ) : (
                      themeSchedule
                        .sort((a, b) => a.time.localeCompare(b.time))
                        .map(item => (
                          <div 
                            key={item.id} 
                            style={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center', 
                              background: 'rgba(255,255,255,0.02)', 
                              border: '1px solid var(--border-color)',
                              padding: '8px 12px',
                              borderRadius: 8
                            }}
                          >
                            <div>
                              <strong style={{ color: themePrimary, fontSize: '0.9rem' }}>{item.time}</strong> -{' '}
                              <span style={{ fontSize: '0.85rem' }}>{item.activity}</span>
                            </div>
                            <button 
                              type="button"
                              onClick={() => {
                                setThemeSchedule(prev => prev.filter(p => p.id !== item.id));
                              }}
                              style={{ color: 'var(--error)', padding: 4 }}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))
                    )}
                  </div>

                  {/* Add Activity Form */}
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 16 }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input 
                        type="text" 
                        placeholder="Ex: 19:30" 
                        value={newActivityTime}
                        onChange={(e) => setNewActivityTime(e.target.value)}
                        className="glass-input"
                        style={{ flex: 1, padding: 8, fontSize: '0.8rem' }}
                      />
                      <input 
                        type="text" 
                        placeholder="Atividade" 
                        value={newActivityDesc}
                        onChange={(e) => setNewActivityDesc(e.target.value)}
                        className="glass-input"
                        style={{ flex: 2, padding: 8, fontSize: '0.8rem' }}
                      />
                      <button 
                        type="button"
                        onClick={() => {
                          if (!newActivityTime || !newActivityDesc) return;
                          const newActivity = {
                            id: `sch-${Math.floor(Math.random() * 10000)}`,
                            time: newActivityTime,
                            activity: newActivityDesc
                          };
                          setThemeSchedule(prev => [...prev, newActivity]);
                          setNewActivityTime('');
                          setNewActivityDesc('');
                        }}
                        className="btn btn-primary" 
                        style={{ padding: '0 12px' }}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. Story Milestones Editor */}
                {themeShowStory && (
                  <div className="glass-panel animate-fade-in" style={{ padding: 24 }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Heart size={16} /> Marcos da Nossa História
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: 16 }}>
                      Adicione uma linha do tempo com momentos especiais do casal.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                      {themeStoryTimeline.length === 0 ? (
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '12px 0' }}>
                          Nenhum marco adicionado.
                        </div>
                      ) : (
                        themeStoryTimeline
                          .sort((a, b) => a.year.localeCompare(b.year))
                          .map(milestone => (
                            <div 
                              key={milestone.id} 
                              style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'flex-start', 
                                background: 'rgba(255,255,255,0.02)', 
                                border: '1px solid var(--border-color)',
                                padding: '10px 14px',
                                borderRadius: 8
                              }}
                            >
                              <div style={{ flex: 1, paddingRight: 10 }}>
                                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                                  <span style={{ color: themePrimary }}>{milestone.year}</span> - {milestone.title}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>{milestone.desc}</div>
                              </div>
                              <button 
                                type="button"
                                onClick={() => {
                                  setThemeStoryTimeline(prev => prev.filter(p => p.id !== milestone.id));
                                }}
                                style={{ color: 'var(--error)', padding: 2 }}
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))
                      )}
                    </div>

                    {/* Add Milestone Form */}
                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 8 }}>
                        <input 
                          type="text" 
                          placeholder="Ano (Ex: 2018)" 
                          value={newMilestoneYear}
                          onChange={(e) => setNewMilestoneYear(e.target.value)}
                          className="glass-input"
                          style={{ padding: 8, fontSize: '0.8rem' }}
                        />
                        <input 
                          type="text" 
                          placeholder="Título do Marco" 
                          value={newMilestoneTitle}
                          onChange={(e) => setNewMilestoneTitle(e.target.value)}
                          className="glass-input"
                          style={{ padding: 8, fontSize: '0.8rem' }}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input 
                          type="text" 
                          placeholder="Breve descrição do marco..." 
                          value={newMilestoneDesc}
                          onChange={(e) => setNewMilestoneDesc(e.target.value)}
                          className="glass-input"
                          style={{ flex: 1, padding: 8, fontSize: '0.8rem' }}
                        />
                        <button 
                          type="button"
                          onClick={() => {
                            if (!newMilestoneYear || !newMilestoneTitle) return;
                            const newM = {
                              id: `st-${Math.floor(Math.random() * 10000)}`,
                              year: newMilestoneYear,
                              title: newMilestoneTitle,
                              desc: newMilestoneDesc
                            };
                            setThemeStoryTimeline(prev => [...prev, newM]);
                            setNewMilestoneYear('');
                            setNewMilestoneTitle('');
                            setNewMilestoneDesc('');
                          }}
                          className="btn btn-primary" 
                          style={{ padding: '0 12px' }}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>

            </div>
          </div>
        )}

      </main>

      {/* MODAL: ADD EVENT */}
      {showAddEventModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }} className="animate-fade-in">
          <div className="glass-panel" style={{ 
            width: '100%', 
            maxWidth: eventCreationStep === 1 ? '780px' : '580px', 
            padding: 32, 
            maxHeight: '90vh', 
            overflowY: 'auto',
            transition: 'max-width var(--transition-normal)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                {eventCreationStep === 1 ? 'Qual é o tipo de evento?' : `Criar Novo Evento: ${
                  newEventType === 'WEDDING' ? 'Casamento' : 
                  newEventType === 'BIRTHDAY' ? 'Aniversário' : 
                  newEventType === 'BABY_SHOWER' ? 'Chá de Bebê' : 
                  newEventType === 'CORPORATE' ? 'Corporativo' : 'Outros'
                }`}
              </h2>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                {eventCreationStep === 2 && (
                  <button 
                    type="button"
                    onClick={() => setEventCreationStep(1)} 
                    style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Voltar
                  </button>
                )}
                <button onClick={() => setShowAddEventModal(false)} style={{ color: 'var(--text-secondary)' }}><X size={20} /></button>
              </div>
            </div>

            {eventFormError && (
              <div style={{ background: 'var(--error-glow)', color: 'var(--error)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: 12, borderRadius: 8, fontSize: '0.85rem', marginBottom: 16 }}>
                {eventFormError}
              </div>
            )}

            {eventCreationStep === 1 ? (
              <div className="animate-fade-in">
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 28, textAlign: 'center' }}>
                  Selecione o tipo de celebração abaixo para começar. Cada tipo ativa temas e opções recomendadas para o seu site.
                </p>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: 16,
                  marginBottom: 8
                }}>
                  {/* Wedding Card */}
                  <div 
                    onClick={() => {
                      setNewEventType('WEDDING');
                      setNewEventWelcomeText('Sejam bem-vindos ao site do nosso casamento! Estamos muito felizes em celebrar esse momento com vocês.');
                      setEventCreationStep(2);
                    }}
                    className="glass-panel"
                    style={{
                      padding: '32px 20px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 16,
                      transition: 'all var(--transition-normal)'
                    }}
                  >
                    <div style={{ background: 'rgba(236, 72, 153, 0.1)', padding: 16, borderRadius: '50%' }}>
                      <Heart size={32} style={{ color: '#ec4899' }} />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>Casamento</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lista de presentes, RSVP sofisticado e cronograma.</span>
                  </div>

                  {/* Birthday Card */}
                  <div 
                    onClick={() => {
                      setNewEventType('BIRTHDAY');
                      setNewEventWelcomeText('Sejam bem-vindos ao meu site de aniversário! Venha celebrar comigo mais um ano de vida.');
                      setEventCreationStep(2);
                    }}
                    className="glass-panel"
                    style={{
                      padding: '32px 20px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 16,
                      transition: 'all var(--transition-normal)'
                    }}
                  >
                    <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: 16, borderRadius: '50%' }}>
                      <Sparkles size={32} style={{ color: '#fbbf24' }} />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>Aniversário</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mural de recados animado, RSVP prático e fotos.</span>
                  </div>

                  {/* Baby Shower Card */}
                  <div 
                    onClick={() => {
                      setNewEventType('BABY_SHOWER');
                      setNewEventWelcomeText('Sejam bem-vindos ao chá de bebê! A nossa família está crescendo e queremos compartilhar essa alegria.');
                      setEventCreationStep(2);
                    }}
                    className="glass-panel"
                    style={{
                      padding: '32px 20px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 16,
                      transition: 'all var(--transition-normal)'
                    }}
                  >
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: 16, borderRadius: '50%' }}>
                      <Gift size={32} style={{ color: '#10b981' }} />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>Chá de Bebê</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sugestão de mimos/fraldas e mural para recadinhos.</span>
                  </div>

                  {/* Corporate Card */}
                  <div 
                    onClick={() => {
                      setNewEventType('CORPORATE');
                      setNewEventWelcomeText('Sejam bem-vindos ao site do nosso evento corporativo. Fique por dentro de toda a programação.');
                      setEventCreationStep(2);
                    }}
                    className="glass-panel"
                    style={{
                      padding: '32px 20px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 16,
                      transition: 'all var(--transition-normal)'
                    }}
                  >
                    <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: 16, borderRadius: '50%' }}>
                      <Users size={32} style={{ color: '#6366f1' }} />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>Corporativo</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cronograma estruturado, mapa e confirmação.</span>
                  </div>

                  {/* Other Card */}
                  <div 
                    onClick={() => {
                      setNewEventType('OTHER');
                      setNewEventWelcomeText('Sejam bem-vindos ao site do nosso evento! Confirme sua presença e confira os detalhes abaixo.');
                      setEventCreationStep(2);
                    }}
                    className="glass-panel"
                    style={{
                      padding: '32px 20px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 16,
                      transition: 'all var(--transition-normal)'
                    }}
                  >
                    <div style={{ background: 'rgba(107, 114, 128, 0.1)', padding: 16, borderRadius: '50%' }}>
                      <Plus size={32} style={{ color: 'var(--text-secondary)' }} />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>Outros</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Qualquer outra celebração com página completa.</span>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateEvent} style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="animate-fade-in">
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Nome do Evento *</label>
                  <input 
                    type="text" 
                    placeholder={
                      newEventType === 'WEDDING' ? 'Ex: Casamento de Mariana & Gustavo' :
                      newEventType === 'BIRTHDAY' ? 'Ex: Aniversário de 30 anos do Felipe' :
                      newEventType === 'BABY_SHOWER' ? 'Ex: Chá de Fraldas do Léo' :
                      newEventType === 'CORPORATE' ? 'Ex: Convenção Anual Tech 2026' :
                      'Ex: Minha Celebração Especial'
                    } 
                    value={newEventTitle} 
                    onChange={(e) => {
                      setNewEventTitle(e.target.value);
                      // Autofill slug
                      setNewEventSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                    }}
                    className="glass-input" 
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Link do Site (Slug) *</label>
                    <input 
                      type="text" 
                      placeholder="Ex: mariana-gustavo-2026" 
                      value={newEventSlug} 
                      onChange={(e) => setNewEventSlug(e.target.value)}
                      className="glass-input" 
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Tipo de Evento</label>
                    <select 
                      value={newEventType} 
                      onChange={(e) => setNewEventType(e.target.value as EventType)}
                      className="glass-input"
                    >
                      <option value="WEDDING" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>Casamento</option>
                      <option value="BIRTHDAY" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>Aniversário</option>
                      <option value="BABY_SHOWER" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>Chá de Bebê</option>
                      <option value="CORPORATE" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>Corporativo</option>
                      <option value="OTHER" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>Outros</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Data e Horário *</label>
                    <input 
                      type="datetime-local" 
                      value={newEventDate} 
                      onChange={(e) => setNewEventDate(e.target.value)}
                      className="glass-input" 
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Nome do Local *</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Espaço das Flores ou Salão de Festas" 
                    value={newEventVenueName} 
                    onChange={(e) => setNewEventVenueName(e.target.value)}
                    className="glass-input" 
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Endereço Completo</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Av. Principal, 123 - Centro" 
                    value={newEventVenueAddress} 
                    onChange={(e) => setNewEventVenueAddress(e.target.value)}
                    className="glass-input" 
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Texto de Boas-vindas</label>
                  <textarea 
                    placeholder="Mensagem receptiva que os convidados lerão ao entrar no site." 
                    value={newEventWelcomeText} 
                    onChange={(e) => setNewEventWelcomeText(e.target.value)}
                    className="glass-input" 
                    rows={3}
                    style={{ resize: 'none' }}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: 8 }}>
                  Criar Evento como Rascunho
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL: ADD GUEST */}
      {showAddGuestModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }} className="animate-fade-in">
          <div className="glass-panel" style={{ width: '100%', maxWidth: '460px', padding: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>Cadastrar Convidado</h2>
              <button onClick={() => setShowAddGuestModal(false)} style={{ color: 'var(--text-secondary)' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleCreateGuest} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Nome do Convidado *</label>
                <input 
                  type="text" 
                  placeholder="Nome completo" 
                  value={newGuestName} 
                  onChange={(e) => setNewGuestName(e.target.value)}
                  className="glass-input" 
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>E-mail *</label>
                <input 
                  type="email" 
                  placeholder="Ex: convidado@email.com" 
                  value={newGuestEmail} 
                  onChange={(e) => setNewGuestEmail(e.target.value)}
                  className="glass-input" 
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Celular / Whatsapp</label>
                <input 
                  type="text" 
                  placeholder="Ex: (11) 99999-9999" 
                  value={newGuestPhone} 
                  onChange={(e) => setNewGuestPhone(e.target.value)}
                  className="glass-input" 
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Grupo de Convidados</label>
                <input 
                  type="text" 
                  placeholder="Ex: Padrinhos, Família da Noiva, Trabalho" 
                  value={newGuestGroup} 
                  onChange={(e) => setNewGuestGroup(e.target.value)}
                  className="glass-input" 
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: 8 }}>
                Confirmar Cadastro
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD GIFT */}
      {showAddGiftModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }} className="animate-fade-in">
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>Adicionar Novo Presente</h2>
              <button onClick={() => setShowAddGiftModal(false)} style={{ color: 'var(--text-secondary)' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleCreateGift} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Nome do Presente *</label>
                <input 
                  type="text" 
                  placeholder="Ex: Microondas Espelhado 30L" 
                  value={newGiftName} 
                  onChange={(e) => setNewGiftName(e.target.value)}
                  className="glass-input" 
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Descrição / Mensagem curta</label>
                <input 
                  type="text" 
                  placeholder="Ex: Ideal para esquentar nossas refeições rápidas." 
                  value={newGiftDesc} 
                  onChange={(e) => setNewGiftDesc(e.target.value)}
                  className="glass-input" 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Tipo de Presente</label>
                  <select 
                    value={newGiftType} 
                    onChange={(e) => setNewGiftType(e.target.value as GiftType)}
                    className="glass-input"
                  >
                    <option value="PHYSICAL_ITEM" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>Item Físico (simulado)</option>
                    <option value="CASH_CONTRIBUTION" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>Cota Lua de Mel / Dinheiro</option>
                    <option value="FREE_PIX" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>Pix Livre</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Valor Sugerido (R$)</label>
                  <input 
                    type="number" 
                    placeholder="Ex: 250" 
                    value={newGiftAmount} 
                    onChange={(e) => setNewGiftAmount(e.target.value)}
                    className="glass-input"
                    disabled={newGiftType === 'FREE_PIX'}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Link de Foto (URL)</label>
                <input 
                  type="text" 
                  placeholder="Ex: https://unsplash.com/... (ou em branco para padrão)" 
                  value={newGiftPhotoUrl} 
                  onChange={(e) => setNewGiftPhotoUrl(e.target.value)}
                  className="glass-input" 
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: 8 }}>
                Cadastrar Presente
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

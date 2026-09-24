import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import './LandingPage.css';

import logoC from '../assets/landing/logo-c.svg';
import logoElebrare from '../assets/landing/logo-elebrare.svg';
import iconUser from '../assets/landing/icon-user.svg';
import sparkle1 from '../assets/landing/sparkle-1.svg';
import sparkle2 from '../assets/landing/sparkle-2.svg';
import sparkle3 from '../assets/landing/sparkle-3.svg';
import underlineOrganiza from '../assets/landing/underline-organiza.svg';
import underlineUnico from '../assets/landing/underline-unico.svg';
import deviceShadow from '../assets/landing/device-shadow.png';
import monitor from '../assets/landing/monitor.png';
import phone from '../assets/landing/phone.png';
import confettiLeft from '../assets/landing/confetti-left.svg';
import confettiRight from '../assets/landing/confetti-right.svg';

interface LandingPageProps {
  onNavigateToDashboard: () => void;
}

const NAV_LINKS = ['Casamento', '15 Anos', 'Aniversário', 'Chá de Bebê', 'Coorporativo'];

const FEATURES = [
  'Controle de Orçamento',
  'Lista de presentes em PIX',
  'Confirmação de presença personalizada',
  'Site para os convidados'
];

// Largura máxima de cada texto, igual ao frame 20:190 do Figma (controla a quebra de linha)
const STEPS = [
  { width: 232, text: 'Escolha seu evento e crie seu site' },
  { width: 195, text: 'Gerencie fornecedores, orçamento, convidados, etc' },
  { width: 211, text: 'Envie convites automáticos para confirmação de presença' },
  { width: 211, text: 'Receba seus presentes em PIX' }
];

interface OrganizerButtonProps {
  className: string;
  onClick: () => void;
}

const OrganizerButton: React.FC<OrganizerButtonProps> = ({ className, onClick }) => (
  <button className={`lp-organizer ${className}`} onClick={onClick}>
    <span>
      <img src={iconUser} alt="" />
      Área do Organizador
    </span>
  </button>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToDashboard }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="lp">

      {/* Header */}
      <header className="lp-header lp-container">
        <button className="lp-logo" onClick={onNavigateToDashboard} aria-label="Celebrare">
          <img className="lp-logo__c" src={logoC} alt="" />
          <img className="lp-logo__text" src={logoElebrare} alt="" />
        </button>

        <nav className={menuOpen ? 'lp-nav lp-nav--open' : 'lp-nav'}>
          {NAV_LINKS.map((link) => (
            <a key={link} href={`#${link.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{link}</a>
          ))}
          <OrganizerButton className="lp-organizer--menu" onClick={onNavigateToDashboard} />
        </nav>

        <OrganizerButton className="lp-organizer--header" onClick={onNavigateToDashboard} />

        <button
          className="lp-menu-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </header>

      {/* Hero — frame 1:2 */}
      <section className="lp-hero lp-container">
        <div className="lp-hero__col">
          <div className="lp-heading">
            <h1 className="lp-heading__lg">
              Você celebra,
              <img className="lp-deco lp-deco--sparkle1" src={sparkle1} alt="" />
              <img className="lp-deco lp-deco--sparkle2" src={sparkle2} alt="" />
              <img className="lp-deco lp-deco--sparkle3" src={sparkle3} alt="" />
            </h1>
            <p className="lp-heading__md">
              a gente organiza.
              <img className="lp-deco lp-deco--organiza" src={underlineOrganiza} alt="" />
            </p>
          </div>

          <ul className="lp-pills">
            {FEATURES.map((feature, idx) => (
              <li key={feature} className={idx === 2 ? 'lp-pill lp-pill--tall' : 'lp-pill'}>{feature}</li>
            ))}
          </ul>
          <p className="lp-more">e muito mais!</p>

          <button className="lp-cta" onClick={onNavigateToDashboard}>QUERO COMEÇAR MEU SITE</button>
        </div>

        <div className="lp-hero__col lp-hero__col--right">
          <div className="lp-heading">
            <h2 className="lp-heading__lg">Todo seu evento</h2>
            <p className="lp-heading__md">
              em um único site.
              <img className="lp-deco lp-deco--unico" src={underlineUnico} alt="" />
            </p>
          </div>

          <div className="lp-devices">
            <img className="lp-devices__shadow" src={deviceShadow} alt="" />
            <img className="lp-devices__monitor" src={monitor} alt="" />
            <img className="lp-devices__phone" src={phone} alt="" />
          </div>
        </div>
      </section>

      {/* Como funciona + galeria — frame 20:190 */}
      <section className="lp-how">
        <div className="lp-how__steps lp-container">
          <div className="lp-confetti lp-confetti--left">
            <img src={confettiLeft} alt="" />
          </div>
          <div className="lp-confetti lp-confetti--right">
            <img src={confettiRight} alt="" />
          </div>

          <ol className="lp-steps">
            {STEPS.map((step, idx) => (
              <li key={step.text} className="lp-step">
                <span className="lp-step__num">{idx + 1}</span>
                <p className="lp-step__text" style={{ maxWidth: step.width }}>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="lp-gallery">Galeria de Sites aqui</div>
      </section>

    </div>
  );
};

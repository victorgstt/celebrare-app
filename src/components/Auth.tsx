import React, { useState } from 'react';
import { Sparkles, Lock, Mail, User, Eye, EyeOff, ArrowLeft, Sun, Moon } from 'lucide-react';

interface AuthProps {
  onLogin: (name: string, email: string) => void;
  onBack: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin, onBack, theme, toggleTheme }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (!isLoginMode && !name.trim()) {
      setError('Por favor, preencha o seu nome.');
      return;
    }

    // Success simulation
    if (isLoginMode) {
      // simulate checking creds
      if (email === 'ana@example.com' && password === '123456') {
        onLogin('Ana Silva', email);
      } else {
        // Allow free login for testing/demo but warn/autofill
        onLogin(email.split('@')[0], email);
      }
    } else {
      // register
      onLogin(name, email);
    }
  };

  return (
    <div className="animate-fade-in" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      background: 'radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.1) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(236, 72, 153, 0.08) 0%, transparent 40%)'
    }}>
      <div style={{ position: 'absolute', top: 24, left: 24 }}>
        <button onClick={onBack} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: '50px' }}>
          <ArrowLeft size={16} /> Voltar para o Início
        </button>
      </div>

      <div style={{ position: 'absolute', top: 24, right: 24 }}>
        <button 
          onClick={toggleTheme}
          className="btn btn-secondary"
          style={{ padding: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}
          title={theme === 'light' ? 'Mudar para Tema Escuro' : 'Mudar para Tema Claro'}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>

      <div className="glass-panel animate-fade-in-up" style={{ width: '100%', maxWidth: '440px', padding: '40px 32px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 800, fontSize: '1.75rem', letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: 32 }}>
          <Sparkles size={28} color="#6366f1" />
          <span>Celebrare</span>
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>
          {isLoginMode ? 'Acesse sua conta' : 'Crie sua conta grátis'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 24 }}>
          {isLoginMode 
            ? 'Entre para gerenciar seus convites, RSVPs e presentes.' 
            : 'Preencha os dados abaixo para começar a criar seu site.'
          }
        </p>

        {/* Demo Credentials Alert */}
        {isLoginMode && (
          <div className="glass-panel" style={{
            background: 'var(--primary-glow)',
            borderColor: 'rgba(99, 102, 241, 0.2)',
            padding: 12,
            fontSize: '0.8rem',
            textAlign: 'left',
            borderRadius: 'var(--radius-sm)',
            marginBottom: 20,
            color: 'var(--text-primary)'
          }}>
            <strong>Acesso Demo:</strong> Use o e-mail <code>ana@example.com</code> e senha <code>123456</code> para testar com dados pré-carregados.
          </div>
        )}

        {error && (
          <div style={{
            background: 'var(--error-glow)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#f87171',
            padding: '10px 14px',
            borderRadius: 8,
            fontSize: '0.85rem',
            textAlign: 'left',
            marginBottom: 20
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'left' }}>
          {!isLoginMode && (
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Nome Completo</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  placeholder="Ex: Ana Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="glass-input"
                  style={{ paddingLeft: 40 }}
                />
                <User size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Endereço de E-mail</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="email" 
                placeholder="Ex: ana@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input"
                style={{ paddingLeft: 40 }}
              />
              <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Senha</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input"
                style={{ paddingLeft: 40, paddingRight: 40 }}
              />
              <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 8 }}>
            {isLoginMode ? 'Entrar no Painel' : 'Criar Conta'}
          </button>
        </form>

        <div style={{ marginTop: 24, borderTop: '1px solid var(--border-color)', paddingTop: 20, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          {isLoginMode ? (
            <span>
              Não tem uma conta?{' '}
              <button 
                onClick={() => { setIsLoginMode(false); setError(''); }}
                style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'underline' }}
              >
                Cadastre-se grátis
              </button>
            </span>
          ) : (
            <span>
              Já possui uma conta?{' '}
              <button 
                onClick={() => { setIsLoginMode(true); setError(''); }}
                style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'underline' }}
              >
                Faça login
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

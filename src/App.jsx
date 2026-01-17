import { useState, useRef, useEffect } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import InvitationScreen from './components/InvitationScreen';
import Dashboard from './components/Dashboard';
import './index.css';

function App() {
  const [step, setStep] = useState('welcome'); // 'welcome' | 'invite' | 'dashboard'
  const [guestName, setGuestName] = useState('');
  const [dashboardPassword, setDashboardPassword] = useState('');
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const audioRef = useRef(null);

  const playMusic = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('./mi historia de amor.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = 0.5;
    }
    audioRef.current.play().catch(e => console.log("Audio play failed", e));
  };

  const handleWelcomeComplete = (name) => {
    setGuestName(name);
    playMusic();
    setStep('invite');
    window.scrollTo(0, 0);
  };

  const handleDashboardAccess = (password) => {
    // Contraseña simple: "NK2026" - cámbiala a una más segura si lo deseas
    if (password === 'NK2026') {
      setStep('dashboard');
      setDashboardPassword('');
    } else {
      alert('Contraseña incorrecta');
    }
  };

  // Tecla de acceso rápido: presiona 'd' y '.' para abrir el prompt de contraseña
  useEffect(() => {
    let keySequence = '';
    const handleKeyPress = (e) => {
      keySequence += e.key.toLowerCase();
      if (keySequence.endsWith('d.')) {
        setShowPasswordPrompt(true);
        keySequence = '';
      }
    };
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, []);

  return (
    <div className="app-container">
      {step === 'welcome' && (
        <WelcomeScreen onComplete={handleWelcomeComplete} />
      )}

      {step === 'invite' && (
        <div className="main-content fade-in">
          <InvitationScreen guestName={guestName} />
        </div>
      )}

      {step === 'dashboard' && (
        <div className="dashboard-view">
          <button 
            onClick={() => setStep('welcome')} 
            style={{ 
              margin: '20px', 
              padding: '10px 20px',
              background: '#8b3a3a',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            ← Volver
          </button>
          <Dashboard />
        </div>
      )}

      {showPasswordPrompt && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h2>Acceso al Dashboard</h2>
            <input 
              type="password" 
              placeholder="Contraseña"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleDashboardAccess(e.target.value);
                }
              }}
              style={{ padding: '10px', width: '200px', marginBottom: '20px' }}
              autoFocus
            />
            <br />
            <button 
              onClick={(e) => {
                const input = e.target.parentElement.querySelector('input');
                handleDashboardAccess(input.value);
              }}
              style={{ marginRight: '10px', padding: '10px 20px' }}
            >
              Entrar
            </button>
            <button 
              onClick={() => setShowPasswordPrompt(false)}
              style={{ padding: '10px 20px' }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;


import { useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const RSVP = ({ guestName }) => {
    const [status, setStatus] = useState(null); // 'attending', 'not_attending'
    const [guests, setGuests] = useState(1);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Establecer un timeout de 10 segundos
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('La solicitud tardó demasiado. Por favor intenta de nuevo.')), 10000)
            );

            const savePromise = addDoc(collection(db, 'confirmaciones'), {
                nombre: guestName,
                estado: status === 'attending' ? 'asistira' : 'no_asistira',
                acompanantes: status === 'attending' ? parseInt(guests) : 0,
                timestamp: serverTimestamp(),
            });

            // Ejecutar con timeout
            await Promise.race([savePromise, timeoutPromise]);

            setSubmitted(true);
        } catch (err) {
            console.error('Error al guardar:', err);
            setError('Error al guardar tu respuesta. Intenta de nuevo o contacta a los novios.');
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <motion.div
                className="rsvp-container"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                <div className="rsvp-success">
                    <h2 className="font-script text-gold" style={{ fontSize: '3rem' }}>¡Gracias!</h2>
                    <p>Tu respuesta ha sido registrada con éxito.</p>
                    <p className="text-ruby" style={{ marginTop: '20px', fontStyle: 'italic' }}>Nos hace mucha ilusión compartir este día contigo.</p>
                </div>
            </motion.div>
        );
    }

    return (
        <section className="rsvp-container" id="rsvp">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="font-cinematic text-ruby">Confirmar Asistencia</h2>
                <p className="rsvp-intro">Por favor, confírmanos tu asistencia antes del 1 de Junio de 2026</p>

                <form onSubmit={handleSubmit} className="rsvp-form">
                    {error && <div style={{ color: '#d32f2f', marginBottom: '20px', textAlign: 'center' }}>{error}</div>}
                    
                    <div className="radio-group">
                        <div
                            className={`radio-option ${status === 'attending' ? 'selected' : ''}`}
                            onClick={() => setStatus('attending')}
                        >
                            <span>Asistiré</span>
                        </div>
                        <div
                            className={`radio-option ${status === 'not_attending' ? 'selected' : ''}`}
                            onClick={() => setStatus('not_attending')}
                        >
                            <span>No podré asistir</span>
                        </div>
                    </div>

                    {status === 'attending' && (
                        <motion.div
                            className="guest-count"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                        >
                            <label>Número de acompañantes:</label>
                            <input
                                type="number"
                                min="1"
                                max="10"
                                value={guests}
                                onChange={(e) => setGuests(e.target.value)}
                            />
                        </motion.div>
                    )}

                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={!status || loading}
                    >
                        {loading ? 'Guardando...' : 'Confirmar'}
                    </button>
                </form>
            </motion.div>
        </section>
    );
};

export default RSVP;

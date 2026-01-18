import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import RSVP from './RSVP';

// Scroll Reveal Wrapper Component
const ScrollReveal = ({ children, delay = 0 }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay, ease: "easeOut" }}
        >
            {children}
        </motion.div>
    );
};

// Animated Counter Component
const AnimatedNumber = ({ value }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let start = displayValue;
        const end = value;
        const duration = 1000;
        const startTime = Date.now();

        const animate = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);
            const current = Math.floor(start + (end - start) * progress);
            setDisplayValue(current);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [value]);

    return <span>{String(displayValue).padStart(2, '0')}</span>;
};

const InvitationScreen = ({ guestName }) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    const weddingDate = new Date('2026-06-27T18:00:00');

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const difference = weddingDate - now;

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="invitation-container">
            {/* Hero Section with Greeting */}
            <motion.section
                className="hero-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2 }}
            >
                <motion.h1
                    className="greeting font-script"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
                >
                    Querido/a {guestName}
                </motion.h1>
                <motion.p
                    className="intro-text"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    Nuestra historia de amor llega al altar y queremos que seas parte de este capítulo
                </motion.p>
            </motion.section>

            {/* Photo Section with Elegant Frame */}
            <ScrollReveal delay={0.2}>
                <section className="photo-section">
                    <div className="photo-frame-outer">
                        <div className="photo-corner photo-corner-tl"></div>
                        <div className="photo-corner photo-corner-tr"></div>
                        <div className="photo-corner photo-corner-bl"></div>
                        <div className="photo-corner photo-corner-br"></div>
                        <motion.div
                            className="photo-frame"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.4 }}
                        >
                            <img
                                src="./foto.jpg"
                                alt="Kelly & Neisdel"
                                className="couple-photo"
                            />
                            <div className="photo-shine"></div>
                        </motion.div>
                    </div>
                </section>
            </ScrollReveal>

            {/* Couple Names */}
            <ScrollReveal delay={0.3}>
                <section className="couple-names">
                    <motion.h2
                        className="bride-name shimmer-text"
                        whileInView={{ opacity: 1, x: 0 }}
                        initial={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        Neisdel Izquierdo Romero
                    </motion.h2>
                    <motion.span
                        className="ampersand"
                        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                        initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        &
                    </motion.span>
                    <motion.h2
                        className="groom-name shimmer-text"
                        whileInView={{ opacity: 1, x: 0 }}
                        initial={{ opacity: 0, x: 30 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        viewport={{ once: true }}
                    >
                        Kelly Jhoana Castro Causil
                    </motion.h2>
                </section>
            </ScrollReveal>

            <div className="divider" style={{ fontSize: '2rem', padding: '40px 0' }}>✧ ✦ ✧</div>

            {/* Event Details */}
            <ScrollReveal delay={0.2}>
                <section className="details-section">
                    <motion.div
                        className="detail-item"
                        whileHover={{ y: -10 }}
                    >
                        <h3>Ceremonia</h3>
                        <p className="detail-value">Iglesia Interamericana</p>
                    </motion.div>

                    <motion.div
                        className="detail-item"
                        whileHover={{ y: -10 }}
                    >
                        <h3>Fecha</h3>
                        <p className="detail-value">27 de Junio de 2026</p>
                    </motion.div>

                    <motion.div
                        className="detail-item"
                        whileHover={{ y: -10 }}
                    >
                        <h3>Hora</h3>
                        <p className="detail-value">6:00 PM</p>
                    </motion.div>
                </section>
            </ScrollReveal>

            {/* Countdown */}
            <ScrollReveal delay={0.3}>
                <section className="countdown-section">
                    <h3>Faltan</h3>
                    <div className="countdown-container">
                        <div className="time-unit">
                            <span className="number">
                                <AnimatedNumber value={timeLeft.days} />
                            </span>
                            <span className="label">Días</span>
                        </div>
                        <div className="time-unit">
                            <span className="number">
                                <AnimatedNumber value={timeLeft.hours} />
                            </span>
                            <span className="label">Horas</span>
                        </div>
                        <div className="time-unit">
                            <span className="number">
                                <AnimatedNumber value={timeLeft.minutes} />
                            </span>
                            <span className="label">Minutos</span>
                        </div>
                        <div className="time-unit">
                            <span className="number">
                                <AnimatedNumber value={timeLeft.seconds} />
                            </span>
                            <span className="label">Segundos</span>
                        </div>
                    </div>
                </section>
            </ScrollReveal>

            {/* RSVP */}
            <ScrollReveal delay={0.4}>
                <RSVP guestName={guestName} />
            </ScrollReveal>
        </div>
    );
};

export default InvitationScreen;

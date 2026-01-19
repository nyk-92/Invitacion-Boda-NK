import './BackgroundEffects.css';

const BackgroundEffects = () => {
    // Generate 6 petals with random properties
    const petals = Array.from({ length: 6 }, (_, i) => ({
        id: i,
        delay: Math.random() * 10,
        duration: 15 + Math.random() * 10,
        left: Math.random() * 100,
        rotation: Math.random() * 360,
        size: 20 + Math.random() * 20
    }));

    return (
        <div className="background-effects" style={{ zIndex: -1 }}>
            {/* Light Rays */}
            <div className="light-rays">
                <div className="ray ray-1"></div>
                <div className="ray ray-2"></div>
                <div className="ray ray-3"></div>
                <div className="ray ray-4"></div>
            </div>

            {/* Floating Petals */}
            <div className="petals-container">
                {petals.map(petal => (
                    <div
                        key={petal.id}
                        className="petal"
                        style={{
                            left: `${petal.left}%`,
                            animationDelay: `${petal.delay}s`,
                            animationDuration: `${petal.duration}s`,
                            transform: `rotate(${petal.rotation}deg)`,
                            fontSize: `${petal.size}px`
                        }}
                    >
                        <svg viewBox="0 0 24 24" width="100%" height="100%">
                            <path
                                d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM15 8C16.1 8 17 8.9 17 10C17 11.1 16.1 12 15 12C13.9 12 13 11.1 13 10C13 8.9 13.9 8 15 8ZM9 8C10.1 8 11 8.9 11 10C11 11.1 10.1 12 9 12C7.9 12 7 11.1 7 10C7 8.9 7.9 8 9 8ZM12 14C13.66 14 15 15.34 15 17V22H9V17C9 15.34 10.34 14 12 14Z"
                                fill="#D4AF37"
                                opacity="0.4"
                            />
                        </svg>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BackgroundEffects;
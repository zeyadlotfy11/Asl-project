import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';

interface Colors {
    primary: string;
    secondary: string;
    accent: string;
    gold: string;
    goldBright: string;
    background: string;
    surface: string;
    surfaceElevated: string;
    surfaceLight: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    border: string;
    borderLight: string;
    navbar: string;
    card: string;
    shadow: string;
    shadowGold: string;
    patternColor: string;
    hieroglyphColor: string;
}
const HeroSection = () => {
    const { t } = useLanguage();
    const { theme } = useTheme();
    const colors: Colors = theme === 'dark' ? {
        // Dark Egyptian Theme
        primary: '#d4af37',      // Golden
        secondary: '#ffd700',    // Light Gold
        accent: '#b8860b',       // Dark Gold
        gold: '#d4af37',
        goldBright: '#ffd700',
        background: 'linear-gradient(135deg, #0f0a19 0%, #1a1a2e 30%, #2c1810 70%, #3d2817 100%)',
        surface: 'rgba(26, 26, 46, 0.85)',
        surfaceElevated: 'rgba(44, 24, 16, 0.9)',
        surfaceLight: 'rgba(212, 175, 55, 0.1)',
        text: '#f5f5dc',         // Beige
        textSecondary: 'rgba(245, 245, 220, 0.8)',
        textMuted: 'rgba(245, 245, 220, 0.6)',
        border: '#d4af37',
        borderLight: 'rgba(212, 175, 55, 0.3)',
        navbar: 'linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(44, 24, 16, 0.95) 100%)',
        card: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(26, 26, 46, 0.85) 100%)',
        shadow: 'rgba(212, 175, 55, 0.2)',
        shadowGold: 'rgba(212, 175, 55, 0.4)',
        patternColor: '#d4af37',
        hieroglyphColor: '#ffd700',
    } : {
        // Light Egyptian Theme
        primary: '#b8860b',      // Darker Gold for better contrast
        secondary: '#d4af37',    // Golden
        accent: '#8b7355',       // Bronze
        gold: '#b8860b',
        goldBright: '#d4af37',
        background: 'linear-gradient(135deg, #faf5e6 0%, #f5f0dc 30%, #ede4c8 70%, #e6d7b8 100%)',
        surface: 'rgba(250, 245, 230, 0.95)',
        surfaceElevated: 'rgba(245, 240, 220, 0.98)',
        surfaceLight: 'rgba(184, 134, 11, 0.1)',
        text: '#2c1810',         // Dark Brown
        textSecondary: 'rgba(44, 24, 16, 0.85)',
        textMuted: 'rgba(44, 24, 16, 0.65)',
        border: '#b8860b',
        borderLight: 'rgba(184, 134, 11, 0.3)',
        navbar: 'linear-gradient(135deg, rgba(250, 245, 230, 0.98) 0%, rgba(237, 228, 200, 0.98) 100%)',
        card: 'linear-gradient(135deg, rgba(184, 134, 11, 0.08) 0%, rgba(250, 245, 230, 0.95) 100%)',
        shadow: 'rgba(184, 134, 11, 0.15)',
        shadowGold: 'rgba(184, 134, 11, 0.3)',
        patternColor: '#b8860b',
        hieroglyphColor: '#8b7355',
    };


    return (
        <>
            {/* Enhanced CSS Animations */}
            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes pharaohGlow {
          0%, 100% { 
            box-shadow: 0 0 30px ${colors.goldBright}, 0 0 60px ${colors.gold}, 0 0 90px ${colors.accent};
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 50px ${colors.goldBright}, 0 0 100px ${colors.gold}, 0 0 150px ${colors.accent};
            transform: scale(1.05);
          }
        }

        @keyframes hieroglyphFloat {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg);
            opacity: 0.6;
          }
          25% { 
            transform: translateY(-20px) rotate(5deg);
            opacity: 0.8;
          }
          50% { 
            transform: translateY(-35px) rotate(-3deg);
            opacity: 1;
          }
          75% { 
            transform: translateY(-15px) rotate(7deg);
            opacity: 0.9;
          }
        }

        @keyframes sandDrift {
          0% { 
            transform: translateX(-100px) translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% { 
            opacity: 0.7;
          }
          90% { 
            opacity: 0.3;
          }
          100% { 
            transform: translateX(calc(100vw + 100px)) translateY(-100px) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes goldenSparkle {
          0%, 100% { 
            transform: scale(0) rotate(0deg);
            opacity: 0;
          }
          50% { 
            transform: scale(1.5) rotate(180deg);
            opacity: 1;
          }
        }

        @keyframes eyeOfRa {
          0%, 100% { 
            transform: translateY(0px) scale(1);
            opacity: 0.7;
          }
          50% { 
            transform: translateY(-30px) scale(1.2);
            opacity: 1;
          }
        }

        @keyframes pharaohCrown {
          0%, 100% { 
            transform: translateX(-50%) rotateY(0deg);
            filter: brightness(1);
          }
          50% { 
            transform: translateX(-50%) rotateY(15deg);
            filter: brightness(1.3);
          }
        }

        @keyframes scepterFloat {
          0%, 100% { 
            transform: rotate(0deg) translateY(0px);
          }
          25% { 
            transform: rotate(5deg) translateY(-5px);
          }
          50% { 
            transform: rotate(-3deg) translateY(-10px);
          }
          75% { 
            transform: rotate(2deg) translateY(-3px);
          }
        }

        @keyframes ankhRotate {
          0% { 
            transform: rotate(0deg) scale(1);
            filter: drop-shadow(0 0 5px ${colors.goldBright});
          }
          25% { 
            transform: rotate(90deg) scale(1.1);
            filter: drop-shadow(0 0 15px ${colors.goldBright});
          }
          50% { 
            transform: rotate(180deg) scale(1.2);
            filter: drop-shadow(0 0 25px ${colors.goldBright});
          }
          75% { 
            transform: rotate(270deg) scale(1.1);
            filter: drop-shadow(0 0 15px ${colors.goldBright});
          }
          100% { 
            transform: rotate(360deg) scale(1);
            filter: drop-shadow(0 0 5px ${colors.goldBright});
          }
        }

        @keyframes scarabScuttle {
          0%, 100% { 
            transform: translateX(0px) rotate(0deg);
          }
          25% { 
            transform: translateX(10px) rotate(15deg);
          }
          50% { 
            transform: translateX(5px) rotate(-10deg);
          }
          75% { 
            transform: translateX(-5px) rotate(20deg);
          }
        }

        @keyframes cartoucheGlow {
          0%, 100% { 
            filter: drop-shadow(0 0 5px ${colors.gold});
            transform: scale(1);
          }
          50% { 
            filter: drop-shadow(0 0 20px ${colors.goldBright});
            transform: scale(1.1);
          }
        }

        @keyframes blessingGlow {
          0%, 100% { 
            color: ${colors.gold};
            filter: drop-shadow(0 0 10px ${colors.gold});
            transform: scale(1);
          }
          50% { 
            color: ${colors.goldBright};
            filter: drop-shadow(0 0 30px ${colors.goldBright});
            transform: scale(1.2);
          }
        }

        @keyframes cardHover {
          0% { 
            transform: translateY(0px) rotateX(0deg);
            box-shadow: 0 15px 40px ${colors.shadow};
          }
          100% { 
            transform: translateY(-10px) rotateX(5deg);
            box-shadow: 0 25px 60px ${colors.shadow}, 0 0 30px ${colors.goldBright}20;
          }
        }

        @keyframes buttonPulse {
          0%, 100% { 
            transform: scale(1);
            box-shadow: 0 10px 30px ${colors.shadowGold};
          }
          50% { 
            transform: scale(1.05);
            box-shadow: 0 20px 50px ${colors.shadowGold}, 0 0 40px ${colors.goldBright}40;
          }
        }

        @keyframes logoSpin {
          0% { 
            transform: rotate(0deg);
            filter: brightness(1);
          }
          25% { 
            transform: rotate(90deg);
            filter: brightness(1.2);
          }
          50% { 
            transform: rotate(180deg);
            filter: brightness(1.5);
          }
          75% { 
            transform: rotate(270deg);
            filter: brightness(1.2);
          }
          100% { 
            transform: rotate(360deg);
            filter: brightness(1);
          }
        }

        @keyframes titleShimmer {
          0%, 100% {
            background-position: -200% center;
          }
          50% {
            background-position: 200% center;
          }
        }

        @keyframes pulseGlow {
          0%, 100% {
            filter: drop-shadow(0 0 10px ${colors.gold});
            transform: scale(1);
          }
          50% {
            filter: drop-shadow(0 0 30px ${colors.goldBright});
            transform: scale(1.05);
          }
        }

        @keyframes buttonShine {
          0% {
            left: -100%;
          }
          50% {
            left: 100%;
          }
          100% {
            left: 100%;
          }
        }

        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .sand-particle {
          position: absolute;
          width: 3px;
          height: 3px;
          background: ${colors.gold};
          border-radius: 50%;
          animation: sandDrift linear infinite;
          pointer-events: none;
        }

        .golden-dust {
          position: absolute;
          color: ${colors.goldBright};
          animation: goldenSparkle ease-in-out infinite;
          pointer-events: none;
        }

        .ra-particle {
          position: absolute;
          color: ${colors.gold};
          font-size: 20px;
          animation: eyeOfRa ease-in-out infinite;
          pointer-events: none;
        }

        .floating-hieroglyphs .hieroglyph {
          position: absolute;
          color: ${colors.hieroglyphColor};
          font-size: 2.5rem;
          animation: hieroglyphFloat ease-in-out infinite;
          animation-duration: 8s;
          pointer-events: none;
          opacity: 0.6;
        }

        .golden-scarab {
          position: absolute;
          color: ${colors.gold};
          font-size: 1.8rem;
          animation: scarabScuttle ease-in-out infinite;
          animation-duration: 4s;
          pointer-events: none;
        }

        .pharaoh-cartouche {
          position: absolute;
          color: ${colors.goldBright};
          font-size: 2rem;
          animation: cartoucheGlow ease-in-out infinite;
          animation-duration: 5s;
          pointer-events: none;
        }

        .hero-cta-btn:hover {
          animation: buttonPulse 0.3s ease-out forwards;
          transform: translateY(-5px) scale(1.02);
          background-position: 100% 50%;
          box-shadow: 
            0 25px 60px ${colors.shadowGold}, 
            0 0 50px ${colors.goldBright}60,
            0 0 0 1px ${colors.goldBright};
        }

        .hero-cta-btn:active {
          transform: translateY(-2px) scale(0.98);
        }

        .asl-logo:hover {
          animation: logoSpin 2s ease-in-out;
        }

        @media (max-width: 768px) {
          .floating-hieroglyphs .hieroglyph {
            font-size: 1.8rem;
          }
          .sand-particle {
            width: 2px;
            height: 2px;
          }
        }
      `
            }} />

            {/* Hero Section */}
            <section style={{
                flex: "0 0 auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "4rem 2rem",
                position: "relative",
                overflow: "hidden",
                minHeight: "80vh"
            }}>
                {/* Background Pattern */}
                <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${encodeURIComponent(colors.patternColor)}' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    opacity: 0.3
                }} />

                {/* Sand particles */}
                <div className="sand-particles">
                    {Array.from({ length: 30 }).map((_, i) => (
                        <div
                            key={i}
                            className="sand-particle"
                            style={{
                                left: `${Math.random() * 100}%`,
                                animationDuration: `${15 + Math.random() * 20}s`,
                                animationDelay: `${Math.random() * 15}s`,
                            }}
                        />
                    ))}
                </div>

                {/* Enhanced Pharaoh's Golden Dust */}
                <div className="pharaoh-dust">
                    {Array.from({ length: 25 }).map((_, i) => (
                        <div
                            key={i}
                            className="golden-dust"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                fontSize: `${12 + Math.random() * 8}px`,
                                animationDuration: `${2 + Math.random() * 3}s`,
                                animationDelay: `${Math.random() * 5}s`,
                            }}
                        >
                            ✨
                        </div>
                    ))}
                </div>

                {/* Mystical Eye of Ra particles */}
                <div className="eye-of-ra-particles">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div
                            key={i}
                            className="ra-particle"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDuration: `${3 + Math.random() * 4}s`,
                                animationDelay: `${Math.random() * 6}s`,
                            }}
                        >
                            𓁹
                        </div>
                    ))}
                </div>

                {/* Ancient Egyptian Constellation Effect */}
                <div className="constellation-effects">
                    {Array.from({ length: 15 }).map((_, i) => (
                        <div
                            key={i}
                            className="constellation-star"
                            style={{
                                position: "absolute",
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                width: "3px",
                                height: "3px",
                                background: colors.goldBright,
                                borderRadius: "50%",
                                animation: `goldenSparkle ${3 + Math.random() * 4}s ease-in-out infinite`,
                                animationDelay: `${Math.random() * 5}s`,
                                boxShadow: `0 0 10px ${colors.goldBright}`,
                                pointerEvents: "none"
                            }}
                        />
                    ))}
                </div>

                {/* Main Hero Content */}
                <div style={{
                    background: `linear-gradient(135deg, ${colors.surface}ee, ${colors.background}cc)`,
                    borderRadius: "25px",
                    border: `3px solid ${colors.border}`,
                    padding: "4rem 3rem",
                    maxWidth: "1000px",
                    width: "100%",
                    boxShadow: `
            0 20px 60px ${colors.shadow},
            0 0 0 1px ${colors.gold}22,
            inset 0 1px 0 ${colors.goldBright}33
          `,
                    position: "relative",
                    overflow: "hidden",
                    textAlign: "center",
                    backdropFilter: "blur(15px)",
                    transition: "all 0.3s ease"
                }}>
                    {/* Top Border */}
                    <div style={{
                        position: "absolute",
                        top: "0",
                        left: "0",
                        right: "0",
                        height: "20px",
                        background: `
              linear-gradient(90deg, 
                transparent 0%, 
                ${colors.gold}40 10%, 
                ${colors.goldBright}60 20%, 
                ${colors.accent}40 30%, 
                ${colors.gold}60 40%, 
                ${colors.goldBright}80 50%, 
                ${colors.gold}60 60%, 
                ${colors.accent}40 70%, 
                ${colors.goldBright}60 80%, 
                ${colors.gold}40 90%, 
                transparent 100%
              )
            `,
                        clipPath: "polygon(0 0, 100% 0, 95% 100%, 5% 100%)"
                    }} />

                    <div style={{
                        position: "absolute",
                        bottom: "0",
                        left: "0",
                        right: "0",
                        height: "20px",
                        background: `
              linear-gradient(90deg, 
                transparent 0%, 
                ${colors.gold}40 10%, 
                ${colors.goldBright}60 20%, 
                ${colors.accent}40 30%, 
                ${colors.gold}60 40%, 
                ${colors.goldBright}80 50%, 
                ${colors.gold}60 60%, 
                ${colors.accent}40 70%, 
                ${colors.goldBright}60 80%, 
                ${colors.gold}40 90%, 
                transparent 100%
              )
            `,
                        clipPath: "polygon(5% 0, 95% 0, 100% 100%, 0 100%)"
                    }} />

                    {/* Left Hieroglyph Panel */}
                    <div className="hieroglyph-panel left-panel" style={{
                        position: "absolute",
                        left: "10px",
                        top: "50px",
                        bottom: "50px",
                        width: "40px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-around",
                        alignItems: "center",
                        fontSize: "1.5rem",
                        color: colors.hieroglyphColor,
                        opacity: "0.6"
                    }}>
                        {['𓈖', '𓄿', '𓇳', '𓈙', '𓋴', '𓉔', '𓂋', '𓊪'].map((symbol, index) => (
                            <div key={index} style={{ animation: `hieroglyphFloat ${8 + index}s ease-in-out infinite` }}>
                                {symbol}
                            </div>
                        ))}
                    </div>

                    <div className="hieroglyph-panel right-panel" style={{
                        position: "absolute",
                        right: "10px",
                        top: "50px",
                        bottom: "50px",
                        width: "40px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-around",
                        alignItems: "center",
                        fontSize: "1.5rem",
                        color: colors.hieroglyphColor,
                        opacity: "0.6"
                    }}>
                        {['𓊪', '𓂋', '𓉔', '𓋴', '𓈙', '𓇳', '𓄿', '𓈖'].map((symbol, index) => (
                            <div key={index} style={{ animation: `hieroglyphFloat ${8 + index}s ease-in-out infinite` }}>
                                {symbol}
                            </div>
                        ))}
                    </div>

                    {/* Logo Container */}
                    <div style={{
                        width: "180px",
                        height: "180px",
                        margin: "0 auto 2rem",
                        background: `
              conic-gradient(
                from 0deg,
                ${colors.gold} 0deg,
                ${colors.goldBright} 72deg,
                ${colors.accent} 144deg,
                ${colors.gold} 216deg,
                ${colors.goldBright} 288deg,
                ${colors.gold} 360deg
              )
            `,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: `5px solid ${colors.border}`,
                        position: "relative",
                        animation: "pharaohGlow 4s ease-in-out infinite",
                        cursor: "pointer"
                    }}>

                        <div style={{
                            width: "150px",
                            height: "150px",
                            borderRadius: "50%",
                            background: `radial-gradient(circle, ${colors.surface}, ${colors.background}88)`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "relative"
                        }}>
                            <img
                                src="/Asl.png"
                                alt="ASL Logo"
                                style={{
                                    width: "90px",
                                    height: "90px",
                                    filter: theme === 'light' ? "brightness(0) invert(1)" : "brightness(1)",
                                    transition: "all 0.3s ease"
                                }}
                                className="asl-logo pharaoh-pulse"
                            />
                        </div>

                        {/* Pharaoh Crown */}
                        <div className="pharaoh-crown" style={{
                            position: "absolute",
                            top: "-35px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "60px",
                            height: "30px",
                            background: `linear-gradient(45deg, ${colors.goldBright}, ${colors.gold}, ${colors.accent})`,
                            clipPath: "polygon(15% 100%, 0% 0%, 25% 15%, 50% 0%, 75% 15%, 100% 0%, 85% 100%)",
                            animation: "pharaohCrown 3s ease-in-out infinite",
                            filter: `drop-shadow(0 5px 15px ${colors.shadowGold})`
                        }} />

                        {/* Eyes of Horus */}
                        <div className="eye-of-horus left-eye" style={{
                            position: "absolute",
                            top: "-15px",
                            right: "-15px",
                            width: "25px",
                            height: "25px",
                            background: `radial-gradient(circle, ${colors.goldBright}, ${colors.gold})`,
                            borderRadius: "50%",
                            animation: "eyeOfRa 3s ease-in-out infinite",
                            boxShadow: `0 0 15px ${colors.goldBright}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "12px",
                            color: colors.background
                        }}>𓁹</div>

                        <div className="eye-of-horus right-eye" style={{
                            position: "absolute",
                            bottom: "-15px",
                            left: "-15px",
                            width: "25px",
                            height: "25px",
                            background: `radial-gradient(circle, ${colors.gold}, ${colors.goldBright})`,
                            borderRadius: "50%",
                            animation: "eyeOfRa 3s ease-in-out infinite",
                            animationDelay: "1s",
                            boxShadow: `0 0 15px ${colors.gold}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "10px",
                            color: colors.background
                        }}>𓂀</div>

                        {/* Pharaoh Scepter */}
                        <div className="pharaoh-scepter" style={{
                            position: "absolute",
                            right: "-40px",
                            top: "30px",
                            width: "6px",
                            height: "80px",
                            background: `linear-gradient(to bottom, ${colors.goldBright}, ${colors.gold}, ${colors.accent})`,
                            borderRadius: "3px",
                            animation: "scepterFloat 4s ease-in-out infinite",
                            boxShadow: `0 0 10px ${colors.gold}`
                        }}>
                            <div style={{
                                position: "absolute",
                                top: "-10px",
                                left: "-7px",
                                width: "20px",
                                height: "20px",
                                background: `radial-gradient(circle, ${colors.goldBright}, ${colors.gold})`,
                                borderRadius: "50%",
                                boxShadow: `0 0 15px ${colors.goldBright}`
                            }} />
                        </div>

                        {/* Ankh Symbol */}
                        <div className="ankh-symbol" style={{
                            position: "absolute",
                            left: "-45px",
                            top: "40px",
                            fontSize: "32px",
                            color: colors.gold,
                            animation: "ankhRotate 6s linear infinite",
                            textShadow: `0 0 20px ${colors.goldBright}, 0 0 40px ${colors.gold}`,
                            filter: `drop-shadow(0 0 10px ${colors.goldBright})`
                        }}>
                            ☥
                        </div>
                    </div>

                    {/* Enhanced Main Title */}
                    <h1 style={{
                        fontSize: "4.8rem",
                        fontWeight: "700",
                        color: colors.text,
                        margin: "0 0 1rem 0",
                        textShadow: `
              3px 3px 6px ${colors.shadow},
              0 0 30px ${colors.gold}66,
              0 0 60px ${colors.goldBright}33
            `,
                        lineHeight: "1.1",
                        fontFamily: "'Cinzel', serif",
                        position: "relative",
                        backgroundImage: `linear-gradient(135deg, ${colors.text}, ${colors.goldBright}, ${colors.text})`,
                        backgroundSize: "200% 100%",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        animation: "titleShimmer 4s ease-in-out infinite"
                    }}>
                        <span style={{ position: "relative", zIndex: 2 }}>
                            Asl - أصل
                        </span>

                        {/* Title Hieroglyphs */}
                        <div style={{
                            position: "absolute",
                            top: "-20px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            fontSize: "1.5rem",
                            color: colors.gold,
                            animation: "hieroglyphFloat 6s ease-in-out infinite"
                        }}>
                            𓊽𓊾
                        </div>
                    </h1>

                    {/* Enhanced Subtitle */}
                    <h2 style={{
                        fontSize: "2.4rem",
                        color: colors.textSecondary,
                        margin: "0 0 1.5rem 0",
                        fontWeight: "400",
                        fontFamily: "'Cinzel', serif",
                        textShadow: `2px 2px 4px ${colors.shadow}`,
                        position: "relative"
                    }}>
                        <span style={{
                            backgroundImage: `linear-gradient(135deg, ${colors.textSecondary}, ${colors.gold}, ${colors.textSecondary})`,
                            backgroundSize: "200% 100%",
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent"
                        }}>
                            {t('homePageTitle')}
                        </span>
                    </h2>

                    {/* Enhanced Mission Statement */}
                    <div style={{
                        position: "relative",
                        margin: "0 0 1rem 0"
                    }}>
                        <p style={{
                            fontSize: "1.5rem",
                            color: colors.textSecondary,
                            margin: "0",
                            lineHeight: "1.6",
                            fontStyle: "italic",
                            fontWeight: "600",
                            textShadow: `1px 1px 3px ${colors.shadow}`,
                            position: "relative",
                            padding: "1rem 2rem",
                            border: `2px solid ${colors.gold}44`,
                            borderRadius: "15px",
                            background: `linear-gradient(135deg, ${colors.surface}66, transparent)`
                        }}>
                            "{t('homePageSubtitle')}"

                            {/* Quote marks */}
                            <div style={{
                                position: "absolute",
                                top: "-10px",
                                left: "10px",
                                fontSize: "2rem",
                                color: colors.gold,
                                background: colors.surface,
                                padding: "0 10px"
                            }}>❝</div>

                            <div style={{
                                position: "absolute",
                                bottom: "-10px",
                                right: "10px",
                                fontSize: "2rem",
                                color: colors.gold,
                                background: colors.surface,
                                padding: "0 10px"
                            }}>❞</div>
                        </p>
                    </div>

                    <p style={{
                        fontSize: "1.1rem",
                        color: colors.textMuted,
                        margin: "0 0 3rem 0",
                        lineHeight: "1.7"
                    }}>
                        مبني على ICP & Web3 | سجل آثار لامركزي | تنسيق مجتمعي
                    </p>

                    {/* Enhanced CTA Button */}
                    <Link to="/artifacts">
                        <button
                            className="hero-cta-btn"
                            style={{
                                padding: "22px 50px",
                                fontSize: "1.5rem",
                                background: `linear-gradient(135deg, ${colors.gold} 0%, ${colors.accent} 25%, ${colors.goldBright} 50%, ${colors.accent} 75%, ${colors.gold} 100%)`,
                                backgroundSize: "200% 100%",
                                color: theme === 'light' ? '#fff' : colors.background,
                                border: `3px solid ${colors.goldBright}`,
                                borderRadius: "18px",
                                cursor: "pointer",
                                fontWeight: "700",
                                boxShadow: `
                  0 15px 40px ${colors.shadowGold},
                  0 0 0 1px ${colors.gold}66,
                  inset 0 1px 0 ${colors.goldBright}44
                `,
                                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                                position: "relative",
                                overflow: "hidden",
                                textTransform: "uppercase",
                                letterSpacing: "1.5px",
                                fontFamily: "'Cinzel', serif",
                                backgroundPosition: "0% 50%"
                            }}
                        >
                            {/* Button shine effect */}
                            <div style={{
                                position: "absolute",
                                top: "0",
                                left: "-100%",
                                width: "100%",
                                height: "100%",
                                background: `linear-gradient(90deg, transparent, ${colors.goldBright}33, transparent)`,
                                animation: "buttonShine 3s ease-in-out infinite",
                                pointerEvents: "none"
                            }} />

                            <span style={{
                                position: "relative",
                                zIndex: 2,
                                display: "flex",
                                alignItems: "center",
                                gap: "10px"
                            }}>
                                <span>🏺</span>
                                استكشف سجل الآثار
                                <span>→</span>
                            </span>

                            {/* Button particles */}
                            <div className="button-particles">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            position: "absolute",
                                            width: "4px",
                                            height: "4px",
                                            background: colors.goldBright,
                                            borderRadius: "50%",
                                            top: `${Math.random() * 100}%`,
                                            left: `${Math.random() * 100}%`,
                                            animation: `goldenSparkle ${2 + Math.random() * 3}s ease-in-out infinite`,
                                            animationDelay: `${Math.random() * 2}s`,
                                            pointerEvents: "none"
                                        }}
                                    />
                                ))}
                            </div>
                        </button>
                    </Link>

                    {/* Enhanced Floating Hieroglyphs */}
                    <div className="floating-hieroglyphs">
                        {[
                            { symbol: '𓈖', left: '8%', delay: '0s', size: '2.5rem' },
                            { symbol: '𓄿', left: '88%', delay: '2s', size: '2.8rem' },
                            { symbol: '𓇳', left: '12%', delay: '4s', size: '2.2rem' },
                            { symbol: '𓈙', left: '75%', delay: '1s', size: '2.6rem' },
                            { symbol: '𓋴', left: '45%', delay: '3s', size: '2.4rem' },
                            { symbol: '𓉔', left: '65%', delay: '5s', size: '2.7rem' },
                            { symbol: '𓂋', left: '25%', delay: '6s', size: '2.3rem' },
                            { symbol: '𓊪', left: '85%', delay: '1.5s', size: '2.5rem' }
                        ].map((hieroglyph, index) => (
                            <div
                                key={index}
                                className="hieroglyph"
                                style={{
                                    left: hieroglyph.left,
                                    animationDelay: hieroglyph.delay,
                                    fontSize: hieroglyph.size,
                                    filter: `drop-shadow(0 0 15px ${colors.hieroglyphColor}66)`
                                }}
                            >
                                {hieroglyph.symbol}
                            </div>
                        ))}
                    </div>

                    {/* Enhanced Pharaoh's mystical elements */}
                    <div className="pharaoh-mystical">
                        {[
                            { symbol: '𓆣', left: '15%', delay: '1s', animation: 'scarabScuttle' },
                            { symbol: '𓆣', left: '85%', delay: '3s', animation: 'scarabScuttle' },
                            { symbol: '𓍿', left: '25%', delay: '4s', animation: 'cartoucheGlow' },
                            { symbol: '𓍿', left: '70%', delay: '2s', animation: 'cartoucheGlow' },
                            { symbol: '𓋹', left: '35%', delay: '5s', animation: 'blessingGlow' },
                            { symbol: '𓋹', left: '60%', delay: '1.5s', animation: 'blessingGlow' }
                        ].map((element, index) => (
                            <div
                                key={index}
                                className={element.animation === 'scarabScuttle' ? 'golden-scarab' : 'pharaoh-cartouche'}
                                style={{
                                    left: element.left,
                                    animationDelay: element.delay,
                                    fontSize: element.animation === 'scarabScuttle' ? '2rem' : '2.2rem',
                                    animation: `${element.animation} ${4 + index}s ease-in-out infinite`,
                                    filter: `drop-shadow(0 0 10px ${colors.gold})`
                                }}
                            >
                                {element.symbol}
                            </div>
                        ))}
                    </div>

                    {/* Pharaoh's Power Aura */}
                    <div className="pharaoh-aura" style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        width: "600px",
                        height: "400px",
                        transform: "translate(-50%, -50%)",
                        background: `radial-gradient(ellipse, ${colors.gold}08 0%, ${colors.goldBright}15 30%, transparent 70%)`,
                        borderRadius: "50%",
                        animation: "pharaohGlow 8s ease-in-out infinite",
                        pointerEvents: "none",
                        zIndex: -1
                    }} />
                </div>
            </section>
        </>
    );
};

export default HeroSection;

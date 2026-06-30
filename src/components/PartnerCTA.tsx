/**
 * PartnerCTA.tsx  (Contact / Partner section)
 * ScrollTrigger animation: section card fades up + slight scale on enter viewport.
 */

import { useState, useRef } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

// Read recipient from environment — never hardcoded
const RECIPIENT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL as string | undefined;

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

const CHESS_PIECE_TYPES = ['rook', 'bishop', 'knight', 'queen', 'king', 'pawn'] as const;

const BACKGROUND_PIECES = Array.from({ length: 15 }).map((_, i) => {
  const type = CHESS_PIECE_TYPES[i % CHESS_PIECE_TYPES.length];
  // Spawns chess pieces evenly across the screen width (0% to 100%) with small random jitter
  const baseLeft = (i / 15) * 100;
  const jitter = (Math.random() - 0.5) * 4; // +/- 2%
  const left = Math.min(95, Math.max(2, baseLeft + jitter)); // Keep away from very edges slightly

  const size = Math.floor(Math.random() * 30 + 85); // 85px to 115px
  const duration = Math.floor(Math.random() * 25 + 50); // 50s to 75s (very slow and elegant)
  const delay = -(Math.random() * 75); // negative delay so they start animated at random scroll points
  const drift = (Math.random() - 0.5) * 80; // horizontal drift +/- 40px
  const startRotate = Math.floor(Math.random() * 40 - 20); // -20deg to 20deg
  const endRotate = Math.floor(Math.random() * 40 - 20); // -20deg to 20deg
  const opacity = Math.random() * 0.4 + 0.5; // subtle opacity factor

  return {
    id: i,
    type,
    left,
    size,
    duration,
    delay,
    drift,
    startRotate,
    endRotate,
    opacity,
  };
});

function renderPieceSvg(type: 'rook' | 'bishop' | 'knight' | 'queen' | 'king' | 'pawn') {
  switch (type) {
    case 'rook':
      return (
        <svg viewBox="0 0 100 100">
          <path d="M27 18h10v10h8V18h10v10h8V18h10v21H27V18z" />
          <path d="M35 39h30l-4 34H39L35 39z" />
          <path d="M30 73h40v8H30z" />
          <path d="M24 81h52v8H24z" />
        </svg>
      );
    case 'bishop':
      return (
        <svg viewBox="0 0 100 100">
          <path d="M50 10c5 0 9 4 9 9 0 4-2 7-5 8 13 9 21 24 21 39 0 10-10 13-25 13S25 76 25 66c0-15 8-30 21-39-3-1-5-4-5-8 0-5 4-9 9-9z" />
          <path d="M53 36l-13 24h9l10-19z" fill="rgba(4,12,31,0.42)" />
          <path d="M31 79h38v8H31z" />
          <path d="M24 87h52v7H24z" />
        </svg>
      );
    case 'knight':
      return (
        <svg viewBox="0 0 100 100">
          <path d="M61 12c15 7 24 22 24 40 0 10-4 20-10 28H40c2-11 8-20 18-27-9 0-17-4-24-11l5-16c6 4 12 6 18 6-4-4-6-9-6-15l10-5z" />
          <path d="M42 80h38v8H42z" />
          <path d="M34 88h52v7H34z" />
          <circle cx="58" cy="31" r="3" fill="rgba(4,12,31,0.45)" />
        </svg>
      );
    case 'pawn':
      return (
        <svg viewBox="0 0 100 100">
          <path d="M50 12c7 0 12 5 12 12 0 6-4 10-10 11 9 7 11 25 12 40H36c1-15 3-33 12-40-6-1-10-5-10-11 0-7 5-12 12-12z" />
          <path d="M30 75h40v8H30z" />
          <path d="M24 83h52v7H24z" />
        </svg>
      );
    case 'queen':
      return (
        <svg viewBox="0 0 100 100">
          <path d="M50 16a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zm22 6a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zm-44 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
          <path d="M25 32l8 16 17-21 17 21 8-16 5 36H20l5-36z" />
          <path d="M28 72h44v8H28z" />
          <path d="M22 80h56v8H22z" />
        </svg>
      );
    case 'king':
      return (
        <svg viewBox="0 0 100 100">
          <path d="M48 8h4v14h-4z" />
          <path d="M44 12h12v4H44z" />
          <path d="M50 22c14 0 20 8 20 22 0 14-8 20-12 24H42c-4-4-12-10-12-24 0-14 6-22 20-22z" />
          <path d="M30 72h40v8H30z" />
          <path d="M24 80h52v8H24z" />
        </svg>
      );
  }
}

export default function ContactSection() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [emailError, setEmailError] = useState('');
  const [messageError, setMessageError] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');

  const ctaSectionRef = useRef<HTMLElement>(null);

  // ScrollTrigger reveal for the section card
  const cardRef = useRef<HTMLDivElement>(null);
  useScrollReveal(cardRef as React.RefObject<Element | null>, {
    y: 50,
    duration: 0.9,
    start: 'top 88%',
  });

  const validateEmail = (val: string) => {
    if (!val) return 'Email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Enter a valid email address.';
    return '';
  };

  const validateMessage = (val: string) => {
    if (!val) return 'Message is required.';
    if (val.trim().length < 10) return 'Message must be at least 10 characters.';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const eErr = validateEmail(email);
    const mErr = validateMessage(message);
    setEmailError(eErr);
    setMessageError(mErr);
    if (eErr || mErr) return;

    setStatus('submitting');

    try {
      // Using mailto: as the submission mechanism since no backend exists in this demo.
      // In production, replace with a real API endpoint (e.g. /api/contact).
      const recipient = RECIPIENT_EMAIL || 'contact@xlchess.com';
      const subject = encodeURIComponent('ChessCraft Contact Form');
      const body = encodeURIComponent(`From: ${email}\n\n${message}`);
      const mailtoLink = `mailto:${recipient}?subject=${subject}&body=${body}`;

      // Open native mail client
      window.location.href = mailtoLink;

      // Slight delay so mailto fires before state update
      await new Promise((r) => setTimeout(r, 600));
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const handleReset = () => {
    setEmail('');
    setMessage('');
    setEmailError('');
    setMessageError('');
    setStatus('idle');
  };

  return (
    <section ref={ctaSectionRef} id="contact-us" className="relative z-10 min-h-[calc(100vh-110px)] flex items-center justify-center py-16 px-6 overflow-hidden">
      <style>{`
        :root {
          --card-bg: rgba(21, 27, 61, 0.72);
          --input-bg: rgba(10, 19, 38, 0.9);
          --purple-2: #7b6dff;
          --ice: #89c2ff;
          --muted: rgba(255, 255, 255, 0.62);
          --placeholder: rgba(255, 255, 255, 0.35);
        }

        .contact-page-bg {
          position: absolute;
          inset: 0;
          z-index: -2;
        }

        .contact-page-bg::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.026) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.026) 1px, transparent 1px);
          background-size: 92px 92px;
          mask-image: radial-gradient(circle at 50% 38%, black 0%, transparent 72%);
          -webkit-mask-image: radial-gradient(circle at 50% 38%, black 0%, transparent 72%);
        }

        .contact-card {
          position: relative;
          width: 100%;
          max-width: 1024px;
          padding: 84px 96px 72px;
          overflow: hidden;
          border-radius: 24px;
          background:
            linear-gradient(135deg, rgba(255,255,255,0.08), transparent 34%),
            radial-gradient(circle at 0% 0%, rgba(137, 194, 255, 0.16), transparent 28%),
            radial-gradient(circle at 100% 0%, rgba(123, 109, 255, 0.18), transparent 26%),
            var(--card-bg);
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow:
            0 28px 80px rgba(0, 0, 0, 0.45),
            inset 0 1px 0 rgba(255,255,255,0.08),
            inset 0 -1px 0 rgba(137,194,255,0.08);
          backdrop-filter: blur(22px);
        }

        .contact-card::before {
          content: "♞";
          position: absolute;
          right: 40px;
          top: 8px;
          font-size: 420px;
          line-height: 1;
          opacity: 0.035;
          color: #fff;
          transform: rotate(-8deg);
          pointer-events: none;
        }

        .contact-card::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          background:
            radial-gradient(circle at top left, rgba(137,194,255,0.32), transparent 26%),
            radial-gradient(circle at top right, rgba(123,109,255,0.32), transparent 25%),
            radial-gradient(circle at bottom left, rgba(137,194,255,0.16), transparent 22%),
            radial-gradient(circle at bottom right, rgba(110,99,246,0.25), transparent 24%);
          opacity: 0.7;
          mix-blend-mode: screen;
        }

        .contact-h2 {
          margin: 0 0 58px;
          text-align: center;
          font-size: clamp(42px, 5vw, 58px);
          line-height: 1;
          letter-spacing: -0.06em;
          text-shadow: 0 0 28px rgba(137,194,255,0.18);
          color: #ffffff;
        }

        .field {
          margin-bottom: 34px;
        }

        .contact-label {
          display: block;
          margin-bottom: 14px;
          color: var(--muted);
          font-size: 18px;
          font-weight: 700;
        }

        .contact-label span {
          color: var(--purple-2);
          text-shadow: 0 0 12px rgba(123,109,255,0.7);
        }

        .contact-input,
        .contact-textarea {
          width: 100%;
          border: 1px solid rgba(137,194,255,0.15);
          background: var(--input-bg);
          color: #fff;
          border-radius: 12px;
          padding: 20px 24px;
          font: inherit;
          font-size: 22px;
          outline: none;
          box-shadow:
            inset 0 0 28px rgba(0,0,0,0.3),
            0 0 0 0 rgba(137,194,255,0);
          transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
        }

        .contact-textarea {
          min-height: 182px;
          resize: vertical;
        }

        .contact-input::placeholder,
        .contact-textarea::placeholder {
          color: var(--placeholder);
        }

        .contact-input:focus,
        .contact-textarea:focus {
          border-color: rgba(137,194,255,0.72);
          box-shadow:
            0 0 0 4px rgba(137,194,255,0.11),
            0 0 28px rgba(137,194,255,0.12),
            inset 0 0 28px rgba(0,0,0,0.3);
          transform: translateY(-1px);
        }
          
        .contact-input.error,
        .contact-textarea.error {
          border-color: rgba(239, 68, 68, 0.7);
        }

        .contact-btn {
          position: relative;
          width: 100%;
          margin-top: 16px;
          border: 0;
          border-radius: 12px;
          padding: 24px 30px;
          color: #fff;
          font-size: 22px;
          font-weight: 800;
          cursor: pointer;
          overflow: hidden;
          background: linear-gradient(90deg, #6e63f6 0%, #7268f8 50%, #7b6dff 100%);
          box-shadow:
            0 0 34px rgba(110,99,246,0.35),
            0 12px 42px rgba(0,0,0,0.35),
            inset 0 1px 0 rgba(255,255,255,0.25);
          transition: transform 180ms ease, box-shadow 180ms ease;
        }

        .contact-btn::before {
          content: "";
          position: absolute;
          top: 0;
          left: -40%;
          width: 30%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent);
          transform: skewX(-18deg);
          animation: buttonShine 4.5s ease-in-out infinite;
        }

        .contact-btn:hover {
          transform: translateY(-2px);
          box-shadow:
            0 0 46px rgba(110,99,246,0.55),
            0 16px 48px rgba(0,0,0,0.4),
            inset 0 1px 0 rgba(255,255,255,0.28);
        }

        @keyframes buttonShine {
          0%, 35% { left: -42%; }
          65%, 100% { left: 115%; }
        }

        .animated-bg {
          --piece: rgba(255, 255, 255, 0.05);
          --piece-soft: rgba(255, 255, 255, 0.03);
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: -1;
        }

        .piece {
          position: absolute;
          top: -150px;
          opacity: 0.72;
          filter: blur(0.2px);
          animation-name: fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
        }

        .piece svg {
          width: 100%;
          height: 100%;
          display: block;
          fill: var(--piece);
          stroke: var(--piece-soft);
          stroke-width: 1.5;
        }

        @keyframes fall {
          0% {
            transform: translate3d(0, -25vh, 0) rotate(var(--start-rotate));
          }
          50% {
            transform: translate3d(var(--drift), 55vh, 0) rotate(calc((var(--start-rotate) + var(--end-rotate)) / 2));
          }
          100% {
            transform: translate3d(calc(var(--drift) * 1.4), 125vh, 0) rotate(var(--end-rotate));
          }
        }

        @media (max-width: 700px) {
          .piece {
            width: 70px !important;
            height: 70px !important;
          }
        }

        .arrow {
          margin-left: 16px;
          color: #fff;
        }

        @media (max-width: 760px) {
          .contact-card {
            padding: 54px 24px 42px;
          }
          .contact-input,
          .contact-textarea,
          .contact-btn {
            font-size: 18px;
          }
        }
      `}</style>
      
      <div className="contact-page-bg"></div>

      {/* Animated Chess Silhouette Background */}
      <div className="animated-bg" aria-hidden="true">
        {BACKGROUND_PIECES.map((piece) => (
          <div
            key={piece.id}
            className="piece"
            style={{
              left: `${piece.left}%`,
              width: `${piece.size}px`,
              height: `${piece.size}px`,
              animationDuration: `${piece.duration}s`,
              animationDelay: `${piece.delay}s`,
              opacity: 0.72 * piece.opacity,
              ['--start-rotate' as any]: `${piece.startRotate}deg`,
              ['--end-rotate' as any]: `${piece.endRotate}deg`,
              ['--drift' as any]: `${piece.drift}px`,
            } as React.CSSProperties}
          >
            {renderPieceSvg(piece.type)}
          </div>
        ))}
      </div>

      <div
        ref={cardRef}
        className="contact-card"
        style={{ opacity: 0 }}
      >
        <div className="relative z-10 max-w-[864px] mx-auto">
          <h1 className="contact-h2 font-sans font-extrabold">
            Contact Us
          </h1>

          {status === 'success' ? (
            <div className="max-w-md mx-auto py-8 space-y-4 animate-in zoom-in-95 duration-300 text-center">
              <div className="w-16 h-16 rounded-full bg-[rgba(110,99,246,0.15)] border border-[rgba(110,99,246,0.3)] flex items-center justify-center text-[#7b6dff] mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="font-sans font-bold text-2xl text-white">Message Sent</h3>
                <p className="font-sans text-[var(--muted)] leading-relaxed">
                  Thank you for reaching out. Your default mail client has been opened with your message pre-filled.
                  We'll get back to you as soon as possible.
                </p>
              </div>
              <button
                onClick={handleReset}
                className="text-sm text-[var(--ice)] font-semibold hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>

              <div className="field font-sans">
                <label htmlFor="contact-email" className="contact-label">
                  Email
                </label>
                <input
                  type="email"
                  id="contact-email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError(validateEmail(e.target.value));
                  }}
                  placeholder="you@example.com"
                  className={`contact-input font-sans ${emailError ? 'error' : ''}`}
                />
                {emailError && (
                  <p className="text-sm text-red-400 mt-2 font-medium">{emailError}</p>
                )}
              </div>

              <div className="field font-sans">
                <label htmlFor="contact-message" className="contact-label">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  required
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (messageError) setMessageError(validateMessage(e.target.value));
                  }}
                  placeholder="Tell us how we can help you."
                  className={`contact-textarea font-sans ${messageError ? 'error' : ''}`}
                />
                {messageError && (
                  <p className="text-sm text-red-400 mt-2 font-medium">{messageError}</p>
                )}
              </div>

              {status === 'error' && (
                <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm mb-4">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  Something went wrong. Please try again or email us directly.
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="contact-btn font-sans flex items-center justify-center gap-2 disabled:opacity-75 disabled:pointer-events-none"
              >
                {status === 'submitting' ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message <span className="arrow font-sans font-black text-xl">→</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

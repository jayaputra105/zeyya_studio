import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZeyyaLogo } from './ZeyyaLogo';

export function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'exit'>('loading');
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const DURATION = 2800;

  useEffect(() => {
    const hasSeenLoading = sessionStorage.getItem('zeyya_has_seen_loading');
    if (hasSeenLoading) {
      setIsVisible(false);
      return;
    }

    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const pct = Math.min((elapsed / DURATION) * 100, 100);

      // Ease-out cubic for more natural feel
      const eased = 1 - Math.pow(1 - pct / 100, 3);
      setProgress(Math.round(eased * 100));

      if (elapsed < DURATION) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setProgress(100);
        setTimeout(() => {
          setPhase('exit');
          setTimeout(() => {
            setIsVisible(false);
            sessionStorage.setItem('zeyya_has_seen_loading', 'true');
          }, 900);
        }, 200);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0A0A0A] overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.08,
            filter: 'blur(24px)',
          }}
          transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Grid lines — Apple-style */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Horizontal lines */}
            {Array.from({ length: 9 }).map((_, i) => (
              <motion.div
                key={`h-${i}`}
                className="absolute left-0 right-0 h-px bg-white/[0.04]"
                style={{ top: `${(i + 1) * 10}%` }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 1.2, delay: i * 0.04, ease: 'easeOut' }}
              />
            ))}
            {/* Vertical lines */}
            {Array.from({ length: 9 }).map((_, i) => (
              <motion.div
                key={`v-${i}`}
                className="absolute top-0 bottom-0 w-px bg-white/[0.04]"
                style={{ left: `${(i + 1) * 10}%` }}
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                transition={{ duration: 1.2, delay: i * 0.04, ease: 'easeOut' }}
              />
            ))}
          </div>

          {/* Orange glow */}
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(255,107,0,0.12) 0%, transparent 70%)' }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />

          {/* Animated orange scanning line */}
          <motion.div
            className="absolute left-0 right-0 h-px pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent, #FF6B00, #FFB347, #FF6B00, transparent)' }}
            initial={{ top: '-2px', opacity: 0 }}
            animate={{ top: ['0%', '100%'], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2.8, ease: 'linear', repeat: 0, delay: 0.3 }}
          />

          {/* Logo + progress group */}
          <div className="relative flex flex-col items-center z-10">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20, filter: 'blur(16px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="relative mb-10"
            >
              {/* Logo glow ring */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at center, rgba(255,107,0,0.35) 0%, transparent 65%)',
                  filter: 'blur(20px)',
                  transform: 'scale(1.8)',
                }}
              />
              <ZeyyaLogo className="h-20 md:h-28 w-auto relative z-10 drop-shadow-[0_0_30px_rgba(255,107,0,0.5)]" />
            </motion.div>

            {/* Loading bar */}
            <motion.div
              className="w-48 md:w-64 relative"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {/* Track */}
              <div className="h-[2px] w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #FF6B00, #FFB347)',
                    width: `${progress}%`,
                    boxShadow: '0 0 12px rgba(255,107,0,0.8)',
                    transition: 'width 0.05s linear',
                  }}
                />
              </div>

              {/* Percentage */}
              <div className="flex justify-between items-center mt-3">
                <motion.p
                  className="text-[10px] text-white/30 font-mono uppercase tracking-[0.2em]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  Initializing
                </motion.p>
                <motion.p
                  className="text-[10px] font-bold font-mono tabular-nums"
                  style={{ color: '#FF6B00' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {progress}%
                </motion.p>
              </div>
            </motion.div>
          </div>

          {/* Bottom tagline */}
          <motion.p
            className="absolute bottom-10 text-[11px] text-white/20 tracking-[0.3em] uppercase font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            Digital Experience That Builds Trust
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

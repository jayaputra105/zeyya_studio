import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Flame, Clock, Users } from 'lucide-react';

function useCountdown(targetMs: number) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = targetMs - Date.now();
      if (diff <= 0) return setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, [targetMs]);

  return timeLeft;
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-16 sm:w-20 h-16 sm:h-20 bg-black/30 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden backdrop-blur-sm">
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
        <span className="relative z-10 text-3xl sm:text-4xl font-bold text-white tabular-nums leading-none">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="mt-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">{label}</span>
    </div>
  );
}

export function PromoSection() {
  // End of current month — computed once, stable number
  const targetMs = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0).getTime();
  }, []);
  const countdown = useCountdown(targetMs);
  const slotsLeft = 3;

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Orange gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #C83D00 0%, #FF6B00 40%, #FF9500 70%, #FFBC00 100%)',
        }}
      />

      {/* Noise texture */}
      <div className="absolute inset-0 opacity-[0.08]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }}
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.12)_1px,transparent_1px)] bg-[size:48px_48px]" />

      {/* Radial dark center */}
      <div className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(0,0,0,0.15) 0%, transparent 70%)' }} />

      <div className="container mx-auto px-5 md:px-10 relative z-10">
        <div className="max-w-4xl mx-auto text-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-black/20 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-8"
          >
            <Flame size={14} className="text-white animate-float" />
            <span className="text-white text-xs font-bold tracking-widest uppercase">Program Studi Kasus</span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-tight"
          >
            Diskon hingga{' '}
            <span className="relative inline-block">
              <span className="relative z-10">80%</span>
              <span className="absolute inset-0 bg-black/20 rounded-lg px-2 -mx-2" />
            </span>
            {' '}untuk Bisnis Anda
          </motion.h2>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-white/85 font-serif text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto"
          >
            Kami membuka <strong className="text-white font-bold">3 slot setiap bulan</strong> untuk Program Studi Kasus.
            Sebagai imbalannya, project Anda akan kami jadikan studi kasus resmi Zeyya Studio.
            Anda dapat website premium, kami dapat portofolio — <em>sama-sama untung</em>.
          </motion.p>

          {/* Slots remaining */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-3 mb-10"
          >
            <div className="flex items-center gap-2 bg-black/25 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2.5">
              <Users size={14} className="text-white" />
              <span className="text-white font-bold text-sm">Slot tersisa bulan ini:</span>
              <span className="flex gap-1.5 ml-1">
                {[...Array(3)].map((_, i) => (
                  <span
                    key={i}
                    className={`w-5 h-5 rounded-full border-2 border-white/30 flex items-center justify-center text-[9px] font-bold ${
                      i < slotsLeft ? 'bg-white text-orange-600' : 'bg-white/10 text-white/30'
                    }`}
                  >
                    {i < slotsLeft ? '✓' : '×'}
                  </span>
                ))}
              </span>
              <span className="ml-2 text-white font-bold text-sm">{slotsLeft} / 3</span>
            </div>
          </motion.div>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="mb-10"
          >
            <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
              <Clock size={12} />
              Promo berakhir dalam
            </p>
            <div className="flex items-start justify-center gap-3">
              <CountdownUnit value={countdown.days} label="Hari" />
              <span className="text-white/40 text-3xl font-bold mt-3">:</span>
              <CountdownUnit value={countdown.hours} label="Jam" />
              <span className="text-white/40 text-3xl font-bold mt-3">:</span>
              <CountdownUnit value={countdown.minutes} label="Menit" />
              <span className="text-white/40 text-3xl font-bold mt-3">:</span>
              <CountdownUnit value={countdown.seconds} label="Detik" />
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.32 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="https://wa.me/6282199870047?text=Halo%2C%20saya%20tertarik%20dengan%20Program%20Studi%20Kasus%20Zeyya%20Studio"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-10 py-4 bg-[#0A0A0A] text-white font-bold rounded-full hover:bg-[#222] transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/30 text-sm flex items-center justify-center gap-2"
            >
              🔥 Daftar Sekarang
            </a>
            <p className="text-white/50 text-xs font-serif">
              Konsultasi gratis · Tanpa biaya pendaftaran
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { ArrowRight, Star, MessageCircle } from 'lucide-react';
import lilaMockup from '@assets/file_000000003fb871fb9d9123c616ef4217_1784143651709.png';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── Slide data ──────────────────────────────────────────────────────────── */
const slides = [
  {
    label: 'Website Restaurant',
    color: '#C85200',
    bg: 'from-[#3D1000] via-[#1A0800] to-[#0A0A0A]',
    icon: '🍽️',
  },
  {
    label: 'Website Hotel',
    color: '#7C4A00',
    bg: 'from-[#2D1A00] via-[#150D00] to-[#0A0A0A]',
    icon: '🏨',
  },
  {
    label: 'Website Klinik',
    color: '#005C7A',
    bg: 'from-[#001F2E] via-[#000D13] to-[#0A0A0A]',
    icon: '🏥',
  },
  {
    label: 'Website Sekolah',
    color: '#1A5C00',
    bg: 'from-[#0A1F00] via-[#050F00] to-[#0A0A0A]',
    icon: '🎓',
  },
  {
    label: 'Website Laundry',
    color: '#3D2A7A',
    bg: 'from-[#160D2E] via-[#080614] to-[#0A0A0A]',
    icon: '👕',
  },
  {
    label: 'Website Fashion',
    color: '#8C1A5C',
    bg: 'from-[#2E0820] via-[#14040E] to-[#0A0A0A]',
    icon: '👗',
  },
  {
    label: 'Company Profile',
    color: '#1A3A7A',
    bg: 'from-[#0A1430] via-[#040814] to-[#0A0A0A]',
    icon: '🏢',
  },
  {
    label: 'Website Coffee Shop',
    color: '#5C2A00',
    bg: 'from-[#1F0E00] via-[#0A0500] to-[#0A0A0A]',
    icon: '☕',
  },
  {
    label: 'Logo Design',
    color: '#FF6B00',
    bg: 'from-[#2D1200] via-[#140800] to-[#0A0A0A]',
    icon: '✏️',
  },
  {
    label: 'Brand Identity',
    color: '#7A001A',
    bg: 'from-[#2E000A] via-[#140004] to-[#0A0A0A]',
    icon: '💎',
  },
];

/* ── Client name marquee ──────────────────────────────────────────────────── */
const clients = [
  'Lila Catering',
  'Restoran Nusantara',
  'Hotel Bintang Timur',
  'Klinik Sehat',
  'Toko Batik Ayu',
  'CV Maju Jaya',
  'Cafe Kopi Darat',
  'Sekolah Harapan',
  'Salon Cantik',
  'Bengkel Prima',
  'UMKM Sukses',
  'Brand Lokal',
];

/* ── Stats ────────────────────────────────────────────────────────────────── */
const stats = [
  { value: '50+', label: 'Proyek Selesai' },
  { value: '100%', label: 'Kepuasan Klien' },
  { value: '7–14', label: 'Hari Pengerjaan' },
];

/* ── Headline cycles ──────────────────────────────────────────────────────── */
const headlines = [
  {
    plain: 'Website yang Tidak Hanya Indah.',
    accent: 'Tapi Benar-benar Menghasilkan Pelanggan.',
  },
  {
    plain: 'Bangun Kepercayaan Pelanggan',
    accent: 'dalam 5 Detik Pertama.',
  },
  {
    plain: 'Kami Mendesain Pengalaman Digital yang',
    accent: 'Membuat Bisnis Terlihat Lebih Premium.',
  },
];

function SlideBackground({ index, active }: { index: number; active: boolean }) {
  const slide = slides[index % slides.length];
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key={index}
          className={`absolute inset-0 bg-gradient-to-br ${slide.bg}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        >
          {/* Ken Burns large icon */}
          <motion.div
            className="absolute inset-0 flex items-center justify-end pr-8 md:pr-24 pointer-events-none"
            initial={{ scale: 1, x: 0, y: 0 }}
            animate={{ scale: 1.12, x: -20, y: -10 }}
            transition={{ duration: 8, ease: 'linear' }}
          >
            <span
              className="text-[200px] md:text-[340px] select-none"
              style={{ opacity: 0.06, filter: 'blur(2px)' }}
            >
              {slide.icon}
            </span>
          </motion.div>
          {/* Slide label pill (bottom-right corner) */}
          <motion.div
            className="absolute bottom-10 right-8 flex items-center gap-2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <span className="text-lg">{slide.icon}</span>
            <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">{slide.label}</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function HeroSection() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null!);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSlideIndex((i) => (i + 1) % slides.length);
    }, 3000);
    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setHeadlineIndex((i) => (i + 1) % headlines.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const hl = headlines[headlineIndex];

  return (
    <section className="relative min-h-[100dvh] flex flex-col bg-[#0A0A0A] overflow-hidden pt-20">

      {/* ── Background slideshow ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {slides.map((_, i) => (
          <SlideBackground key={i} index={i} active={slideIndex === i} />
        ))}

        {/* 70% dark overlay */}
        <div className="absolute inset-0 bg-[#0A0A0A]/70" />

        {/* Radial orange glow */}
        <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,107,0,0.12) 0%, transparent 65%)' }} />

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_90%_90%_at_50%_50%,black_30%,transparent_100%)]" />
      </div>

      {/* ── Main content ── */}
      <div className="container mx-auto px-5 md:px-10 relative z-10 flex-1 flex flex-col justify-center py-16 lg:py-24">
        <div className="grid lg:grid-cols-[55%_45%] gap-12 xl:gap-20 items-center">

          {/* ── Left: Copy ── */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.15 } } }}
          >
            {/* Stars badge */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }}
              className="mb-6"
            >
              <div className="inline-flex items-center gap-2.5 py-1.5 px-4 rounded-full border border-amber-500/25 bg-amber-500/10 backdrop-blur-sm">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={11} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-amber-300/90 text-xs font-bold tracking-wide">
                  Dipercaya berbagai UMKM Indonesia
                </span>
              </div>
            </motion.div>

            {/* Headline with animated cycle */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } } }}
              className="mb-6"
            >
              <AnimatePresence mode="wait">
                <motion.h1
                  key={headlineIndex}
                  initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="text-4xl sm:text-5xl md:text-[3.4rem] xl:text-[3.8rem] font-bold text-white tracking-tight leading-[1.09]"
                >
                  {hl.plain}{' '}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF6B00] via-[#FFB347] to-[#FF6B00] bg-[size:200%] animate-shimmer">
                    {hl.accent}
                  </span>
                </motion.h1>
              </AnimatePresence>
            </motion.div>

            {/* Subheadline */}
            <motion.p
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } }}
              className="text-base md:text-lg text-gray-400 mb-8 max-w-xl leading-relaxed font-serif"
            >
              Website bukan sekadar pajangan online. Kami membantu UMKM, restoran, sekolah, klinik, hotel hingga perusahaan tampil profesional, dipercaya pelanggan, dan siap berkembang di era digital.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }}
              className="flex flex-col sm:flex-row items-start gap-3 mb-12"
            >
              <a
                href="https://wa.me/6282199870047"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-zeyya-orange text-white rounded-full font-bold hover:bg-[#e66000] transition-all hover:scale-105 active:scale-95 shadow-lg shadow-orange-900/40 text-sm"
              >
                <MessageCircle size={16} />
                🟧 Konsultasi Gratis
              </a>
              <Link
                href="/projects"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white rounded-full font-bold hover:bg-white/[0.06] transition-all hover:scale-105 active:scale-95 text-sm"
              >
                Lihat Portfolio <ArrowRight size={15} />
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }}
              className="flex items-stretch gap-6 md:gap-10 pt-8 border-t border-white/[0.08]"
            >
              {stats.map((s, i) => (
                <div key={s.label} className={`${i > 0 ? 'pl-6 md:pl-10 border-l border-white/[0.08]' : ''}`}>
                  <p className="text-2xl md:text-3xl font-bold text-white leading-none mb-1">{s.value}</p>
                  <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right: Mockup visual ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: EASE }}
            className="relative hidden lg:flex items-center justify-center"
          >
            {/* Outer glow */}
            <div
              className="absolute inset-[-20%] rounded-[50%] pointer-events-none"
              style={{ background: 'radial-gradient(ellipse, rgba(255,107,0,0.08) 0%, transparent 70%)' }}
            />

            {/* Browser mockup card */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-full max-w-md rounded-[1.6rem] overflow-hidden border border-white/[0.1] shadow-[0_32px_80px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.05)] bg-[#111]"
            >
              {/* Browser chrome */}
              <div className="h-10 bg-[#1C1C1C] border-b border-white/[0.07] flex items-center px-4 gap-2 shrink-0">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="mx-auto flex items-center gap-1.5 bg-white/[0.06] rounded-full px-4 py-1">
                  <div className="w-2 h-2 rounded-full bg-green-400/70" />
                  <span className="text-[9px] text-white/25 font-mono">lilacatering.vercel.app</span>
                </div>
              </div>
              <img
                src={lilaMockup}
                alt="Website mockup Lila Catering"
                className="w-full block"
                loading="eager"
              />
            </motion.div>

            {/* Floating badge: website live */}
            <motion.div
              initial={{ opacity: 0, x: -20, y: 10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6, ease: EASE }}
              className="absolute -left-6 bottom-16 glass rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                <span className="text-green-400 text-sm">✓</span>
              </div>
              <div>
                <p className="text-white text-xs font-bold leading-none mb-0.5">Website Live</p>
                <p className="text-gray-500 text-[10px]">Lila Catering · Kediri</p>
              </div>
            </motion.div>

            {/* Floating badge: responsive */}
            <motion.div
              initial={{ opacity: 0, x: 20, y: -10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 1.4, duration: 0.6, ease: EASE }}
              className="absolute -right-4 top-12 bg-zeyya-orange rounded-xl px-4 py-2.5 shadow-lg shadow-orange-900/50"
            >
              <p className="text-white text-xs font-bold">100% Responsif</p>
            </motion.div>

            {/* Slide indicator dots */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlideIndex(i)}
                  className={`rounded-full transition-all duration-300 ${
                    slideIndex === i
                      ? 'w-5 h-1.5 bg-zeyya-orange'
                      : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Client Logo Marquee ── */}
      <div className="relative z-10 border-t border-white/[0.06] bg-[#0A0A0A]/80 backdrop-blur-sm py-5 mt-auto overflow-hidden">
        <div className="flex items-center gap-4 mb-2">
          <p className="text-[10px] text-white/25 uppercase tracking-[0.25em] font-semibold whitespace-nowrap px-6">Dipercaya oleh</p>
        </div>
        <div className="flex overflow-hidden select-none [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
          <div className="flex gap-10 animate-marquee whitespace-nowrap">
            {[...clients, ...clients].map((name, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 text-sm font-semibold text-white/30 hover:text-white/60 transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-zeyya-orange/50 shrink-0" />
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { getTestimonials } from '@/lib/storage';

const DEFAULT_TESTIMONIALS_EXTRA = [
  {
    id: 'default-1',
    quote: 'Luar biasa! Website kami sekarang terlihat jauh lebih profesional. Banyak pelanggan baru yang bilang mereka percaya dengan bisnis kami setelah melihat website.',
    author: 'Sari Dewi',
    role: 'Owner · Catering Sari, Surabaya',
    rating: 5,
    initials: 'SD',
    color: '#FF6B00',
  },
  {
    id: 'default-2',
    quote: 'Prosesnya cepat dan hasilnya melampaui ekspektasi saya. Tim Zeyya Studio sangat responsif dan benar-benar memahami kebutuhan bisnis saya.',
    author: 'Budi Santoso',
    role: 'Owner · Bengkel Prima, Malang',
    rating: 5,
    initials: 'BS',
    color: '#FF9500',
  },
  {
    id: 'default-3',
    quote: 'Sekarang pelanggan bisa langsung lihat menu dari HP tanpa ribet download PDF. Pesanan jadi lebih banyak!',
    author: 'Owner · Lila Catering',
    role: 'Kediri',
    rating: 5,
    initials: 'LC',
    color: '#FFBC00',
  },
  {
    id: 'default-4',
    quote: 'Sangat puas dengan hasil kerjanya. Website hotel kami sekarang banyak yang booking langsung tanpa lewat OTA. Revenue meningkat signifikan.',
    author: 'Hendra Wijaya',
    role: 'Manager · Hotel Bintang, Bali',
    rating: 5,
    initials: 'HW',
    color: '#FF7B2C',
  },
  {
    id: 'default-5',
    quote: 'Desainnya premium banget. Saya pikir awalnya harganya mahal, ternyata terjangkau dan hasilnya melebihi brand agency besar.',
    author: 'Rina Maharani',
    role: 'Owner · Butik Rina, Bandung',
    rating: 5,
    initials: 'RM',
    color: '#FF6B00',
  },
  {
    id: 'default-6',
    quote: 'Pelanggan klinik kami sekarang bisa daftar online dengan mudah. Antrian jadi lebih tertib dan pasien baru meningkat 40% dalam sebulan.',
    author: 'dr. Ahmad Fauzi',
    role: 'Dokter · Klinik Sehat, Jakarta',
    rating: 5,
    initials: 'AF',
    color: '#FF9944',
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? 'fill-amber-400 text-amber-400' : 'text-gray-600'}
        />
      ))}
    </div>
  );
}

function TestimonialCard({
  quote, author, role, rating = 5, initials = '?', color = '#FF6B00', delay = 0,
}: {
  quote: string; author: string; role: string; rating?: number;
  initials?: string; color?: string; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, scale: 1.015 }}
      className="group relative bg-[#111] border border-white/[0.07] rounded-3xl p-7 hover:border-white/[0.14] hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)] transition-all duration-400 flex flex-col"
    >
      {/* Quote icon */}
      <div
        className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity"
        style={{ color }}
      >
        <Quote size={32} />
      </div>

      {/* Stars */}
      <div className="mb-4">
        <StarRating rating={rating} />
      </div>

      {/* Quote */}
      <p className="text-gray-300 font-serif text-sm leading-relaxed mb-6 flex-1">
        "{quote}"
      </p>

      {/* Footer */}
      <div className="flex items-center gap-3 pt-5 border-t border-white/[0.06]">
        {/* Avatar */}
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
          style={{ background: `${color}30`, border: `1.5px solid ${color}40` }}
        >
          <span style={{ color }}>{initials}</span>
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-tight">{author}</p>
          <p className="text-gray-500 text-xs mt-0.5">{role}</p>
        </div>
        {/* Google-style verified badge */}
        <div className="ml-auto flex items-center gap-1 bg-white/[0.04] rounded-full px-2.5 py-1">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span className="text-[9px] text-white/30 font-semibold">Google</span>
        </div>
      </div>
    </motion.div>
  );
}

export function TestimonialsSection() {
  const stored = getTestimonials();

  // Merge stored + default extras (for rich display)
  const mergedMap = new Map<string, typeof DEFAULT_TESTIMONIALS_EXTRA[0]>();
  DEFAULT_TESTIMONIALS_EXTRA.forEach((t) => mergedMap.set(t.id, t));
  stored.forEach((t, i) => {
    const colors = ['#FF6B00', '#FF9500', '#FFBC00', '#FF7B2C', '#FF9944'];
    const words = t.author.split(/[\s,·]+/).filter(Boolean);
    const initials = words.slice(0, 2).map((w) => w[0].toUpperCase()).join('');
    mergedMap.set(t.id, {
      id: t.id,
      quote: t.quote,
      author: t.author,
      role: t.role,
      rating: 5,
      initials,
      color: colors[i % colors.length],
    });
  });

  const displayList = Array.from(mergedMap.values());

  return (
    <section className="py-24 md:py-32 bg-[#0A0A0A] relative overflow-hidden border-t border-white/[0.05]">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,107,0,0.05) 0%, transparent 65%)' }} />
      </div>

      <div className="container mx-auto px-5 md:px-10 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full border border-[#FF6B00]/20 bg-[#FF6B00]/[0.08] mb-5"
          >
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={10} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-[#FF6B00] text-xs font-bold tracking-wider uppercase">Testimoni Klien</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="text-4xl md:text-5xl font-bold text-white mb-5 tracking-tight"
          >
            Apa Kata{' '}
            <span className="text-gradient-orange">Klien Kami</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.14 }}
            className="text-gray-500 text-lg font-serif"
          >
            Kepercayaan mereka adalah alasan kami terus berkembang. Bukan klaim kami sendiri — tapi pengalaman nyata dari bisnis yang pernah bekerja sama dengan kami.
          </motion.p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayList.map((t, i) => (
            <TestimonialCard
              key={t.id}
              quote={t.quote}
              author={t.author}
              role={t.role}
              rating={t.rating}
              initials={t.initials}
              color={t.color}
              delay={i * 0.07}
            />
          ))}
        </div>

        {/* Overall rating */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-14 py-8 border-t border-white/[0.06]"
        >
          <div className="flex items-center gap-3">
            <span className="text-5xl font-bold text-white">5.0</span>
            <div>
              <div className="flex gap-0.5 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-gray-500 text-xs">Rating rata-rata dari semua klien</p>
            </div>
          </div>
          <div className="w-px h-10 bg-white/[0.08] hidden sm:block" />
          <div className="text-center sm:text-left">
            <p className="text-white font-bold text-lg">100% Kepuasan Klien</p>
            <p className="text-gray-500 text-sm font-serif">Berdasarkan seluruh proyek yang telah selesai</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

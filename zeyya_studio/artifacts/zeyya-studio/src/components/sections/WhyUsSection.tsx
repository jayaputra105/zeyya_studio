import { motion } from 'framer-motion';
import { Sparkles, Clock, Smartphone, Search, HeadphonesIcon, Target, Award, Users, Zap } from 'lucide-react';

const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

interface BentoItem {
  title: string;
  description: string;
  icon: React.ElementType;
  span?: 'wide' | 'tall' | 'normal';
  highlight?: boolean;
}

const bentoItems: BentoItem[] = [
  {
    title: 'Desain Premium',
    description: 'Website yang membuat bisnis Anda terlihat lebih profesional sejak pelanggan pertama kali membuka halaman.',
    icon: Sparkles,
    span: 'wide',
    highlight: true,
  },
  {
    title: 'Pengerjaan Cepat',
    description: '7–14 hari kerja. Deadline selalu tepat waktu, tanpa drama.',
    icon: Clock,
  },
  {
    title: 'Mobile First',
    description: 'Tampil sempurna di semua perangkat. 80% pengunjung datang dari HP.',
    icon: Smartphone,
  },
  {
    title: 'SEO Ready',
    description: 'Mudah ditemukan di Google sejak hari pertama diluncurkan.',
    icon: Search,
    span: 'wide',
  },
  {
    title: 'Support Responsif',
    description: 'Selalu ada saat dibutuhkan. Support teknis 30 hari setelah live.',
    icon: HeadphonesIcon,
  },
  {
    title: 'Fokus Bisnis Anda',
    description: 'Solusi yang dirancang spesifik sesuai kebutuhan dan target pelanggan bisnis Anda.',
    icon: Target,
  },
  {
    title: 'Kualitas Terjamin',
    description: 'Revisi hingga puas. Kami tidak selesai sampai Anda bangga.',
    icon: Award,
    span: 'wide',
    highlight: true,
  },
  {
    title: 'Tim Berpengalaman',
    description: 'Developer dan desainer yang telah membantu puluhan UMKM bertransformasi digital.',
    icon: Users,
  },
  {
    title: 'Teknologi Terkini',
    description: 'React, Next.js, Tailwind, Vercel — stack yang sama dipakai perusahaan global.',
    icon: Zap,
  },
];

function BentoCard({ title, description, icon: Icon, span, highlight, delay }: BentoItem & { delay: number }) {
  return (
    <motion.div
      variants={item}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, scale: 1.012 }}
      className={`group relative rounded-3xl p-7 overflow-hidden border transition-all duration-400 ${
        highlight
          ? 'bg-gradient-to-br from-[#FF6B00]/20 via-[#FF6B00]/10 to-[#1C1208] border-[#FF6B00]/20 hover:border-[#FF6B00]/40'
          : 'bg-white/[0.04] border-white/[0.07] hover:bg-white/[0.07] hover:border-white/[0.12]'
      } ${span === 'wide' ? 'md:col-span-2' : ''}`}
      style={{ minHeight: 170 }}
    >
      {/* Glow on hover */}
      <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
        highlight ? 'bg-[#FF6B00]/[0.06]' : 'bg-white/[0.03]'
      }`} />

      <div
        className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${
          highlight ? 'bg-[#FF6B00]/25 border border-[#FF6B00]/40' : 'bg-white/[0.07] border border-white/[0.1]'
        }`}
      >
        <Icon size={20} className={highlight ? 'text-[#FF6B00]' : 'text-white/70 group-hover:text-white'} />
      </div>

      <h3 className="text-white font-bold text-lg mb-2 leading-tight">{title}</h3>
      <p className={`text-sm leading-relaxed font-serif ${highlight ? 'text-white/60' : 'text-white/40 group-hover:text-white/60'} transition-colors`}>
        {description}
      </p>

      {/* Corner decoration */}
      {highlight && (
        <div className="absolute top-5 right-5 w-16 h-16 rounded-full border border-[#FF6B00]/20 animate-spin-slow pointer-events-none" />
      )}
    </motion.div>
  );
}

export function WhyUsSection() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0F0A07 0%, #1A0E07 40%, #0F0A07 100%)' }}>
      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,107,0,0.06) 0%, transparent 65%)' }} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:64px_64px]" />
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
            <span className="text-[#FF6B00] text-xs font-bold tracking-wider uppercase">Kenapa Memilih Kami</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="text-4xl md:text-5xl font-bold text-white mb-5 tracking-tight"
          >
            Lebih dari Sekadar{' '}
            <span className="text-gradient-orange">Penyedia Jasa</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.14 }}
            className="text-white/50 text-lg font-serif"
          >
            Kami adalah partner pertumbuhan bisnis Anda — bukan vendor yang hilang begitu proyek selesai.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {bentoItems.map((item, i) => (
            <BentoCard key={item.title} {...item} delay={i * 0.05} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

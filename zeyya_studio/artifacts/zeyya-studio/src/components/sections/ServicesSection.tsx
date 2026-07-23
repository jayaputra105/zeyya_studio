import { motion } from 'framer-motion';
import {
  MonitorSmartphone, PenTool, TrendingUp, Layers,
  Search, Wrench, HardDrive, Globe, Palette,
} from 'lucide-react';

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } },
};

interface ServiceCard {
  title: string;
  description: string;
  icon: React.ElementType;
  accent: string;
  size?: 'wide' | 'tall' | 'normal';
}

const services: ServiceCard[] = [
  {
    title: 'Website Development',
    description: 'Website modern, cepat, dan mobile-friendly yang mengkonversi pengunjung menjadi pelanggan nyata — bukan sekadar tampilan.',
    icon: MonitorSmartphone,
    accent: '#FF6B00',
    size: 'wide',
  },
  {
    title: 'Logo Design',
    description: 'Logo yang bercerita, dikenali, dan membangun kepercayaan sejak pandangan pertama.',
    icon: PenTool,
    accent: '#FF9500',
    size: 'normal',
  },
  {
    title: 'Brand Identity',
    description: 'Identitas brand yang konsisten dari warna, tipografi, hingga tone of voice.',
    icon: Palette,
    accent: '#FFBC00',
    size: 'normal',
  },
  {
    title: 'Social Media Marketing',
    description: 'Strategi konten digital yang tepat sasaran untuk meningkatkan jangkauan dan mendorong penjualan.',
    icon: TrendingUp,
    accent: '#FF6B00',
    size: 'wide',
  },
  {
    title: 'UI/UX Design',
    description: 'Desain antarmuka yang intuitif, nyaman digunakan, dan meningkatkan konversi.',
    icon: Layers,
    accent: '#FF8C42',
    size: 'normal',
  },
  {
    title: 'SEO Optimization',
    description: 'Mudah ditemukan di Google. Website Anda muncul saat calon pelanggan mencari.',
    icon: Search,
    accent: '#FFB347',
    size: 'normal',
  },
  {
    title: 'Maintenance',
    description: 'Perawatan rutin agar website selalu cepat, aman, dan up-to-date.',
    icon: Wrench,
    accent: '#FF7B2C',
    size: 'normal',
  },
  {
    title: 'Hosting',
    description: 'Server cepat dan stabil. Website Anda online 24/7 tanpa gangguan.',
    icon: HardDrive,
    accent: '#FF9944',
    size: 'normal',
  },
  {
    title: 'Domain',
    description: 'Alamat digital profesional yang mudah diingat dan mencerminkan brand Anda.',
    icon: Globe,
    accent: '#FFAA33',
    size: 'normal',
  },
];

interface CardProps extends ServiceCard {
  index: number;
}

function ServiceBentoCard({ title, description, icon: Icon, accent, size, index }: CardProps) {
  const isWide = size === 'wide';

  return (
    <motion.a
      href="https://wa.me/6282199870047"
      target="_blank"
      rel="noreferrer"
      variants={item}
      whileHover={{ y: -6, scale: 1.015 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`group relative bg-white border border-gray-100 rounded-3xl p-7 overflow-hidden hover:border-[#FF6B00]/20 hover:shadow-[0_20px_60px_rgba(255,107,0,0.08)] transition-all duration-400 cursor-pointer flex flex-col justify-between ${
        isWide ? 'md:col-span-2' : ''
      }`}
      style={{ minHeight: isWide ? 190 : 200 }}
    >
      {/* Background glow on hover */}
      <div
        className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${accent}18 0%, transparent 70%)` }}
      />

      {/* Top: icon + title */}
      <div>
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
          style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}
        >
          <Icon size={22} style={{ color: accent }} />
        </div>
        <h3 className="text-[#0A0A0A] font-bold text-lg mb-2 leading-tight">{title}</h3>
        <p className="text-gray-500 font-serif text-sm leading-relaxed">{description}</p>
      </div>

      {/* Bottom: CTA link */}
      <div className="mt-5 flex items-center gap-1.5">
        <span
          className="text-xs font-bold transition-colors duration-200 group-hover:gap-2"
          style={{ color: accent }}
        >
          Pelajari lebih →
        </span>
      </div>

      {/* Corner accent */}
      <div
        className="absolute bottom-0 right-0 w-20 h-20 rounded-tl-[3rem] opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-300"
        style={{ background: accent }}
      />
    </motion.a>
  );
}

export function ServicesSection() {
  return (
    <section id="layanan" className="py-24 md:py-32 bg-[#F7F5F2] relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.025)_1px,transparent_1px)] bg-[size:48px_48px]" />

      <div className="container mx-auto px-5 md:px-10 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full border border-[#FF6B00]/25 bg-[#FF6B00]/10 mb-5"
          >
            <span className="text-[#FF6B00] text-xs font-bold tracking-wider uppercase">Layanan Kami</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="text-4xl md:text-5xl font-bold text-[#0A0A0A] mb-5 tracking-tight"
          >
            Solusi Digital{' '}
            <span className="text-gradient-orange">End-to-End</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.14 }}
            className="text-gray-500 text-lg font-serif leading-relaxed"
          >
            Kesan pertama menentukan keputusan pelanggan. Kami mendesain setiap elemen digital Anda agar membangun kepercayaan bahkan sebelum mereka menghubungi Anda.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {services.map((service, i) => (
            <ServiceBentoCard key={service.title} {...service} index={i} />
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-14"
        >
          <a
            href="https://wa.me/6282199870047"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#0A0A0A] text-white font-bold rounded-full hover:bg-[#222] transition-all hover:scale-105 active:scale-95 text-sm shadow-lg"
          >
            Diskusikan Kebutuhan Anda
            <span className="text-zeyya-orange">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

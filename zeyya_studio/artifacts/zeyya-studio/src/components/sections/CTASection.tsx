import { motion } from 'framer-motion';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

export function CTASection() {
  return (
    <section className="py-24 md:py-32 bg-[#0A0A0A] relative overflow-hidden">
      {/* Layered background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,107,0,0.14) 0%, transparent 65%)' }} />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,107,0,0.06) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(100,50,200,0.04) 0%, transparent 70%)' }} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="container mx-auto px-5 md:px-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl mx-auto text-center"
        >
          {/* Label */}
          <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full border border-[#FF6B00]/25 bg-[#FF6B00]/[0.08] mb-8">
            <span className="text-[#FF6B00] text-xs font-bold tracking-wider uppercase">Mulai Sekarang</span>
          </div>

          {/* Big headline */}
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-[1.06]">
            Mari Bangun Website{' '}
            <span className="relative inline-block">
              <span className="text-gradient-orange">yang Layak</span>
              <br />
              <span className="text-gradient-orange">Dibanggakan.</span>
            </span>
          </h2>

          {/* Sub */}
          <p className="text-lg md:text-xl text-white/50 mb-12 font-serif max-w-2xl mx-auto leading-relaxed">
            Konsultasi gratis, tanpa syarat, tanpa tekanan.{' '}
            <span className="text-white/70">Ceritakan kebutuhan bisnis Anda dan kami akan bantu mewujudkannya.</span>
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a
              href="https://wa.me/6282199870047?text=Halo%2C%20saya%20ingin%20konsultasi%20pembuatan%20website"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-[#FF6B00] text-white rounded-full font-bold hover:bg-[#e66000] transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-orange-900/40 text-base"
            >
              <MessageCircle size={20} />
              Konsultasi via WhatsApp
            </a>
            <Link
              href="/projects"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-5 border border-white/15 text-white rounded-full font-bold hover:bg-white/[0.06] transition-all hover:scale-105 active:scale-95 text-base group"
            >
              Lihat Portfolio <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Trust line */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-white/25 text-xs font-semibold uppercase tracking-widest">
            <span className="flex items-center gap-1.5">
              <span className="text-[#FF6B00]">✓</span> 100% Kepuasan
            </span>
            <span className="w-1 h-1 rounded-full bg-white/10" />
            <span className="flex items-center gap-1.5">
              <span className="text-[#FF6B00]">✓</span> Tanpa Biaya Tersembunyi
            </span>
            <span className="w-1 h-1 rounded-full bg-white/10" />
            <span className="flex items-center gap-1.5">
              <span className="text-[#FF6B00]">✓</span> Revisi Sampai Puas
            </span>
            <span className="w-1 h-1 rounded-full bg-white/10" />
            <span className="flex items-center gap-1.5">
              <span className="text-[#FF6B00]">✓</span> Support 30 Hari
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

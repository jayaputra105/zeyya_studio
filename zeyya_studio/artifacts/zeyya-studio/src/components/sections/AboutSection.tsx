import { motion } from 'framer-motion';

const tags = ['Desain Premium', 'Fast Delivery', 'Mobile-First', 'SEO Ready', 'Revisi Sampai Puas', 'Support Penuh'];

export function AboutSection() {
  return (
    <section id="tentang" className="py-24 md:py-32 bg-[#F7F5F2] relative overflow-hidden">
      {/* Subtle bg texture */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:56px_56px]" />

      <div className="container mx-auto px-5 md:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-7"
          >
            <div>
              <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full border border-[#FF6B00]/25 bg-[#FF6B00]/10 mb-6">
                <span className="text-[#FF6B00] text-xs font-bold tracking-wider uppercase">Tentang Kami</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#0A0A0A] leading-tight tracking-tight">
                Bukan Sekadar <br />
                <span className="relative inline-block">
                  Penyedia Jasa
                  <div className="absolute -bottom-1 left-0 w-full h-[3px] bg-gradient-to-r from-[#FF6B00] to-transparent rounded-full" />
                </span>
              </h2>
            </div>

            <p className="text-lg text-gray-600 leading-relaxed font-serif">
              Kami percaya bahwa setiap bisnis — besar maupun kecil — berhak memiliki representasi digital yang premium dan membangun kepercayaan. Zeyya Studio lahir dari keinginan untuk menjembatani kesenjangan tersebut.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed font-serif">
              Sebagai partner digital UMKM, kami tidak hanya membuatkan website lalu pergi. Kami membangun pondasi, merancang identitas, dan memastikan aset digital Anda <strong className="text-[#0A0A0A] font-semibold">benar-benar bekerja</strong> untuk kemajuan bisnis Anda.
            </p>

            <div className="flex flex-wrap gap-2.5 pt-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-white border border-gray-200 text-sm font-semibold text-[#0A0A0A] rounded-full shadow-sm hover:border-[#FF6B00]/40 hover:bg-[#FF6B00]/5 transition-all cursor-default"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right: Visual card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-[480px] lg:h-[540px]"
          >
            {/* Orange offset shadow card */}
            <div className="absolute inset-4 bg-[#FF6B00]/15 rounded-3xl transform translate-x-4 translate-y-4" />

            {/* Main card */}
            <div className="absolute inset-0 bg-[#0A0A0A] rounded-3xl overflow-hidden border border-white/10 flex flex-col">
              {/* Top bar */}
              <div className="h-10 border-b border-white/[0.06] flex items-center px-5 gap-2 shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              </div>

              {/* Content visualization */}
              <div className="flex-1 p-8 flex flex-col justify-between">
                {/* Fake browser content */}
                <div className="space-y-4">
                  <div className="h-8 bg-[#FF6B00] rounded-xl w-1/3" />
                  <div className="space-y-2">
                    <div className="h-3 bg-white/10 rounded-full w-full" />
                    <div className="h-3 bg-white/10 rounded-full w-5/6" />
                    <div className="h-3 bg-white/10 rounded-full w-4/6" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-[#FF6B00]/30 transition-colors">
                    <div className="text-3xl font-bold text-white mb-1">50+</div>
                    <div className="text-xs text-white/40 font-serif">Proyek selesai</div>
                  </div>
                  <div className="bg-[#FF6B00]/15 border border-[#FF6B00]/20 rounded-2xl p-5">
                    <div className="text-3xl font-bold text-[#FF6B00] mb-1">100%</div>
                    <div className="text-xs text-white/40 font-serif">Kepuasan klien</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <div className="text-3xl font-bold text-white mb-1">7–14</div>
                    <div className="text-xs text-white/40 font-serif">Hari selesai</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <div className="text-3xl font-bold text-white mb-1">24/7</div>
                    <div className="text-xs text-white/40 font-serif">Support aktif</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative ring */}
            <div className="absolute -top-8 -right-8 w-36 h-36 border border-[#FF6B00]/15 rounded-full pointer-events-none" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}

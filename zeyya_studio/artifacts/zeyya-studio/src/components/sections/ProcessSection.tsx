import { motion } from 'framer-motion';

const steps = [
  {
    num: '01',
    title: 'Konsultasi Gratis',
    description: 'Diskusi kebutuhan, tujuan bisnis, dan target pelanggan Anda. Gratis, tanpa syarat.',
    color: '#FF6B00',
  },
  {
    num: '02',
    title: 'Analisis & Riset',
    description: 'Riset mendalam tentang bisnis, kompetitor, dan tren industri Anda untuk strategi terbaik.',
    color: '#FF9500',
  },
  {
    num: '03',
    title: 'Desain & Mockup',
    description: 'Mockup visual yang sesuai brand Anda. Anda review dan berikan feedback sebelum development.',
    color: '#FFBC00',
  },
  {
    num: '04',
    title: 'Development',
    description: 'Pembangunan website dengan teknologi terkini — cepat, aman, dan SEO-friendly.',
    color: '#FF8C42',
  },
  {
    num: '05',
    title: 'Revisi & Testing',
    description: 'Penyempurnaan berdasarkan feedback Anda. Testing di berbagai perangkat dan browser.',
    color: '#FF7B2C',
  },
  {
    num: '06',
    title: 'Launch & Support',
    description: 'Website resmi diluncurkan! Kami dampingi dengan support teknis 30 hari setelah live.',
    color: '#FF6B00',
  },
];

export function ProcessSection() {
  return (
    <section className="py-24 md:py-32 bg-[#F7F5F2] relative">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:48px_48px]" />

      <div className="container mx-auto px-5 md:px-10 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full border border-[#FF6B00]/25 bg-[#FF6B00]/10 mb-5"
          >
            <span className="text-[#FF6B00] text-xs font-bold tracking-wider uppercase">Proses Kerja</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="text-4xl md:text-5xl font-bold text-[#0A0A0A] mb-5 tracking-tight"
          >
            Dari Konsultasi{' '}
            <span className="text-gradient-orange">Hingga Launch</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.14 }}
            className="text-gray-500 text-lg font-serif"
          >
            Proses transparan yang membuat Anda selalu tahu perkembangan project tanpa harus bertanya.
          </motion.p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.08, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6 }}
              className="group relative bg-white border border-gray-100 rounded-3xl p-8 hover:border-[#FF6B00]/20 hover:shadow-[0_20px_50px_rgba(255,107,0,0.07)] transition-all duration-400"
            >
              {/* Step number */}
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 font-bold text-lg transition-all duration-300 group-hover:scale-110"
                style={{
                  background: `${step.color}18`,
                  border: `1.5px solid ${step.color}35`,
                  color: step.color,
                }}
              >
                {step.num}
              </div>

              <h3 className="text-[#0A0A0A] font-bold text-xl mb-3">{step.title}</h3>
              <p className="text-gray-500 font-serif text-sm leading-relaxed">{step.description}</p>

              {/* Connector arrow (not on last items) */}
              {i < steps.length - 1 && (
                <div
                  className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full hidden lg:flex items-center justify-center text-[10px] z-10"
                  style={{ background: `${step.color}20`, color: step.color }}
                >
                  →
                </div>
              )}
            </motion.div>
          ))}
        </div>

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
            className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#FF6B00] text-white font-bold rounded-full hover:bg-[#e66000] transition-all hover:scale-105 active:scale-95 text-sm shadow-lg shadow-orange-900/20"
          >
            💬 Mulai Konsultasi Gratis
          </a>
        </motion.div>
      </div>
    </section>
  );
}

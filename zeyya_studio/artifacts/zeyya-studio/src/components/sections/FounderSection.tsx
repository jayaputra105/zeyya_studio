import { motion } from 'framer-motion';
import founderPhoto from '@assets/file_00000000813871fa81416b1c64500f9a_1784139312499.png';

export function FounderSection() {
  return (
    <section className="py-24 md:py-32 bg-[#F7F5F2] relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:56px_56px]" />

      <div className="container mx-auto px-5 md:px-10 relative z-10">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full border border-[#FF6B00]/25 bg-[#FF6B00]/10 mb-5">
            <span className="text-[#FF6B00] text-xs font-bold tracking-wider uppercase">Tim Kami</span>
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-[#0A0A0A] mb-4 tracking-tight"
          >
            Orang di Balik{' '}
            <span className="text-gradient-orange">Zeyya Studio</span>
          </motion.h2>
        </div>

        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full md:w-2/5 shrink-0 relative"
          >
            <div className="absolute inset-4 bg-[#FF6B00] rounded-3xl opacity-10 transform translate-x-3 translate-y-3" />
            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] border border-gray-200 bg-[#1A1A1A]">
              <img
                src={founderPhoto}
                alt="Jaya Putra Syaipul — Founder Zeyya Studio"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full md:w-3/5 space-y-6"
          >
            <div>
              <h3 className="text-3xl font-bold text-[#0A0A0A]">Jaya Putra Syaipul</h3>
              <p className="text-[#FF6B00] font-bold tracking-widest uppercase text-xs mt-2">
                Founder & Fullstack Developer
              </p>
            </div>

            <p className="text-gray-600 font-serif leading-relaxed text-lg">
              "Seorang developer muda yang bersemangat membantu UMKM Indonesia bertumbuh melalui solusi digital modern. Berpengalaman dalam membangun website profesional yang tidak hanya terlihat bagus, tapi juga <strong className='text-[#0A0A0A] font-semibold'>benar-benar menghasilkan</strong>."
            </p>

            <p className="text-gray-600 font-serif leading-relaxed text-lg">
              Zeyya Studio didirikan dengan satu visi: memberikan UMKM akses ke teknologi yang sama yang digunakan oleh brand-brand global — dengan harga yang terjangkau dan tanpa kerumitan teknis.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              {['Fullstack Dev', 'UI/UX', 'SEO', 'Brand Strategy', 'React & Next.js'].map((skill) => (
                <span
                  key={skill}
                  className="px-4 py-2 bg-white border border-gray-200 text-sm font-semibold text-[#0A0A0A] rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

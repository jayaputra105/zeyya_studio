import { motion } from 'framer-motion';
import { Globe, ExternalLink } from 'lucide-react';

// Static domain data (can be made admin-editable later via storage.ts)
const domains = [
  { tld: '.com', price: 'Rp 180.000', period: '/tahun', popular: true, desc: 'Paling dikenal global' },
  { tld: '.id', price: 'Rp 340.000', period: '/tahun', popular: false, desc: 'Identitas Indonesia' },
  { tld: '.co.id', price: 'Rp 350.000', period: '/tahun', popular: false, desc: 'Bisnis resmi' },
  { tld: '.my.id', price: 'Rp 30.000', period: '/tahun', popular: false, desc: 'Pribadi & UMKM' },
  { tld: '.web.id', price: 'Rp 65.000', period: '/tahun', popular: false, desc: 'Website umum' },
  { tld: '.sch.id', price: 'Rp 250.000', period: '/tahun', popular: false, desc: 'Sekolah & pendidikan' },
  { tld: '.biz.id', price: 'Rp 80.000', period: '/tahun', popular: false, desc: 'Bisnis lokal' },
  { tld: '.online', price: 'Rp 95.000', period: '/tahun', popular: false, desc: 'Fleksibel & modern' },
  { tld: '.store', price: 'Rp 120.000', period: '/tahun', popular: false, desc: 'Toko online' },
  { tld: '.tech', price: 'Rp 145.000', period: '/tahun', popular: false, desc: 'Startup & teknologi' },
];

export function DomainPricingSection() {
  return (
    <section id="domain" className="py-24 md:py-32 bg-[#F7F5F2] relative">
      {/* Subtle bg pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:48px_48px]" />

      <div className="container mx-auto px-5 md:px-10 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full border border-[#FF6B00]/25 bg-[#FF6B00]/10 mb-5"
          >
            <Globe size={12} className="text-[#FF6B00]" />
            <span className="text-[#FF6B00] text-xs font-bold tracking-wider uppercase">Harga Domain</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="text-4xl md:text-5xl font-bold text-[#0A0A0A] mb-5 tracking-tight"
          >
            Pilih Alamat Digital{' '}
            <span className="text-gradient-orange">yang Tepat</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.14 }}
            className="text-gray-500 text-lg font-serif"
          >
            Domain yang tepat membangun kepercayaan dan mudah diingat pelanggan Anda. Tersedia berbagai pilihan sesuai kebutuhan bisnis.
          </motion.p>
        </div>

        {/* Domain table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
            {/* Table header */}
            <div className="grid grid-cols-4 gap-0 px-6 py-4 bg-[#0A0A0A] rounded-t-3xl">
              <div className="text-white/60 text-xs font-bold uppercase tracking-wider">Extension</div>
              <div className="text-white/60 text-xs font-bold uppercase tracking-wider text-center">Harga</div>
              <div className="text-white/60 text-xs font-bold uppercase tracking-wider text-center hidden sm:block">Periode</div>
              <div className="text-white/60 text-xs font-bold uppercase tracking-wider text-right">Keterangan</div>
            </div>

            {/* Domain rows */}
            {domains.map((domain, i) => (
              <motion.div
                key={domain.tld}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`grid grid-cols-4 gap-0 px-6 py-4 border-b border-gray-50 hover:bg-orange-50/50 transition-colors group ${
                  domain.popular ? 'bg-orange-50/70' : ''
                }`}
              >
                {/* TLD */}
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#0A0A0A] text-base">{domain.tld}</span>
                  {domain.popular && (
                    <span className="px-2 py-0.5 bg-[#FF6B00] text-white text-[9px] font-bold rounded-full uppercase tracking-wide">
                      Populer
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-center justify-center">
                  <span className={`font-bold text-base ${domain.popular ? 'text-[#FF6B00]' : 'text-[#0A0A0A]'}`}>
                    {domain.price}
                  </span>
                </div>

                {/* Period */}
                <div className="hidden sm:flex items-center justify-center">
                  <span className="text-gray-400 text-sm font-serif">{domain.period}</span>
                </div>

                {/* Description */}
                <div className="flex items-center justify-end">
                  <span className="text-gray-400 text-xs font-serif text-right">{domain.desc}</span>
                </div>
              </motion.div>
            ))}

            {/* Bottom CTA row */}
            <div className="px-6 py-5 bg-gray-50/50 rounded-b-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-gray-400 text-sm font-serif">
                Harga belum termasuk PPN. Bisa berubah sewaktu-waktu.
              </p>
              <a
                href="https://wa.me/6282199870047?text=Halo%2C%20saya%20ingin%20tanya%20tentang%20domain"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-6 py-2.5 bg-[#FF6B00] text-white font-bold rounded-full hover:bg-[#e66000] transition-all hover:scale-105 active:scale-95 text-sm shadow-md shadow-orange-200"
              >
                <ExternalLink size={14} />
                Tanya & Pesan Domain
              </a>
            </div>
          </div>
        </motion.div>

        {/* Info cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mt-8"
        >
          {[
            { icon: '⚡', title: 'Aktivasi Cepat', desc: '1–24 jam setelah pembayaran' },
            { icon: '🔒', title: 'Aman & Terpercaya', desc: 'Domain resmi terdaftar PANDI' },
            { icon: '🔄', title: 'Renewal Mudah', desc: 'Kami bantu perpanjang setiap tahun' },
          ].map((info) => (
            <div key={info.title} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-3 shadow-sm">
              <span className="text-2xl shrink-0">{info.icon}</span>
              <div>
                <p className="text-[#0A0A0A] font-bold text-sm">{info.title}</p>
                <p className="text-gray-400 text-xs font-serif mt-0.5">{info.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

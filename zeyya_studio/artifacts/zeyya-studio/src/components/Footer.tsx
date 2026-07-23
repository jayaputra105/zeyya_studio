import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Twitter, Clock, ArrowRight } from 'lucide-react';
import { ZeyyaLogo } from './ZeyyaLogo';

const menuLinks = [
  { label: 'Beranda', href: '/' },
  { label: 'Tentang Kami', href: '/#tentang' },
  { label: 'Layanan', href: '/#layanan' },
  { label: 'Portfolio', href: '/projects' },
  { label: 'Studi Kasus', href: '/#studi-kasus' },
  { label: 'Harga Domain', href: '/#domain' },
  { label: 'FAQ', href: '/#faq' },
];

const services = [
  'Website Development',
  'Logo & Brand Identity',
  'Social Media Marketing',
  'UI/UX Design',
  'SEO Optimization',
  'Website Maintenance',
  'Hosting & Domain',
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#050505] text-white border-t border-white/[0.06] relative overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[200px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(255,107,0,0.04) 0%, transparent 70%)' }} />

      {/* ── Newsletter banner ── */}
      <div className="border-b border-white/[0.06]">
        <div className="container mx-auto px-5 md:px-10 py-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div>
              <h3 className="text-white font-bold text-lg mb-1">Dapatkan Tips Digital Marketing Gratis</h3>
              <p className="text-gray-500 text-sm font-serif">Update terbaru tentang strategi digital untuk UMKM Indonesia.</p>
            </div>
            <form
              onSubmit={(e) => { e.preventDefault(); alert('Terima kasih! Kami akan segera menghubungi Anda.'); }}
              className="flex gap-2 w-full md:w-auto"
            >
              <input
                type="email"
                required
                placeholder="email@bisnis.com"
                className="flex-1 md:w-60 bg-white/[0.05] border border-white/[0.08] rounded-full px-5 py-3 text-white text-sm outline-none focus:border-[#FF6B00]/50 transition-colors placeholder-white/20"
              />
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-3 bg-[#FF6B00] text-white font-bold rounded-full hover:bg-[#e66000] transition-all text-sm whitespace-nowrap"
              >
                Daftar <ArrowRight size={14} />
              </button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* ── Main footer grid ── */}
      <div className="container mx-auto px-5 md:px-10 pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-14">

          {/* Col 1: Brand */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-5">
            <Link href="/" className="inline-block">
              <ZeyyaLogo className="h-10 w-auto" />
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs font-serif">
              Partner digital terpercaya untuk UMKM Indonesia. Kami membangun identitas digital yang profesional, modern, dan menghasilkan.
            </p>
            {/* Social */}
            <div className="flex gap-3 flex-wrap">
              {[
                { href: 'https://facebook.com/zeyyastudio', icon: <Facebook size={16} />, label: 'Facebook' },
                { href: 'https://instagram.com/zeyyastudio', icon: <Instagram size={16} />, label: 'Instagram' },
                { href: '#', icon: <Youtube size={16} />, label: 'YouTube' },
                { href: '#', icon: <Twitter size={16} />, label: 'Twitter' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.07] flex items-center justify-center text-gray-500 hover:bg-[#FF6B00] hover:text-white hover:border-[#FF6B00] transition-all duration-200"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Menu */}
          <div>
            <h4 className="font-bold text-white text-sm mb-5 uppercase tracking-widest">Menu</h4>
            <ul className="space-y-3">
              {menuLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-500 hover:text-white transition-colors text-sm flex items-center gap-1.5 group"
                  >
                    <span className="w-0 group-hover:w-3 h-[1.5px] bg-[#FF6B00] transition-all duration-300 rounded-full shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Services */}
          <div>
            <h4 className="font-bold text-white text-sm mb-5 uppercase tracking-widest">Layanan</h4>
            <ul className="space-y-3">
              {services.map((s) => (
                <li key={s}>
                  <a
                    href="https://wa.me/6282199870047"
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-500 hover:text-white transition-colors text-sm flex items-center gap-1.5 group"
                  >
                    <span className="w-0 group-hover:w-3 h-[1.5px] bg-[#FF6B00] transition-all duration-300 rounded-full shrink-0" />
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div id="kontak">
            <h4 className="font-bold text-white text-sm mb-5 uppercase tracking-widest">Kontak</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="https://wa.me/6282199870047"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-3 text-gray-500 hover:text-white transition-colors group"
                >
                  <Phone size={15} className="text-[#FF6B00] mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">0821-9987-0047</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:zeyyastudio@gmail.com"
                  className="flex items-start gap-3 text-gray-500 hover:text-white transition-colors group"
                >
                  <Mail size={15} className="text-[#FF6B00] mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">zeyyastudio@gmail.com</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-500">
                <MapPin size={15} className="text-[#FF6B00] mt-0.5 shrink-0" />
                <span className="text-sm">Indonesia 🇮🇩</span>
              </li>
              <li className="flex items-start gap-3 text-gray-500">
                <Clock size={15} className="text-[#FF6B00] mt-0.5 shrink-0" />
                <div className="text-sm">
                  <p>Senin – Sabtu</p>
                  <p className="text-gray-600">08.00 – 21.00 WIB</p>
                </div>
              </li>
            </ul>

            {/* Quick WA CTA */}
            <a
              href="https://wa.me/6282199870047"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-[#FF6B00] text-white font-bold rounded-full hover:bg-[#e66000] transition-all text-xs shadow-lg shadow-orange-900/30"
            >
              💬 Chat WhatsApp
            </a>
          </div>
        </div>

        {/* ── Google Maps placeholder ── */}
        <div className="rounded-2xl overflow-hidden border border-white/[0.06] mb-10 h-40 relative bg-[#111]">
          <div className="absolute inset-0 flex items-center justify-center flex-col gap-2">
            <MapPin size={24} className="text-[#FF6B00]" />
            <p className="text-gray-600 text-sm font-serif">Zeyya Studio · Indonesia</p>
            <a
              href="https://wa.me/6282199870047"
              target="_blank"
              rel="noreferrer"
              className="text-[#FF6B00] text-xs hover:underline font-semibold"
            >
              Hubungi untuk alamat lengkap →
            </a>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="pt-6 border-t border-white/[0.05] flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-gray-600 text-xs">
            &copy; {year} Zeyya Studio. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs flex items-center gap-1.5">
            Designed with <span className="text-[#FF6B00] text-sm">❤</span> by{' '}
            <span className="text-gray-500 font-semibold">Zeyya Studio</span>
          </p>
          <div className="flex gap-4 text-gray-600 text-xs">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

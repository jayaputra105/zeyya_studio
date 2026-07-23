import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MessageCircle } from 'lucide-react';
import { ZeyyaLogo } from './ZeyyaLogo';

const navLinks = [
  { name: 'Beranda', path: '/', hash: '' },
  { name: 'Tentang', path: '/', hash: '#tentang' },
  { name: 'Layanan', path: '/', hash: '#layanan' },
  { name: 'Portfolio', path: '/projects', hash: '' },
  { name: 'Studi Kasus', path: '/', hash: '#studi-kasus' },
  { name: 'Harga', path: '/', hash: '#domain' },
  { name: 'FAQ', path: '/', hash: '#faq' },
];

function scrollToHash(hash: string) {
  const id = hash.replace('#', '');
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function Navbar() {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: typeof navLinks[0]) => {
    if (link.hash) {
      if (location === '/') {
        e.preventDefault();
        scrollToHash(link.hash);
        setMobileOpen(false);
      } else {
        // Let navigation happen then scroll
        setMobileOpen(false);
      }
    } else {
      setMobileOpen(false);
    }
  };

  const linkHref = (link: typeof navLinks[0]) =>
    link.hash ? (location === '/' ? link.hash : `/${link.hash}`) : link.path;

  return (
    <>
      <header
        className={`fixed top-0 w-full z-40 transition-all duration-500 ${
          scrolled
            ? 'bg-[#0A0A0A]/85 backdrop-blur-xl border-b border-white/[0.06] py-3 shadow-[0_4px_32px_rgba(0,0,0,0.4)]'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-5 md:px-10 flex items-center justify-between gap-4">

          {/* ── Logo left ── */}
          <Link href="/" className="relative z-50 shrink-0">
            <ZeyyaLogo
              className={`w-auto transition-all duration-300 ${scrolled ? 'h-7 md:h-8' : 'h-8 md:h-10'}`}
            />
          </Link>

          {/* ── Nav center (desktop) ── */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map((link) => {
              const isActive =
                !link.hash
                  ? location === link.path
                  : location === link.path;
              return (
                <Link
                  key={link.name}
                  href={linkHref(link)}
                  onClick={(e) => handleNavClick(e, link)}
                  className={`relative px-3 py-2 text-[13px] font-semibold rounded-lg transition-all duration-200 group ${
                    isActive && !link.hash
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {link.name}
                  <span className="absolute bottom-1 left-3 right-3 h-[1.5px] bg-zeyya-orange origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full" />
                </Link>
              );
            })}
          </nav>

          {/* ── CTA right (desktop) ── */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <a
              href="https://wa.me/6282199870047"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-zeyya-orange text-white text-[13px] font-bold rounded-full hover:bg-[#e66000] transition-all hover:scale-105 active:scale-95 shadow-lg shadow-orange-900/30"
            >
              <MessageCircle size={14} />
              Konsultasi Gratis
            </a>
          </div>

          {/* ── Hamburger (mobile) ── */}
          <button
            className="lg:hidden relative z-50 w-10 h-10 flex items-center justify-center text-white rounded-xl transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <X size={22} />
                </motion.div>
              ) : (
                <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Menu size={22} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </header>

      {/* ── Mobile slide drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              className="fixed top-0 right-0 bottom-0 z-40 w-[78vw] max-w-[320px] bg-[#0D0D0D] border-l border-white/[0.07] flex flex-col lg:hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-white/[0.06]">
                <ZeyyaLogo className="h-8 w-auto" />
                <button onClick={() => setMobileOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Links */}
              <nav className="flex-1 overflow-y-auto py-6 px-5 space-y-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.06, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={linkHref(link)}
                      onClick={(e) => handleNavClick(e, link)}
                      className="flex items-center justify-between w-full px-4 py-3.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/[0.05] text-sm font-semibold transition-all group"
                    >
                      {link.name}
                      <span className="text-white/20 group-hover:text-zeyya-orange transition-colors">›</span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Bottom CTA */}
              <div className="p-5 border-t border-white/[0.06]">
                <motion.a
                  href="https://wa.me/6282199870047"
                  target="_blank"
                  rel="noreferrer"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                  className="flex items-center justify-center gap-2 w-full py-4 bg-zeyya-orange text-white font-bold rounded-2xl text-sm shadow-lg shadow-orange-900/30"
                >
                  <MessageCircle size={16} />
                  Konsultasi Gratis
                </motion.a>
                <p className="text-center text-gray-600 text-[11px] mt-3">WhatsApp · Respon cepat</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

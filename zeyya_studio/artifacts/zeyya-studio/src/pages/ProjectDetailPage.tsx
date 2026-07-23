import { useParams, Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Quote } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { getProjects } from '@/lib/storage';

export default function ProjectDetailPage() {
  const params = useParams();
  const projects = getProjects();
  const project = projects.find((p) => p.slug === params.slug);

  if (!project) {
    return (
      <main className="min-h-screen flex flex-col bg-[#0A0A0A] justify-center items-center text-white">
        <h1 className="text-4xl font-bold mb-4">Project tidak ditemukan</h1>
        <Link href="/projects" className="text-zeyya-orange hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> Kembali ke Studi Kasus
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-[#0A0A0A]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 md:pt-48 pb-16 md:pb-24 relative bg-[#111]">
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <Link href="/projects" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 text-sm font-semibold">
            <ArrowLeft size={16} /> Semua Studi Kasus
          </Link>
          
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <span className="px-4 py-1.5 rounded-full bg-zeyya-orange/10 border border-zeyya-orange/30 text-zeyya-orange text-xs font-bold uppercase tracking-widest inline-block">
                {project.category}
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight"
            >
              {project.clientName}
            </motion.h1>
          </div>
        </div>
      </section>

      {/* Hero Image */}
      <section className="py-0 relative z-20 -mt-12 md:-mt-20">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="w-full aspect-video md:aspect-[21/9] bg-[#1A1A1A] rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden relative"
          >
            {project.mockupImage ? (
              <img
                src={project.mockupImage}
                alt={`${project.clientName} mockup`}
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-br from-zeyya-orange/10 to-transparent opacity-50 mix-blend-overlay z-0" />
                <div className="flex items-center justify-center h-full">
                  <div className="relative z-10 w-full max-w-2xl bg-[#0A0A0A] rounded-xl border border-white/10 shadow-2xl flex flex-col overflow-hidden mx-8 transform rotate-1">
                    <div className="h-10 border-b border-white/10 flex items-center px-4 gap-2 bg-[#111]">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                      <div className="ml-4 w-48 h-4 bg-white/5 rounded-full" />
                    </div>
                    <div className="p-8 space-y-4 bg-white/5">
                      <div className="h-24 bg-white/10 rounded-lg w-full" />
                      <div className="h-4 bg-white/10 rounded w-3/4" />
                      <div className="h-4 bg-white/10 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-20 md:py-32 bg-[#0A0A0A]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-3xl mx-auto space-y-24">
            
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-sm font-bold text-zeyya-orange uppercase tracking-wider mb-4">Tentang Klien</h2>
              <p className="text-xl md:text-2xl text-white font-serif leading-relaxed">{project.aboutClient}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-sm font-bold text-zeyya-orange uppercase tracking-wider mb-4">Masalah</h2>
              <p className="text-lg text-gray-400 font-serif leading-relaxed border-l-2 border-red-500/30 pl-6 py-2">{project.problemDetail}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-sm font-bold text-zeyya-orange uppercase tracking-wider mb-4">Analisis</h2>
              <p className="text-lg text-gray-400 font-serif leading-relaxed">{project.analysisDetail}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-sm font-bold text-zeyya-orange uppercase tracking-wider mb-4">Solusi</h2>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-10">
                <p className="text-lg text-white font-serif leading-relaxed">{project.solutionDetail}</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-sm font-bold text-zeyya-orange uppercase tracking-wider mb-4">Konsep Desain</h2>
              <p className="text-lg text-gray-400 font-serif leading-relaxed">{project.designConcept}</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-white/5">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h2 className="text-sm font-bold text-zeyya-orange uppercase tracking-wider mb-6">Teknologi</h2>
                <ul className="space-y-3">
                  {project.technologies.map((tech, i) => (
                    <li key={i} className="text-white font-medium flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-zeyya-orange" /> {tech}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                <h2 className="text-sm font-bold text-zeyya-orange uppercase tracking-wider mb-6">Fitur Website</h2>
                <ul className="space-y-3">
                  {project.features.map((feature, i) => (
                    <li key={i} className="text-white font-medium flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-zeyya-orange" /> {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-sm font-bold text-zeyya-orange uppercase tracking-wider mb-4">Hasil Akhir</h2>
              <p className="text-lg text-gray-400 font-serif leading-relaxed mb-8">{project.result}</p>
              
              <a 
                href={`https://${project.previewUrl}`} 
                target="_blank" 
                rel="noreferrer"
                className="group block bg-[#111] border border-white/10 rounded-2xl p-6 hover:bg-white/5 hover:border-zeyya-orange/50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-zeyya-orange group-hover:text-white transition-colors">
                      <ExternalLink size={20} />
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">Preview Website</h4>
                      <p className="text-gray-400 text-sm">{project.previewUrl}</p>
                    </div>
                  </div>
                </div>
              </a>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              whileInView={{ opacity: 1, scale: 1 }} 
              viewport={{ once: true }}
              className="bg-zeyya-orange rounded-3xl p-10 md:p-14 text-white relative overflow-hidden"
            >
              <Quote className="absolute -top-6 -left-6 w-32 h-32 text-black/10 rotate-180" />
              <div className="relative z-10">
                <p className="text-xl md:text-3xl font-serif font-medium leading-relaxed mb-8">
                  "{project.testimonial.quote}"
                </p>
                <p className="font-bold tracking-wider uppercase text-sm">
                  — {project.testimonial.author}
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* CTA Konsultasi */}
      <section className="py-24 bg-[#111] border-t border-white/5 text-center">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ingin Bisnis Anda Seperti Ini?</h2>
            <p className="text-gray-400 text-lg mb-10 font-serif">Konsultasi Gratis Sekarang</p>
            <a 
              href="https://wa.me/6282199870047"
              target="_blank"
              rel="noreferrer"
              className="inline-flex px-8 py-4 bg-zeyya-orange text-white rounded-full font-bold hover:bg-[#e66000] transition-all hover:scale-105 active:scale-95 items-center justify-center gap-2"
            >
              Hubungi via WhatsApp
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

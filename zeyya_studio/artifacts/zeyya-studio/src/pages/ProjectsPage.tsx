import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CTASection } from '@/components/sections/CTASection';
import { getProjects } from '@/lib/storage';

const filters = ['Semua', 'Website', 'Branding', 'Logo', 'Social Media'];

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState('Semua');

  const allProjects = getProjects();
  const filteredProjects = allProjects.filter(p => 
    activeFilter === 'Semua' || p.category.includes(activeFilter)
  );

  return (
    <main className="min-h-screen flex flex-col bg-[#0A0A0A]">
      <Navbar />
      
      {/* Page Hero */}
      <section className="pt-32 md:pt-48 pb-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#111] to-[#0A0A0A] z-0" />
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-3xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight"
            >
              Studi Kasus
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-400 font-serif leading-relaxed"
            >
              Kami tidak hanya mendesain agar terlihat bagus, tapi juga merancang agar bisnis Anda tumbuh. Lihat beberapa hasil karya kami.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="pb-8 sticky top-20 z-30 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  activeFilter === filter 
                    ? 'bg-white text-black' 
                    : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  key={project.slug}
                  className="group"
                >
                  <Link href={`/project/${project.slug}`}>
                    <div className="block bg-[#111111] rounded-[2rem] overflow-hidden border border-white/5 hover:border-zeyya-orange/30 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(255,107,0,0.07)] h-full flex flex-col">
                      
                      {/* Image Area */}
                      <div className="bg-[#1A1A1A] aspect-video relative overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-zeyya-orange/10 to-transparent z-0" />
                        {project.mockupImage ? (
                          <img
                            src={project.mockupImage}
                            alt={project.clientName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className="relative z-10 w-full h-full max-w-xs mx-auto bg-[#0A0A0A] rounded-t-xl border border-white/10 shadow-2xl flex flex-col overflow-hidden group-hover:scale-105 transition-transform duration-700 translate-y-8">
                            <div className="h-8 border-b border-white/10 flex items-center px-3 gap-1.5">
                              <div className="w-2 h-2 rounded-full bg-red-500/50" />
                              <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                              <div className="w-2 h-2 rounded-full bg-green-500/50" />
                            </div>
                            <div className="flex-1 p-4 space-y-3">
                              <div className="h-20 bg-white/5 rounded w-full" />
                              <div className="h-3 bg-white/10 rounded w-3/4" />
                              <div className="h-3 bg-white/10 rounded w-1/2" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Content Area */}
                      <div className="p-8 md:p-10 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="mb-4">
                            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-gray-300 uppercase tracking-widest inline-block">
                              {project.category}
                            </span>
                          </div>
                          <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-zeyya-orange transition-colors">
                            {project.clientName}
                          </h3>
                          <p className="text-gray-400 font-serif leading-relaxed line-clamp-2 mb-8">
                            {project.problemSummary}
                          </p>
                        </div>

                        <div className="inline-flex items-center gap-2 text-white font-bold text-sm">
                          Lihat Detail
                          <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>

                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <CTASection />
      <Footer />
    </main>
  );
}

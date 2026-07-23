import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'wouter';
import { getProjects } from '@/lib/storage';
import type { AdminProject } from '@/lib/storage';

function ProjectCard({ project }: { project: AdminProject }) {
  return (
    <Link href={`/project/${project.slug}`}>
      <div className="group flex-shrink-0 w-[320px] md:w-[380px] bg-[#111] border border-white/[0.07] rounded-3xl overflow-hidden hover:border-[#FF6B00]/25 hover:shadow-[0_20px_60px_rgba(255,107,0,0.08)] transition-all duration-400 cursor-pointer">
        {/* Image area */}
        <div className="h-52 bg-[#1A1A1A] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B00]/10 to-transparent z-0" />
          {project.mockupImage ? (
            <img
              src={project.mockupImage}
              alt={project.clientName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="relative z-10 flex items-center justify-center h-full">
              <div className="w-32 h-44 bg-[#0A0A0A] rounded-xl border border-white/10 shadow-2xl flex flex-col overflow-hidden group-hover:scale-105 transition-transform duration-500">
                <div className="h-6 border-b border-white/10 flex items-center px-2 gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/50" />
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
                </div>
                <div className="flex-1 p-3 space-y-2">
                  <div className="h-16 bg-white/5 rounded" />
                  <div className="h-2 bg-white/10 rounded w-3/4" />
                  <div className="h-2 bg-white/10 rounded w-1/2" />
                </div>
              </div>
            </div>
          )}

          {/* Category badge */}
          <div className="absolute top-4 left-4 z-10">
            <span className="px-3 py-1.5 rounded-full bg-[#0A0A0A]/80 backdrop-blur text-[10px] font-bold text-white/70 uppercase tracking-widest border border-white/10">
              {project.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-white font-bold text-xl mb-4">{project.clientName}</h3>

          <div className="space-y-3 mb-6">
            <div>
              <span className="text-[10px] font-bold text-[#FF6B00] uppercase tracking-widest block mb-1">Masalah</span>
              <p className="text-gray-500 text-sm font-serif leading-relaxed line-clamp-2">{project.problemSummary}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest block mb-1">Solusi</span>
              <p className="text-gray-500 text-sm font-serif leading-relaxed line-clamp-2">{project.solutionSummary}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
            <span className="text-white text-sm font-bold group-hover:text-[#FF6B00] transition-colors">
              Lihat Detail
            </span>
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#FF6B00]/40 group-hover:bg-[#FF6B00]/10 transition-all">
              <ArrowRight size={14} className="text-white/60 group-hover:text-[#FF6B00] -rotate-45 group-hover:rotate-0 transition-all" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function CaseStudiesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const projects = getProjects();

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'right' ? 420 : -420, behavior: 'smooth' });
  };

  if (projects.length === 0) return null;

  return (
    <section id="studi-kasus" className="py-24 md:py-32 bg-[#111111] border-t border-white/[0.05] relative">
      <div className="container mx-auto px-5 md:px-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full border border-[#FF6B00]/20 bg-[#FF6B00]/[0.08] mb-5"
            >
              <span className="text-[#FF6B00] text-xs font-bold tracking-wider uppercase">Studi Kasus</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight"
            >
              Hasil Nyata,{' '}
              <span className="text-gradient-orange">Bukan Janji</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.14 }}
              className="text-gray-500 font-serif leading-relaxed"
            >
              Lihat bagaimana kami membantu bisnis bertransformasi secara digital — lengkap dengan masalah, strategi, dan dampak nyata.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3"
          >
            {/* Scroll arrows */}
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-all"
            >
              <ChevronRight size={18} />
            </button>
            <Link
              href="/projects"
              className="flex items-center gap-2 text-white/60 font-semibold hover:text-white transition-colors text-sm group ml-2"
            >
              Semua Studi Kasus
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Horizontal scroll */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto pb-6 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-thumb]:bg-[#FF6B00]/30 [&::-webkit-scrollbar-thumb]:rounded-full [mask-image:linear-gradient(90deg,black_90%,transparent)]"
          >
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}

            {/* "Tambah lagi" placeholder */}
            <div className="flex-shrink-0 w-[320px] md:w-[380px] border-2 border-dashed border-white/[0.06] rounded-3xl flex flex-col items-center justify-center gap-4 p-8 text-center">
              <div className="w-14 h-14 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center">
                <span className="text-2xl text-white/20">+</span>
              </div>
              <div>
                <p className="text-white/30 font-bold text-sm">Project Berikutnya</p>
                <p className="text-white/15 text-xs font-serif mt-1">Mungkin milik Anda</p>
              </div>
              <a
                href="https://wa.me/6282199870047"
                target="_blank"
                rel="noreferrer"
                className="text-[#FF6B00] text-xs font-bold hover:underline"
              >
                Konsultasi Sekarang →
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MessageCircle } from 'lucide-react';

const faqs = [
  {
    question: "Berapa biaya pembuatan website?",
    answer: "Biaya bervariasi tergantung kompleksitas dan fitur yang dibutuhkan. Kami menyediakan berbagai paket mulai dari website landing page sederhana hingga website e-commerce lengkap. Hubungi kami untuk konsultasi gratis dan penawaran yang sesuai dengan budget Anda."
  },
  {
    question: "Berapa lama proses pengerjaan website?",
    answer: "Rata-rata 7–14 hari kerja tergantung kompleksitas project dan seberapa cepat konten/aset dari klien tersedia. Landing page sederhana bisa selesai dalam 5–7 hari, sedangkan website dengan fitur lengkap membutuhkan 14–21 hari."
  },
  {
    question: "Apakah saya bisa request revisi?",
    answer: "Ya, setiap project sudah termasuk sesi revisi. Kami tidak selesai sampai Anda benar-benar puas dengan hasilnya. Revisi minor bisa dilakukan berkali-kali selama masih dalam scope project yang disepakati."
  },
  {
    question: "Apakah ada garansi setelah website selesai?",
    answer: "Kami memberikan support teknis selama 30 hari setelah website diluncurkan. Jika ada bug atau masalah teknis, kami tangani gratis. Setelah itu tersedia paket maintenance bulanan jika Anda membutuhkan support berkelanjutan."
  },
  {
    question: "Bisnis apa saja yang bisa Zeyya Studio bantu?",
    answer: "Semua jenis bisnis! UMKM, rumah makan, cafe, hotel, klinik, bengkel, toko fashion, salon, sekolah, startup, company profile, hingga e-commerce. Kami sudah memiliki pengalaman di berbagai industri dan memahami kebutuhan unik masing-masing."
  },
  {
    question: "Apakah website yang dibuat mobile-friendly?",
    answer: "Ya, 100% responsif dan mobile-first. Lebih dari 80% pengunjung website datang dari perangkat mobile, jadi kami selalu memastikan pengalaman mobile sempurna terlebih dahulu sebelum desktop."
  },
  {
    question: "Bagaimana proses kerjasama dimulai?",
    answer: "Sangat mudah! (1) Hubungi kami via WhatsApp untuk konsultasi gratis, (2) Kami diskusikan kebutuhan dan tujuan bisnis Anda, (3) Kami kirim proposal & penawaran harga, (4) Setelah sepakat, pengerjaan dimulai. Anda akan selalu update setiap tahapan progress."
  },
  {
    question: "Apakah saya perlu menyediakan hosting dan domain sendiri?",
    answer: "Tidak perlu. Kami bisa mengurus hosting, domain, dan semua kebutuhan teknis untuk Anda. Atau jika Anda sudah punya, kami bisa gunakan yang sudah ada. Semuanya fleksibel sesuai kebutuhan."
  },
  {
    question: "Apakah website bisa diupdate sendiri setelah jadi?",
    answer: "Tergantung platform yang dipilih. Kami bisa membangun dengan CMS (Content Management System) seperti WordPress atau sistem custom admin panel sehingga Anda bisa update konten sendiri tanpa perlu coding. Kami juga menyediakan training singkat cara penggunaannya."
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="py-24 md:py-32 bg-[#F0EEE8] relative">
      {/* Subtle bg */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:56px_56px]" />

      <div className="container mx-auto px-5 md:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 items-start">

          {/* Left: Header */}
          <div className="lg:sticky lg:top-28">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full border border-[#FF6B00]/25 bg-[#FF6B00]/10 mb-6"
            >
              <span className="text-[#FF6B00] text-xs font-bold tracking-wider uppercase">FAQ</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              className="text-3xl md:text-4xl font-bold text-[#0A0A0A] mb-5 tracking-tight leading-tight"
            >
              Pertanyaan yang{' '}
              <span className="text-gradient-orange">Sering Ditanyakan</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.14 }}
              className="text-gray-500 font-serif leading-relaxed mb-8"
            >
              Tidak menemukan jawaban yang Anda cari? Langsung tanyakan ke kami.
            </motion.p>
            <motion.a
              href="https://wa.me/6282199870047"
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#0A0A0A] text-white font-bold rounded-full hover:bg-[#222] transition-all hover:scale-105 active:scale-95 text-sm shadow-lg"
            >
              <MessageCircle size={16} />
              Tanya Langsung via WA
            </motion.a>
          </div>

          {/* Right: Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Accordion type="single" collapsible className="w-full space-y-3">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-white border border-gray-100 rounded-2xl px-6 data-[state=open]:border-[#FF6B00]/25 data-[state=open]:shadow-[0_8px_30px_rgba(255,107,0,0.06)] transition-all duration-300 hover:border-gray-200"
                >
                  <AccordionTrigger className="text-left text-[#0A0A0A] font-bold py-5 hover:no-underline hover:text-[#FF6B00] transition-colors text-[15px]">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-500 font-serif leading-relaxed pb-5 pt-0 text-sm">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

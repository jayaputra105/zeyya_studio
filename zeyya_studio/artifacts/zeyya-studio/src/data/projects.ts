export interface Project {
  slug: string;
  category: string;
  clientName: string;
  problemSummary: string;
  solutionSummary: string;
  aboutClient: string;
  problemDetail: string;
  analysisDetail: string;
  solutionDetail: string;
  designConcept: string;
  technologies: string[];
  features: string[];
  result: string;
  previewUrl: string;
  mockupImage?: string;
  testimonial: {
    quote: string;
    author: string;
  };
}

import lilaCateringMockup from '@assets/file_000000003fb871fb9d9123c616ef4217_1784143651709.png';

export const projects: Project[] = [
  {
    slug: 'lila-catering',
    mockupImage: lilaCateringMockup,
    category: 'Website Development',
    clientName: 'Lila Catering',
    problemSummary: 'Pelanggan kesulitan melihat menu PDF di berbagai perangkat',
    solutionSummary: 'Website modern dengan menu digital yang responsif dan mudah diakses',
    aboutClient: 'Lila Catering adalah bisnis catering yang menyajikan berbagai menu makanan untuk berbagai acara di Indonesia.',
    problemDetail: 'Pelanggan kesulitan mengakses menu yang disimpan dalam file PDF. Di beberapa perangkat, PDF tidak bisa dibuka dengan baik, menyebabkan calon pelanggan frustrasi dan berpotensi kehilangan order.',
    analysisDetail: 'Penggunaan PDF untuk menu adalah hambatan UX yang signifikan. PDF tidak mobile-friendly, lambat dimuat, dan bergantung pada aplikasi pihak ketiga. Bisnis butuh solusi yang bisa diakses siapa saja, di perangkat apa saja, langsung dari browser.',
    solutionDetail: 'Membangun website modern dengan halaman menu digital yang responsif, mudah diupdate, dan bisa diakses langsung dari browser tanpa download atau aplikasi tambahan. Website dioptimalkan untuk mobile users.',
    designConcept: 'Clean, warm, dan appetizing. Warna yang menonjolkan cita rasa makanan. Layout yang menampilkan menu dengan visual yang menarik dan mudah dibaca.',
    technologies: ['Next.js', 'Tailwind CSS', 'Vercel (deployment)', 'Responsive Design', 'SEO Optimization'],
    features: [
      'Menu digital interaktif',
      'Sistem kategori menu',
      'WhatsApp order integration',
      'Mobile-first design',
      'Fast loading',
      'SEO ready'
    ],
    result: 'Website live di lilacatering.vercel.app. Pelanggan kini dapat mengakses menu dengan mudah di semua perangkat tanpa hambatan.',
    previewUrl: 'lilacatering.vercel.app',
    testimonial: {
      quote: 'Sekarang pelanggan bisa langsung lihat menu dari HP tanpa ribet download PDF. Pesanan jadi lebih banyak!',
      author: 'Owner, Lila Catering'
    }
  }
];

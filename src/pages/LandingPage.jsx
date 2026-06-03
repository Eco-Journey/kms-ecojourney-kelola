import React from 'react';

export default function LandingPage({ onNavigate }) {
  const features = [
    {
      id: 'benih',
      title: 'Dokumentasi benih lokal',
      description: 'Menghimpun dan mendokumentasikan bukti manfaat serta praktik baik konservasi plasma nutfah.',
      imgSrc: '/seed_planting.png',
    },
    {
      id: 'peta',
      title: 'Visualisasi persebaran data',
      description: 'Memetakan observasi sebaran varietas tanaman lokal secara in-situ dan on-farm di seluruh Indonesia.',
      imgSrc: '/indonesia_map.png',
    },
    {
      id: 'masyarakat',
      title: 'Kolaborasi masyarakat',
      description: 'Memfasilitasi transformasi pengetahuan tradisional lisan menjadi digital secara etis (FPIC).',
      imgSrc: '/farmers_community.png',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-kms-gray-bg w-full">
      {/* Hero Section */}
      <section 
        className="relative bg-cover bg-center h-[500px] md:h-[600px] flex flex-col justify-center items-center px-4 select-none"
        style={{ backgroundImage: "url('/rice_terrace_hero.png')" }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-4xl px-4 animate-fade-in">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight drop-shadow-md mb-8">
            Eco Journey: Knowledge Management System
          </h1>
          
          <button
            onClick={() => onNavigate('login')}
            className="bg-kms-blue-accent hover:bg-blue-700 active:scale-95 text-white font-bold text-lg md:text-xl py-3 px-8 rounded-[5px] shadow-lg hover:shadow-blue-500/30 transition-all duration-200 cursor-pointer"
          >
            Mulai Sekarang
          </button>
        </div>
      </section>

      {/* Features Cards Section (overlapping the Hero section slightly on larger viewports) */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 md:px-8 -mt-24 md:-mt-32 pb-16 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div 
              key={feature.id}
              className="bg-white rounded-[5px] shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 p-6 flex flex-col text-left group cursor-pointer"
            >
              {/* Card Image */}
              <div className="w-full h-44 overflow-hidden rounded-[5px] mb-4 bg-gray-100 relative">
                <img 
                  src={feature.imgSrc} 
                  alt={feature.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Title & Description */}
              <h2 className="text-xl font-extrabold text-gray-900 mb-2 leading-tight group-hover:text-kms-green-dark transition-colors duration-200">
                {feature.title}
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed mt-2 font-normal">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-kms-gray-bg py-12 text-center border-t border-gray-200/50 w-full mb-16">
        <h3 className="text-xl font-extrabold text-gray-900 tracking-wide mb-3">
          Kata Mereka
        </h3>
        <p className="text-xl text-gray-700 italic font-medium px-4">
          &ldquo; Sistem ini sangat berguna &rdquo;
        </p>
      </section>
    </div>
  );
}

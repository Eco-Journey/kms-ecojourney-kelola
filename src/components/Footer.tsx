import React from 'react';

export default function Footer(): React.ReactElement {
  return (
    <footer className="bg-kms-green-dark text-white px-6 md:px-12 py-6 flex items-center justify-between border-t border-white/10 w-full mt-auto">
      <div className="flex flex-col items-start space-y-0.5">
        <span className="text-base md:text-lg font-extrabold font-sans tracking-tight">
          Eco-Journey
        </span>
        <span className="text-[9px] text-kms-green-light/80 font-bold uppercase tracking-wider block">
          Portal Manajemen Kearifan Lokal & SDG Pertanian
        </span>
      </div>
      <div className="text-xs text-gray-400">
        &copy; {new Date().getFullYear()} KMS Ecojourney. All rights reserved.
      </div>
    </footer>
  );
}

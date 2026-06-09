import React from 'react';

export default function Footer(): React.ReactElement {
  return (
    <footer className="bg-kms-green-dark text-white px-6 md:px-12 py-6 flex items-center justify-between border-t border-white/10 w-full mt-auto">
      <div className="flex items-center space-x-2">
        <span className="text-lg md:text-xl font-bold font-sans tracking-wide">
          Thank you!
        </span>
      </div>
      <div className="text-xs text-gray-400">
        &copy; {new Date().getFullYear()} KMS Ecojourney. All rights reserved.
      </div>
    </footer>
  );
}

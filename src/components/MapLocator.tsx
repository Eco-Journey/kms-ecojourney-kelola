import React, { useRef, useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

interface MapLocatorProps {
  readOnly?: boolean;
  latitude: number | null;
  longitude: number | null;
  onChange?: (lat: number, lng: number) => void;
}

export default function MapLocator({ 
  readOnly = false, 
  latitude, 
  longitude, 
  onChange 
}: MapLocatorProps): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pinPosition, setPinPosition] = useState<{ x: number; y: number } | null>(null);

  // Convert lat/lng to container x/y percentages
  // Indonesia coordinates boundaries approx: 
  // Longitude: 95°E to 141°E (width of 46 degrees)
  // Latitude: 6°N to 11°S (height of 17 degrees)
  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      // Longitude: 95 is 0%, 141 is 100%
      const x = ((longitude - 95) / 46) * 100;
      // Latitude: 6 is 0% (top), -11 is 100% (bottom)
      const y = ((6 - latitude) / 17) * 100;
      
      // Clamp values between 0 and 100
      setPinPosition({
        x: Math.max(0, Math.min(100, x)),
        y: Math.max(0, Math.min(100, y))
      });
    } else {
      setPinPosition(null);
    }
  }, [latitude, longitude]);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (readOnly || !onChange || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const percentX = (clickX / rect.width) * 100;
    const percentY = (clickY / rect.height) * 100;

    // Convert percentages back to lat/lng
    const lng = 95 + (percentX / 100) * 46;
    const lat = 6 - (percentY / 100) * 17;

    // Format coordinates to 4 decimal places
    onChange(Number(lat.toFixed(4)), Number(lng.toFixed(4)));
  };

  return (
    <div className="space-y-2">
      <div 
        ref={containerRef}
        onClick={handleMapClick}
        className={`relative w-full h-44 md:h-52 bg-slate-50 border border-gray-300 rounded-[5px] overflow-hidden select-none ${
          readOnly ? 'cursor-default' : 'cursor-crosshair hover:bg-slate-100/80 transition-colors'
        }`}
      >
        {/* Background Grid Lines */}
        <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 opacity-35 pointer-events-none">
          {Array.from({ length: 11 }).map((_, i) => (
            <div key={`col-${i}`} className="border-r border-gray-200 h-full" style={{ gridColumnStart: i + 2 }} />
          ))}
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={`row-${i}`} className="border-b border-gray-200 w-full" style={{ gridRowStart: i + 2 }} />
          ))}
        </div>

        {/* Indonesia Outline Map Visual using custom SVG paths */}
        <svg 
          viewBox="0 0 800 350" 
          className="absolute inset-0 w-full h-full p-4 text-gray-400 stroke-gray-500 fill-none pointer-events-none"
          strokeWidth="1.5"
        >
          {/* Sumatra */}
          <path d="M 60 70 L 100 120 L 180 180 L 220 220 L 210 230 L 170 190 L 90 140 L 40 80 Z" fill="#E5E7EB" stroke="#9CA3AF" />
          {/* Java */}
          <path d="M 230 240 L 300 242 L 380 250 L 410 255 L 410 262 L 350 258 L 290 250 L 225 248 Z" fill="#E5E7EB" stroke="#9CA3AF" />
          {/* Kalimantan */}
          <path d="M 290 90 L 340 70 L 410 110 L 410 160 L 370 200 L 300 190 L 280 140 Z" fill="#E5E7EB" stroke="#9CA3AF" />
          {/* Sulawesi */}
          <path d="M 450 110 L 490 110 L 490 130 L 460 145 L 490 165 L 500 195 L 485 198 L 470 170 L 440 170 L 435 130 Z" fill="#E5E7EB" stroke="#9CA3AF" />
          {/* Papua */}
          <path d="M 640 140 L 730 150 L 750 250 L 720 250 L 670 210 L 630 185 L 610 150 L 620 140 Z" fill="#E5E7EB" stroke="#9CA3AF" />
          {/* Lesser Sunda Islands (Bali, Lombok, Sumbawa, Flores, Timor) */}
          <path d="M 425 258 L 450 259 M 460 260 L 490 262 M 500 263 L 550 264 M 555 264 L 590 275" stroke="#9CA3AF" strokeWidth="3" strokeLinecap="round" />
          {/* Maluku Islands */}
          <path d="M 520 130 L 530 140 M 550 160 L 560 180 M 530 190 L 545 192" stroke="#9CA3AF" strokeWidth="4" strokeLinecap="round" />
        </svg>

        {/* Mapped marker pin */}
        {pinPosition && (
          <div 
            className="absolute z-10 -translate-x-1/2 -translate-y-full transition-all duration-300 ease-out"
            style={{ left: `${pinPosition.x}%`, top: `${pinPosition.y}%` }}
          >
            <div className="relative group flex items-center justify-center">
              {/* Floating marker pin */}
              <MapPin className="w-8 h-8 text-kms-red fill-white/80 filter drop-shadow-md animate-bounce" />
              {/* Tiny radar ring */}
              <span className="absolute bottom-0 w-2.5 h-1 bg-black/30 rounded-full blur-xs" />
            </div>
          </div>
        )}

        {/* Interactive Helper Label */}
        {!readOnly && (
          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-1 rounded select-none pointer-events-none">
            Klik pada peta untuk menetapkan koordinat
          </div>
        )}
      </div>

      {/* Lat/Lng display boxes matching Image 1 & 4 */}
      <div className="grid grid-cols-2 gap-3 text-left">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-gray-500 block uppercase tracking-wider">Latitude (Lintang)</span>
          <input 
            type="text" 
            value={latitude !== null ? latitude : ''} 
            readOnly 
            placeholder="Contoh: -7.2575"
            className="w-full border border-gray-300 bg-gray-50 rounded-[5px] px-3 py-2 text-xs outline-none text-gray-700 font-semibold"
          />
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-gray-500 block uppercase tracking-wider">Longitude (Bujur)</span>
          <input 
            type="text" 
            value={longitude !== null ? longitude : ''} 
            readOnly 
            placeholder="Contoh: 112.7521"
            className="w-full border border-gray-300 bg-gray-50 rounded-[5px] px-3 py-2 text-xs outline-none text-gray-700 font-semibold"
          />
        </div>
      </div>
    </div>
  );
}

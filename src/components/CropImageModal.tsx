import React, { useState } from 'react';
import { X, Crop, RotateCw, ZoomIn } from 'lucide-react';

interface CropImageModalProps {
  onClose: () => void;
  onFinish: (imageUrl: string) => void;
}

interface MockImageItem {
  id: number;
  url: string;
  label: string;
}

export default function CropImageModal({ onClose, onFinish }: CropImageModalProps): React.ReactElement {
  // A curated list of mock high-quality agricultural/seed images to pick from
  const mockImages: MockImageItem[] = [
    { id: 1, url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=600&h=450', label: 'Talas Bogor' },
    { id: 2, url: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=600&h=450', label: 'Benih Jagung' },
    { id: 3, url: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&q=80&w=600&h=450', label: 'Padi Emas' },
    { id: 4, url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=600&h=450', label: 'Cengkeh Kering' },
    { id: 5, url: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=600&h=450', label: 'Terasering Sawah' },
  ];

  const [selectedImage, setSelectedImage] = useState<MockImageItem>(mockImages[0]);
  const [zoom, setZoom] = useState<number>(100);

  const handleFinish = (): void => {
    onFinish(selectedImage.url);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-[5px] shadow-2xl border border-gray-200 w-full max-w-xl overflow-hidden animate-scale-up text-left">
        
        {/* Header */}
        <div className="bg-kms-green-dark text-white px-5 py-4 flex justify-between items-center select-none">
          <div className="flex items-center space-x-2">
            <Crop className="w-5 h-5 text-kms-green-light" />
            <h3 className="text-base font-extrabold">Potong dan Unggah Foto</h3>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="text-white hover:text-kms-green-light cursor-pointer border-none bg-transparent"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Main Cropper Box */}
          <div className="relative w-full h-64 md:h-80 bg-slate-900 rounded-[5px] overflow-hidden flex items-center justify-center border border-gray-300">
            {/* Main Image Layer */}
            <img 
              src={selectedImage.url} 
              alt={selectedImage.label}
              className="max-w-full max-h-full object-contain transition-transform duration-200"
              style={{ transform: `scale(${zoom / 100})` }}
            />
            
            {/* Semi-transparent Overlay Crop Guideline Grid */}
            <div className="absolute inset-4 border-2 border-dashed border-white/80 pointer-events-none flex items-center justify-center">
              {/* Grid vertical lines */}
              <div className="absolute inset-y-0 left-1/3 border-r border-dashed border-white/40 w-px" />
              <div className="absolute inset-y-0 right-1/3 border-r border-dashed border-white/40 w-px" />
              {/* Grid horizontal lines */}
              <div className="absolute inset-x-0 top-1/3 border-b border-dashed border-white/40 h-px" />
              <div className="absolute inset-x-0 bottom-1/3 border-b border-dashed border-white/40 h-px" />
              
              {/* Crop Helper text */}
              <span className="bg-black/70 backdrop-blur-xs text-[10px] text-white font-bold py-1 px-2.5 rounded-[3px]">
                Area Potong
              </span>
            </div>

            {/* Scale/Zoom Control Slider */}
            <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-xs rounded px-4 py-2 flex items-center space-x-3 text-white text-xs select-none">
              <ZoomIn className="w-4 h-4 text-kms-green-light" />
              <span className="w-10 text-right">{zoom}%</span>
              <input 
                type="range" 
                min="50" 
                max="200" 
                value={zoom} 
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1 accent-kms-green-status cursor-pointer h-1 rounded-lg bg-gray-600 appearance-none"
              />
              <button 
                type="button"
                onClick={() => setZoom(100)}
                className="p-1 hover:bg-white/10 rounded cursor-pointer"
                title="Reset Zoom"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Thumbnail List Selector matching mockup layout */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 block uppercase tracking-wider">
              Pilih Gambar Varietas dari Galeri Mockup
            </label>
            <div className="grid grid-cols-5 gap-2.5">
              {mockImages.map((img) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => {
                    setSelectedImage(img);
                    setZoom(100);
                  }}
                  className={`relative aspect-square rounded-[5px] overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedImage.id === img.id 
                      ? 'border-kms-green-dark scale-105 shadow-md' 
                      : 'border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100'
                  }`}
                  title={img.label}
                >
                  <img 
                    src={img.url} 
                    alt={img.label}
                    className="w-full h-full object-cover"
                  />
                  {selectedImage.id === img.id && (
                    <div className="absolute inset-0 bg-kms-green-dark/15 flex items-center justify-center" />
                  )}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-150">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-bold border border-gray-300 rounded-[5px] hover:bg-gray-100 transition cursor-pointer text-gray-700 bg-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleFinish}
            className="bg-kms-green-status hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold px-6 py-2.5 rounded-[5px] transition-all duration-200 cursor-pointer shadow-sm"
          >
            Finish
          </button>
        </div>

      </div>
    </div>
  );
}

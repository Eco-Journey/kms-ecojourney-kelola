import React, { useRef, useEffect } from 'react';
import L from 'leaflet';

interface MapLocatorProps {
  readOnly?: boolean;
  latitude: number | null;
  longitude: number | null;
  onChange?: (lat: number, lng: number) => void;
  pins?: Array<{ 
    id: string; 
    lat?: number | null; 
    lng?: number | null; 
    cx?: number | null; 
    cy?: number | null; 
    nama: string; 
    type: string; 
  }>;
}

// Custom SVG-based Pin Icon creator to ensure 100% offline support and avoid Vite asset URL resolution bugs
const createCustomPinIcon = (color: string = '#284027') => {
  return L.divIcon({
    html: `
      <div class="relative flex items-center justify-center w-8 h-8 -translate-y-2 select-none pointer-events-none">
        <svg class="w-8 h-8 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="${color}"/>
        </svg>
        <div class="absolute w-2 h-2 rounded-full bg-white top-[7px] border border-black/10"></div>
      </div>
    `,
    className: 'custom-leaflet-pin',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

export default function MapLocator({ 
  readOnly = false, 
  latitude, 
  longitude, 
  onChange,
  pins
}: MapLocatorProps): React.ReactElement {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const markerGroupRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map Instance
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Default coordinates centered on Indonesia if no point is provided
    const initialLat = latitude !== null ? latitude : -2.5;
    const initialLng = longitude !== null ? longitude : 118.0;
    const initialZoom = latitude !== null && longitude !== null ? 8 : 5;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: initialZoom,
      zoomControl: !readOnly,
      attributionControl: false,
    });

    // Load OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
    }).addTo(map);

    mapRef.current = map;
    markerGroupRef.current = L.layerGroup().addTo(map);

    // Interactive coordinate selector on map click
    if (!readOnly && onChange) {
      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        onChange(Number(lat.toFixed(4)), Number(lng.toFixed(4)));
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [readOnly]);

  // Handle active single coordinates selection (Add/Edit mode)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || readOnly) return;

    if (latitude !== null && longitude !== null) {
      const pos: L.LatLngExpression = [latitude, longitude];

      if (markerRef.current) {
        markerRef.current.setLatLng(pos);
      } else {
        // Red pin for active editing marker
        const activeIcon = createCustomPinIcon('#EB3131');
        const marker = L.marker(pos, { 
          draggable: true,
          icon: activeIcon
        }).addTo(map);

        // Update coordinates when marker is dragged
        marker.on('dragend', () => {
          const latLng = marker.getLatLng();
          if (onChange) {
            onChange(Number(latLng.lat.toFixed(4)), Number(latLng.lng.toFixed(4)));
          }
        });

        markerRef.current = marker;
      }

      // Pan to the selected coordinate if map is not centered
      const center = map.getCenter();
      if (Math.abs(center.lat - latitude) > 0.05 || Math.abs(center.lng - longitude) > 0.05) {
        map.setView(pos, map.getZoom() < 8 ? 8 : map.getZoom());
      }
    } else {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    }
  }, [latitude, longitude, readOnly]);

  // Handle dashboard pins plot (Multiple markers)
  useEffect(() => {
    const map = mapRef.current;
    const group = markerGroupRef.current;
    if (!map || !group || !readOnly) return;

    group.clearLayers();

    if (pins && pins.length > 0) {
      const bounds: L.LatLngExpression[] = [];

      pins.forEach(pin => {
        let pinLat: number | null = null;
        let pinLng: number | null = null;

        if (pin.lat !== undefined && pin.lat !== null && pin.lng !== undefined && pin.lng !== null) {
          pinLat = pin.lat;
          pinLng = pin.lng;
        } else if (pin.cx !== undefined && pin.cx !== null && pin.cy !== undefined && pin.cy !== null) {
          // Convert mockup SVG percentages to approximate lat/lng
          const percentX = (pin.cx / 800) * 100;
          const percentY = (pin.cy / 350) * 100;
          pinLng = 95 + (percentX / 100) * 46;
          pinLat = 6 - (percentY / 100) * 17;
        }

        if (pinLat !== null && pinLng !== null) {
          const pos: L.LatLngExpression = [pinLat, pinLng];
          bounds.push(pos);

          // Color-code markers based on type: dark green for varieties/villages
          const pinColor = pin.type === 'Desa' ? '#7A5535' : '#284027'; 
          const icon = createCustomPinIcon(pinColor);
          
          const marker = L.marker(pos, { icon });
          
          const popupContent = `
            <div class="font-sans text-left min-w-[120px]">
              <strong class="text-xs font-extrabold text-kms-green-dark block">${pin.nama}</strong>
              <span class="inline-block mt-1 px-1.5 py-0.5 rounded bg-kms-green-light/30 text-[9px] font-extrabold text-kms-green-dark uppercase">${pin.type}</span>
              <div class="text-[9px] text-gray-400 font-medium mt-2">
                Lintang: ${pinLat.toFixed(4)}<br/>
                Bujur: ${pinLng.toFixed(4)}
              </div>
            </div>
          `;
          
          marker.bindPopup(popupContent);
          marker.bindTooltip(pin.nama, {
            permanent: false,
            direction: 'top',
            className: 'font-sans text-[10px] font-bold text-kms-green-dark px-2 py-1 bg-white border border-kms-green-light rounded-[3px] shadow-sm'
          });

          group.addLayer(marker);
        }
      });

      // Fit map boundaries to display all pins
      if (bounds.length > 0) {
        if (bounds.length === 1) {
          map.setView(bounds[0], 8);
        } else {
          map.fitBounds(L.latLngBounds(bounds), { padding: [40, 40] });
        }
      }
    } else if (latitude !== null && longitude !== null) {
      // Single marker in display mode (e.g. ValidasiDataPage)
      const pos: L.LatLngExpression = [latitude, longitude];
      const icon = createCustomPinIcon('#284027');
      const marker = L.marker(pos, { icon });
      
      const popupContent = `
        <div class="font-sans text-left">
          <strong class="text-xs font-extrabold text-kms-green-dark block">Lokasi Komoditas</strong>
          <div class="text-[9px] text-gray-400 font-medium mt-1">
            Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}
          </div>
        </div>
      `;
      marker.bindPopup(popupContent);
      group.addLayer(marker);
      map.setView(pos, 8);
    }
  }, [pins, latitude, longitude, readOnly]);

  return (
    <div className="space-y-2">
      <div 
        ref={mapContainerRef}
        className="w-full h-56 md:h-64 bg-slate-100 border border-gray-300 rounded-[5px] overflow-hidden shadow-sm"
        style={{ minHeight: '220px' }}
      />
      
      {/* Lat/Lng display inputs */}
      <div className="grid grid-cols-2 gap-3 text-left">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-gray-500 block uppercase tracking-wider">Latitude (Lintang)</span>
          <input 
            type="text" 
            value={latitude !== null ? latitude : ''} 
            readOnly 
            placeholder="Contoh: -7.2575"
            className="w-full border border-gray-300 bg-gray-50 rounded-[5px] px-3 py-2 text-xs outline-none text-gray-700 font-semibold shadow-xs"
          />
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-gray-500 block uppercase tracking-wider">Longitude (Bujur)</span>
          <input 
            type="text" 
            value={longitude !== null ? longitude : ''} 
            readOnly 
            placeholder="Contoh: 112.7521"
            className="w-full border border-gray-300 bg-gray-50 rounded-[5px] px-3 py-2 text-xs outline-none text-gray-700 font-semibold shadow-xs"
          />
        </div>
      </div>
      
      {!readOnly && (
        <p className="text-[10px] text-gray-500 text-left font-medium select-none">
          * Klik pada peta untuk memilih koordinat, atau geser pin merah untuk menyesuaikan posisi.
        </p>
      )}
    </div>
  );
}

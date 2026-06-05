import React, { useState } from 'react';
import { 
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Link, Image, Undo, Redo, Smile, Lock 
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}

export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Tulis deskripsi detail di sini...",
  readOnly = false 
}: RichTextEditorProps): React.ReactElement {
  const [activeStyles, setActiveStyles] = useState<string[]>([]);

  const toggleStyle = (style: string): void => {
    if (readOnly) return;
    setActiveStyles(prev => 
      prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]
    );
  };

  // Mock text editor styling helper
  const getTextAreaStyle = (): string => {
    let classes = "w-full border border-gray-300 rounded-b-[5px] p-3 text-sm outline-none focus:border-kms-blue-accent resize-none min-h-[150px] font-normal ";
    if (activeStyles.includes('bold')) classes += 'font-bold ';
    if (activeStyles.includes('italic')) classes += 'italic ';
    if (activeStyles.includes('underline')) classes += 'underline ';
    return classes;
  };

  return (
    <div className="border border-gray-300 rounded-[5px] overflow-hidden flex flex-col w-full">
      {/* Formatting Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1 items-center select-none">
        
        {/* Undo / Redo */}
        <button 
          type="button"
          onClick={() => !readOnly && alert('Undo action')}
          className="p-1 text-gray-500 hover:bg-gray-200 rounded transition cursor-pointer"
          title="Undo"
          disabled={readOnly}
        >
          <Undo className="w-3.5 h-3.5" />
        </button>
        <button 
          type="button"
          onClick={() => !readOnly && alert('Redo action')}
          className="p-1 text-gray-500 hover:bg-gray-200 rounded transition cursor-pointer"
          title="Redo"
          disabled={readOnly}
        >
          <Redo className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-4 bg-gray-300 mx-1" />

        {/* Text Styles */}
        {[
          { id: 'bold', icon: Bold, label: 'Bold' },
          { id: 'italic', icon: Italic, label: 'Italic' },
          { id: 'underline', icon: Underline, label: 'Underline' }
        ].map(style => (
          <button
            key={style.id}
            type="button"
            onClick={() => toggleStyle(style.id)}
            className={`p-1 rounded transition cursor-pointer ${
              activeStyles.includes(style.id) 
                ? 'bg-kms-green-light text-kms-green-dark font-extrabold' 
                : 'text-gray-600 hover:bg-gray-200'
            }`}
            title={style.label}
            disabled={readOnly}
          >
            <style.icon className="w-3.5 h-3.5" />
          </button>
        ))}

        <div className="w-px h-4 bg-gray-300 mx-1" />

        {/* Alignments */}
        <button 
          type="button" 
          className="p-1 text-gray-600 hover:bg-gray-200 rounded transition cursor-pointer" 
          title="Align Left"
          disabled={readOnly}
        >
          <AlignLeft className="w-3.5 h-3.5" />
        </button>
        <button 
          type="button" 
          className="p-1 text-gray-600 hover:bg-gray-200 rounded transition cursor-pointer" 
          title="Align Center"
          disabled={readOnly}
        >
          <AlignCenter className="w-3.5 h-3.5" />
        </button>
        <button 
          type="button" 
          className="p-1 text-gray-600 hover:bg-gray-200 rounded transition cursor-pointer" 
          title="Align Right"
          disabled={readOnly}
        >
          <AlignRight className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-4 bg-gray-300 mx-1" />

        {/* Lists */}
        <button 
          type="button" 
          className="p-1 text-gray-600 hover:bg-gray-200 rounded transition cursor-pointer" 
          title="Bullet List"
          disabled={readOnly}
        >
          <List className="w-3.5 h-3.5" />
        </button>
        <button 
          type="button" 
          className="p-1 text-gray-600 hover:bg-gray-200 rounded transition cursor-pointer" 
          title="Numbered List"
          disabled={readOnly}
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-4 bg-gray-300 mx-1" />

        {/* Insert Elements */}
        <button 
          type="button" 
          onClick={() => !readOnly && alert('Insert Link')}
          className="p-1 text-gray-600 hover:bg-gray-200 rounded transition cursor-pointer" 
          title="Insert Link"
          disabled={readOnly}
        >
          <Link className="w-3.5 h-3.5" />
        </button>
        <button 
          type="button" 
          onClick={() => !readOnly && alert('Insert Image')}
          className="p-1 text-gray-600 hover:bg-gray-200 rounded transition cursor-pointer" 
          title="Insert Image"
          disabled={readOnly}
        >
          <Image className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-4 bg-gray-300 mx-1" />

        {/* Utilities */}
        <button 
          type="button" 
          className="p-1 text-gray-600 hover:bg-gray-200 rounded transition cursor-pointer" 
          title="Lock Section"
          disabled={readOnly}
        >
          <Lock className="w-3.5 h-3.5" />
        </button>
        <button 
          type="button" 
          className="p-1 text-gray-600 hover:bg-gray-200 rounded transition cursor-pointer" 
          title="Symbol"
          disabled={readOnly}
        >
          <Smile className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Editor Body */}
      {readOnly ? (
        <div className="w-full bg-gray-50 border border-t-0 border-gray-300 rounded-b-[5px] p-3 text-sm min-h-[150px] overflow-y-auto text-gray-700 leading-relaxed font-normal whitespace-pre-wrap">
          {value || <span className="text-gray-400 italic">Tidak ada deskripsi</span>}
        </div>
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={getTextAreaStyle()}
          rows={6}
        />
      )}
    </div>
  );
}

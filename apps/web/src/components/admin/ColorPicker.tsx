
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

export function ColorPicker({ value, onChange, label, className }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const colorRef = useRef<HTMLDivElement>(null);
  
  // Preset colors for quick selection
  const presetColors = [
    "#1A1F2C", "#6E59A5", "#9b87f5", "#333333", "#FFFFFF", 
    "#F97316", "#0EA5E9", "#8B5CF6", "#D946EF", "#F2FCE2",
    "#FEF7CD", "#FEC6A1", "#E5DEFF", "#FFDEE2", "#D3E4FD"
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorRef.current && !colorRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleColorClick = (color: string) => {
    onChange(color);
    setIsOpen(false);
  };

  return (
    <div className={cn("space-y-2 relative", className)} ref={colorRef}>
      {label && <p className="text-sm font-medium">{label}</p>}
      
      <div className="flex gap-2 items-center">
        <Input
          type="text"
          value={value}
          onChange={handleInputChange}
          className="flex-1"
        />
        <button
          type="button"
          className="h-10 w-10 rounded-md border shadow-sm"
          style={{ backgroundColor: value }}
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 p-2 bg-background border rounded-md shadow-lg w-full max-w-md">
          <div className="grid grid-cols-5 gap-2">
            {presetColors.map((color) => (
              <button
                key={color}
                type="button"
                className={cn(
                  "h-8 w-full rounded-md border transition-transform hover:scale-110",
                  value === color && "ring-2 ring-primary"
                )}
                style={{ backgroundColor: color }}
                onClick={() => handleColorClick(color)}
              />
            ))}
          </div>
          <div className="mt-2 pt-2 border-t">
            <input
              type="color"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-8 cursor-pointer rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
}

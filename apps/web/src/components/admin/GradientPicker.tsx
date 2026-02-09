import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { ColorPickerField } from './ColorPickerField';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface GradientPickerProps {
  label: string;
  value: string;
  onChange: (gradient: string) => void;
}

export const GradientPicker = ({ label, value, onChange }: GradientPickerProps) => {
  // Parse gradient or use defaults
  const [color1, setColor1] = useState('#0466C8');
  const [color2, setColor2] = useState('#0355A6');
  const [color3, setColor3] = useState('#023E7D');
  const [direction, setDirection] = useState<'horizontal' | 'vertical' | 'diagonal'>('horizontal');
  const [useThreeColors, setUseThreeColors] = useState(false);

  // Parse existing gradient value on mount
  useEffect(() => {
    if (value && value.includes('linear-gradient')) {
      const match = value.match(/linear-gradient\((\d+)deg,\s*(#[0-9A-Fa-f]{6})\s+\d+%,\s*(#[0-9A-Fa-f]{6})\s+\d+%(?:,\s*(#[0-9A-Fa-f]{6})\s+\d+%)?\)/);
      if (match) {
        const deg = parseInt(match[1]);
        setColor1(match[2]);
        setColor2(match[3]);
        if (match[4]) {
          setColor3(match[4]);
          setUseThreeColors(true);
        }

        // Determine direction from degrees
        if (deg === 90) setDirection('horizontal');
        else if (deg === 180) setDirection('vertical');
        else if (deg === 135) setDirection('diagonal');
      }
    }
  }, []);

  // Generate gradient string
  const generateGradient = (c1: string, c2: string, c3: string, dir: string, three: boolean) => {
    const degrees = dir === 'horizontal' ? 90 : dir === 'vertical' ? 180 : 135;

    if (three) {
      return `linear-gradient(${degrees}deg, ${c1} 0%, ${c2} 50%, ${c3} 100%)`;
    } else {
      return `linear-gradient(${degrees}deg, ${c1} 0%, ${c2} 100%)`;
    }
  };

  // Update gradient when any value changes
  useEffect(() => {
    const gradient = generateGradient(color1, color2, color3, direction, useThreeColors);
    onChange(gradient);
  }, [color1, color2, color3, direction, useThreeColors]);

  return (
    <div className="space-y-4">
      <Label>{label}</Label>

      {/* Preview */}
      <div
        className="h-20 rounded-lg border-2 border-gray-300"
        style={{
          background: generateGradient(color1, color2, color3, direction, useThreeColors)
        }}
      />

      {/* Direction */}
      <div className="space-y-2">
        <Label className="text-sm">Direção do Gradiente</Label>
        <RadioGroup value={direction} onValueChange={(val) => setDirection(val as any)}>
          <div className="flex gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="horizontal" id={`${label}-horizontal`} />
              <Label htmlFor={`${label}-horizontal`} className="font-normal cursor-pointer">
                Horizontal →
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="vertical" id={`${label}-vertical`} />
              <Label htmlFor={`${label}-vertical`} className="font-normal cursor-pointer">
                Vertical ↓
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="diagonal" id={`${label}-diagonal`} />
              <Label htmlFor={`${label}-diagonal`} className="font-normal cursor-pointer">
                Diagonal ↘
              </Label>
            </div>
          </div>
        </RadioGroup>
      </div>

      {/* Number of colors */}
      <div className="space-y-2">
        <Label className="text-sm">Número de Cores</Label>
        <RadioGroup value={useThreeColors ? 'three' : 'two'} onValueChange={(val) => setUseThreeColors(val === 'three')}>
          <div className="flex gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="two" id={`${label}-two-colors`} />
              <Label htmlFor={`${label}-two-colors`} className="font-normal cursor-pointer">
                2 Cores
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="three" id={`${label}-three-colors`} />
              <Label htmlFor={`${label}-three-colors`} className="font-normal cursor-pointer">
                3 Cores
              </Label>
            </div>
          </div>
        </RadioGroup>
      </div>

      {/* Color pickers */}
      <div className="grid grid-cols-2 gap-4">
        <ColorPickerField
          label="Cor 1"
          value={color1}
          onChange={setColor1}
        />
        <ColorPickerField
          label="Cor 2"
          value={color2}
          onChange={setColor2}
        />
        {useThreeColors && (
          <ColorPickerField
            label="Cor 3"
            value={color3}
            onChange={setColor3}
          />
        )}
      </div>

      {/* CSS Output */}
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">CSS Gerado:</Label>
        <code className="text-xs bg-gray-100 p-2 rounded block break-all">
          {generateGradient(color1, color2, color3, direction, useThreeColors)}
        </code>
      </div>
    </div>
  );
};

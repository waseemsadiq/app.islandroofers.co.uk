import { useMemo } from 'react';

interface RoofShapeSelectorProps {
  selectedShape: string;
  onShapeSelect: (shape: string) => void;
}

export default function RoofShapeSelector({ selectedShape, onShapeSelect }: RoofShapeSelectorProps) {
  const shapes = useMemo(() => [
    {
      id: 'rectangle',
      title: 'Rectangle',
      svg: (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect x="10" y="20" width="80" height="60" className="fill-current" />
        </svg>
      ),
    },
    {
      id: 'l-shape',
      title: 'L-Shaped',
      svg: (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path
            d="M10 20h80v30h-50v30h-30v-60z"
            className="fill-current"
          />
        </svg>
      ),
    },
    {
      id: 'h-shape',
      title: 'H-Shaped',
      svg: (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path
            d="M10 20h25v60h-25zM35 35h30v30h-30zM65 20h25v60h-25z"
            className="fill-current"
          />
        </svg>
      ),
    },
    {
      id: 'c-shape',
      title: 'C-Shaped',
      svg: (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path
            d="M10 20h80v20h-50v20h50v20h-80v-60z"
            className="fill-current"
          />
        </svg>
      ),
    },
  ], []);

  return (
    <div className="grid grid-cols-2 gap-4">
      {shapes.map((shape) => (
        <button
          key={shape.id}
          onClick={() => onShapeSelect(shape.id)}
          className={`p-4 rounded-lg border-2 transition-all ${
            selectedShape === shape.id
              ? 'border-blue-600 bg-blue-50 text-blue-600'
              : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-800'
          }`}
        >
          <div className="aspect-square w-full mb-2">
            {shape.svg}
          </div>
          <span className="block text-sm font-medium">{shape.title}</span>
        </button>
      ))}
    </div>
  );
}

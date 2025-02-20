interface RoofDimensionDiagramProps {
  shape: string;
  unit: string;
}

export default function RoofDimensionDiagram({ shape, unit }: RoofDimensionDiagramProps) {
  const renderShape = () => {
    switch (shape) {
      case 'rectangle':
        return (
          <svg viewBox="0 0 300 200" className="w-full">
            <rect x="40" y="40" width="220" height="120" className="fill-gray-100 stroke-gray-400" strokeWidth="2" />
            
            {/* Width arrow and label */}
            <line x1="40" y1="20" x2="260" y2="20" className="stroke-blue-500" strokeWidth="2" markerEnd="url(#arrowhead)" markerStart="url(#arrowhead)" />
            <text x="150" y="15" className="text-sm text-blue-600 text-center" textAnchor="middle">Width ({unit})</text>
            
            {/* Length arrow and label */}
            <line x1="280" y1="40" x2="280" y2="160" className="stroke-blue-500" strokeWidth="2" markerEnd="url(#arrowhead)" markerStart="url(#arrowhead)" />
            <text x="260" y="105" className="text-sm text-blue-600" textAnchor="start" transform="rotate(90, 295, 100)">Length ({unit})</text>
            
            {/* Arrow markers */}
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" className="fill-blue-500" />
              </marker>
            </defs>
          </svg>
        );
      
      case 'l-shape':
        return (
          <svg viewBox="0 0 300 200" className="w-full">
            <path d="M40 40h220v60h-120v60h-100z" className="fill-gray-100 stroke-gray-400" strokeWidth="2" />
            
            {/* Main width arrow */}
            <line x1="40" y1="20" x2="260" y2="20" className="stroke-blue-500" strokeWidth="2" markerEnd="url(#arrowhead)" markerStart="url(#arrowhead)" />
            <text x="150" y="15" className="text-sm text-blue-600" textAnchor="middle">Width ({unit})</text>
            
            {/* Main length arrow */}
            <line x1="280" y1="40" x2="280" y2="100" className="stroke-blue-500" strokeWidth="2" markerEnd="url(#arrowhead)" markerStart="url(#arrowhead)" />
            <text x="250" y="75" className="text-sm text-blue-600" textAnchor="start" transform="rotate(90, 295, 70)">Length ({unit})</text>
            
            {/* Section B width arrow */}
            <line x1="40" y1="180" x2="140" y2="180" className="stroke-green-500" strokeWidth="2" markerEnd="url(#arrowhead-green)" markerStart="url(#arrowhead-green)" />
            <text x="90" y="175" className="text-sm text-green-600" textAnchor="middle">Width B ({unit})</text>
            
            {/* Section B length arrow */}
            <line x1="20" y1="100" x2="20" y2="160" className="stroke-green-500" strokeWidth="2" markerEnd="url(#arrowhead-green)" markerStart="url(#arrowhead-green)" />
            <text x="70" y="125" className="text-sm text-green-600" textAnchor="end" transform="rotate(-90, 15, 130)">Length B ({unit})</text>
            
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" className="fill-blue-500" />
              </marker>
              <marker id="arrowhead-green" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" className="fill-green-500" />
              </marker>
            </defs>
          </svg>
        );
      
      case 'h-shape':
        return (
          <svg viewBox="0 0 300 200" className="w-full">
            <path d="M40 40h60v120h-60zM100 80h100v40h-100zM200 40h60v120h-60z" className="fill-gray-100 stroke-gray-400" strokeWidth="2" />
            
            {/* Main section arrows */}
            <line x1="40" y1="20" x2="100" y2="20" className="stroke-blue-500" strokeWidth="2" markerEnd="url(#arrowhead)" markerStart="url(#arrowhead)" />
            <text x="70" y="15" className="text-sm text-blue-600" textAnchor="middle">Width ({unit})</text>
            
            <line x1="20" y1="40" x2="20" y2="160" className="stroke-blue-500" strokeWidth="2" markerEnd="url(#arrowhead)" markerStart="url(#arrowhead)" />
            <text x="60" y="95" className="text-sm text-blue-600" textAnchor="end" transform="rotate(-90, 15, 100)">Length ({unit})</text>
            
            {/* Section B arrows */}
            <line x1="100" y1="70" x2="200" y2="70" className="stroke-green-500" strokeWidth="2" markerEnd="url(#arrowhead-green)" markerStart="url(#arrowhead-green)" />
            <text x="150" y="65" className="text-sm text-green-600" textAnchor="middle">Width B ({unit})</text>
            
            <line x1="210" y1="80" x2="210" y2="120" className="stroke-green-500" strokeWidth="2" markerEnd="url(#arrowhead-green)" markerStart="url(#arrowhead-green)" />
            <text x="225" y="100" className="text-sm text-green-600" textAnchor="middle">Length B ({unit})</text>
            
            {/* Section C arrows */}
            <line x1="200" y1="20" x2="260" y2="20" className="stroke-purple-500" strokeWidth="2" markerEnd="url(#arrowhead-purple)" markerStart="url(#arrowhead-purple)" />
            <text x="230" y="15" className="text-sm text-purple-600" textAnchor="middle">Width C ({unit})</text>
            
            <line x1="280" y1="40" x2="280" y2="160" className="stroke-purple-500" strokeWidth="2" markerEnd="url(#arrowhead-purple)" markerStart="url(#arrowhead-purple)" />
            <text x="245" y="105" className="text-sm text-purple-600" textAnchor="start" transform="rotate(90, 295, 100)">Length C ({unit})</text>
            
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" className="fill-blue-500" />
              </marker>
              <marker id="arrowhead-green" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" className="fill-green-500" />
              </marker>
              <marker id="arrowhead-purple" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" className="fill-purple-500" />
              </marker>
            </defs>
          </svg>
        );
      
      case 'c-shape':
        return (
          <svg viewBox="0 0 300 200" className="w-full">
            <path d="M40 40h220v40h-120v40h120v40h-220z" className="fill-gray-100 stroke-gray-400" strokeWidth="2" />
            
            {/* Main section arrows */}
            <line x1="40" y1="20" x2="260" y2="20" className="stroke-blue-500" strokeWidth="2" markerEnd="url(#arrowhead)" markerStart="url(#arrowhead)" />
            <text x="150" y="15" className="text-sm text-blue-600" textAnchor="middle">Width ({unit})</text>
            
            <line x1="20" y1="40" x2="20" y2="160" className="stroke-blue-500" strokeWidth="2" markerEnd="url(#arrowhead)" markerStart="url(#arrowhead)" />
            <text x="60" y="95" className="text-sm text-blue-600" textAnchor="end" transform="rotate(-90, 15, 100)">Length ({unit})</text>
            
            {/* Section B arrows */}
            <line x1="140" y1="90" x2="260" y2="90" className="stroke-green-500" strokeWidth="2" markerEnd="url(#arrowhead-green)" markerStart="url(#arrowhead-green)" />
            <text x="200" y="105" className="text-sm text-green-600" textAnchor="middle">Width B ({unit})</text>
            
            <line x1="280" y1="80" x2="280" y2="120" className="stroke-green-500" strokeWidth="2" markerEnd="url(#arrowhead-green)" markerStart="url(#arrowhead-green)" />
            <text x="245" y="105" className="text-sm text-green-600" textAnchor="start" transform="rotate(90, 295, 100)">Length B ({unit})</text>
            
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" className="fill-blue-500" />
              </marker>
              <marker id="arrowhead-green" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" className="fill-green-500" />
              </marker>
            </defs>
          </svg>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-white rounded-lg p-4 border border-gray-200">
      {renderShape()}
    </div>
  );
}

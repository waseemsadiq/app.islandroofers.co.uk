import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';

interface Address {
  display_name: string;
  lat: string;
  lon: string;
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string, latitude?: number, longitude?: number) => void;
  onBlur?: () => void;
}

export default function AddressAutocomplete({ value, onChange, onBlur }: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<Address[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<number>();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            value
          )},UK&addressdetails=1&limit=5`
        );
        const data = await response.json();
        setSuggestions(data);
        setIsOpen(true);
      } catch (error) {
        console.error('Error fetching address suggestions:', error);
      } finally {
        setLoading(false);
      }
    };

    timeoutRef.current = window.setTimeout(fetchSuggestions, 300);

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [value]);

  const handleSelect = (address: Address) => {
    onChange(address.display_name, parseFloat(address.lat), parseFloat(address.lon));
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => {
            // Delay closing to allow clicking on suggestions
            setTimeout(() => onBlur?.(), 200);
          }}
          className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Start typing to search address..."
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        {loading && (
          <div className="absolute right-3 top-2.5">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200">
          <ul className="py-1 max-h-60 overflow-auto">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSelect(suggestion)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                {suggestion.display_name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { Search, X, Filter } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onClear: () => void;
  onFilterToggle: () => void;
  placeholder?: string;
}

export const SearchBar = ({ 
  onSearch, 
  onClear, 
  onFilterToggle,
  placeholder = "Buscar Pokemon..." 
}: SearchBarProps) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onClear();
  };

  return (
    <div className="relative w-full max-w-md">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-20 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
          />
          
          {/* Botones de acción */}
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            
            <button
              type="button"
              onClick={onFilterToggle}
              className="p-1.5 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
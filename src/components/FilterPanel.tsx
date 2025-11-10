import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { pokemonService } from '../services/pokemonService';
import { formatPokemonName, getTypeColor } from '../utils/pokemon';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onTypeFilter: (type: string | null) => void;
}

export const FilterPanel = ({ isOpen, onClose, onTypeFilter }: FilterPanelProps) => {
  const [types, setTypes] = useState<Array<{ name: string; url: string }>>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && types.length === 0) {
      loadTypes();
    }
  }, [isOpen, types.length]);

  const loadTypes = async () => {
    setLoading(true);
    try {
      const typeList = await pokemonService.getTypes();
      // Filtrar algunos tipos que no son tan relevantes
      const filteredTypes = typeList.filter(type => 
        !['unknown', 'shadow'].includes(type.name)
      );
      setTypes(filteredTypes);
    } catch (error) {
      console.error('Error loading types:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTypeSelect = (type: string) => {
    const newSelectedType = selectedType === type ? null : type;
    setSelectedType(newSelectedType);
    onTypeFilter(newSelectedType);
  };

  const handleClearFilters = () => {
    setSelectedType(null);
    onTypeFilter(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Filtrar por Tipo</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-96">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2" />
              <p className="text-sm text-gray-600">Cargando tipos...</p>
            </div>
          ) : (
            <>
              {/* Clear filters button */}
              <button
                onClick={handleClearFilters}
                className={`w-full mb-4 p-3 rounded-lg border-2 border-dashed transition-colors ${
                  selectedType === null
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 text-gray-600 hover:border-gray-400'
                }`}
              >
                Todos los tipos
              </button>

              {/* Type buttons */}
              <div className="grid grid-cols-2 gap-3">
                {types.map((type) => (
                  <button
                    key={type.name}
                    onClick={() => handleTypeSelect(type.name)}
                    className={`p-3 rounded-lg text-white font-medium transition-all transform hover:scale-105 ${
                      selectedType === type.name
                        ? 'ring-2 ring-white ring-opacity-60 shadow-lg'
                        : 'hover:shadow-md'
                    }`}
                    style={{
                      backgroundColor: getTypeColor(type.name),
                      opacity: selectedType === type.name ? 1 : 0.9
                    }}
                  >
                    {formatPokemonName(type.name)}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {selectedType && (
          <div className="p-4 bg-gray-50 border-t">
            <p className="text-sm text-gray-600 text-center">
              Filtrando por tipo: <span className="font-medium">{formatPokemonName(selectedType)}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
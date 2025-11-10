import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import type { Pokemon } from "../types/pokemon";
import { PokemonCard } from "./PokemonCard";

interface PokemonListProps {
  pokemon: Pokemon[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onNextPage: () => void;
  onPrevPage: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
  onPokemonClick: (pokemon: Pokemon) => void;
  showPagination?: boolean;
}

export const PokemonList = ({
  pokemon,
  loading,
  currentPage,
  totalPages,
  onPageChange,
  onNextPage,
  onPrevPage,
  canGoNext,
  canGoPrev,
  onPokemonClick,
  showPagination = true,
}: PokemonListProps) => {
  if (pokemon.length === 0 && loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando Pokemon...</p>
        </div>
      </div>
    );
  }

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 4;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
      const end = Math.min(totalPages, start + maxVisible - 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  return (
    <div className="space-y-8">
      {/* Grid de Pokemon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {pokemon.map((p) => (
          <PokemonCard
            key={p.id}
            pokemon={p}
            onClick={() => onPokemonClick(p)}
          />
        ))}
      </div>

      {/* Loading state para cambio de página */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="text-center">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Cargando Pokemon...</p>
          </div>
        </div>
      )}

      {/* Paginación */}
      {showPagination && totalPages > 1 && !loading && (
        <div className="flex justify-center items-center space-x-1 sm:space-x-2 py-6 sm:py-8">
          {/* Botón Anterior */}
          <button
            onClick={onPrevPage}
            disabled={!canGoPrev}
            className={`flex items-center space-x-1 sm:space-x-2 px-2 py-1 sm:px-4 sm:py-2 rounded-md sm:rounded-lg text-sm sm:text-base font-medium transition-all duration-200 ${
              canGoPrev
                ? "bg-green-600 text-white hover:bg-green-700 hover:scale-105 shadow-md sm:shadow-lg"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Anterior</span>
          </button>

          {/* Números de página */}
          <div className="flex space-x-1 sm:space-x-2">
            {getPageNumbers().map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-md sm:rounded-lg text-sm sm:text-base font-medium transition-all duration-200 ${
                  pageNum === currentPage
                    ? "bg-green-600 text-white shadow-md sm:shadow-lg scale-105 sm:scale-110"
                    : "bg-white text-gray-700 hover:bg-green-50 hover:text-green-600 border border-gray-200 hover:border-green-300"
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>

          {/* Botón Siguiente */}
          <button
            onClick={onNextPage}
            disabled={!canGoNext}
            className={`flex items-center space-x-1 sm:space-x-2 px-2 py-1 sm:px-4 sm:py-2 rounded-md sm:rounded-lg text-sm sm:text-base font-medium transition-all duration-200 ${
              canGoNext
                ? "bg-green-600 text-white hover:bg-green-700 hover:scale-105 shadow-md sm:shadow-lg"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <span>Siguiente</span>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      )}

      {/* Mensaje si no hay Pokemon */}
      {pokemon.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No se encontraron Pokemon</p>
        </div>
      )}
    </div>
  );
};

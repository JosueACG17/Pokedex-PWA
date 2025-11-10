import { useState, useEffect } from 'react';
import { Heart, Home, RefreshCw } from 'lucide-react';
import type { Pokemon } from './types/pokemon';
import { PokemonList } from './components/PokemonList';
import { PokemonModal } from './components/PokemonModal';
import { SearchBar } from './components/SearchBar';
import { ConnectivityIndicator } from './components/ConnectivityIndicator';
import { FilterPanel } from './components/FilterPanel';
import { usePokemonList } from './hooks/usePokemonList';
import { usePokemonSearch } from './hooks/usePokemonSearch';
import { useFavorites } from './hooks/useFavorites';
import { pokemonService } from './services/pokemonService';
import { favoritesManager } from './utils/storage';
import './App.css';

type ViewMode = 'home' | 'favorites' | 'search' | 'filter';

function App() {
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [showFilters, setShowFilters] = useState(false);
  const [favoritePokemons, setFavoritePokemons] = useState<Pokemon[]>([]);
  const [filteredPokemons, setFilteredPokemons] = useState<Pokemon[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const { 
    pokemon, 
    loading, 
    currentPage,
    totalPages,
    totalCount,
    goToPage,
    nextPage,
    prevPage,
    refresh,
    canGoNext,
    canGoPrev
  } = usePokemonList(32);

  const { 
    searchResults, 
    loading: searchLoading, 
    searchPokemon, 
    clearResults 
  } = usePokemonSearch();

  const { favorites } = useFavorites();

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          favoritesManager.sendNotification('¡Bienvenido a PokePWA!');
        }
      });
    }
  }, []);

  useEffect(() => {
    const loadFavoritePokemons = async () => {
      if (favorites.length > 0) {
        try {
          const favPokemons = await Promise.all(
            favorites.map(id => pokemonService.getPokemonDetails(id))
          );
          setFavoritePokemons(favPokemons);
        } catch (error) {
          console.error('Error loading favorite pokemons:', error);
        }
      } else {
        setFavoritePokemons([]);
      }
    };

    loadFavoritePokemons();
  }, [favorites]);

  useEffect(() => {
    const loadFilteredPokemons = async () => {
      if (selectedType && viewMode === 'filter') {
        try {
          const typePokemons = await pokemonService.getPokemonByType(selectedType);
          setFilteredPokemons(typePokemons);
        } catch (error) {
          console.error('Error loading filtered pokemons:', error);
        }
      }
    };

    loadFilteredPokemons();
  }, [selectedType, viewMode]);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      setViewMode('search');
      searchPokemon(query);
    }
  };

  const handleClearSearch = () => {
    clearResults();
    setViewMode('home');
  };

  const handleTypeFilter = (type: string | null) => {
    if (type) {
      setSelectedType(type);
      setViewMode('filter');
      setShowFilters(false);
    } else {
      setSelectedType(null);
      setViewMode('home');
    }
  };

  const handlePokemonClick = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
  };

  const handleRefresh = () => {
    if (viewMode === 'home') {
      refresh();
    } else if (viewMode === 'search') {
      clearResults();
      setViewMode('home');
    }
    favoritesManager.sendNotification('¡Lista actualizada!', '🔄');
  };

  const getCurrentList = () => {
    switch (viewMode) {
      case 'favorites':
        return favoritePokemons;
      case 'search':
        return searchResults;
      case 'filter':
        return filteredPokemons;
      default:
        return pokemon;
    }
  };

  const getCurrentLoading = () => {
    return viewMode === 'search' ? searchLoading : loading;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Pok%C3%A9_Ball_icon.svg/1026px-Pok%C3%A9_Ball_icon.svg.png" alt="PokePWA Logo" className="w-8 h-8" />
              <h1 className="ml-3 text-xl font-bold text-gray-900">Pokedex PWA</h1>
            </div>

            {/* Navigation */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setViewMode('home')}
                className={`p-2 rounded-full transition-colors ${
                  viewMode === 'home'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Home size={20} />
              </button>
              
              <button
                onClick={() => setViewMode('favorites')}
                className={`p-2 rounded-full transition-colors relative ${
                  viewMode === 'favorites'
                    ? 'bg-red-100 text-red-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Heart size={20} />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </button>

              <button
                onClick={handleRefresh}
                className="p-2 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
              >
                <RefreshCw size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <SearchBar
              onSearch={handleSearch}
              onClear={handleClearSearch}
              onFilterToggle={() => setShowFilters(!showFilters)}
              placeholder="Busca tu Pokemon favorito..."
            />
          
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {(() => {
              if (viewMode === 'home') {
                return 'Todos los Pokemon';
              } else if (viewMode === 'favorites') {
                return 'Tus Pokemon Favoritos';
              } else if (viewMode === 'search') {
                return 'Resultados de Búsqueda';
              } else if (viewMode === 'filter') {
                return `Pokemon tipo ${selectedType ? selectedType.charAt(0).toUpperCase() + selectedType.slice(1) : ''}`;
              }
              return 'Todos los Pokemon';
            })()}
          </h2>
          <p className="text-gray-600">
            {(() => {
              if (viewMode === 'home') {
                return 'Descubre y colecciona todos los Pokemon';
              } else if (viewMode === 'favorites') {
                return favorites.length > 0 
                  ? `${favorites.length} Pokemon${favorites.length !== 1 ? 's' : ''} en tu colección`
                  : 'Aún no tienes Pokemon favoritos';
              } else if (viewMode === 'search') {
                return 'Encuentra el Pokemon que buscas';
              } else if (viewMode === 'filter') {
                return `Explorando Pokemon de tipo ${selectedType}`;
              }
              return 'Descubre y colecciona todos los Pokemon';
            })()}
          </p>
        </div>

        {/* Pokemon List */}
        {viewMode === 'favorites' && favorites.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Sin Pokemon favoritos
            </h3>
            <p className="text-gray-500 mb-6">
              Explora y marca tus Pokemon favoritos tocando el corazón
            </p>
            <button
              onClick={() => setViewMode('home')}
              className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
            >
              Explorar Pokemon
            </button>
          </div>
        ) : (
          
          <PokemonList
            pokemon={getCurrentList()}
            loading={getCurrentLoading()}
            currentPage={viewMode === 'home' ? currentPage : 1}
            totalPages={viewMode === 'home' ? totalPages : 1}
            totalCount={viewMode === 'home' ? totalCount : getCurrentList().length}
            onPageChange={goToPage}
            onNextPage={nextPage}
            onPrevPage={prevPage}
            canGoNext={viewMode === 'home' ? canGoNext : false}
            canGoPrev={viewMode === 'home' ? canGoPrev : false}
            onPokemonClick={handlePokemonClick}
            showPagination={viewMode === 'home'}
          />
        )}
        {/* Información de paginación */}
          {viewMode === 'home' && totalCount > 0 && (
            <div className="text-center text-sm text-gray-500">
              Página {currentPage} de {totalPages} • {totalCount} Pokemon en total
            </div>
          )}
      </main>

      {/* Connectivity Indicator */}
      <ConnectivityIndicator />

      {/* Pokemon Modal */}
      <PokemonModal
        pokemon={selectedPokemon}
        isOpen={!!selectedPokemon}
        onClose={() => setSelectedPokemon(null)}
      />

      {/* Filter Panel */}
      <FilterPanel
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onTypeFilter={handleTypeFilter}
      />
    </div>
  );
}

export default App;

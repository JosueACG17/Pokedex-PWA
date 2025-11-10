import { Heart } from 'lucide-react';
import type { Pokemon } from '../types/pokemon';
import { formatPokemonId, formatPokemonName, getTypeColor } from '../utils/pokemon';
import { useFavorites } from '../hooks/useFavorites';

interface PokemonCardProps {
  pokemon: Pokemon;
  onClick: () => void;
}

export const PokemonCard = ({ pokemon, onClick }: PokemonCardProps) => {
  const { isFavorite, toggleFavoriteWithPokemon } = useFavorites();
  const isLiked = isFavorite(pokemon.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavoriteWithPokemon(pokemon);
  };

  const mainType = pokemon.types[0]?.type.name || 'normal';
  const typeColor = getTypeColor(mainType);

  return (
    <div
      className="relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 overflow-hidden"
      onClick={onClick}
      style={{
        background: `linear-gradient(135deg, ${typeColor}20 0%, white 50%)`
      }}
    >
      {/* Botón de favorito */}
      <button
        onClick={handleFavoriteClick}
        className="cursor-pointer absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
      >
        <Heart
          size={20}
          className={`${
            isLiked
              ? 'fill-red-500 text-red-500'
              : 'text-gray-400 hover:text-red-500'
          } transition-colors`}
        />
      </button>

      {/* Imagen del Pokemon */}
      <div className="relative pt-6 pb-4">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div
            className="w-32 h-32 rounded-full blur-2xl mx-auto mt-4"
            style={{ backgroundColor: typeColor }}
          />
        </div>
        <img
          src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
          alt={pokemon.name}
          className="w-24 h-24 mx-auto relative z-10 drop-shadow-lg"
          loading="lazy"
        />
      </div>

      {/* Información del Pokemon */}
      <div className="px-4 pb-4">
        <div className="text-center">
          <p className="text-sm font-medium text-gray-500 mb-1">
            {formatPokemonId(pokemon.id)}
          </p>
          <h3 className="text-lg font-bold text-gray-800 mb-3">
            {formatPokemonName(pokemon.name)}
          </h3>
          
          {/* Tipos */}
          <div className="flex justify-center gap-2 mb-3">
            {pokemon.types.map((type) => (
              <span
                key={type.type.name}
                className="px-3 py-1 text-xs font-medium text-white rounded-full"
                style={{ backgroundColor: getTypeColor(type.type.name) }}
              >
                {formatPokemonName(type.type.name)}
              </span>
            ))}
          </div>

          {/* Stats básicas */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-gray-50 rounded-lg p-2">
              <p className="text-gray-600">HP</p>
              <p className="font-bold text-gray-800">
                {pokemon.stats.find(s => s.stat.name === 'hp')?.base_stat || 0}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <p className="text-gray-600">ATK</p>
              <p className="font-bold text-gray-800">
                {pokemon.stats.find(s => s.stat.name === 'attack')?.base_stat || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
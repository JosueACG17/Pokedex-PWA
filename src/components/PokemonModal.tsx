import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Zap, Star, Shield, Swords, Activity, TrendingUp, Award } from 'lucide-react';
import type { Pokemon } from '../types/pokemon';
import { getTypeColor, formatPokemonName, formatPokemonId } from '../utils/pokemon';
import { useFavorites } from '../hooks/useFavorites';

interface PokemonModalProps {
  pokemon: Pokemon | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PokemonModal = ({ pokemon, isOpen, onClose }: PokemonModalProps) => {
  const { isFavorite, toggleFavoriteWithPokemon } = useFavorites();

  if (!pokemon) return null;

  const isLiked = isFavorite(pokemon.id);
  const mainType = pokemon.types[0]?.type.name || 'normal';
  const typeColor = getTypeColor(mainType);
  const totalStats = pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getStatIcon = (statName: string) => {
    switch (statName) {
      case 'hp': return <Heart className="w-5 h-5" />;
      case 'attack': return <Swords className="w-5 h-5" />;
      case 'defense': return <Shield className="w-5 h-5" />;
      case 'special-attack': return <Star className="w-5 h-5" />;
      case 'special-defense': return <Activity className="w-5 h-5" />;
      case 'speed': return <TrendingUp className="w-5 h-5" />;
      default: return <Zap className="w-5 h-5" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
            className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Section */}
            <div 
              className="relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${typeColor}15 0%, ${typeColor}25 100%)`
              }}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div 
                  className="w-full h-full"
                  style={{
                    backgroundImage: `radial-gradient(circle at 20% 80%, ${typeColor} 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${typeColor} 0%, transparent 50%)`,
                  }}
                />
              </div>

              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="cursor-pointer absolute top-6 right-6 p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200 z-10"
              >
                <X className="w-6 h-6 text-gray-600" />
              </motion.button>

              <div className="relative p-8 lg:p-12">
                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                  {/* Pokemon Image Section */}
                  <motion.div 
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="relative"
                  >
                    {/* Image Container */}
                    <div className="relative">
                      <div 
                        className="w-80 h-80 rounded-full p-6 shadow-2xl"
                        style={{
                          background: `linear-gradient(135deg, white 0%, ${typeColor}10 100%)`
                        }}
                      >
                        <motion.img
                          initial={{ scale: 0.8, rotate: -10 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
                          src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                          alt={pokemon.name}
                          className="w-full h-full object-contain drop-shadow-2xl"
                        />
                      </div>
                    </div>

                    {/* Favorite Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleFavoriteWithPokemon(pokemon)}
                      className="cursor-pointer absolute -bottom-4 -right-4 p-4 rounded-full bg-white shadow-2xl hover:shadow-3xl transition-all duration-300"
                    >
                      <Heart
                        size={28}
                        className={`${
                          isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'
                        } transition-colors duration-300`}
                      />
                    </motion.button>
                  </motion.div>

                  {/* Pokemon Info Section */}
                  <motion.div 
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.2 }}
                    className="flex-1 text-center lg:text-left space-y-6"
                  >
                    {/* ID Badge */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
                      className="inline-flex items-center px-4 py-2 rounded-full bg-white shadow-lg"
                    >
                      <Award className="w-4 h-4 mr-2" style={{ color: typeColor }} />
                      <span className="text-lg font-bold text-gray-700">{formatPokemonId(pokemon.id)}</span>
                    </motion.div>

                    {/* Pokemon Name */}
                    <motion.h1
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="text-5xl lg:text-6xl font-black text-gray-900 leading-tight"
                    >
                      {formatPokemonName(pokemon.name)}
                    </motion.h1>

                    {/* Types */}
                    <motion.div 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                      className="flex flex-wrap gap-3 justify-center lg:justify-start"
                    >
                      {pokemon.types.map((type, index) => (
                        <motion.span
                          key={type.type.name}
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ 
                            delay: 0.1 + index * 0.1, 
                            duration: 0.1,
                            type: "spring",
                            stiffness: 200
                          }}
                          className="px-6 py-3 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                          style={{ backgroundColor: getTypeColor(type.type.name) }}
                        >
                          {formatPokemonName(type.type.name)}
                        </motion.span>
                      ))}
                    </motion.div>

                    {/* Quick Stats */}
                    <motion.div
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                      className="grid grid-cols-3 gap-4 pt-4"
                    >
                      <div className="text-center p-4 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg">
                        <div className="text-3xl font-black text-gray-900">{totalStats}</div>
                        <div className="text-xs lg:text-sm text-gray-600 font-medium ">Estadísticas Totales</div>
                      </div>
                      <div className="text-center p-4 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg">
                        <div className="text-3xl font-black text-gray-900">{pokemon.base_experience}</div>
                        <div className="text-xs lg:text-sm text-gray-600 font-medium ">Experiencia Base</div>
                      </div>
                      <div className="text-center p-4 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg">
                        <div className="text-3xl font-black text-gray-900">
                          {pokemon.stats.find(s => s.stat.name === 'hp')?.base_stat || 0}
                        </div>
                        <div className="text-xs lg:text-sm text-gray-600 font-medium">Vida</div>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="px-8 py-6 lg:px-12 lg:py-8">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Estadísticas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pokemon.stats.map((stat, index) => (
                    <motion.div
                      key={stat.stat.name}
                      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl hover:shadow-lg transition-all duration-300"
                    >
                      <div 
                        className="p-3 rounded-xl shadow-md"
                        style={{ backgroundColor: `${typeColor}15` }}
                      >
                        {getStatIcon(stat.stat.name)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-700 capitalize">
                            {stat.stat.name.replace('-', ' ')}
                          </span>
                          <span className="font-bold text-xl text-gray-900">{stat.base_stat}</span>
                        </div>
                        <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((stat.base_stat / 200) * 100, 100)}%` }}
                            transition={{ duration: 1.5, delay: 1 + index * 0.1 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: typeColor }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Additional Info Section */}
            <div className="px-8 pb-8 lg:px-12 lg:pb-12">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="bg-gray-50 rounded-3xl p-6 lg:p-8"
              >
                <h4 className="text-xl font-bold text-gray-800 mb-6">Información Física</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-white rounded-2xl shadow-sm">
                    <div className="text-2xl font-black text-gray-900">{pokemon.height / 10} m</div>
                    <div className="text-sm text-gray-600 font-medium tracking-wide">Altura</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-2xl shadow-sm">
                    <div className="text-2xl font-black text-gray-900">{pokemon.weight / 10} kg</div>
                    <div className="text-sm text-gray-600 font-medium tracking-wide">Peso</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-2xl shadow-sm">
                    <div className="text-2xl font-black text-gray-900">{pokemon.base_experience}</div>
                    <div className="text-sm text-gray-600 font-medium tracking-wide">Experiencia Base</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-2xl shadow-sm">
                    <div className="text-2xl font-black text-gray-900">{pokemon.abilities?.length || 0}</div>
                    <div className="text-sm text-gray-600 font-medium tracking-wide">Habilidades</div>
                  </div>
                </div>

                {pokemon.abilities && pokemon.abilities.length > 0 && (
                  <div className="mt-6">
                    <h5 className="font-bold text-gray-700 mb-3">Habilidades</h5>
                    <div className="flex flex-wrap gap-3">
                      {pokemon.abilities.map((ability, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1.3 + index * 0.1 }}
                          className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm border-2"
                          style={{ borderColor: `${typeColor}30` }}
                        >
                          {formatPokemonName(ability.ability.name)}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
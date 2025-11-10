export const typeColors: Record<string, string> = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC'
};

export const getTypeColor = (typeName: string): string => {
  return typeColors[typeName.toLowerCase()] || '#68A090';
};

export const formatPokemonId = (id: number): string => {
  return `#${id.toString().padStart(3, '0')}`;
};

export const formatPokemonName = (name: string): string => {
  return name.charAt(0).toUpperCase() + name.slice(1);
};

export const formatHeight = (height: number): string => {
  return `${(height / 10).toFixed(1)} m`;
};

export const formatWeight = (weight: number): string => {
  return `${(weight / 10).toFixed(1)} kg`;
};

export const getStatName = (statName: string): string => {
  const statNames: Record<string, string> = {
    'hp': 'HP',
    'attack': 'Ataque',
    'defense': 'Defensa',
    'special-attack': 'At. Esp.',
    'special-defense': 'Def. Esp.',
    'speed': 'Velocidad'
  };
  
  return statNames[statName] || statName;
};

export const getStatColor = (value: number): string => {
  if (value >= 100) return '#10b981'; 
  if (value >= 70) return '#f59e0b';  
  if (value >= 50) return '#f97316';  
  return '#ef4444'; 
};
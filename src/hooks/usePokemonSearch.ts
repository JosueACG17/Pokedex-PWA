import { useState } from 'react';
import type { Pokemon } from '../types/pokemon';
import { pokemonService } from '../services/pokemonService';

export const usePokemonSearch = () => {
  const [searchResults, setSearchResults] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchPokemon = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const results = await pokemonService.searchPokemon(query);
      setSearchResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error searching Pokemon');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setSearchResults([]);
    setError(null);
  };

  return {
    searchResults,
    loading,
    error,
    searchPokemon,
    clearResults
  };
};
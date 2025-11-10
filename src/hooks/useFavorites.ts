import { useState, useEffect } from 'react';
import { favoritesManager } from '../utils/storage';
import { showNotification } from '../utils/notifications';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<number[]>([]);

  const updateFavorites = () => {
    setFavorites(favoritesManager.getFavorites());
  };

  useEffect(() => {
    updateFavorites();
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'pokemon-favorites') {
        updateFavorites();
      }
    };

    const handleFavoritesUpdate = () => {
      updateFavorites();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('favoritesUpdated', handleFavoritesUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
    };
  }, []);

  const addFavorite = (pokemonId: number, pokemonName?: string) => {
    favoritesManager.addFavorite(pokemonId);
    updateFavorites();
    window.dispatchEvent(new CustomEvent('favoritesUpdated'));
    const displayName = pokemonName ? pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1) : `Pokemon #${pokemonId}`;
    showNotification(`¡${displayName} añadido a tus favoritos! `);
  };

  const removeFavorite = (pokemonId: number, pokemonName?: string) => {
    favoritesManager.removeFavorite(pokemonId);
    updateFavorites();
    window.dispatchEvent(new CustomEvent('favoritesUpdated'));
    const displayName = pokemonName ? pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1) : `Pokemon #${pokemonId}`;
    showNotification(`${displayName} eliminado de favoritos `);
  };

  const toggleFavorite = (pokemonId: number, pokemonName?: string) => {
    if (isFavorite(pokemonId)) {
      removeFavorite(pokemonId, pokemonName);
    } else {
      addFavorite(pokemonId, pokemonName);
    }
  };

  const toggleFavoriteWithPokemon = (pokemon: { id: number; name: string }) => {
    toggleFavorite(pokemon.id, pokemon.name);
  };

  const isFavorite = (pokemonId: number) => {
    return favorites.includes(pokemonId);
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    toggleFavoriteWithPokemon,
    isFavorite
  };
};
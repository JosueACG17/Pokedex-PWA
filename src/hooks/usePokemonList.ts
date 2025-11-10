import { useState, useEffect, useCallback } from 'react';
import type { Pokemon } from '../types/pokemon';
import { pokemonService } from '../services/pokemonService';
import { dataCache, offlineManager } from '../utils/offline';

export const usePokemonList = (limit: number = 20) => {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isOffline, setIsOffline] = useState(!offlineManager.isOnline());

  const totalPages = Math.ceil(totalCount / limit);

  const loadPage = useCallback(async (page: number = 1) => {
    if (loading) return;
    
    setLoading(true);
    setError(null);
    
    const offset = (page - 1) * limit;
    
    try {
      if (!offlineManager.isOnline() && page === 1) {
        const cachedData = dataCache.getPokemonList();
        if (cachedData) {
          setPokemon(cachedData);
          setLoading(false);
          return;
        }
      }

      const response = await pokemonService.getPokemonList(offset, limit);
      const pokemonDetails = await Promise.all(
        response.results.map(p => pokemonService.getPokemonDetails(p.name))
      );
      
      setPokemon(pokemonDetails);
      setCurrentPage(page);
      setTotalCount(response.count);
      
      // Guardar en cache solo la primera página para uso offline
      if (page === 1) {
        dataCache.savePokemonList(pokemonDetails);
      }
    } catch (error) {
      if (page === 1) {
        const cachedData = dataCache.getPokemonList();
        if (cachedData) {
          setPokemon(cachedData);
          setError('Mostrando datos offline');
        } else if(error instanceof Error) {
          setError('Error al cargar Pokemon');
        }
      } else {
        setError('Error al cargar página');
      }
    } finally {
      setLoading(false);
    }
  }, [limit, loading]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      loadPage(page);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const refresh = () => {
    loadPage(currentPage);
  };

  useEffect(() => {
    loadPage(1);
  }, []);

  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOffline(!offlineManager.isOnline());
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  return {
    pokemon,
    loading,
    error,
    currentPage,
    totalPages,
    totalCount,
    isOffline,
    goToPage,
    nextPage,
    prevPage,
    refresh,
    canGoNext: currentPage < totalPages,
    canGoPrev: currentPage > 1
  };
};
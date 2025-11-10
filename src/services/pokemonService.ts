import axios from 'axios';
import type { Pokemon, PokemonListResponse } from '../types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

export const pokemonApi = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export const pokemonService = {
  async getPokemonList(offset: number = 0, limit: number = 30): Promise<PokemonListResponse> {
    const response = await pokemonApi.get(`/pokemon?offset=${offset}&limit=${limit}`);
    return response.data;
  },

  async getPokemonDetails(nameOrId: string | number): Promise<Pokemon> {
    const response = await pokemonApi.get(`/pokemon/${nameOrId}`);
    return response.data;
  },

  async searchPokemon(query: string): Promise<Pokemon[]> {
    try {
      const pokemon = await this.getPokemonDetails(query.toLowerCase());
      return [pokemon];
    } catch {
      const response = await pokemonApi.get('/pokemon?limit=1000');
      const filteredResults = response.data.results.filter((pokemon: { name: string; url: string }) =>
        pokemon.name.toLowerCase().includes(query.toLowerCase())
      );
      
      const pokemonDetails = await Promise.all(
        filteredResults.slice(0, 20).map((pokemon: { name: string; url: string }) => 
          this.getPokemonDetails(pokemon.name)
        )
      );
      
      return pokemonDetails;
    }
  },

  async getPokemonByType(type: string): Promise<Pokemon[]> {
    const response = await pokemonApi.get(`/type/${type}`);
    const pokemonList = response.data.pokemon.slice(0, 20);
    
    const pokemonDetails = await Promise.all(
      pokemonList.map((item: { pokemon: { name: string } }) => this.getPokemonDetails(item.pokemon.name))
    );
    
    return pokemonDetails;
  },

  async getTypes(): Promise<{ name: string; url: string }[]> {
    const response = await pokemonApi.get('/type');
    return response.data.results;
  }
};
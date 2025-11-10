export const favoritesManager = {
  getFavorites(): number[] {
    const favorites = localStorage.getItem('pokemon-favorites');
    return favorites ? JSON.parse(favorites) : [];
  },

  addFavorite(pokemonId: number): void {
    const favorites = this.getFavorites();
    if (!favorites.includes(pokemonId)) {
      favorites.push(pokemonId);
      localStorage.setItem('pokemon-favorites', JSON.stringify(favorites));
      this.sendNotification(`¡${pokemonId} agregado a favoritos!`, '⭐');
    }
  },

  removeFavorite(pokemonId: number): void {
    const favorites = this.getFavorites();
    const updatedFavorites = favorites.filter(id => id !== pokemonId);
    localStorage.setItem('pokemon-favorites', JSON.stringify(updatedFavorites));
  },

  isFavorite(pokemonId: number): boolean {
    return this.getFavorites().includes(pokemonId);
  },

  // Enviar notificación
  async sendNotification(title: string, icon: string = '🔔'): Promise<void> {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(title, {
          icon: '/pwa-192x192.png',
          body: `${icon} PokePWA`,
          tag: 'pokemon-notification'
        });
      } else if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          new Notification(title, {
            icon: '/pwa-192x192.png',
            body: `${icon} PokePWA`,
            tag: 'pokemon-notification'
          });
        }
      }
    }
  }
};

// Gestión de configuración de la app
export const appConfig = {
  getTheme(): 'light' | 'dark' {
    return (localStorage.getItem('pokemon-theme') as 'light' | 'dark') || 'light';
  },

  setTheme(theme: 'light' | 'dark'): void {
    localStorage.setItem('pokemon-theme', theme);
  },

  getViewMode(): 'grid' | 'list' {
    return (localStorage.getItem('pokemon-view-mode') as 'grid' | 'list') || 'grid';
  },

  setViewMode(mode: 'grid' | 'list'): void {
    localStorage.setItem('pokemon-view-mode', mode);
  }
};
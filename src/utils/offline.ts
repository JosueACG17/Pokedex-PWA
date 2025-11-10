export const offlineManager = {
  isOnline(): boolean {
    return navigator.onLine;
  },

  onConnectivityChange(callback: (isOnline: boolean) => void) {
    const handleOnline = () => callback(true);
    const handleOffline = () => callback(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  },

  showConnectivityNotification(isOnline: boolean) {
    if ('serviceWorker' in navigator && 'showNotification' in ServiceWorkerRegistration.prototype) {
      if (isOnline) {
        this.showNotification('¡Conexión restaurada!', 'Ya puedes explorar nuevos Pokemon', '🌐');
      } else {
        this.showNotification('Sin conexión', 'Modo offline activado. Puedes ver tus Pokemon favoritos', '📱');
      }
    }
  },

  async showNotification(title: string, body: string, emoji: string = '/Pokeballs.png') {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: `${emoji} ${body}`,
        icon: '/Pokeballs.png',
        tag: 'connectivity-notification',
        silent: false
      });
    }
  }
};

export const dataCache = {
  savePokemonList(pokemon: unknown[], key: string = 'pokemon-list') {
    try {
      localStorage.setItem(key, JSON.stringify({
        data: pokemon,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  },

  getPokemonList(key: string = 'pokemon-list', maxAge: number = 24 * 60 * 60 * 1000) {
    try {
      const cached = localStorage.getItem(key);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      
      if (Date.now() - timestamp > maxAge) {
        localStorage.removeItem(key);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error reading from cache:', error);
      return null;
    }
  },

  clearExpiredCache() {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('pokemon-') && key !== 'pokemon-favorites') {
        try {
          const cached = localStorage.getItem(key);
          if (cached) {
            const { timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp > 24 * 60 * 60 * 1000) {
              localStorage.removeItem(key);
            }
          }
        } catch {
          localStorage.removeItem(key);
        }
      }
    });
  }
};
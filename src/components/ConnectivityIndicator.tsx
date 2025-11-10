import { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { offlineManager } from '../utils/offline';

export const ConnectivityIndicator = () => {
  const [isOnline, setIsOnline] = useState(offlineManager.isOnline());
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    const cleanup = offlineManager.onConnectivityChange((online) => {
      setIsOnline(online);
      setShowIndicator(true);
      if (online) {
        setTimeout(() => setShowIndicator(false), 3000);
      }
    });

    if (!isOnline) {
      setShowIndicator(true);
    }

    return cleanup;
  }, [isOnline]);

  if (!showIndicator) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-all duration-300 ${
        isOnline
          ? 'bg-green-500 text-white'
          : 'bg-red-500 text-white'
      }`}
    >
      {isOnline ? (
        <>
          <Wifi size={16} />
          <span className="text-sm font-medium">Conectado</span>
        </>
      ) : (
        <>
          <WifiOff size={16} />
          <span className="text-sm font-medium">Sin conexión</span>
        </>
      )}
    </div>
  );
};
export const showNotification = (message: string) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('PokePWA', {
      body: message,
      icon: '/Pokeballs.png'
    })
  } else if ('Notification' in window && Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification('PokePWA', {
          body: message,
          icon: '/Pokeballs.png'
        })
      }
    })
  }
}

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  return false
}
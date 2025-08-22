function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i)
  return outputArray
}

export async function initPush() {
  try {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return
    const reg = await navigator.serviceWorker.ready
    if (Notification.permission === 'default') await Notification.requestPermission()
    if (Notification.permission !== 'granted') return
    const publicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY
    if (!publicKey) return
    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey)
    })
    await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription)
    })
  } catch (e) {
    // ignore
  }
}



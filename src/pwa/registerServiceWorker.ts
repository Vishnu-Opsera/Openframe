export function canRegisterServiceWorker(target: { protocol: string; hostname: string }, serviceWorker: unknown): boolean {
  if (!serviceWorker) {
    return false
  }
  return target.protocol === 'https:' || target.protocol === 'http:' || target.hostname === 'localhost'
}

export async function registerServiceWorker(
  target: Pick<Location, 'protocol' | 'hostname'> = window.location,
  nav: Pick<Navigator, 'serviceWorker'> = navigator,
): Promise<ServiceWorkerRegistration | null> {
  if (!canRegisterServiceWorker(target, nav.serviceWorker)) {
    return null
  }

  try {
    return await nav.serviceWorker.register('/sw.js')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'registration failed'
    console.warn(JSON.stringify({ operation: 'service_worker_register', message }))
    return null
  }
}

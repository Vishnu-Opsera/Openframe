export function ready(redis: boolean): { status: number; body: { status: string } } { return redis ? { status: 200, body: { status: 'ok' } } : { status: 503, body: { status: 'degraded' } } }

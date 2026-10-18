export function live(): { status: number } { return { status: 200 } }
export function ready(postgres: boolean): { status: number; dependency?: string } { return postgres ? { status: 200 } : { status: 503, dependency: 'postgres' } }

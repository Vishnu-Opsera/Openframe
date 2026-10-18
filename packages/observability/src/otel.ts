export function initializeOpenTelemetry(config: { endpoint: string }): { tracer: boolean; meter: boolean } { return { tracer: config.endpoint.length > 0, meter: true } }
export function shutdownOpenTelemetry(): void {}
export function createMeter(): { name: string } { return { name: 'meter' } }
export function createTracer(): { name: string } { return { name: 'tracer' } }
export function createStructuredLogger(): { attributes: Record<string, string> } { return { attributes: {} } }


export function fetcher(...args: Parameters<typeof fetch>) {
    args[0] = `${import.meta.env.VITE_BASE_URL || 'http://localhost:3000'}${args[0]}`
    return fetch(...args)
}

/**
 * useStorage — public API for all storage operations.
 *
 * Components import { useStorage } from this file and call functions from the
 * returned context object. The context handles routing between localStorage
 * and Supabase based on auth state.
 *
 * The raw localStorage functions are in useLocalStorage.js (used by the
 * context internally and for seeding/migration).
 */

export { useStorage, StorageProvider } from './useStorageContext.jsx'

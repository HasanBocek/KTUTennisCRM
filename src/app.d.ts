// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    interface Locals {
      user: Record<string, unknown> | null;
    }
    // interface Error {}
    // interface PageData {}
    // interface Platform {}
  }
}

export {};
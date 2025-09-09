<script context="module" lang="ts">
  import { writable } from 'svelte/store';
  import { browser } from '$app/environment';

  // Toast type definition
  export interface Toast {
    id: number;
    message: string;
    type?: 'danger' | 'success' | 'warning' | 'info';
    duration?: number;
  }

  // Create a persistent store that works across page loads
  function createPersistentToastStore() {
    const key = 'app_toasts';
    
    // Initialize store from browser storage
    const initialToasts: Toast[] = browser 
      ? JSON.parse(localStorage.getItem(key) || '[]')
      : [];

    const { subscribe, set, update } = writable<Toast[]>(initialToasts);

    return {
      subscribe,
      add: (toast: Omit<Toast, 'id'>) => {
        update(toasts => {
          const newToast = {
            ...toast,
            id: Date.now(),
            duration: toast.duration || 5000
          };
          
          const updatedToasts = [newToast, ...toasts].slice(0, 5);
          
          if (browser) {
            localStorage.setItem(key, JSON.stringify(updatedToasts));
          }
          
          return updatedToasts;
        });
      },
      remove: (id: number) => {
        update(toasts => {
          const filteredToasts = toasts.filter(t => t.id !== id);
          
          if (browser) {
            localStorage.setItem(key, JSON.stringify(filteredToasts));
          }
          
          return filteredToasts;
        });
      },
      clear: () => {
        if (browser) {
          localStorage.removeItem(key);
        }
        set([]);
      }
    };
  }

  export const toastStore = createPersistentToastStore();

  // Exported functions for adding/removing toasts
  export function addToast(toast: Omit<Toast, 'id'>) {
    toastStore.add(toast);
  }

  export function removeToast(id: number) {
    toastStore.remove(id);
  }

  export function clearToasts() {
    toastStore.clear();
  }
</script>

<script lang="ts">
  import { 
    Toast as SvelteToast, 
    ToastBody 
  } from "@sveltestrap/sveltestrap";
  import { onMount, onDestroy } from 'svelte';
  import { navigating } from '$app/stores';

  // Track and clear timers
  const toastTimers: number[] = [];

  // Clear toasts on navigation
  $: if ($navigating) {
    // Clear all current toasts when navigating
    $toastStore.forEach(toast => removeToast(toast.id));
  }

  // Auto-remove toasts after their duration
  $: {
    $toastStore.forEach(toast => {
      if (!toastTimers.includes(toast.id)) {
        const timer = setTimeout(() => {
          removeToast(toast.id);
        }, toast.duration);
        
        // @ts-ignore
        toastTimers.push(toast.id);
      }
    });
  }

  // Clear timers on destroy
  onDestroy(() => {
    toastTimers.forEach(clearTimeout);
  });
</script>

<div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 9999;">
  {#each $toastStore as toast (toast.id)}
    <div class="mb-2">
      <SvelteToast 
        isOpen={true}
        on:close={() => removeToast(toast.id)}
      >
        <ToastBody>
          <div class="d-flex align-items-start">
            <i class={`fas fa-${
              toast.type === 'danger' ? 'exclamation-circle text-danger' : 
              toast.type === 'success' ? 'check-circle text-success' :
              toast.type === 'warning' ? 'exclamation-triangle text-warning' :
              'info-circle text-info'
            } me-2 mt-1`}></i>
            <div class="toast-message">
              {toast.message}
            </div>
          </div>
        </ToastBody>
      </SvelteToast>
    </div>
  {/each}
</div>

<style>
  .toast-container {
    max-width: 350px;
    display: flex;
    flex-direction: column;
  }

  .toast-message {
    word-wrap: break-word;
    word-break: break-word;
    white-space: normal;
    max-width: 100%;
    flex-grow: 1;
  }
</style>

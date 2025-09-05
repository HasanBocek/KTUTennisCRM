<script lang="ts" context="module">
  import { writable } from 'svelte/store';
  import { 
    Toast, 
    ToastBody 
  } from "@sveltestrap/sveltestrap";

  // Create a global toast store that can be imported and used across the application
  export const toastStore = writable<any[]>([]);

  // Function to add a toast
  export function addToast(toast: any) {
    const id = Math.floor(Math.random() * 10000);
    const toastWithId = { 
      ...toast, 
      id, 
      duration: toast.duration || 10000 
    };

    toastStore.update(toasts => [toastWithId, ...toasts]);

    // Auto-remove toast
    setTimeout(() => {
      removeToast(id);
    }, toastWithId.duration);
  }

  // Function to remove a specific toast
  export function removeToast(id: number) {
    toastStore.update(toasts => toasts.filter(t => t.id !== id));
  }

  // Function to clear all toasts
  export function clearToasts() {
    toastStore.set([]);
  }
</script>

<div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 9999;">
  {#each $toastStore as toast (toast.id)}
    <div class="mb-2">
      <Toast 
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
      </Toast>
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

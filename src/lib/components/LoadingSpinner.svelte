<script lang="ts">
  import { Spinner } from "@sveltestrap/sveltestrap";
  
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let color: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' = 'primary';
  export let text: string = 'Yükleniyor...';
  export let showText: boolean = true;
  export let variant: 'border' | 'grow' = 'border';
  export let centered: boolean = true;
  export let fullHeight: boolean = false;
  
  // Size mapping
  const sizeMap = {
    sm: 'sm',
    md: '',
    lg: 'lg'
  };
  
  $: spinnerSize = sizeMap[size];
</script>

<div class="loading-spinner" class:centered={centered} class:full-height={fullHeight}>
  <div class="spinner-container">
    <Spinner 
      {color} 
      size={spinnerSize}
      class="mb-2"
    />
    {#if showText && text}
      <div class="loading-text text-{color} small">
        {text}
      </div>
    {/if}
  </div>
</div>

<style>
  .loading-spinner {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }
  
  .loading-spinner.centered {
    justify-content: center;
  }
  
  .loading-spinner.full-height {
    min-height: 200px;
  }
  
  .spinner-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .loading-text {
    font-weight: 500;
    margin-top: 0.5rem;
  }
  
  /* Overlay variant */
  .loading-spinner.overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.8);
    z-index: 1000;
  }
  
  /* Dark overlay variant */
  .loading-spinner.overlay-dark {
    background-color: rgba(0, 0, 0, 0.5);
  }
  
  .loading-spinner.overlay-dark .loading-text {
    color: white !important;
  }
</style> 
<script lang="ts">
  import { Button } from "@sveltestrap/sveltestrap";
  
  export let title: string = 'Veri bulunamadı';
  export let description: string = 'Aradığınız kriterlere uygun veri bulunamadı.';
  export let icon: string = 'fas fa-inbox';
  export let iconSize: 'sm' | 'md' | 'lg' = 'lg';
  export let showAction: boolean = false;
  export let actionText: string = 'Yeni Ekle';
  export let actionIcon: string = 'fas fa-plus';
  export let actionColor: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' = 'primary';
  export let compact: boolean = false;
  
  // Event dispatcher
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  
  function handleAction() {
    dispatch('action');
  }
  
  // Icon size mapping
  const iconSizeMap = {
    sm: '2rem',
    md: '3rem',
    lg: '4rem'
  };
</script>

<div class="empty-state" class:compact={compact}>
  <div class="empty-state-content">
    {#if icon}
      <div class="empty-state-icon">
        <i class="{icon}" style="font-size: {iconSizeMap[iconSize]};"></i>
      </div>
    {/if}
    
    <div class="empty-state-text">
      <h4 class="empty-state-title">{title}</h4>
      {#if description}
        <p class="empty-state-description">{description}</p>
      {/if}
    </div>
    
    {#if showAction}
      <div class="empty-state-action">
        <Button 
          color={actionColor} 
          on:click={handleAction}
          class="d-flex align-items-center gap-2"
        >
          <i class={actionIcon}></i>
          {actionText}
        </Button>
      </div>
    {/if}
    
    <slot />
  </div>
</div>

<style>
  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    text-align: center;
  }
  
  .empty-state.compact {
    padding: 1rem;
  }
  
  .empty-state-content {
    max-width: 400px;
  }
  
  .empty-state-icon {
    margin-bottom: 1rem;
    color: var(--bs-secondary);
  }
  
  .empty-state.compact .empty-state-icon {
    margin-bottom: 0.5rem;
  }
  
  .empty-state-text {
    margin-bottom: 1.5rem;
  }
  
  .empty-state.compact .empty-state-text {
    margin-bottom: 1rem;
  }
  
  .empty-state-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--bs-heading-color);
    margin-bottom: 0.5rem;
  }
  
  .empty-state.compact .empty-state-title {
    font-size: 1.1rem;
    margin-bottom: 0.25rem;
  }
  
  .empty-state-description {
    color: var(--bs-secondary);
    margin-bottom: 0;
    line-height: 1.5;
  }
  
  .empty-state.compact .empty-state-description {
    font-size: 0.9rem;
  }
  
  .empty-state-action {
    margin-bottom: 1rem;
  }
  
  .empty-state.compact .empty-state-action {
    margin-bottom: 0.5rem;
  }
  
  /* Variants */
  .empty-state.centered {
    min-height: 300px;
  }
  
  .empty-state.full-height {
    min-height: 400px;
  }
  
  .empty-state.bordered {
    border: 2px dashed var(--bs-border-color);
    border-radius: 0.5rem;
    background-color: var(--bs-light);
  }
</style> 
<script lang="ts">
  import { Card, CardBody, CardHeader, CardTitle, Badge } from "@sveltestrap/sveltestrap";
  
  export let title: string;
  export let subtitle: string = '';
  export let icon: string = '';
  export let color: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' = 'primary';
  export let variant: 'default' | 'outlined' | 'elevated' = 'default';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let showHeader: boolean = true;
  export let showIcon: boolean = true;
  export let clickable: boolean = false;
  
  // Event dispatcher
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  
  function handleClick() {
    if (clickable) {
      dispatch('click');
    }
  }
</script>

<Card 
  class="info-card info-card-{variant} info-card-{size} {clickable ? 'clickable' : ''}"
  on:click={handleClick}
>
  {#if showHeader}
    <CardHeader class="bg-transparent border-0 pb-0">
      <div class="d-flex align-items-center justify-content-between">
        <CardTitle class="mb-0 d-flex align-items-center gap-2">
          {#if showIcon && icon}
            <i class="{icon} text-{color}"></i>
          {/if}
          {title}
        </CardTitle>
        {#if subtitle}
          <Badge color={color} class="text-{color} bg-{color}-subtle">
            {subtitle}
          </Badge>
        {/if}
      </div>
    </CardHeader>
  {/if}
  
  <CardBody class="pt-{showHeader ? '2' : '3'}">
    <slot />
  </CardBody>
</Card>

<style>
  .info-card {
    transition: all 0.2s ease-in-out;
    border: 1px solid var(--bs-border-color);
  }
  
  .info-card-outlined {
    background: transparent;
    border: 2px solid var(--bs-border-color);
  }
  
  .info-card-elevated {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
  
  .info-card-sm .card-body {
    padding: 0.75rem;
  }
  
  .info-card-lg .card-body {
    padding: 1.5rem;
  }
  
  .info-card.clickable {
    cursor: pointer;
  }
  
  .info-card.clickable:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
  
  .info-card .card-header {
    background: transparent;
    border-bottom: none;
  }
  
  .info-card .card-title {
    font-size: 1.1rem;
    font-weight: 600;
  }
  
  .info-card .card-title i {
    font-size: 1.2rem;
  }
</style> 
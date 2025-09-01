<script lang="ts">
  import { Button } from "@sveltestrap/sveltestrap";
  
  export let currentPage: number;
  export let totalPages: number;
  export let totalItems: number;
  export let itemsPerPage: number;
  export let showPageInfo: boolean = true;
  export let showPageNumbers: boolean = true;
  export let maxVisiblePages: number = 5;
  
  // Event dispatcher
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  
  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      dispatch('pageChange', { page });
    }
  }
  
  function goToPrevious() {
    goToPage(currentPage - 1);
  }
  
  function goToNext() {
    goToPage(currentPage + 1);
  }
  
  function goToFirst() {
    goToPage(1);
  }
  
  function goToLast() {
    goToPage(totalPages);
  }
  
  // Calculate visible page numbers
  $: visiblePages = (() => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);
    
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }
    
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  })();
  
  // Calculate item range
  $: startItem = (currentPage - 1) * itemsPerPage + 1;
  $: endItem = Math.min(currentPage * itemsPerPage, totalItems);
</script>

<div class="pagination-wrapper">
  {#if showPageInfo}
    <div class="pagination-info text-muted small mb-2">
      {totalItems} kayıttan {startItem}-{endItem} arası gösteriliyor
    </div>
  {/if}
  
  <nav aria-label="Sayfalama">
    <ul class="pagination pagination-sm justify-content-center mb-0">
      <!-- First page -->
      <li class="page-item" class:disabled={currentPage === 1}>
        <Button 
          color="link" 
          class="page-link p-1" 
          disabled={currentPage === 1}
          on:click={goToFirst}
          aria-label="İlk sayfa"
        >
          <i class="fas fa-angle-double-left"></i>
        </Button>
      </li>
      
      <!-- Previous page -->
      <li class="page-item" class:disabled={currentPage === 1}>
        <Button 
          color="link" 
          class="page-link p-1" 
          disabled={currentPage === 1}
          on:click={goToPrevious}
          aria-label="Önceki sayfa"
        >
          <i class="fas fa-angle-left"></i>
        </Button>
      </li>
      
      <!-- Page numbers -->
      {#if showPageNumbers}
        {#each visiblePages as page}
          <li class="page-item" class:active={page === currentPage}>
            <Button 
              color="link" 
              class="page-link p-1" 
              on:click={() => goToPage(page)}
              aria-label="Sayfa {page}"
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </Button>
          </li>
        {/each}
      {/if}
      
      <!-- Next page -->
      <li class="page-item" class:disabled={currentPage === totalPages}>
        <Button 
          color="link" 
          class="page-link p-1" 
          disabled={currentPage === totalPages}
          on:click={goToNext}
          aria-label="Sonraki sayfa"
        >
          <i class="fas fa-angle-right"></i>
        </Button>
      </li>
      
      <!-- Last page -->
      <li class="page-item" class:disabled={currentPage === totalPages}>
        <Button 
          color="link" 
          class="page-link p-1" 
          disabled={currentPage === totalPages}
          on:click={goToLast}
          aria-label="Son sayfa"
        >
          <i class="fas fa-angle-double-right"></i>
        </Button>
      </li>
    </ul>
  </nav>
</div>

<style>
  .pagination-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
  
  .pagination-info {
    text-align: center;
  }
  
  .pagination .page-link {
    border: none;
    color: var(--bs-primary);
    text-decoration: none;
    min-width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.375rem;
    margin: 0 0.125rem;
  }
  
  .pagination .page-link:hover {
    background-color: var(--bs-primary);
    color: white;
  }
  
  .pagination .page-item.active .page-link {
    background-color: var(--bs-primary);
    color: white;
  }
  
  .pagination .page-item.disabled .page-link {
    color: var(--bs-secondary);
    pointer-events: none;
    background-color: transparent;
  }
  
  .pagination .page-link:focus {
    box-shadow: 0 0 0 0.2rem rgba(var(--bs-primary-rgb), 0.25);
  }
</style> 
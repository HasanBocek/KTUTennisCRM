<script lang="ts">
  export let currentPage: number;
  export let totalPages: number;
  export let startIndex: number;
  export let endIndex: number;
  export let totalItems: number;
  export let goToPage: (page: number) => void;
</script>

{#if totalPages > 1}
  <div class="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
    <div class="text-center text-md-start">
      <small class="text-muted text-nowrap">
        {startIndex + 1} - {Math.min(endIndex, totalItems)} / {totalItems} kayıt
      </small>
    </div>
    <nav class="w-100">
      <ul class="pagination mb-0 justify-content-center justify-content-md-end flex-wrap">
        <li class="page-item {currentPage === 1 ? 'disabled' : ''}">
          <button
            class="page-link px-1 px-md-2 py-1"
            on:click={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            style="min-width: 45px;"
          >
            <i class="fas fa-chevron-left d-none d-sm-inline me-1"></i>
            <span class="d-sm-none">‹</span>
            <span class="d-none d-sm-inline">Önceki</span>
          </button>
        </li>

        {#each Array.from({ length: totalPages }, (_, i) => i + 1) as page}
          {#if page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)}
            <li class="page-item {currentPage === page ? 'active' : ''}">
              <button
                class="page-link px-1 px-md-2 py-1"
                on:click={() => goToPage(page)}
                style="min-width: 30px;"
              >
                {page}
              </button>
            </li>
          {:else if page === currentPage - 2 || page === currentPage + 2}
            <li class="page-item disabled">
              <span class="page-link px-2 py-1" style="min-width: 30px;">...</span>
            </li>
          {/if}
        {/each}

        <li class="page-item {currentPage === totalPages ? 'disabled' : ''}">
          <button
            class="page-link px-1 px-md-2 py-1"
            on:click={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            style="min-width: 45px;"
          >
            <span class="d-none d-sm-inline">Sonraki</span>
            <i class="fas fa-chevron-right d-none d-sm-inline ms-1"></i>
            <span class="d-sm-none">›</span>
          </button>
        </li>
      </ul>
    </nav>
  </div>
{/if}


<script lang="ts">
  import { Table, Badge, Button } from "@sveltestrap/sveltestrap";
  
  export let columns: Array<{
    key: string;
    label: string;
    sortable?: boolean;
    width?: string;
    align?: 'left' | 'center' | 'right';
  }>;
  export let data: Array<Record<string, any>>;
  export let sortable: boolean = false;
  export let striped: boolean = true;
  export let hover: boolean = true;
  export let bordered: boolean = false;
  export let responsive: boolean = true;
  export let emptyMessage: string = 'Veri bulunamadı';
  export let loading: boolean = false;
  
  let sortColumn: string | null = null;
  let sortDirection: 'asc' | 'desc' = 'asc';
  
  function handleSort(columnKey: string) {
    if (!sortable) return;
    
    if (sortColumn === columnKey) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortColumn = columnKey;
      sortDirection = 'asc';
    }
  }
  
  $: sortedData = sortable && sortColumn 
    ? [...data].sort((a, b) => {
        const aVal = a[sortColumn!];
        const bVal = b[sortColumn!];
        
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      })
    : data;
</script>

<div class="data-table-wrapper">
  {#if loading}
    <div class="text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Yükleniyor...</span>
      </div>
    </div>
  {:else if data.length === 0}
    <div class="text-center py-4 text-muted">
      {emptyMessage}
    </div>
  {:else}
    <Table 
      {striped} 
      {hover} 
      {bordered} 
      {responsive}
      class="data-table"
    >
      <thead>
        <tr>
          {#each columns as column}
            <th 
              class="text-{column.align || 'left'}"
              style="width: {column.width || 'auto'}"
              class:sortable={sortable && column.sortable !== false}
              on:click={() => handleSort(column.key)}
            >
              {column.label}
              {#if sortable && column.sortable !== false}
                <i class="fas fa-sort ms-1 text-muted"></i>
                {#if sortColumn === column.key}
                  <i class="fas fa-sort-{sortDirection === 'asc' ? 'up' : 'down'} ms-1 text-primary"></i>
                {/if}
              {/if}
            </th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each sortedData as row, rowIndex}
          <tr>
            {#each columns as column}
              <td class="text-{column.align || 'left'}">
                <slot name="cell" {row} {column} {rowIndex}>
                  {#if column.key === 'actions'}
                    <slot name="actions" {row} {rowIndex} />
                  {:else}
                    {row[column.key] || '-'}
                  {/if}
                </slot>
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </Table>
  {/if}
</div>

<style>
  .data-table-wrapper {
    overflow-x: auto;
  }
  
  .data-table th.sortable {
    cursor: pointer;
    user-select: none;
  }
  
  .data-table th.sortable:hover {
    background-color: var(--bs-light);
  }
  
  .data-table tbody tr:hover {
    background-color: var(--bs-light);
  }
</style> 
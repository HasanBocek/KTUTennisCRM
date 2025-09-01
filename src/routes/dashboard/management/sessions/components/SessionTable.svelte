<script lang="ts">
  import { Table } from "@sveltestrap/sveltestrap";
  import type { SessionType } from "$lib/types/types";
  import { createEventDispatcher } from "svelte";
  import SessionRow from "./table/SessionRow.svelte";
  import Pagination from "./table/Pagination.svelte";

  export let filteredSessions: SessionType[];

  const dispatch = createEventDispatcher();

  // Pagination
  let currentPage = 1;
  const itemsPerPage = 10;

  $: totalPages = Math.ceil(filteredSessions.length / itemsPerPage);
  $: startIndex = (currentPage - 1) * itemsPerPage;
  $: endIndex = startIndex + itemsPerPage;
  $: paginatedSessions = filteredSessions.slice(startIndex, endIndex);

  // Reset to page 1 when filtered sessions change
  $: if (filteredSessions) {
    currentPage = 1;
  }

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
    }
  }

  function forward(event: CustomEvent<SessionType>) {
    dispatch(event.type, event.detail);
  }
</script>

<!-- Tablo -->
<Table responsive class="mb-3">
  <thead class="table-light">
    <tr>
      <th>Grup & Antrenörler</th>
      <th>Zaman</th>
      <th class="d-none d-md-table-cell">Durum</th>
      <th class="d-none d-lg-table-cell text-center">Katılım</th>
      <th class="d-none d-lg-table-cell">Notlar</th>
    </tr>
  </thead>
  <tbody>
    {#each paginatedSessions as session}
      <SessionRow
        {session}
        on:openSession={forward}
        on:viewDetails={forward}
      />
    {:else}
      <tr>
        <td colspan="6" class="text-center py-4">
          <i class="fas fa-search-minus text-muted me-2"></i>
          Gösterilecek ders yok
        </td>
      </tr>
    {/each}
  </tbody>
</Table>

<!-- Pagination -->
<Pagination
  {currentPage}
  {totalPages}
  {startIndex}
  {endIndex}
  totalItems={filteredSessions.length}
  {goToPage}
/>

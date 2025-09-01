<script lang="ts">
  import { Table } from "@sveltestrap/sveltestrap";
  import type { MembershipType } from "$lib/types/types";
  import { createEventDispatcher } from "svelte";
  import MembershipRow from "./table/MembershipRow.svelte";
  import Pagination from "./table/Pagination.svelte";

  export let filteredMemberships: MembershipType[];

  const dispatch = createEventDispatcher();

  // Pagination
  let currentPage = 1;
  const itemsPerPage = 10;

  $: totalPages = Math.ceil(filteredMemberships.length / itemsPerPage);
  $: startIndex = (currentPage - 1) * itemsPerPage;
  $: endIndex = startIndex + itemsPerPage;
  $: paginatedMemberships = filteredMemberships.slice(startIndex, endIndex);

  // Reset to page 1 when filtered memberships change
  $: if (filteredMemberships) {
    currentPage = 1;
  }

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
    }
  }

  function forward(event: CustomEvent<MembershipType>) {
    dispatch(event.type, event.detail);
  }
</script>

<!-- Tablo -->
<Table responsive class="mb-3">
  <thead class="table-light">
    <tr>
      <th>Üye Bilgileri</th>
      <th class="d-none d-md-table-cell">Grup</th>
      <th class="d-none d-md-table-cell">Başvuru Tarihi</th>
      <th class="text-center">Durum</th>
      <th class="text-center">İşlemler</th>
    </tr>
  </thead>
  <tbody>
    {#each paginatedMemberships as membership}
      <MembershipRow
        {membership}
        on:showApprovalModal={forward}
      />
    {:else}
      <tr>
        <td colspan="5" class="text-center py-4">
          <i class="fas fa-search-minus text-muted me-2"></i>
          Gösterilecek başvuru yok
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
  totalItems={filteredMemberships.length}
  {goToPage}
/>
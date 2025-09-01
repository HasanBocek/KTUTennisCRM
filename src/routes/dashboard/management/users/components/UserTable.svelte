<script lang="ts">
    import { Table } from "@sveltestrap/sveltestrap";
    import type { UserType } from "$lib/types/types";
    import { createEventDispatcher } from "svelte";
    import UserRow from "./table/UserRow.svelte";
    import Pagination from "./table/Pagination.svelte";
    export let filteredUsers: UserType[];

    const dispatch = createEventDispatcher();

    // Pagination
    let currentPage = 1;
    const itemsPerPage = 10;

    $: totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    $: startIndex = (currentPage - 1) * itemsPerPage;
    $: endIndex = startIndex + itemsPerPage;
    $: paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    // Reset to page 1 when filtered users change
    $: if (filteredUsers) {
        currentPage = 1;
    }

    function goToPage(page: number) {
        if (page >= 1 && page <= totalPages) {
            currentPage = page;
        }
    }

    function forward(event: CustomEvent<UserType>) {
        dispatch(event.type, event.detail);
    }
</script>

<!-- Tablo -->
<Table responsive class="mb-3">
    <thead class="table-light">
        <tr>
            <th>Ad Soyad</th>
            <th class="d-none d-md-table-cell">Öğrenci NO</th>
            <th>Telefon</th>
            <th class="d-none d-md-table-cell">E-Posta</th>
            <th class="d-none d-lg-table-cell text-center">Rol</th>
            <th class="d-none d-lg-table-cell">Üyelikler</th>
            <th>Eylem</th>
        </tr>
    </thead>
    <tbody>
        {#each paginatedUsers as user}
            <UserRow
                {user}
                on:openActions={forward}
                on:openInfo={forward}
                on:openEdit={forward}
                on:openEmail={forward}
                on:openDelete={forward}
            />
        {:else}
            <tr>
                <td colspan="6" class="text-center py-4">
                    <i class="fas fa-search-minus text-muted me-2"></i>
                    Gösterilecek kayıt yok
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
    totalItems={filteredUsers.length}
    {goToPage}
/>

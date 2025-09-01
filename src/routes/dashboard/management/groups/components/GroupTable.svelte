<script lang="ts">
  import { Badge, Table } from "@sveltestrap/sveltestrap";
  import Pagination from "$lib/components/Pagination.svelte";
  import type { GroupType } from "$lib/types/types";
  import { UserData } from "$lib/assets/data/mock/data";

  export let filteredGroups: GroupType[];

  // Calculate current members count for each group
  function getCurrentMembersCount(groupId: string): number {
    return UserData.filter(user => 
      user.memberships?.some(membership => 
        membership.group._id === groupId && membership.status === "active"
      )
    ).length;
  }

  // Pagination
  let currentPage = 1;
  const itemsPerPage = 10;

  $: totalPages = Math.ceil(filteredGroups.length / itemsPerPage);
  $: startIndex = (currentPage - 1) * itemsPerPage;
  $: endIndex = startIndex + itemsPerPage;
  $: groups = filteredGroups.map(group => ({
    ...group,
    currentMembersCount: getCurrentMembersCount(group._id)
  }));
  $: paginatedGroups = groups.slice(startIndex, endIndex);

  // Reset to page 1 when filtered groups change
  $: if (filteredGroups) {
    currentPage = 1;
  }

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
    }
  }

  function formatSchedule(schedule: GroupType["schedule"]): string {
    return schedule
      .map((s) => {
        const dayNames: Record<string, string> = {
          Monday: "Pazartesi",
          Tuesday: "Salı",
          Wednesday: "Çarşamba",
          Thursday: "Perşembe",
          Friday: "Cuma",
          Saturday: "Cumartesi",
          Sunday: "Pazar",
        };
        return `${dayNames[s.dayOfWeek] || s.dayOfWeek} ${s.startTime}-${s.endTime}`;
      })
      .join(", ");
  }

  function getMembershipStatus(group: GroupType): { text: string; color: string } {
    if (group.membershipOpen) {
      return { text: "Açık", color: "success" };
    }
    return { text: "Kapalı", color: "danger" };
  }
</script>

<!-- Tablo -->
<Table responsive class="mb-3">
  <thead class="table-light">
    <tr>
      <th style="min-width: 200px;">Grup Adı</th>
      <th class="d-none d-sm-table-cell">Program</th>
      <th>Üye Durumu</th>
      <th class="d-none d-md-table-cell text-center">Ücret</th>
      <th class="d-none d-lg-table-cell text-center">Kayıt Durumu</th>
    </tr>
  </thead>
  <tbody>
    {#each paginatedGroups as group}
      <tr>
        <td>
          <div>
            <span>
              <a href={`/dashboard/management/groups/${group._id}`}>{group.name}</a>
            </span>
            <br />
            <small class="text-muted d-none d-md-table-cell description-cell" title={group.description}>
              {group.description}
            </small>
          </div>
        </td>
        <td class="d-none d-sm-table-cell">
          <small class="text-muted">
            {formatSchedule(group.schedule)}
          </small>
        </td>
        <td>
          <div class="d-flex align-items-center gap-2">
            <span class="fw-medium">{group.currentMembersCount} / {group.maxMembers}</span>
            <div class="progress d-none d-md-flex" style="width: 60px; height: 6px;">
              <div
                class="progress-bar"
                role="progressbar"
                style="width: {(group.currentMembersCount / group.maxMembers) * 100}%"
                aria-valuenow={group.currentMembersCount}
                aria-valuemin="0"
                aria-valuemax={group.maxMembers}
              ></div>
            </div>
          </div>
        </td>
        <td class="d-none d-md-table-cell text-center">
          <span class="fw-medium">₺{group.payment.amount}</span><br />
          <small class="text-muted">{group.payment.billingCycle}</small>
        </td>
        <td class="d-none d-lg-table-cell text-center">
          {#each [getMembershipStatus(group)] as status}
            <Badge color={status.color}>
              {status.text}
            </Badge>
          {/each}
        </td>
      </tr>
    {:else}
      <tr>
        <td colspan="7" class="text-center py-4">
          <i class="fas fa-search-minus text-muted me-2"></i>
          Gösterilecek grup yok
        </td>
      </tr>
    {/each}
  </tbody>
</Table>

<!-- Pagination -->
{#if totalPages > 1}
  <Pagination
    {currentPage}
    {totalPages}
    totalItems={filteredGroups.length}
    {itemsPerPage}
    on:pageChange={(event) => goToPage(event.detail.page)}
  />
{/if}

<style>
  .description-cell {
    display: block;
    max-width: 300px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .progress {
    background-color: var(--bs-gray-200);
  }

  html[data-bs-theme="dark"] .progress {
    background-color: var(--bs-gray-700);
  }
</style>
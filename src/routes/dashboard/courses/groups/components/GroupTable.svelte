<script lang="ts">
  import { Badge, Button, Table } from "@sveltestrap/sveltestrap";
  import Pagination from "$lib/components/Pagination.svelte";
  import GroupApplicationModal from "./modals/GroupApplicationModal.svelte";
  import type { GroupListType } from "$lib/types/types";
  import { createEventDispatcher } from "svelte";
  import { meStore } from "$lib/stores/userStore";
  import type { MeType } from "$lib/types/types";
  import { onDestroy } from "svelte";
  let user: MeType;
  const unsubscribe = meStore.subscribe((u) => (user = u));
  onDestroy(() => unsubscribe());

  // Event dispatcher for application submission
  const dispatch = createEventDispatcher();

  export let GroupListData: GroupListType[];

  // Pagination
  let currentPage = 1;
  const itemsPerPage = 10;

  $: totalPages = Math.ceil(GroupListData.length / itemsPerPage);
  $: startIndex = (currentPage - 1) * itemsPerPage;
  $: endIndex = startIndex + itemsPerPage;
  $: groups = GroupListData.map((group) => ({
    ...group,
  }));
  $: paginatedGroups = groups.slice(startIndex, endIndex);

  // Reset to page 1 when filtered groups change
  $: if (GroupListData) {
    currentPage = 1;
  }

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
    }
  }

  function formatSchedule(
    schedule: GroupListType["schedule"]
  ): string {
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

  function getMembershipStatus(group: GroupListType): {
    text: string;
    color: string;
  } {
    if (group.membershipOpen) {
      return { text: "Açık", color: "success" };
    }
    return { text: "Kapalı", color: "danger" };
  }

  // Application modal state
  let isApplicationModalOpen = false;
  let selectedGroup: GroupListType | null = null;
  let isSubmitting = false;

  function openApplicationModal(group: GroupListType) {
    selectedGroup = group;
    isApplicationModalOpen = true;
    isSubmitting = false;
  }

  function handleModalClose() {
    isApplicationModalOpen = false;
    selectedGroup = null;
    isSubmitting = false;
  }

  function handleModalSubmit(event: CustomEvent) {
    const { groupId } = event.detail;
    if (!selectedGroup) return;
    
    isSubmitting = true;
    // Simulate API call and handle the submission
    simulateApplicationSubmission(groupId);
  }

  async function simulateApplicationSubmission(groupId: string) {
    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (!selectedGroup?.membershipOpen) {
            reject(new Error("Bu grup için başvurular kapalıdır."));
          } else {
            resolve(true);
          }
        }, 1500);
      });
      
      dispatch("applicationSubmitted", { groupId });
      // Auto close after success
      setTimeout(() => {
        handleModalClose();
      }, 300);
      
    } catch (error) {
      console.error("Application submission failed:", error);
    } finally {
      isSubmitting = false;
    }
  }

  // Get user's membership status for a specific group
  function getUserMembershipStatus(groupId: string): string {
    if (!user?.memberships) return "Bilgi & Başvuru";
    
    const membership = user.memberships.find(m => m.group._id === groupId);
    if (!membership) return "Bilgi & Başvuru";
    
    switch (membership.status) {
      case "approvementPending":
        return "Onay Bekliyor";
      case "paymentPending":
        return "Ödeme Bekliyor";
      case "active":
        return "Üyelik Mevcut";
      case "expired":
        return "Zaman Aşımı";
      case "cancelled":
        return "Reddedildi";
      default:
        return "Bilgi & Başvuru";
    }
  }

  // Check if user can apply to a group
  function canApplyToGroup(group: GroupListType): boolean {
    if (!group.membershipOpen) return false;
    if (!user?.memberships) return true;
    
    const membership = user.memberships.find(m => m.group._id === group._id);
    if (!membership) return true;
    
    // Can reapply if expired or cancelled
    return membership.status === "expired" || membership.status === "cancelled";
  }

  // Get button color based on membership status
  function getButtonColor(groupId: string): string {
    if (!user?.memberships) return "primary";
    
    const membership = user.memberships.find(m => m.group._id === groupId);
    if (!membership) return "primary";
    
    switch (membership.status) {
      case "pending":
        return "warning";
      case "paymentPending":
        return "warning";
      case "active":
        return "success";
      case "expired":
        return "secondary";
      case "cancelled":
        return "danger";
      default:
        return "primary";
    }
  }
</script>

<!-- Tablo -->
<Table responsive class="mb-0">
  <thead class="table-light">
    <tr>
      <th style="min-width: 200px;">Grup Adı</th>
      <th class="d-none d-sm-table-cell">Program</th>
      <th class="d-none d-md-table-cell text-center">Ücret</th>
      <th class="d-none d-lg-table-cell text-center">Kayıt Durumu</th>
      <th class="text-center">Başvuru</th>
    </tr>
  </thead>
  <tbody>
    {#each paginatedGroups as group}
      <tr>
        <td>
          <div>
            <span>
              <a href={`/dashboard/management/groups/${group._id}`}
                >{group.name}</a
              >
            </span>
            <br />
            <small
              class="text-muted d-none d-md-table-cell description-cell"
              title={group.description}
            >
              {group.description}
            </small>
          </div>
        </td>
        <td class="d-none d-sm-table-cell">
          <small class="text-muted">
            {formatSchedule(group.schedule)}
          </small>
        </td>
        <td class="d-none d-md-table-cell text-center">
          <span class="fw-medium">₺{group.payment.amount}</span><br />
          <small class="text-muted"
            >{group.payment.billingCycle}</small
          >
        </td>
        <td class="d-none d-lg-table-cell text-center">
          {#each [getMembershipStatus(group)] as status}
            <Badge color={status.color}>
              {status.text}
            </Badge>
          {/each}
        </td>
        <td class="text-center">
          <Button
            size="sm"
            color={group.membershipOpen ? getButtonColor(group._id) : "secondary"}
            disabled={!canApplyToGroup(group)}
            on:click={() => openApplicationModal(group)}
          >
            {group.membershipOpen 
              ? getUserMembershipStatus(group._id)
              : "Başvuruya Kapalı"
            }
          </Button>
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
    totalItems={GroupListData.length}
    {itemsPerPage}
    on:pageChange={(event) => goToPage(event.detail.page)}
  />
{/if}

<!-- Application Modal -->
<GroupApplicationModal 
  isOpen={isApplicationModalOpen}
  {selectedGroup}
  {isSubmitting}
  on:close={handleModalClose}
  on:submit={handleModalSubmit}
/>

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

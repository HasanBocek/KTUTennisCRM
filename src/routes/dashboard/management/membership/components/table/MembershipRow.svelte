<script lang="ts">
  import { Badge } from "@sveltestrap/sveltestrap";
  import type { MembershipType } from "$lib/types/types";
  import { createEventDispatcher } from "svelte";

  export let membership: MembershipType;

  const dispatch = createEventDispatcher();

  function getStatusBadgeColor(status: string) {
    switch (status) {
      case "approvementPending":
        return "warning";
      case "paymentPending":
        return "info";
      case "active":
        return "success";
      case "rejected":
        return "danger";
      default:
        return "secondary";
    }
  }

  function getStatusText(status: string) {
    switch (status) {
      case "approvementPending":
        return "Beklemede";
      case "paymentPending":
        return "Ödeme Bekliyor";
      case "active":
        return "Aktif";
      case "rejected":
        return "Reddedildi";
      default:
        return status;
    }
  }

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat("tr-TR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  }

  function handleApprove() {
    dispatch("showApprovalModal", membership);
  }
</script>

<tr>
  <td class="text-truncate">
    <div class="fw-medium text-truncate">
      {membership.user.firstName}
      {membership.user.lastName}
    </div>
    <small class="text-muted text-truncate d-block">
      {membership.user.phoneNumber}
    </small>
  </td>

  <td class="d-none d-md-table-cell text-truncate">
    <div class="text-truncate">
      {membership.group.name}
    </div>
    <small class="text-muted text-truncate">
      {membership.group.payment.amount}₺ / {membership.group.payment
        .billingCycle}
    </small>
  </td>

  <td class="d-none d-md-table-cell text-truncate">
    {formatDate(membership.joinDate)}
  </td>

  <td class="text-truncate text-center">
    <Badge color={getStatusBadgeColor(membership.status)}>
      {getStatusText(membership.status)}
    </Badge>
  </td>

  <td class="text-center">
    {#if membership.status === "approvementPending" || membership.status === "paymentPending"}
      <button
        type="button"
        class="btn btn-sm btn-outline-primary"
        title={membership.status === "approvementPending"
          ? "Başvuruyu İşle"
          : "Ödemeyi İşle"}
        on:click={handleApprove}
      >
        <i class="fas fa-cog me-1"></i>
        İşle
      </button>
    {/if}
  </td>
</tr>

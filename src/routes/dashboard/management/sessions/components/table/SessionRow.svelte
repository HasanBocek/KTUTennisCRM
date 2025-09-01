<script lang="ts">
  import { Badge } from "@sveltestrap/sveltestrap";
  import type { SessionType } from "$lib/types/types";

  export let session: SessionType;

  function getStatusBadgeColor(status: string) {
    switch (status) {
      case "completed":
        return "success";
      case "active":
        return "primary";
      case "cancelled":
        return "danger";
      default:
        return "secondary";
    }
  }

  function getStatusText(status: string) {
    switch (status) {
      case "completed":
        return "Tamamlandı";
      case "active":
        return "Devam Ediyor";
      case "cancelled":
        return "İptal Edildi";
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

  function formatTime(date: Date) {
    return new Intl.DateTimeFormat("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }

  $: presentCount = session.attendance.filter(
    (a) => a.status === "present"
  ).length;
  $: totalCount = session.attendance.length;
</script>

<tr>
  <td class="text-truncate">
    <a
      href={`/dashboard/management/sessions/${session._id}`}
      class="btn btn-link p-0 fw-medium text-decoration-none text-primary text-truncate"
    >
      {session.group.name}
    </a>
    <br />
    <small class="text-muted text-truncate">
      {#each session.coaches as coach, index}
        {coach.firstName}
        {coach.lastName}{#if index < session.coaches.length - 1}, <span
          ></span>{/if}
      {/each}
    </small>
  </td>

  <td class="text-truncate">
    <div class="text-truncate">
      {formatDate(session.startTime)}
    </div>
    {#if session.endTime}
      <small class="text-muted text-truncate">
        {formatTime(session.startTime)} - {formatTime(
          session.endTime
        )}
      </small>
    {:else}
      <small class="text-muted"> Devam ediyor... </small>
    {/if}
  </td>

  <td class="d-none d-md-table-cell text-truncate">
    <Badge color={getStatusBadgeColor(session.status || "")}>
      {getStatusText(session.status || "")}
    </Badge>
  </td>

  <td class="d-none d-lg-table-cell text-center text-truncate">
    <div class="text-truncate">
      <Badge class="bg-success-subtle text-success p-1">
        {presentCount}/{totalCount}
      </Badge>
    </div>
  </td>

  <td class="d-none d-lg-table-cell text-truncate">
    {#if session.notes}
      <span
        class="text-truncate d-inline-block"
        title={session.notes}
      >
        {session.notes}
      </span>
    {:else}
      <span class="text-muted">Not yok</span>
    {/if}
  </td>
</tr>

<script lang="ts">
  import { Card, CardHeader, CardTitle, CardBody } from "@sveltestrap/sveltestrap";
  import { goto } from "$app/navigation";
  import type { SessionType } from "$lib/types/types";

  export let sessionData: SessionType;

  function formatDateTime(date: Date) {
    return new Intl.DateTimeFormat("tr-TR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }

  function formatTime(date: Date) {
    return new Intl.DateTimeFormat("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
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
</script>

<Card>
  <CardHeader
    ><CardTitle class="mb-0"
      ><i class="fas fa-info-circle me-2"></i>Ders Bilgileri</CardTitle
    ></CardHeader
  >
  <CardBody>
    <div class="mb-2 d-flex align-items-start justify-content-between">
      <strong class="me-2">Grup:</strong>
      <button
        class="btn btn-link p-0 text-end flex-grow-1 text-primary text-decoration-none"
        type="button"
        on:click={() => goto(`/dashboard/management/groups/${sessionData.group._id}`)}
      >
        {sessionData.group.name}
      </button>
    </div>
    <div class="mb-2 d-flex align-items-start justify-content-between">
      <strong class="me-2">Antrenörler:</strong>
      <div class="text-end flex-grow-1">
        {#each sessionData.coaches as coach, index}
          <button
            class="btn btn-link p-0 me-1 text-primary text-decoration-none"
            type="button"
            on:click={() => goto(`/dashboard/management/users/${coach._id}`)}
          >{coach.firstName} {coach.lastName}{#if index < sessionData.coaches.length - 1},{/if}</button>
        {/each}
      </div>
    </div>
    <div class="mb-2 d-flex align-items-start justify-content-between">
      <strong class="me-2">Durum:</strong>
      <div class="text-end flex-grow-1">
        {getStatusText(sessionData.status || "")}
      </div>
    </div>
    <div class="mb-0 d-flex align-items-start justify-content-between">
      <strong class="me-2">Tarih:</strong>
      <div class="text-end flex-grow-1">
        {formatDateTime(sessionData.startTime)}
        {#if sessionData.endTime}
          - {formatTime(sessionData.endTime)}
        {/if}
      </div>
    </div>
    <hr />
    <div class="mb-2">
      <strong class="me-2">Ders Notları:</strong>
      <div class="mt-2">
        {#if sessionData.notes && sessionData.notes.trim().length}
          <div class="text-muted" style="white-space: pre-wrap;">{sessionData.notes}</div>
        {:else}
          <span class="text-muted">-</span>
        {/if}
      </div>
    </div>
  </CardBody>
</Card>


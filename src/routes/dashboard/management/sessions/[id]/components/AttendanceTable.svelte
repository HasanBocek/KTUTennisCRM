<script lang="ts">
  import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Table,
  } from "@sveltestrap/sveltestrap";
  import type { SessionType } from "$lib/types/types";
  import AttendanceEditModal from "./modals/AttendanceEditModal.svelte";
  import StatusBadge from "$lib/components/StatusBadge.svelte";

  type AttendanceItem = {
    user: {
      _id?: string;
      firstName: string;
      lastName: string;
      phoneNumber?: string;
    };
    status: string;
    note?: string;
  };

  export let session: SessionType | null = null;
  export let editedAttendance: AttendanceItem[] = [];
  export let updateAttendance: (
    index: number,
    newStatus: string
  ) => void;
  export let updateAttendanceNote: (
    index: number,
    note: string
  ) => void;

  let isEditModalOpen = false;
  let editingIndex: number | null = null;
  let currentStatus: string = "";
  let currentNote: string = "";

  function openEditModal(index: number) {
    editingIndex = index;
    currentStatus = editedAttendance[index]?.status || "present";
    currentNote = editedAttendance[index]?.note || "";
    isEditModalOpen = true;
  }

  function handleModalSave(
    event: CustomEvent<{
      sessionId: string;
      status: string;
      note: string;
    }>
  ) {
    if (editingIndex === null) return;
    const { status, note } = event.detail;
    updateAttendance(editingIndex, status as string);
    updateAttendanceNote(editingIndex, note);
    isEditModalOpen = false;
    editingIndex = null;
  }
</script>

<Card>
  <CardHeader class="bg-transparent border-0 pb-0"
    ><CardTitle class="mb-0">Yoklama</CardTitle></CardHeader
  >
  <CardBody>
    <Table responsive class="attendance-table">
      <thead>
        <tr>
          <th>Ad Soyad</th><th>Durum</th><th>Not</th>
        </tr>
      </thead>
      <tbody>
        {#each editedAttendance as attendance, index}
          <tr>
            <td class="py-1">
              <h6 class="mb-0">
                <a
                  href="/dashboard/management/users/{attendance.user
                    ._id}"
                  class="text-decoration-none text-primary"
                >
                  {attendance.user.firstName}
                  {attendance.user.lastName}
                </a>
              </h6>
              <small class="text-muted"
                >{attendance.user.phoneNumber ||
                  "Telefon belirtilmemiş"}</small
              >
            </td>
            <td>
              <button
                type="button"
                class="btn btn-link p-0 text-decoration-none"
                aria-label="Katılım durumunu düzenle"
                on:click={() => openEditModal(index)}
              >
                <StatusBadge
                  status={attendance.status}
                  variant="badge"
                />
              </button>
            </td>
            <td>
              <button
                type="button"
                class="btn btn-link p-0 text-decoration-none text-muted"
                on:click={() => openEditModal(index)}
              >
                {attendance.note || "-"}
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </Table>
  </CardBody>
</Card>

<AttendanceEditModal
  bind:isOpen={isEditModalOpen}
  {session}
  {currentStatus}
  {currentNote}
  on:save={handleModalSave}
  on:close={() => (isEditModalOpen = false)}
/>

<style>
  .attendance-table tbody tr:first-child td {
    border-top: 1px dashed rgba(0, 0, 0, 0.15);
  }
  html[data-bs-theme="dark"]
    .attendance-table
    tbody
    tr:first-child
    td {
    border-top: 1px dashed rgba(255, 255, 255, 0.15);
  }
</style>

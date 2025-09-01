<script lang="ts">
  import {
    Badge,
    Card,
    CardBody,
    CardHeader,
    Table,
    Button,
    ButtonGroup,
    Row,
    Col,
  } from "@sveltestrap/sveltestrap";
  import type { GroupType } from "$lib/types/types";
  import type { SessionType } from "$lib/types/types";
  import type { UserType } from "$lib/types/types";
  import { SessionData } from "$lib/assets/data/mock/data";
  import { UserData } from "$lib/assets/data/mock/data";
  import AttendanceEditModal from "./modals/AttendanceEditModal.svelte";

  export let group: GroupType;

  // Modal state
  let isModalOpen = false;
  let selectedSession: SessionType | null = null;
  let selectedMember: UserType | null = null;
  let currentAttendance: { status: string; note?: string } | null =
    null;

  // Get group sessions
  $: groupSessions = SessionData.filter(
    (session) => session.group._id === group._id
  );

  // Extract unique members from sessions
  $: groupMembers = groupSessions.reduce(
    (members: UserType[], session) => {
      session.attendance.forEach((attendance) => {
        const userId = attendance.user._id;
        if (!members.some((m) => m._id === userId)) {
          const userData = UserData.find((u) => u._id === userId);
          if (userData) {
            members.push(userData);
          }
        }
      });
      return members;
    },
    []
  );

  // Sort sessions by date (most recent first)
  $: sortedSessions = [...groupSessions].sort(
    (a, b) =>
      new Date(a.startTime).getTime() -
      new Date(b.startTime).getTime()
  );

  import StatusBadge from "$lib/components/StatusBadge.svelte";

  function getMemberAttendance(
    session: SessionType,
    memberId: string
  ) {
    return session.attendance.find(
      (att) => att.user._id === memberId
    );
  }

  function formatShortDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
    });
  }

  // Modal functions
  function openAttendanceModal(
    session: SessionType,
    member: UserType
  ) {
    selectedSession = session;
    selectedMember = member;
    const attendance = getMemberAttendance(session, member._id);
    currentAttendance = attendance
      ? { status: attendance.status, note: attendance.note }
      : null;
    isModalOpen = true;
  }

  function closeModal() {
    isModalOpen = false;
    selectedSession = null;
    selectedMember = null;
    currentAttendance = null;
  }

  function handleAttendanceSave(
    event: CustomEvent<{
      sessionId: string;
      status: string;
      note?: string;
    }>
  ) {
    const { sessionId, status, note } = event.detail;

    if (!selectedMember) return;

    // Find the session in our data and update the attendance
    const sessionIndex = SessionData.findIndex(
      (s) => s._id === sessionId
    );
    if (sessionIndex !== -1) {
      const session = SessionData[sessionIndex];
      const attendanceIndex = session.attendance.findIndex(
        (a) => a.user._id === selectedMember?._id
      );

      if (attendanceIndex !== -1) {
        // Update existing attendance
        session.attendance[attendanceIndex].status = status;
        session.attendance[attendanceIndex].note = note;
      } else {
        // Add new attendance record
        session.attendance.push({
          user: {
            _id: selectedMember._id,
            firstName: selectedMember.firstName,
            lastName: selectedMember.lastName,
            isMale: selectedMember.isMale,
            phoneNumber: selectedMember.phoneNumber,
            studentNumber: selectedMember.studentNumber,
          },
          status,
          note,
        });
      }

      // Trigger reactivity
      SessionData[sessionIndex] = { ...session };
    }

    closeModal();
  }
</script>

<Card>
  <CardHeader class="bg-transparent border-0 pb-0">
    <div class="d-flex justify-content-between align-items-center">
      <h5 class="mb-0">Devam Listesi</h5>
      <div class="d-flex gap-2">
        <Badge color="primary">{groupMembers.length} Üye</Badge>
        <Badge color="info">{sortedSessions.length} Ders</Badge>
      </div>
    </div>
  </CardHeader>
  <CardBody>
    {#if sortedSessions.length > 0 && groupMembers.length > 0}
      <div class="table-responsive">
        <Table class="attendance-table">
          <thead>
            <tr class="border-bottom-dashed">
              <th class="sticky-column">Ad Soyad</th>
              {#each sortedSessions as session}
                <th class="text-center session-column">
                  <div class="session-header">
                    <div class="fw-semibold">
                      {formatShortDate(session.startTime.toString())}
                    </div>
                  </div>
                </th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each groupMembers as member}
              <tr>
                <td class="sticky-column member-column">
                  <div class="d-flex align-items-center">
                    <div>
                      <h6 class="mb-0">
                        <a
                          href="/dashboard/management/users/{member._id}"
                          class="text-decoration-none text-primary"
                        >
                          {member.firstName}
                          {member.lastName}
                        </a>
                      </h6>
                      <small class="text-muted"
                        >{member.phoneNumber ||
                          "Telefon belirtilmemiş"}</small
                      >
                    </div>
                  </div>
                </td>
                {#each sortedSessions as session}
                  <td class="text-center attendance-cell">
                    {#if getMemberAttendance(session, member._id)}
                      {@const attendance = getMemberAttendance(
                        session,
                        member._id
                      )}
                      <button
                        class="attendance-badge bg-light text-dark clickable-badge border-0 p-0"
                        on:click={() =>
                          openAttendanceModal(session, member)}
                      >
                        <StatusBadge
                          status={attendance?.status || ""}
                          variant="badge"
                        />
                      </button>
                    {:else}
                      <button
                        class="badge bg-light text-dark attendance-badge border-0"
                        disabled
                      >
                        -
                      </button>
                    {/if}
                  </td>
                {/each}
              </tr>
            {/each}
          </tbody>
        </Table>
      </div>
    {:else if groupMembers.length === 0}
      <div class="text-center py-4">
        <i class="fas fa-users text-muted" style="font-size: 3rem;"
        ></i>
        <h5 class="mt-3 text-muted">Henüz üye bulunmuyor</h5>
        <p class="text-muted">Bu gruba henüz hiç üye katılmamış.</p>
      </div>
    {:else}
      <div class="text-center py-4">
        <i
          class="fas fa-calendar-times text-muted"
          style="font-size: 3rem;"
        ></i>
        <h5 class="mt-3 text-muted">Henüz ders kaydı bulunmuyor</h5>
        <p class="text-muted">
          Bu grup için henüz hiç ders yapılmamış.
        </p>
      </div>
    {/if}
  </CardBody>
</Card>

<!-- Attendance Edit Modal -->
<AttendanceEditModal
  bind:isOpen={isModalOpen}
  session={selectedSession}
  currentStatus={currentAttendance?.status || ""}
  currentNote={currentAttendance?.note || ""}
  on:save={handleAttendanceSave}
  on:close={closeModal}
/>

<style>
  .border-bottom-dashed {
    border-bottom: 1px dashed rgba(0, 0, 0, 0.1) !important;
  }

  html[data-bs-theme="dark"] .border-bottom-dashed {
    border-bottom-color: rgba(255, 255, 255, 0.1) !important;
  }

  .attendance-table {
    min-width: 800px;
  }

  .sticky-column {
    position: sticky;
    left: 0;
    background-color: var(--bs-body-bg);
    z-index: 10;
    min-width: 200px;
    border-right: 2px solid var(--bs-border-color);
  }

  .clickable-badge {
    cursor: pointer;
    transition: all 0.2s ease;
  }

  /* Compact table rows */
  .attendance-table tbody tr {
    line-height: 1.2;
  }

  .attendance-table tbody td {
    padding: 0.4rem 0.5rem !important;
    vertical-align: middle;
  }

  .attendance-table tbody td h6 {
    margin-bottom: 0.1rem;
  }

  /* Dark mode adjustments */
  html[data-bs-theme="dark"] .sticky-column {
    background-color: var(--bs-body-bg);
    border-right-color: var(--bs-border-color);
  }

  html[data-bs-theme="dark"] .clickable-badge:hover {
    box-shadow: 0 2px 4px rgba(255, 255, 255, 0.1);
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .sticky-column {
      min-width: 135px;
    }
  }
</style>

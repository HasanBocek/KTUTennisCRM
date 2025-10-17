<script lang="ts">
  import {
    Badge,
    Card,
    CardBody,
    CardHeader,
    Col,
    Row,
    Nav,
    NavItem,
    NavLink,
  } from "@sveltestrap/sveltestrap";
  import type { UserType, SessionType } from "$lib/types/types";
  import { format } from "date-fns";
  import { tr } from "date-fns/locale";
  import StatusBadge from "$lib/components/StatusBadge.svelte";
  import AttendanceEditModal from "./modals/AttendanceEditModal.svelte";
  import { AttendanceService } from "$lib/services/attendance/attendanceService";

  export let user: UserType;
  export let sessionsData: SessionType[];

  // State
  let sessions = [...sessionsData];
  let activeGroupId: string | undefined = undefined;
  let attendanceModalOpen = false;
  let selectedSession: SessionType | null = null;
  let updatingAttendance: { [sessionId: string]: boolean } = {};

  // Computed
  $: memberships = (user.memberships || []).filter(m => m.status === "active");
  $: if (!activeGroupId && memberships?.length) activeGroupId = memberships[0].group._id;
  $: activeSessions = activeGroupId ? getSortedSessions(activeGroupId) : [];
  $: sessionsByGroup = (groupId: string) => sessions.filter(s => s.group._id === groupId);

  // Constants
  const ATTENDANCE_OPTIONS = [
    { value: "present", label: "Geldi", color: "success" },
    { value: "absent", label: "Gelmedi", color: "danger" },
    { value: "late", label: "Geç Geldi", color: "warning" },
    { value: "excused", label: "Mazeretli", color: "info" },
  ];

  const TWELVE_SLOTS = Array.from({ length: 12 }, (_, i) => i);

  // Helper functions
  function getSortedSessions(groupId: string, desc = false) {
    const filtered = sessions.filter(s => s.group._id === groupId);
    return filtered.sort((a, b) => {
      const timeA = new Date(a.startTime).getTime();
      const timeB = new Date(b.startTime).getTime();
      return desc ? timeB - timeA : timeA - timeB;
    });
  }

  function getUserAttendance(session: SessionType) {
    return session.attendance.find(a => a.user._id === user._id);
  }

  function getAttendanceStatus(session: SessionType) {
    return getUserAttendance(session)?.status;
  }

  function getAttendanceNote(session: SessionType) {
    return getUserAttendance(session)?.note;
  }

  function getAttendanceMeta(status?: string) {
    switch (status) {
      case "present": return { label: "Geldi", color: "success" };
      case "absent": return { label: "Gelm.", color: "danger" };
      case "late": return { label: "Geç", color: "warning" };
      case "excused": return { label: "Maz.", color: "info" };
      default: return { label: "-", color: "light" };
    }
  }

  function formatShortDate(date?: string | Date) {
    return date ? new Date(date).toLocaleDateString("tr-TR", {
      day: "2-digit", month: "2-digit"
    }) : "-";
  }

  function formatTime(date?: string | Date) {
    return date ? new Date(date).toLocaleTimeString("tr-TR", {
      hour: "2-digit", minute: "2-digit"
    }) : "-";
  }

  function listCoaches(coaches: SessionType["coaches"]) {
    return coaches.map(c => `${c.firstName} ${c.lastName}`).join(", ") || "-";
  }

  // API functions
  async function updateAttendance(sessionId: string, status: string, note?: string) {
    updatingAttendance = { ...updatingAttendance, [sessionId]: true };

    try {
      const result = await AttendanceService.updateAttendance({
        sessionId,
        userId: user._id,
        status,
        note,
      });

      if (result.success) {
        sessions = sessions.map(session => {
          if (session._id !== sessionId) return session;

          const attendanceIndex = session.attendance.findIndex(a => a.user._id === user._id);
          
          if (attendanceIndex !== -1) {
            return {
              ...session,
              attendance: session.attendance.map((att, index) =>
                index === attendanceIndex ? { ...att, status, note } : att
              ),
            };
          }

          return {
            ...session,
            attendance: [
              ...session.attendance,
              {
                user: {
                  _id: user._id,
                  email: user.email || "",
                  firstName: user.firstName || "",
                  lastName: user.lastName || "",
                  isMale: user.isMale || "",
                  phoneNumber: user.phoneNumber || "",
                  studentNumber: user.studentNumber || 0,
                },
                status,
                note,
              },
            ],
          };
        });

        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("sessionDataUpdated"));
        }
      }
    } catch (error) {
      console.error("Error updating attendance:", error);
    } finally {
      updatingAttendance = { ...updatingAttendance, [sessionId]: false };
    }
  }

  // Modal handlers
  function openModal(session: SessionType) {
    selectedSession = session;
    attendanceModalOpen = true;
  }

  function closeModal() {
    attendanceModalOpen = false;
    selectedSession = null;
  }

  async function handleModalUpdate(event: CustomEvent<{
    sessionId: string;
    status: string;
    note?: string;
  }>) {
    const { sessionId, status, note } = event.detail;
    await updateAttendance(sessionId, status, note);
  }
</script>

<Row>
  <Col lg="12">
    <Card class="shadow-sm border-0">
      <CardHeader class="bg-transparent border-0 pb-0">
        <div class="d-flex align-items-center justify-content-between flex-wrap gap-2">
          <h5 class="mb-0">Grup Dersleri</h5>
        </div>
        <Nav tabs class="mt-3">
          {#each memberships as membership}
            <NavItem>
              <NavLink
                active={activeGroupId === membership.group._id}
                on:click={() => (activeGroupId = membership.group._id)}
                role="button"
              >
                {membership.group.name}
                <Badge color="light" class="ms-2 text-muted border">
                  {sessionsByGroup(membership.group._id).length}
                </Badge>
              </NavLink>
            </NavItem>
          {/each}
        </Nav>
      </CardHeader>
      <CardBody>
        {#if activeGroupId && sessionsByGroup(activeGroupId).length > 0}
          <!-- Mobile: horizontal chips -->
          <div class="d-md-none">
            <div class="sessions-scroll">
              {#each TWELVE_SLOTS as idx}
                <div class="session-chip">
                  <div class="chip-date text-dark">
                    {activeSessions[idx] ? formatShortDate(activeSessions[idx].startTime) : "-"}
                  </div>
                  <div class="chip-badge">
                    {#if activeSessions[idx]}
                      <Badge color={getAttendanceMeta(getAttendanceStatus(activeSessions[idx])).color}>
                        {getAttendanceMeta(getAttendanceStatus(activeSessions[idx])).label}
                      </Badge>
                    {:else}
                      -
                    {/if}
                  </div>
                </div>
              {/each}
            </div>
          </div>

          <!-- Desktop: table -->
          <div class="table-responsive d-none d-md-block">
            <table class="table table-sm sessions-table">
              <thead>
                <tr>
                  <th>Ders</th>
                  {#each TWELVE_SLOTS as idx}
                    <th class="text-dark">
                      {activeSessions[idx] ? formatShortDate(activeSessions[idx].startTime) : "-"}
                    </th>
                  {/each}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="text-muted small">Katılım</td>
                  {#each TWELVE_SLOTS as idx}
                    <td>
                      {#if activeSessions[idx]}
                        <StatusBadge
                          status={getAttendanceStatus(activeSessions[idx]) || "absent"}
                          variant="badge"
                        />
                      {:else}
                        -
                      {/if}
                    </td>
                  {/each}
                </tr>
              </tbody>
            </table>
          </div>
        {:else}
          <div class="text-muted small">
            {activeGroupId ? "Bu üyelik için kayıtlı ders bulunmuyor." : "Üyelik bulunamadı."}
          </div>
        {/if}
      </CardBody>
    </Card>
  </Col>
</Row>

<Row class="mt-0">
  <Col lg="12">
    <Card class="shadow-sm border-0">
      <CardHeader class="bg-transparent border-0 pb-0">
        <h5 class="mb-0">Ders Detayları</h5>
      </CardHeader>
      <CardBody>
        {#if activeGroupId && sessionsByGroup(activeGroupId).length > 0}
          <ul class="list-unstyled mb-0">
            {#each getSortedSessions(activeGroupId, true) as session, index}
              <li class="session-item" class:first-item={index === 0}>
                <div class="d-flex w-100 align-items-start justify-content-between flex-column flex-md-row">
                  <div class="session-left">
                    <div class="session-date">
                      {format(new Date(session.startTime), "dd MMMM yyyy", { locale: tr })}
                      <span class="day-name">
                        {format(new Date(session.startTime), "EEEE", { locale: tr })}
                      </span>
                    </div>

                    <div class="session-info">
                      <div class="info-row">
                        <span class="label">Session ID:</span>
                        <code class="session-id">
                          <a href={`/dashboard/management/sessions/${session._id}`}>
                            {session._id}
                          </a>
                        </code>
                      </div>

                      <div class="info-row">
                        <span class="label">Saat:</span>
                        <span class="value">
                          {formatTime(session.startTime)} - {formatTime(session.endTime)}
                        </span>
                      </div>

                      <div class="info-row">
                        <span class="label">Eğitmenler:</span>
                        <span class="value">{listCoaches(session.coaches)}</span>
                      </div>

                      {#if session.notes}
                        <div class="info-row">
                          <span class="label">Not:</span>
                          <span class="value note">{session.notes}</span>
                        </div>
                      {/if}

                      {#if getAttendanceNote(session)}
                        <div class="info-row">
                          <span class="label">Öğrenci Notu:</span>
                          <span class="value attendance-note">
                            {getAttendanceNote(session)}
                          </span>
                        </div>
                      {/if}
                    </div>
                  </div>

                  <div class="session-right">
                    <div class="session-status">
                      <StatusBadge status={session.status || "active"} variant="text" />
                    </div>
                    <div class="session-attendance">
                      <div class="attendance-text">
                        <StatusBadge
                          status={getAttendanceStatus(session) || "absent"}
                          variant="text"
                        />
                        <button
                          type="button"
                          class="btn btn-link btn-sm p-0 ms-2"
                          disabled={updatingAttendance[session._id]}
                          on:click={() => openModal(session)}
                          title="Katılım durumunu düzenle"
                        >
                          {#if updatingAttendance[session._id]}
                            <span class="spinner-border spinner-border-sm"></span>
                          {:else}
                            <i class="fas fa-edit"></i>
                          {/if}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            {/each}
          </ul>
        {:else}
          <div class="text-muted">
            {activeGroupId ? "Ders bulunmuyor." : "Üyelik bulunamadı."}
          </div>
        {/if}
      </CardBody>
    </Card>
  </Col>
</Row>

<AttendanceEditModal
  bind:isOpen={attendanceModalOpen}
  session={selectedSession}
  currentStatus={selectedSession ? getAttendanceStatus(selectedSession) || "present" : "present"}
  currentNote={selectedSession ? getAttendanceNote(selectedSession) || "" : ""}
  on:save={handleModalUpdate}
  on:close={closeModal}
/>

<style>
  .sessions-table {
    width: 100% !important;
    table-layout: fixed;
  }
  
  .sessions-table thead {
    border-bottom: 0;
  }
  
  .sessions-table tbody tr:first-child td {
    border-top: 1px dashed rgba(0, 0, 0, 0.15);
  }
  
  html[data-bs-theme="dark"] .sessions-table tbody tr:first-child td {
    border-top: 1px dashed rgba(255, 255, 255, 0.15);
  }

  .sessions-table th,
  .sessions-table td {
    white-space: nowrap;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .sessions-table thead th:first-child,
  .sessions-table tbody td:first-child {
    width: 120px;
  }

  .sessions-scroll {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding-bottom: 6px;
    margin-bottom: 2px;
    -webkit-overflow-scrolling: touch;
    scroll-snap-type: x mandatory;
  }

  .session-chip {
    scroll-snap-align: start;
    flex: 0 0 auto;
    min-width: 86px;
    border: 1px dashed rgba(0, 0, 0, 0.15);
    border-radius: 12px;
    padding: 8px 10px;
    text-align: center;
    background: var(--bs-body-bg);
  }

  .session-item {
    border-bottom: 1px dashed rgba(0, 0, 0, 0.15);
    padding: 16px 0;
  }

  .session-item.first-item {
    padding-top: 8px;
  }

  .session-item:last-child {
    border-bottom: none;
  }

  html[data-bs-theme="dark"] .session-item {
    border-bottom-color: rgba(255, 255, 255, 0.15);
  }

  html[data-bs-theme="dark"] .session-chip {
    border-color: rgba(255, 255, 255, 0.15);
  }

  .chip-date {
    font-weight: 600;
    font-size: 0.85rem;
  }

  .chip-badge {
    margin-top: 4px;
  }

  .session-left {
    flex: 1;
    margin-right: 0;
    margin-bottom: 8px;
  }

  @media (min-width: 768px) {
    .session-left {
      margin-right: 16px;
      margin-bottom: 0;
    }
  }

  .session-date {
    font-size: 1rem;
    font-weight: 600;
    color: var(--bs-body-color);
    margin-bottom: 10px;
  }

  .day-name {
    font-weight: 400;
    color: var(--bs-secondary);
    margin-left: 8px;
  }

  .session-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .info-row {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    font-size: 0.8rem;
  }

  .label {
    color: var(--bs-secondary);
    min-width: 80px;
    font-weight: 500;
    font-size: 0.75rem;
  }

  .value {
    color: var(--bs-body-color);
    flex: 1;
  }

  .session-id {
    background: rgba(var(--bs-success-rgb), 0.1);
    border: 1px solid rgba(var(--bs-success-rgb), 0.2);
    color: var(--bs-success);
    padding: 1px 4px;
    border-radius: 3px;
    font-size: 0.7rem;
  }

  .session-id a {
    color: inherit;
    text-decoration: none;
  }

  .session-id a:hover {
    text-decoration: underline;
  }

  .note {
    color: var(--bs-secondary);
    font-style: italic;
  }

  .attendance-note {
    color: var(--bs-info);
  }

  .session-right {
    display: flex;
    flex-direction: row;
    gap: 25px;
    align-items: center;
    justify-content: center;
    margin-top: 16px;
    width: 100%;
  }

  @media (min-width: 768px) {
    .session-right {
      min-width: 160px;
      flex-direction: column;
      gap: 12px;
      align-items: flex-end;
      text-align: right;
      margin-top: 0;
      width: auto;
      justify-content: flex-start;
    }
  }

  .session-status {
    font-size: 0.8rem;
  }

  .session-attendance {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .attendance-text {
    display: flex;
    align-items: center;
  }
</style>
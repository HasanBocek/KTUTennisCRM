<script lang="ts">
  import {
    Badge,
    Card,
    CardBody,
    CardHeader,
    CardFooter,
    Col,
    Row,
    Nav,
    NavItem,
    NavLink,
    Button,
    Input,
    FormGroup,
    Label,
  } from "@sveltestrap/sveltestrap";
  import type { UserType } from "$lib/types/types";
  import { SessionData } from "$lib/assets/data/mock/data";
  import type { SessionType } from "$lib/types/types";

  export let user: UserType;

  // Local mutable copy of sessions for updates
  let sessions = [...SessionData];
  import {
    format,
    formatDistance,
    formatRelative,
    subDays,
  } from "date-fns";
  import { tr } from "date-fns/locale";
  import AttendanceEditModal from "./modals/AttendanceEditModal.svelte";

  // Sadece active status'undaki üyelikleri göster
  $: memberships = (user.memberships || []).filter(
    (membership) => membership.status === "active"
  );
  const currentUserId = user._id;
  let activeGroupId: string | undefined = undefined;
  $: if (!activeGroupId && memberships?.length) {
    activeGroupId = memberships[0].group._id;
  }

  const getDayName = (day: string) => {
    switch (day) {
      case "Monday":
        return "Pazartesi";
      case "Tuesday":
        return "Salı";
      case "Wednesday":
        return "Çarşamba";
      case "Thursday":
        return "Perşembe";
      case "Friday":
        return "Cuma";
      case "Saturday":
        return "Cumartesi";
      case "Sunday":
        return "Pazar";
      default:
        return day;
    }
  };

  import StatusBadge from "$lib/components/StatusBadge.svelte";
  import EmptyState from "$lib/components/EmptyState.svelte";

  const formatDate = (date?: string | Date) =>
    date ? new Date(date).toLocaleDateString() : "Veri Yok";
  const formatDateTime = (date?: string | Date) =>
    date ? new Date(date).toLocaleString() : "-";
  const formatShortDate = (date?: string | Date) =>
    date
      ? new Date(date).toLocaleDateString("tr-TR", {
          day: "2-digit",
          month: "2-digit",
        })
      : "-";
  const formatTime = (date?: string | Date) =>
    date
      ? new Date(date).toLocaleTimeString("tr-TR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "-";
  const listCoaches = (coaches: SessionType["coaches"]) =>
    coaches.map((c) => c.firstName + " " + c.lastName).join(", ") ||
    "-";

  $: sessionsByGroup = (groupId: string): SessionType[] =>
    sessions.filter((s) => s.group._id === groupId);

  const myAttendanceStatus = (session: SessionType) =>
    session.attendance.find((a) => a.user._id === currentUserId)
      ?.status;

  const myAttendanceNote = (session: SessionType) =>
    session.attendance.find((a) => a.user._id === currentUserId)
      ?.note;

  // Dersleri (session) kronolojik sıraya diz, 12 slot hazırla
  const compareByStartTime = (a: SessionType, b: SessionType) =>
    new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
  $: getSortedSessionsByGroup = (groupId: string): SessionType[] =>
    sessions
      .filter((s) => s.group._id === groupId)
      .slice()
      .sort(compareByStartTime);

  // Yalnızca "Ders Detayları" listesi için: en yeni tarih başta olacak şekilde sırala
  const compareByStartTimeDesc = (a: SessionType, b: SessionType) =>
    new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
  $: getSortedSessionsByGroupDesc = (
    groupId: string
  ): SessionType[] =>
    sessions
      .filter((s) => s.group._id === groupId)
      .slice()
      .sort(compareByStartTimeDesc);
  const twelveSlots = Array.from({ length: 12 }, (_, i) => i);
  let activeSessions: SessionType[] = [];
  $: activeSessions = activeGroupId
    ? getSortedSessionsByGroup(activeGroupId)
    : [];

  // Katılım durumu güncelleme için state yönetimi
  let editingAttendance: Record<string, boolean> = {};
  let tempAttendanceStatus: Record<string, string> = {};

  // Modal state
  let attendanceModalOpen = false;
  let selectedSession: SessionType | null = null;

  // Katılım durumu seçenekleri
  const attendanceOptions = [
    { value: "present", label: "Geldi", color: "success" },
    { value: "absent", label: "Gelmedi", color: "danger" },
    { value: "late", label: "Geç Geldi", color: "warning" },
    { value: "excused", label: "Mazeretli", color: "info" },
  ];

  // Katılım durumu güncelleme fonksiyonu
  function updateAttendanceStatus(
    sessionId: string,
    newStatus: string
  ) {
    // Deep clone approach - completely new object structure
    sessions = sessions.map((session) => {
      if (session._id === sessionId) {
        const attendanceIndex = session.attendance.findIndex(
          (a) => a.user._id === currentUserId
        );

        if (attendanceIndex !== -1) {
          // Update existing attendance
          return {
            ...session,
            attendance: session.attendance.map((att, index) =>
              index === attendanceIndex
                ? { ...att, status: newStatus }
                : { ...att }
            ),
          };
        } else {
          // Add new attendance
          return {
            ...session,
            attendance: [
              ...session.attendance,
              {
                user: {
                  _id: currentUserId,
                  email: user.email || "",
                  firstName: user.firstName || "",
                  lastName: user.lastName || "",
                  isMale: user.isMale || "",
                  phoneNumber: user.phoneNumber || "",
                  studentNumber: user.studentNumber || 0,
                },
                status: newStatus,
              },
            ],
          };
        }
      }
      return { ...session };
    });

    // Edit modunu kapat
    editingAttendance = { ...editingAttendance, [sessionId]: false };
    tempAttendanceStatus = Object.fromEntries(
      Object.entries(tempAttendanceStatus).filter(
        ([key]) => key !== sessionId
      )
    );

    // Dispatch custom event to notify ProfileInfo
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("sessionDataUpdated"));
    }

    // Force re-render
    activeSessions = activeGroupId
      ? getSortedSessionsByGroup(activeGroupId)
      : [];

    if (import.meta.env.DEV) {
      console.log(
        `✅ AFTER UPDATE: Sessions updated, new length: ${sessions.length}`
      );
      console.log("Active sessions updated:", activeSessions.length);
      console.log("Edit mode closed for session:", sessionId);
    }
  }

  // Edit modunu iptal et
  function cancelEditingAttendance(sessionId: string) {
    editingAttendance = { ...editingAttendance, [sessionId]: false };
    tempAttendanceStatus = Object.fromEntries(
      Object.entries(tempAttendanceStatus).filter(
        ([key]) => key !== sessionId
      )
    );
  }

  // Modal fonksiyonları
  function openAttendanceModal(session: SessionType) {
    selectedSession = session;
    attendanceModalOpen = true;
  }

  function closeAttendanceModal() {
    attendanceModalOpen = false;
    selectedSession = null;
  }

  // Modal'dan katılım durumu güncelleme
  function handleAttendanceUpdate(
    event: CustomEvent<{
      sessionId: string;
      status: string;
      note?: string;
    }>
  ) {
    const { sessionId, status, note } = event.detail;
    if (import.meta.env.DEV) {
      console.log(
        `🔄 MODAL UPDATE: Updating attendance for session ${sessionId} to ${status} with note: "${note}"`
      );
    }

    // Deep clone approach - completely new object structure
    sessions = sessions.map((session) => {
      if (session._id === sessionId) {
        const attendanceIndex = session.attendance.findIndex(
          (a) => a.user._id === currentUserId
        );

        if (attendanceIndex !== -1) {
          // Update existing attendance
          return {
            ...session,
            attendance: session.attendance.map((att, index) =>
              index === attendanceIndex
                ? { ...att, status: status, note: note || undefined }
                : { ...att }
            ),
          };
        } else {
          // Add new attendance
          return {
            ...session,
            attendance: [
              ...session.attendance,
              {
                user: {
                  _id: currentUserId,
                  email: user.email || "",
                  firstName: user.firstName || "",
                  lastName: user.lastName || "",
                  isMale: user.isMale || "",
                  phoneNumber: user.phoneNumber || "",
                  studentNumber: user.studentNumber || 0,
                },
                status: status,
                note: note || undefined,
              },
            ],
          };
        }
      }
      return { ...session };
    });

    // Also update the global SessionData so ProfileInfo gets updated
    SessionData.splice(0, SessionData.length, ...sessions);

    // Dispatch custom event to notify ProfileInfo
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("sessionDataUpdated"));
    }

    // Force re-render
    activeSessions = activeGroupId
      ? getSortedSessionsByGroup(activeGroupId)
      : [];

    if (import.meta.env.DEV) {
      console.log(`✅ MODAL UPDATE COMPLETE: Sessions updated`);
    }
  }

  function getAttendanceMeta(status?: string): {
    label: string;
    color: string;
  } {
    switch (status) {
      case "present":
        return { label: "Geldi", color: "success" };
      case "absent":
        return { label: "Gelm.", color: "danger" };
      case "late":
        return { label: "Geç", color: "warning" };
      case "excused":
        return { label: "Maz.", color: "info" };
      default:
        return { label: "-", color: "light" };
    }
  }
</script>

<Row>
  <Col lg="12">
    <Card class="shadow-sm border-0">
      <CardHeader class="bg-transparent border-0 pb-0">
        <div
          class="d-flex align-items-center justify-content-between flex-wrap gap-2"
        >
          <h5
            class="mb-0
        "
          >
            Grup Dersleri
          </h5>
        </div>
        <Nav tabs class="mt-3">
          {#each memberships as membership}
            <NavItem>
              <NavLink
                active={activeGroupId === membership.group._id}
                on:click={() =>
                  (activeGroupId = membership.group._id)}
                role="button"
              >
                {membership.group.name}
                <Badge color="light" class="ms-2 text-muted border"
                  >{sessionsByGroup(membership.group._id)
                    .length}</Badge
                >
              </NavLink>
            </NavItem>
          {/each}
        </Nav>
      </CardHeader>
      <CardBody>
        {#if activeGroupId}
          {#if sessionsByGroup(activeGroupId).length > 0}
            <!-- Mobile: horizontal chips -->
            <div class="d-md-none">
              <div class="sessions-scroll">
                {#each twelveSlots as idx}
                  <div class="session-chip">
                    <div class="chip-date text-dark">
                      {activeSessions[idx]
                        ? formatShortDate(
                            activeSessions[idx].startTime
                          )
                        : "-"}
                    </div>
                    <div class="chip-badge">
                      {#if activeSessions[idx]}
                        <Badge
                          color={getAttendanceMeta(
                            myAttendanceStatus(activeSessions[idx])
                          ).color}
                        >
                          {getAttendanceMeta(
                            myAttendanceStatus(activeSessions[idx])
                          ).label}
                        </Badge>
                      {:else}
                        -
                      {/if}
                    </div>
                  </div>
                {/each}
              </div>
            </div>

            <!-- Desktop/tablet: keep table -->
            <div class="table-responsive d-none d-md-block">
              <table class="table table-sm sessions-table">
                <thead>
                  <tr>
                    <th>Ders</th>
                    {#each twelveSlots as idx}
                      <th class="text-dark"
                        >{activeSessions[idx]
                          ? formatShortDate(
                              activeSessions[idx].startTime
                            )
                          : "-"}</th
                      >
                    {/each}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="text-muted small">Katılımım</td>
                    {#each twelveSlots as idx}
                      <td>
                        {#if activeSessions[idx]}
                          {#key activeSessions[idx]._id + JSON.stringify(activeSessions[idx].attendance)}
                            <StatusBadge
                              status={myAttendanceStatus(
                                activeSessions[idx]
                              ) || "absent"}
                              variant="badge"
                            />
                          {/key}
                        {:else}-{/if}
                      </td>
                    {/each}
                  </tr>
                </tbody>
              </table>
            </div>
          {:else}
            <div class="text-muted small">
              Bu üyelik için kayıtlı ders bulunmuyor.
            </div>
          {/if}
        {:else}
          <div class="text-muted small">Üyelik bulunamadı.</div>
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
        {#if activeGroupId}
          {#if sessionsByGroup(activeGroupId).length > 0}
            <ul class="list-unstyled mb-0">
              {#each getSortedSessionsByGroupDesc(activeGroupId) as session, index (session._id + JSON.stringify(session.attendance))}
                <li
                  class="session-item"
                  class:first-item={index === 0}
                >
                  <div
                    class="d-flex w-100 align-items-start justify-content-between flex-column flex-md-row"
                  >
                    <div class="session-left">
                      <div class="session-date">
                        {format(
                          new Date(session.startTime),
                          "dd MMMM yyyy",
                          { locale: tr }
                        )}
                        <span class="day-name"
                          >{format(
                            new Date(session.startTime),
                            "EEEE",
                            { locale: tr }
                          )}</span
                        >
                      </div>

                      <div class="session-info">
                        <div class="info-row">
                          <span class="label">Session ID:</span>
                          <code class="session-id">
                            <a
                              href={`/dashboard/management/sessions/${session._id}`}
                              >{session._id}</a
                            >
                          </code>
                        </div>

                        <div class="info-row">
                          <span class="label">Saat:</span>
                          <span class="value"
                            >{formatTime(session.startTime)} - {formatTime(
                              session.endTime
                            )}</span
                          >
                        </div>

                        <div class="info-row">
                          <span class="label">Eğitmenler:</span>
                          <span class="value"
                            >{listCoaches(session.coaches)}</span
                          >
                        </div>

                        {#if session.notes}
                          <div class="info-row">
                            <span class="label">Not:</span>
                            <span class="value note"
                              >{session.notes}</span
                            >
                          </div>
                        {/if}

                        {#if myAttendanceNote(session)}
                          <div class="info-row">
                            <span class="label">Öğrenci Notu:</span>
                            <span class="value attendance-note">
                              {myAttendanceNote(session)}
                            </span>
                          </div>
                        {/if}
                      </div>
                    </div>
                    <div class="session-right">
                      <div class="session-status">
                        <StatusBadge
                          status={session.status || "active"}
                          variant="text"
                        />
                      </div>
                      <div class="session-attendance">
                        {#if editingAttendance[session._id]}
                          <div class="edit-mode">
                            <select
                              bind:value={
                                tempAttendanceStatus[session._id]
                              }
                              class="form-select form-select-sm"
                            >
                              {#each attendanceOptions as option}
                                <option value={option.value}
                                  >{option.label}</option
                                >
                              {/each}
                            </select>
                            <div class="edit-buttons">
                              <button
                                type="button"
                                class="btn btn-sm btn-success"
                                on:click={() =>
                                  updateAttendanceStatus(
                                    session._id,
                                    tempAttendanceStatus[session._id]
                                  )}
                              >
                                ✓
                              </button>
                              <button
                                type="button"
                                class="btn btn-sm btn-secondary"
                                on:click={() =>
                                  cancelEditingAttendance(
                                    session._id
                                  )}
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        {:else}
                          <div class="attendance-text">
                            <StatusBadge
                              status={myAttendanceStatus(session) ||
                                "absent"}
                              variant="text"
                            />
                            <button
                              type="button"
                              class="btn btn-link btn-sm p-0 ms-2"
                              on:click={() =>
                                openAttendanceModal(session)}
                              title="Katılım durumunu düzenle"
                            >
                              <i class="fas fa-edit"></i>
                            </button>
                          </div>
                        {/if}
                      </div>
                    </div>
                  </div>
                </li>
              {/each}
            </ul>
          {:else}
            <div class="text-muted">Ders bulunmuyor.</div>
          {/if}
        {:else}
          <div class="text-muted">Üyelik bulunamadı.</div>
        {/if}
      </CardBody>
    </Card>
  </Col>
</Row>

<!-- Katılım Düzenleme Modal'ı -->
<AttendanceEditModal
  bind:isOpen={attendanceModalOpen}
  session={selectedSession}
  currentStatus={selectedSession
    ? myAttendanceStatus(selectedSession) || "present"
    : "present"}
  currentNote={selectedSession
    ? myAttendanceNote(selectedSession) || ""
    : ""}
  on:save={handleAttendanceUpdate}
  on:close={closeAttendanceModal}
/>

<style>
  .fw-500 {
    font-weight: 500;
  }

  /* Tablo: thead ile ilk tbody satırı arasına yatay kesik çizgi */
  .sessions-table thead {
    border-bottom: 0; /* Bootstrap alt çizgisini kaldır */
  }
  .sessions-table tbody tr:first-child td {
    border-top: 1px dashed rgba(0, 0, 0, 0.15);
  }
  html[data-bs-theme="dark"] .sessions-table tbody tr:first-child td {
    border-top: 1px dashed rgba(255, 255, 255, 0.15);
  }

  /* Tablo tam genişlikte yayılsın, 12 sütun sağa kadar uzasın */
  .sessions-table {
    width: 100% !important;
    table-layout: fixed;
  }
  .sessions-table th,
  .sessions-table td {
    white-space: nowrap;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  /* İlk kolon (etiket) sabit genişlikte kalsın */
  .sessions-table thead th:first-child,
  .sessions-table tbody td:first-child {
    width: 120px;
  }

  /* Mobile chips */
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
  html[data-bs-theme="dark"] .session-item {
    border-bottom-color: rgba(255, 255, 255, 0.15);
  }
  .session-item:last-child {
    border-bottom: none;
  }
  html[data-bs-theme="dark"] .session-item:last-child {
    border-bottom-color: transparent;
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

  /* Session layout stilleri */
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

  .edit-mode {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: center;
  }

  @media (min-width: 768px) {
    .edit-mode {
      flex-wrap: nowrap;
      justify-content: flex-start;
    }
  }

  .edit-buttons {
    display: flex;
    gap: 4px;
  }

  .attendance-text {
    display: flex;
    align-items: center;
  }

  .attendance-value {
    font-weight: 500;
    font-size: 0.8rem;
  }
</style>

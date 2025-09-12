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
  import { SessionData } from "$lib/assets/data/mock/data";
  import type { SessionType } from "$lib/types/types";
  import { format } from "date-fns";
  import { tr } from "date-fns/locale";
  import type { MeType } from "$lib/types/types";

  export let user: MeType;

  // Sadece active status'undaki üyelikleri göster
  $: memberships = (user?.memberships || []).filter(membership => membership.status === "active");
  $: currentUserId = user?._id;
  let activeGroupId: string | undefined = undefined;
  $: if (!activeGroupId && memberships?.length) {
    activeGroupId = memberships[0].group._id;
  }

  function getSessionStatusMeta(status?: string): {
    label: string;
    color: string;
  } {
    switch (status) {
      case "active":
        return { label: "Devam Ediyor", color: "primary" };
      case "completed":
        return { label: "Tamamlandı", color: "success" };
      case "cancelled":
        return { label: "İptal", color: "danger" };
      default:
        return { label: "Bilinmiyor", color: "secondary" };
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

  const formatShortDate = (date?: string | Date) =>
    date
      ? new Date(date).toLocaleDateString("tr-TR", {
          day: "2-digit",
          month: "2-digit",
        })
      : "-";
  const listCoaches = (coaches: SessionType["coaches"]) =>
    coaches.map((c) => c.firstName + " " + c.lastName).join(", ") ||
    "-";

  const sessionsByGroup = (groupId: string): SessionType[] =>
    SessionData.filter((s) => s.group._id === groupId);

  const myAttendanceStatus = (session: SessionType) =>
    session.attendance.find((a) => a.user._id === currentUserId)
      ?.status;

  // Dersleri (session) kronolojik sıraya diz, 12 slot hazırla
  const compareByStartTime = (a: SessionType, b: SessionType) =>
    new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
  const getSortedSessionsByGroup = (groupId: string): SessionType[] =>
    sessionsByGroup(groupId).slice().sort(compareByStartTime);

  // Yalnızca "Ders Detayları" listesi için: en yeni tarih başta olacak şekilde sırala
  const compareByStartTimeDesc = (a: SessionType, b: SessionType) =>
    new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
  const getSortedSessionsByGroupDesc = (
    groupId: string
  ): SessionType[] =>
    sessionsByGroup(groupId).slice().sort(compareByStartTimeDesc);
  const twelveSlots = Array.from({ length: 12 }, (_, i) => i);
  let activeSessions: SessionType[] = [];
  $: activeSessions = activeGroupId
    ? getSortedSessionsByGroup(activeGroupId)
    : [];
</script>

<Row>
  <Col lg="12">
    <Card class="shadow-sm border-0">
      <CardHeader class="bg-transparent border-0 pb-0">
        <div
          class="d-flex align-items-center justify-content-between flex-wrap gap-2"
        >
          <h5 class="mb-0 fw-bold">Grup Dersleri</h5>
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
                          <Badge
                            color={getAttendanceMeta(
                              myAttendanceStatus(activeSessions[idx])
                            ).color}
                          >
                            {getAttendanceMeta(
                              myAttendanceStatus(activeSessions[idx])
                            ).label}
                          </Badge>
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
        <h5 class="mb-0 fw-bold">Ders Detayları</h5>
      </CardHeader>
      <CardBody>
        {#if activeGroupId}
          {#if sessionsByGroup(activeGroupId).length > 0}
            <ul class="list-unstyled mb-0">
              {#each getSortedSessionsByGroupDesc(activeGroupId) as session}
                <li class="session-item py-3">
                  <div
                    class="d-flex w-100 align-items-start justify-content-between flex-column flex-md-row"
                  >
                    <div class="me-md-3 mb-2 mb-md-0">
                      <div class="fw-500 mb-1">
                        {format(
                          new Date(session.startTime),
                          "dd MMMM yyyy",
                          { locale: tr }
                        )}
                        <span class="text-muted ms-1">
                          {format(
                            new Date(session.startTime),
                            "EEEE",
                            { locale: tr }
                          )}
                        </span>
                      </div>
                      <div class="">
                        Eğitmenler: <span class="text-dark"
                          >{listCoaches(session.coaches)}</span
                        >
                      </div>
                      {#if session.notes}
                        <div class=" text-muted">
                          Not: {session.notes}
                        </div>
                      {/if}
                    </div>
                    <div class="text-start text-md-end mt-1 mt-md-0">
                      <div class="mb-1">
                        Durum: {getSessionStatusMeta(session.status)
                          .label}
                      </div>
                      <div>
                        Katılımım: {getAttendanceMeta(
                          myAttendanceStatus(session)
                        ).label}
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
</style>

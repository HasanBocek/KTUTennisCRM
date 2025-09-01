<script lang="ts">
  import {
    Badge,
    Card,
    CardBody,
    CardHeader,
    Table,
    Button,
  } from "@sveltestrap/sveltestrap";
  import type { GroupType } from "$lib/types/types";
  import { SessionData } from "$lib/assets/data/mock/data";
  import { UserData } from "$lib/assets/data/mock/data";

  export let group: GroupType;

  // Get group members from UserData groupMemberships
  $: groupMembers = UserData.filter((user) =>
    user.memberships?.some(
      (membership) => membership.group._id === group._id && membership.status === "active"
    )
  );

  // Get group sessions for attendance calculation
  $: groupSessions = SessionData.filter(
    (session) => session.group._id === group._id
  );

  // Calculate attendance statistics for each member
  $: membersWithStats = groupMembers.map((member) => {
    const memberAttendances = groupSessions.reduce(
      (attendances, session) => {
        const attendance = session.attendance.find(
          (a) => a.user._id === member._id
        );
        if (attendance) {
          attendances.push(attendance.status);
        }
        return attendances;
      },
      [] as string[]
    );

    const totalSessions = memberAttendances.length;
    const presentCount = memberAttendances.filter(
      (status) => status === "present" || status === "late"
    ).length;
    const attendanceRate =
      totalSessions > 0
        ? Math.round((presentCount / totalSessions) * 100)
        : 0;

    return {
      ...member,
      totalSessions,
      presentCount,
      attendanceRate,
    };
  });

  function getStatusBadge(status: string) {
    switch (status) {
      case "present":
        return { color: "success", text: "Katıldı" };
      case "late":
        return { color: "warning", text: "Geç" };
      case "absent":
        return { color: "danger", text: "Gelmedi" };
      case "excused":
        return { color: "info", text: "Mazeretli" };
      default:
        return { color: "secondary", text: "Bilinmiyor" };
    }
  }
</script>

<Card>
  <CardHeader class="bg-transparent border-0 pb-0">
    <div class="d-flex justify-content-between align-items-center">
      <h5 class="mb-0">Grup Üyeleri</h5>
      <Badge color="primary">{membersWithStats.length} Üye</Badge>
    </div>
  </CardHeader>
  <CardBody>
    {#if membersWithStats.length > 0}
      <Table hover responsive class="attendance-table">
        <thead>
          <tr class="border-bottom-dashed">
            <th>Ad Soyad</th>
            <th>Telefon</th>
            <th>Katılım Oranı</th>
          </tr>
        </thead>
        <tbody>
          {#each membersWithStats as member}
            <tr>
              <td class="py-1">
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
              <td>{member.phoneNumber || "Belirtilmemiş"}</td>
              <td>
                <span class="text-muted">
                  {member.presentCount}/{member.totalSessions} ders
                </span>
              </td>
            </tr>
          {/each}
        </tbody>
      </Table>
    {:else}
      <div class="text-center py-4">
        <i class="fas fa-users text-muted" style="font-size: 3rem;"
        ></i>
        <h5 class="mt-3 text-muted">Henüz üye bulunmuyor</h5>
        <p class="text-muted">Bu gruba henüz hiç üye katılmamış.</p>
      </div>
    {/if}
  </CardBody>
</Card>

<style>
  .border-bottom-dashed {
    border-bottom: 1px dashed rgba(0, 0, 0, 0.1) !important;
  }

  html[data-bs-theme="dark"] .border-bottom-dashed {
    border-bottom-color: rgba(255, 255, 255, 0.1) !important;
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
</style>

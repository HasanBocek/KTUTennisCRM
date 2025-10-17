<script lang="ts">
  import {
    Card,
    CardBody,
    Col,
    Row,
    Badge,
  } from "@sveltestrap/sveltestrap";
  import type { GroupType } from "$lib/types/types";
  import { SessionData } from "$lib/assets/data/mock/data";
  import { UserData } from "$lib/assets/data/mock/data";

  export let group: GroupType;

  // Calculate group statistics
  let totalSessions = 0;
  let currentMembers = 0;
  let averageAttendance = 0;

  $: {
    // Calculate current members from UserData
    currentMembers = group.memberships.length;

    // Filter sessions for this group
    const groupSessions = SessionData.filter(
      (session) => session.group._id === group._id
    );
    totalSessions = groupSessions.length;

    // Calculate average attendance across all sessions
    if (groupSessions.length > 0) {
      const totalAttendees = groupSessions.reduce(
        (total, session) => {
          const presentCount = session.attendance.filter(
            (a) => a.status === "present" || a.status === "late"
          ).length;
          return total + presentCount;
        },
        0
      );

      averageAttendance =
        totalSessions > 0
          ? Math.round((totalAttendees / totalSessions) * 100) / 100
          : 0;
    }
  }
</script>

<Col xs="12">
  <Card>
    <CardBody>
      <Row>
        <Col lg="4" class="align-self-center mb-3 mb-lg-0">
          <div class="d-flex align-items-center flex-row flex-wrap">
            <div class="">
              <h5 class="fw-semibold fs-22 mb-2">{group.name}</h5>
              <p class="mb-0 text-muted fw-medium">
                <Badge
                  color={group.membershipOpen
                    ? "success"
                    : "secondary"}
                >
                  {group.membershipOpen
                    ? "Üyelik Açık"
                    : "Üyelik Kapalı"}
                </Badge>
              </p>
            </div>
          </div>
        </Col>
        <Col lg="4" class="ms-auto align-self-center">
          <div class="d-flex justify-content-center">
            <div
              class="border-dashed rounded border-theme-color p-2 me-2 flex-grow-1 flex-basis-0"
            >
              <h5 class="fw-semibold fs-22 mb-1">
                {currentMembers}/{group.maxMembers}
              </h5>
              <p class="text-muted mb-0 fw-medium">Üye</p>
            </div>
            <div
              class="border-dashed rounded border-theme-color p-2 me-2 flex-grow-1 flex-basis-0"
            >
              <h5 class="fw-semibold fs-22 mb-1">{totalSessions}</h5>
              <p class="text-muted mb-0 fw-medium">Toplam Ders</p>
            </div>
            <div
              class="border-dashed rounded border-theme-color p-2 me-2 flex-grow-1 flex-basis-0"
            >
              <h5 class="fw-semibold fs-22 mb-1">
                {averageAttendance}
              </h5>
              <p class="text-muted mb-0 fw-medium">Ort. Katılım</p>
            </div>
          </div>
        </Col>
      </Row>
    </CardBody>
  </Card>
</Col>

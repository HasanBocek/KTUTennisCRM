<script lang="ts">
  import { Card, CardBody, CardHeader, CardTitle, Col, Row } from "@sveltestrap/sveltestrap";
  import type { MeType } from "$lib/types/types";
  import { SessionData } from "$lib/assets/data/mock/data";

  export let user: MeType;

  let attendedCount = 0;
  $: attendedCount = user
    ? SessionData.reduce((count, session) => {
        const record = session.attendance.find(
          (a) => a.user._id === user._id
        );
        const attended =
          record &&
          (record.status === "present" || record.status === "late");
        return count + (attended ? 1 : 0);
      }, 0)
    : 0;

  let missedCount = 0;
  // "excused" (mazeretli) durumlarını sayma
  $: missedCount = user
    ? SessionData.reduce((count, session) => {
        const record = session.attendance.find(
          (a) => a.user._id === user._id
        );
        const missed = record && record.status === "absent";
        return count + (missed ? 1 : 0);
      }, 0)
    : 0;

  let excusedCount = 0;
  $: excusedCount = user
    ? SessionData.reduce((count, session) => {
        const record = session.attendance.find(
          (a) => a.user._id === user._id
        );
        const excused = record && record.status === "excused";
        return count + (excused ? 1 : 0);
      }, 0)
    : 0;
</script>

<Col xs="12">
  <Card
    class="info-card info-card-elevated info-card-sm"
  >

    <CardBody class="pt-3">
      <Row>
        <Col lg="4" class="align-self-center mb-3 mb-lg-0">
          <div class="d-flex align-items-center flex-row flex-wrap">
            <div class="">
              <h5 class="fw-semibold fs-22 mb-1">
                {user.firstName}
                {user.lastName}
              </h5>

            </div>
          </div>
        </Col>
        <Col lg="4" class="ms-auto align-self-center">
          <div class="d-flex justify-content-center">
            <div
              class="border-dashed rounded border-theme-color p-2 me-2 flex-grow-1 flex-basis-0"
            >
              <h5 class="fw-semibold fs-22 mb-1">{attendedCount}</h5>
              <p class="text-muted mb-0 fw-medium">Katılım</p>
            </div>
            <div
              class="border-dashed rounded border-theme-color p-2 me-2 flex-grow-1 flex-basis-0"
            >
              <h5 class="fw-semibold fs-22 mb-1">
                {missedCount + excusedCount}
              </h5>
              <p class="text-muted mb-0 fw-medium">Devamsızlık</p>
            </div>
            <div
              class="border-dashed rounded border-theme-color p-2 me-2 flex-grow-1 flex-basis-0"
            >
              <h5 class="fw-semibold fs-22 mb-1">{excusedCount}</h5>
              <p class="text-muted mb-0 fw-medium">Mazeretli</p>
            </div>
          </div>
        </Col>
      </Row>
    </CardBody>
  </Card>
</Col>


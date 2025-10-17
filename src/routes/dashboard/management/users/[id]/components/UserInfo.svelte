<script lang="ts">
  import { Card, CardBody, Col, Row } from "@sveltestrap/sveltestrap";
  import type { UserType, SessionType } from "$lib/types/types";
  import { onMount, onDestroy } from "svelte";

  export let user: UserType;
  export let sessionsData: SessionType[];

  let SessionData = [...sessionsData];
  // Force reactivity trigger
  let updateTrigger = 0;

  // Listen for custom events that indicate SessionData has been updated
  function handleSessionUpdate() {
    updateTrigger++;
  }

  onMount(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('sessionDataUpdated', handleSessionUpdate);
    }
  });

  onDestroy(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('sessionDataUpdated', handleSessionUpdate);
    }
  });

  let attendedCount = 0;
  $: attendedCount = user && updateTrigger >= 0
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
  $: missedCount = user && updateTrigger >= 0
    ? SessionData.reduce((count, session) => {
        const record = session.attendance.find(
          (a) => a.user._id === user._id
        );
        const missed = record && record.status === "absent";
        return count + (missed ? 1 : 0);
      }, 0)
    : 0;

  let excusedCount = 0;
  $: excusedCount = user && updateTrigger >= 0
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
  <Card>
    <CardBody>
      <Row>
        <Col lg="4" class="align-self-center mb-3 mb-lg-0">
          <div class="d-flex align-items-center flex-row flex-wrap">
            <div class="">
              <h5 class="fw-semibold fs-22 mb-1">
                {user.firstName}
                {user.lastName}
              </h5>
              <p class="mb-0 text-muted fw-medium">Demo Kullanıcı</p>
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

<script lang="ts">
    import { Card, CardBody, Col, Row } from "@sveltestrap/sveltestrap";
    import type { SessionType } from "$lib/types/types";

    export let session: SessionType;

    // Live counts passed from parent
    export let presentCount: number = 0;
    export let lateCount: number = 0;
    export let excusedCount: number = 0;
    export let absentCount: number = 0;

    $: attendedCount = presentCount + lateCount;
  </script>
  
  <Col xs="12">
    <Card>
      <CardBody>
        <Row>
          <Col lg="4" class="align-self-center mb-3 mb-lg-0">
            <div class="d-flex align-items-center flex-row flex-wrap">
              <div class="">
                <h5 class="fw-semibold fs-22 mb-2">{session.group.name}</h5>
              </div>
            </div>
          </Col>
          <Col lg="4" class="ms-auto align-self-center">
            <div class="d-flex justify-content-center">
              <div class="border-dashed rounded border-theme-color p-2 me-2 flex-grow-1 flex-basis-0">
                <h5 class="fw-semibold fs-22 mb-1">{attendedCount}</h5>
                <p class="text-muted mb-0 fw-medium">Katıldı</p>
              </div>
              <div class="border-dashed rounded border-theme-color p-2 me-2 flex-grow-1 flex-basis-0">
                <h5 class="fw-semibold fs-22 mb-1">{absentCount}</h5>
                <p class="text-muted mb-0 fw-medium">Gelmedi</p>
              </div>
              <div class="border-dashed rounded border-theme-color p-2 me-2 flex-grow-1 flex-basis-0">
                <h5 class="fw-semibold fs-22 mb-1">{excusedCount}</h5>
                <p class="text-muted mb-0 fw-medium">Mazeretli</p>
              </div>
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  </Col>
  
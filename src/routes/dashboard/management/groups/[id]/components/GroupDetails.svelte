<script lang="ts">
  import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Col,
    Row,
    Badge,
  } from "@sveltestrap/sveltestrap";
  import type { GroupType } from "$lib/types/types";

  export let group: GroupType;

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

  const formatTime = (time: string) => time;
</script>

<Col md="4">
  <Card>
    <CardHeader>
      <Row class="align-items-center">
        <div class="col">
          <CardTitle>Grup Detayları</CardTitle>
        </div>
        <div class="col-auto">
          <Badge
            color={group.membershipOpen ? "success" : "secondary"}
          >
            {group.membershipOpen ? "Açık" : "Kapalı"}
          </Badge>
        </div>
      </Row>
    </CardHeader>
    <CardBody class="pt-0">
      {#if group.description}
        <div class="mb-3">
          <p class="text-muted">{group.description}</p>
        </div>
      {/if}

      <ul class="list-unstyled mb-0">
        <li class="mt-2">
          <i
            class="las la-users me-2 text-secondary fs-22 align-middle"
          ></i>
          <b>Maksimum Üye</b>: {group.maxMembers}
        </li>

        <li class="mt-2">
          <i
            class="las la-chalkboard-teacher me-2 text-secondary fs-22 align-middle"
          ></i>
          <b>Antrenörler</b>:
          {#each group.coaches as coach, index}
            {coach.firstName}
            {coach.lastName}{index < group.coaches.length - 1
              ? ", "
              : ""}
          {/each}
        </li>

        <li class="mt-2">
          <i
            class="las la-money-bill-wave me-2 text-secondary fs-22 align-middle"
          ></i>
          <b>Ücret</b>: ₺{group.payment.amount} / {group.payment
            .billingCycle}
        </li>

        <li class="mt-2">
          <i
            class="las la-tools me-2 text-secondary fs-22 align-middle"
          ></i>
          <b>Ekipman Dahil</b>: {group.payment.includesEquipment
            ? "Evet"
            : "Hayır"}
        </li>

        {#if group.payment.notes}
          <li class="mt-2">
            <i
              class="las la-sticky-note me-2 text-secondary fs-22 align-middle"
            ></i>
            <b>Ödeme Notu</b>: {group.payment.notes}
          </li>
        {/if}

        {#if group.notes}
          <li class="mt-2">
            <i
              class="las la-comment me-2 text-secondary fs-22 align-middle"
            ></i>
            <b>Notlar</b>: {group.notes}
          </li>
        {/if}

          <li class="mt-2">
            <i
              class="las la-id-card text-secondary fs-22 align-middle me-2"
            ></i>
            <b>Grup ID</b>:
            <code class="small text-muted">{group._id}</code>
          </li>
      </ul>
    </CardBody>
  </Card>

  <!-- Antrenman Programı -->
  <Card class="mt-3">
    <CardHeader>
      <CardTitle>Antrenman Programı</CardTitle>
    </CardHeader>
    <CardBody>
      {#if group.schedule.length > 0}
        <ul class="list-unstyled mb-0">
          {#each group.schedule as schedule}
            <li
              class="d-flex align-items-center justify-content-between schedule-item py-2 border-bottom"
            >
              <span class="text-dark fw-500"
                >{getDayName(schedule.dayOfWeek)}</span
              >
              <span class="text-muted">
                {formatTime(schedule.startTime)} - {formatTime(
                  schedule.endTime
                )}
                <Badge color="light" class="ms-2 text-muted border">
                  {schedule.duration} dk
                </Badge>
              </span>
            </li>
          {/each}
        </ul>
      {:else}
        <div class="text-muted">Program bilgisi bulunmuyor.</div>
      {/if}
    </CardBody>
  </Card>
</Col>

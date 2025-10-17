<script lang="ts">
  import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Col,
    Row,
    Badge,
    CardFooter,
  } from "@sveltestrap/sveltestrap";
  import RoleBadge from "$lib/components/RoleBadge.svelte";
  import type { UserType } from "$lib/types/types";
  import { getRoleById } from "$lib/types/role";
  import type { RoleType } from "$lib/types/role";

  export let user: UserType;

  // Rolleri seviyeye göre sırala (yüksekten düşüğe)
  $: sortedRoles = user?.roles
    ? user.roles
        .map((roleId: string) => getRoleById(roleId))
        .filter((role): role is RoleType => role !== undefined)
        .sort(
          (a: RoleType, b: RoleType) =>
            (b?.level || 0) - (a?.level || 0)
        )
    : ([] as RoleType[]);

  $: memberships = user.memberships || [];

  function getStatusMeta(status: string): {
    label: string;
    color: string;
  } {
    switch (status) {
      case "active":
        return { label: "Aktif", color: "success" };
      case "approvementPending":
        return { label: "Onay Bekliyor", color: "warning" };
      case "paymentPending":
        return { label: "Ödeme Bekliyor", color: "warning" };
      case "rejected":
        return { label: "Reddedildi", color: "danger" };
      case "expired":
        return { label: "Süresi Doldu", color: "secondary" };
      default:
        return { label: status || "Bilinmiyor", color: "secondary" };
    }
  }

  const formatDate = (date?: string | Date) =>
    date ? new Date(date).toLocaleDateString() : "Veri Yok";

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
</script>

<Col md="4">
  <Card>
    <CardHeader>
      <Row class="align-items-center">
        <div class="col">
          <CardTitle>Kişisel Bilgiler</CardTitle>
        </div>
        <div class="col-auto">
          <div class="mt-2 d-flex justify-content-center gap-2">
            {#if sortedRoles.length > 0}
              {#each sortedRoles as role}
                <RoleBadge roleId={role.id} />
              {/each}
            {/if}
          </div>
        </div>
      </Row>
    </CardHeader>
    <CardBody class="pt-0">
      {#if user.notes}
        <div class="text-center mb-3">
          <span>{user.notes}</span>
        </div>
      {/if}
      <ul class="list-unstyled mb-0">
        <li class="mt-2">
          <i
            class="las la-phone me-2 text-secondary fs-22 align-middle"
          ></i>
          <b> Telefon Numarası</b>: {user.phoneNumber || "Veri Yok"}
        </li>
        <li class="mt-2">
          <i
            class="las la-envelope me-2 text-secondary fs-22 align-middle"
          ></i>
          <b> E-posta</b>: {user.email ||
            "Veri Yok"}{#if user.isEmailVerified}
            <i
              class="fas fa-check-circle text-success ms-1"
              title="E-posta doğrulandı"
            ></i>
          {:else}
            <i
              class="fas fa-exclamation-circle text-warning ms-1"
              title="E-posta doğrulanmadı"
            ></i>
          {/if}
        </li>
        <li class="mt-2">
          <i
            class="las la-user text-secondary fs-22 align-middle me-2"
          ></i>
          <b> Cinsiyet</b>: {user.isMale == "1" ? "Erkek" : "Kadın"}
        </li>
        <li class="mt-2">
          <i
            class="las la-trophy text-secondary fs-22 align-middle me-2"
          ></i>
          <b> Tenis Seviyesi</b>: {user.skillLevel || "Veri Yok"} / 10
        </li>
        <li class="mt-2">
          <i
            class="las la-user-graduate text-secondary fs-22 align-middle me-2"
          ></i>
          <b> Öğrenci mi</b>: {user.isStudent ? "Evet" : "Hayır"}
        </li>

        <li class="mt-2">
          <i
            class="las la-id-card text-secondary fs-22 align-middle me-2"
          ></i>
          <b> Öğrenci No</b>: {user.studentNumber || "Veri Yok"}
        </li>

        <li class="mt-2">
          <i
            class="las la-user-check text-secondary fs-22 align-middle me-2"
          ></i>
          <b> Hesap ID</b>:
          <code class="small text-muted">{user._id}</code>
        </li>
      </ul>

      <Row class="justify-content-center mt-4">
        <Col xs="6">
          <div class="text-center">
            <h6 class="mb-1">Oluşturulma Tarihi</h6>
            <p class="text-muted mb-0">
              {#if user.createdAt}
                {new Date(user.createdAt).toLocaleDateString()}
              {:else}
                <span class="text-muted">Veri Yok</span>
              {/if}
            </p>
          </div>
        </Col>
        <Col xs="6">
          <div class="text-center">
            <h6 class="mb-1">Son Giriş Tarihi</h6>
            <p class="text-muted mb-0">
              {#if user.lastLoginAt}
                {new Date(user.lastLoginAt).toLocaleDateString()}
              {:else}
                <span class="text-muted">Veri Yok</span>
              {/if}
            </p>
          </div>
        </Col>
      </Row>
    </CardBody>
  </Card>

  <Row>
    {#each memberships as membership}
      <Col lg="12">
        <Card class="shadow-sm border-0">
          <CardHeader class="bg-transparent border-0 pb-0">
            <div
              class="d-flex align-items-center justify-content-between"
            >
              <h5 class="mb-0 fw-bold text-truncate">
                {membership.group.name}
              </h5>
              {#if membership.status}
                <Badge
                  color={getStatusMeta(membership.status).color}
                  pill
                >
                  {getStatusMeta(membership.status).label}
                </Badge>
              {/if}
            </div>
          </CardHeader>
          <CardBody class="pt-2">
            {#if membership.group.schedule && membership.group.schedule.length > 0}
              <ul class="list-unstyled mb-0">
                {#each membership.group.schedule as schedule}
                  <li
                    class="d-flex align-items-center justify-content-between schedule-item py-1"
                  >
                    <span class="text-dark fw-500"
                      >{getDayName(schedule.dayOfWeek)}</span
                    >
                    <span class="text-muted small">
                      {schedule.startTime} - {schedule.endTime}
                      <Badge
                        color="light"
                        class="ms-2 text-muted border"
                        >{schedule.duration} dk</Badge
                      >
                    </span>
                  </li>
                {/each}
              </ul>
            {:else}
              <div class="text-muted small mb-3">
                Program bilgisi bulunmuyor.
              </div>
            {/if}
          </CardBody>
          <CardFooter class="bg-transparent border-0 pt-0">
            <div class="d-flex justify-content-end text-muted small">
              <span>Üyelik başlangıcı:&nbsp;</span>
              <span class="text-dark"
                >{formatDate(membership.joinDate)}</span
              >
            </div>
          </CardFooter>
        </Card>
      </Col>
    {/each}
  </Row>
</Col>

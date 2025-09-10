<script lang="ts">
  import {
    Badge,
    Button,
    Col,
    Row,
    Modal,
    ModalBody,
    ModalFooter,
  } from "@sveltestrap/sveltestrap";
  import type { UserType } from "$lib/types/types";
  import type { RoleType } from "$lib/types/role";
  import { getRoleById } from "$lib/types/role";
  import { createEventDispatcher } from "svelte";
  import RoleBadge from "$lib/components/RoleBadge.svelte";

  export let isOpen: boolean;
  export let selectedUser: UserType | null = null;

  const dispatch = createEventDispatcher();
  function close() {
    dispatch("close");
  }
  function back() {
    dispatch("back");
  }

  function getFullName(user: UserType): string {
    return (
      `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
      "Veri Yok"
    );
  }

  // Rolleri seviyeye göre sırala (yüksekten düşüğe)
  $: sortedRoles = selectedUser?.roles
    ? selectedUser.roles
        .map((roleId) => getRoleById(roleId))
        .filter((role) => role !== undefined)
        .sort((a, b) => (b?.level || 0) - (a?.level || 0))
    : [];
</script>

<Modal {isOpen} toggle={close} centered scrollable>
  {#if selectedUser}
    <ModalBody class="p-4 ">
      <Row class="align-items-center">
        <div class="text-center">
          <div
            class="bg-primary-subtle rounded-circle d-inline-flex p-3 mb-3"
          >
            <i
              class="las la-info-circle text-primary"
              style="font-size: 2rem;"
            ></i>
          </div>
          <h4 class="text-primary mb-3">Üye Bilgi Ekranı</h4>
        </div>
      </Row>
      <Row class="border-primary border-2 mb-2">
        <div class="text-center">
          <h5 class="mb-1">{getFullName(selectedUser)}</h5>
          <p class="text-muted mb-0">
            <i class="fas fa-phone me-1"></i>
            Tel. No: {selectedUser.phoneNumber}
          </p>
        </div>
      </Row>

      <p class="text-muted fw-medium mb-2 text-center">
        Not: {selectedUser.notes || "Veri Yok"}
      </p>
      <div class="mb-3 d-flex justify-content-center gap-2">
        {#if sortedRoles.length > 0}
          {#each sortedRoles as role}
            <RoleBadge roleId={role.id} />
          {/each}
        {/if}
      </div>
      <ul class="list-unstyled mb-0">
        <li class="mt-2">
          <i
            class="las la-id-card me-2 text-secondary fs-22 align-middle"
          ></i>
          <b> Öğrenci No</b>: {selectedUser.studentNumber ||
            "Veri Yok"}
        </li>
        <li class="mt-2">
          <i
            class="las la-envelope me-2 text-secondary fs-22 align-middle"
          ></i>
          <b> E-posta</b>: {selectedUser.email ||
            "Veri Yok"}{#if selectedUser.isEmailVerified}
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
          <b> Cinsiyet</b>: {selectedUser.isMale == "1"
            ? "Erkek"
            : "Kadın"}
        </li>
        <li class="mt-2">
          <i
            class="las la-graduation-cap me-2 text-secondary fs-22 align-middle"
          ></i>
          <b> Bölüm</b>: {selectedUser.department || "Veri Yok"}
        </li>
        <li class="mt-2">
          <i
            class="las la-layer-group me-2 text-secondary fs-22 align-middle"
          ></i> <b> Sınıf </b> : {selectedUser.grade || "Veri Yok"}
        </li>
        <li class="mt-2">
          <i
            class="las la-trophy text-secondary fs-22 align-middle me-2"
          ></i>
          <b> Tenis Seviyesi</b>: {selectedUser.skillLevel ||
            "Veri Yok"} / 10
        </li>
        <li class="mt-2">
          <i
            class="las la-user-graduate text-secondary fs-22 align-middle me-2"
          ></i>
          <b> Öğrenci mi</b>: {selectedUser.isStudent
            ? "Evet"
            : "Hayır"}
        </li>
      </ul>

      {#if selectedUser.memberships}
        <Row class="justify-content-center mt-3">
          <Col xs="12" class="text-center">
            <h5 class="mb-1">
              <i
                class="las la-users text-secondary fs-22 align-middle me-2"
              ></i> Grup Üyelikleri:
            </h5>
            <div
              class="d-flex flex-wrap gap-2 justify-content-center"
            >
              {#each selectedUser.memberships as membership}
                <Badge
                  class="bg-info-subtle text-info text-decoration-none p-1"
                >
                  {membership.group.name} - {#if membership.status === "active"}
                    <span class="text-success">Aktif</span>
                  {:else if membership.status === "paymentPending"}
                    <span class="text-warning">Ödeme Bekliyor</span>
                  {:else if membership.status === "approvementPending"}
                    <span class="text-danger">Beklemede</span>
                  {:else if membership.status === "rejected"}
                    <span class="text-danger">Reddedildi</span>
                  {:else if membership.status === "expired"}
                    <span class="text-danger">Süresi Doldu</span>
                  {/if}
                </Badge>
              {/each}
            </div>
          </Col>
        </Row>
      {/if}

      <Row class="justify-content-center mt-4">
        <Col xs="6">
          <div class="text-center">
            <h6 class="mb-1">Oluşturulma Tarihi</h6>
            <p class="text-muted mb-0">
              {#if selectedUser.createdAt}
                {new Date(
                  selectedUser.createdAt
                ).toLocaleDateString()}
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
              {#if selectedUser.lastLoginAt}
                {new Date(
                  selectedUser.lastLoginAt
                ).toLocaleDateString()}
              {:else}
                <span class="text-muted">Veri Yok</span>
              {/if}
            </p>
          </div>
        </Col>
      </Row>
    </ModalBody>
    <ModalFooter
      class="border-top py-2 d-flex justify-content-between"
    >
      <Button color="link" class="text-muted" on:click={back}>
        <i class="fas fa-arrow-left me-1"></i>
        Geri
      </Button>
      <Button color="secondary" on:click={close}>
        <i class="fas fa-times me-1"></i>
        Kapat
      </Button>
    </ModalFooter>
  {/if}
</Modal>

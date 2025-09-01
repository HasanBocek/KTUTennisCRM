<script lang="ts">
  import {
    Modal,
    ModalBody,
    ModalFooter,
    Button,
    Badge,
    Row,
    Col,
  } from "@sveltestrap/sveltestrap";
  import type { MembershipType } from "$lib/types/types";
  import { createEventDispatcher } from "svelte";

  export let isOpen = false;
  export let membership: MembershipType | null = null;

  const dispatch = createEventDispatcher();

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }

  function getStatusText(status: string) {
    switch (status) {
      case "approvementPending":
        return "Beklemede";
      case "paymentPending":
        return "Ödeme Bekliyor";
      case "active":
        return "Aktif";
      case "rejected":
        return "Reddedildi";
      default:
        return status;
    }
  }

  function getStatusBadgeColor(status: string) {
    switch (status) {
      case "approvementPending":
        return "warning";
      case "paymentPending":
        return "info";
      case "active":
        return "success";
      case "rejected":
        return "danger";
      default:
        return "secondary";
    }
  }

  function handleApprove() {
    if (membership) {
      dispatch("approve", membership);
      close();
    }
  }

  function handleReject() {
    if (membership) {
      dispatch("reject", membership);
      close();
    }
  }

  function handleFullApprove() {
    if (membership) {
      dispatch("fullApprove", membership);
      close();
    }
  }

  function close() {
    dispatch("close");
  }

  $: isApprovalPending = membership?.status === "approvementPending";
  $: isPaymentPending = membership?.status === "paymentPending";
</script>

<Modal {isOpen} toggle={close} header="" centered scrollable size="lg">
  {#if membership}
    <ModalBody class="p-4">
      <!-- Header Icon ve Title -->
      <div class="text-center mb-4">
        <div class="bg-{isApprovalPending ? 'warning' : isPaymentPending ? 'info' : 'primary'}-subtle rounded-circle d-inline-flex p-3 mb-3">
          <i class="fas fa-{isApprovalPending ? 'clock' : isPaymentPending ? 'credit-card' : 'user-check'} text-{isApprovalPending ? 'warning' : isPaymentPending ? 'info' : 'primary'}" style="font-size: 2rem;"></i>
        </div>
        <h4 class="mb-1">
          {#if isApprovalPending}
            Başvuru Onayı
          {:else if isPaymentPending}
            Ödeme Onayı
          {:else}
            Üyelik Detayları
          {/if}
        </h4>
        <p class="text-muted mb-0">
          {membership.user.firstName} {membership.user.lastName}
        </p>
      </div>

      <Row class="g-3">
        <!-- Üye Bilgileri -->
        <Col md="6">
          <div class="border rounded p-3 h-100">
            <h6 class="text-primary mb-3">
              <i class="fas fa-user me-2"></i>Üye Bilgileri
            </h6>
            
            <div class="mb-2">
              <strong>Ad Soyad:</strong>
              <span class="ms-2">{membership.user.firstName} {membership.user.lastName}</span>
            </div>
            
            <div class="mb-2">
              <strong>Telefon:</strong>
              <span class="ms-2">{membership.user.phoneNumber}</span>
            </div>
            
            {#if membership.user.studentNumber}
              <div class="mb-2">
                <strong>Öğrenci No:</strong>
                <span class="ms-2">{membership.user.studentNumber}</span>
              </div>
            {/if}
            
            <div class="mb-2">
              <strong>Başvuru Tarihi:</strong>
              <span class="ms-2">{formatDate(membership.joinDate)}</span>
            </div>
            
            <div class="mb-0">
              <strong>Durum:</strong>
              <Badge color={getStatusBadgeColor(membership.status)} class="ms-2">
                {getStatusText(membership.status)}
              </Badge>
            </div>
          </div>
        </Col>

        <!-- Grup ve Ödeme Bilgileri -->
        <Col md="6">
          <div class="border rounded p-3 h-100">
            <h6 class="text-success mb-3">
              <i class="fas fa-users me-2"></i>Grup ve Ödeme Bilgileri
            </h6>
            
            <div class="mb-2">
              <strong>Grup Adı:</strong>
              <span class="ms-2">{membership.group.name}</span>
            </div>
            
            <div class="mb-2">
              <strong>Açıklama:</strong>
              <small class="ms-2 text-muted d-block">
                {membership.group.description}
              </small>
            </div>
            
            <div class="mb-2">
              <strong>Ödeme:</strong>
              <span class="ms-2 text-success fw-bold">
                {membership.group.payment.amount}₺ / {membership.group.payment.billingCycle}
              </span>
            </div>
            
            <div class="mb-2">
              <strong>Antrenörler:</strong>
              <small class="ms-2 d-block">
                {#each membership.group.coaches as coach, index}
                  {coach.firstName} {coach.lastName}{#if index < membership.group.coaches.length - 1}, {/if}
                {/each}
              </small>
            </div>
            
            <div class="mb-0">
              <strong>Ekipman Dahil:</strong>
              <span class="ms-2">
                {membership.group.payment.includesEquipment ? "Evet" : "Hayır"}
              </span>
            </div>
          </div>
        </Col>
      </Row>



      <!-- Onay Mesajı -->
      {#if isApprovalPending || isPaymentPending}
        <Row class="mt-3">
          <Col xs="12">
            <div class="alert alert-warning mb-0">
              <i class="fas fa-exclamation-triangle me-2"></i>
              <strong>İşlem Seçenekleri:</strong>
              <ul class="mb-0 mt-2">
                <li><strong>Başvuruyu Onayla:</strong> Sadece başvuruyu onaylar, ödeme bekleme durumuna geçer</li>
                <li><strong>Başvuruyu Reddet:</strong> Başvuruyu reddeder</li>
                <li><strong>Hem Başvuruyu Hem Ödemeyi Onayla:</strong> Direkt aktif üyelik yapar</li>
              </ul>
            </div>
          </Col>
        </Row>
      {/if}
    </ModalBody>

    <ModalFooter class="d-flex justify-content-between flex-wrap gap-2">
      <Button color="link" class="text-muted" on:click={close}>
        <i class="fas fa-times me-1"></i>
        Kapat
      </Button>
      
      {#if isApprovalPending || isPaymentPending}
        <div class="d-flex gap-2 flex-wrap">
          <Button color="danger" on:click={handleReject} outline>
            <i class="fas fa-times me-1"></i>
            {isApprovalPending ? "Başvuruyu Reddet" : "Ödemeyi Reddet"}
          </Button>
          
          {#if isApprovalPending}
            <Button color="warning" on:click={handleApprove} outline>
              <i class="fas fa-check-circle me-1"></i>
              Başvuruyu Onayla
            </Button>
            
            <Button color="success" on:click={handleFullApprove}>
              <i class="fas fa-check-double me-1"></i>
              Hem Başvuruyu Hem Ödemeyi Onayla
            </Button>
          {:else if isPaymentPending}
            <Button color="primary" on:click={handleApprove}>
              <i class="fas fa-dollar-sign me-1"></i>
              Ödemeyi Onayla
            </Button>
          {/if}
        </div>
      {/if}
    </ModalFooter>
  {/if}
</Modal>

<style>
  /* Scrollbar'ı gizle ama scroll işlevselliğini koru */
  :global(.modal-body) {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE/Edge */
  }
  
  :global(.modal-body::-webkit-scrollbar) {
    display: none; /* Chrome, Safari, Opera */
  }
</style>
<script lang="ts">
  import { Button, Col, Row, Modal, ModalBody, ModalFooter } from "@sveltestrap/sveltestrap";
  import type { UserType } from "$lib/types/types";
  import { createEventDispatcher } from "svelte";

  export let isOpen: boolean;
  export let selectedUser: UserType | null = null;

  const dispatch = createEventDispatcher();
  function close() {
    dispatch("close");
  }
  function openInfo() {
    dispatch("openInfo");
  }
  function openEdit() {
    dispatch("openEdit");
  }
  function openEmail() {
    dispatch("openEmail");
  }
  function openDelete() {
    dispatch("openDelete");
  }

  $: fullName = selectedUser ? `${selectedUser.firstName || ""} ${selectedUser.lastName || ""}`.trim() : "";
</script>

<Modal {isOpen} toggle={close} centered size="sm">
  {#if selectedUser}
    <ModalBody class="p-4">
      <div class="text-center mb-3">
        <h4 class="mb-3">İşlem Seçin</h4>
        <Row class="border-primary border-2 mb-2">
            <div class="text-center">
              <h5 class="mb-1">{fullName}</h5>
              <p class="text-muted mb-0">
                <i class="fas fa-phone me-1"></i>
                Tel. No: {selectedUser.phoneNumber}
              </p>
            </div>
          </Row>
      </div>
      <div class="d-grid gap-2">
        <Button color="secondary" outline on:click={openInfo}>
          <i class="las la-info-circle me-2"></i>Bilgi
        </Button>
        <Button color="warning" outline on:click={openEdit}>
          <i class="las la-pen me-2"></i>Düzenle
        </Button>
        <Button color="info" outline on:click={openEmail}>
          <i class="fas fa-envelope me-2"></i>E-Posta Düzenle
        </Button>
        <Button color="danger" outline on:click={openDelete}>
          <i class="las la-trash-alt me-2"></i>Sil
        </Button>
      </div>
    </ModalBody>
    <ModalFooter class="py-2">
      <Button color="secondary" size="sm" on:click={close}>
        Kapat
      </Button>
    </ModalFooter>
  {/if}
  
</Modal>


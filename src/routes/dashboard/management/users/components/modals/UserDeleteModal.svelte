<script lang="ts">
  import {
    Badge,
    Button,
    Card,
    CardBody,
    Col,
    Row,
    Modal,
    ModalBody,
    ModalFooter,
  } from "@sveltestrap/sveltestrap";
  import type { UserType } from "$lib/types/types";
  import { createEventDispatcher } from "svelte";

  export let isOpen: boolean;
  export let selectedUser: UserType | null = null;
  export let isDeleting = false;

  const dispatch = createEventDispatcher();
  function close() {
    dispatch("close");
  }
  function submit() {
    dispatch("confirm");
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
</script>

<Modal {isOpen} toggle={close} header="" centered scrollable>
  {#if selectedUser}
    <ModalBody class="text-center p-4">
      <div class="mb-4">
        <div
          class="bg-danger-subtle rounded-circle d-inline-flex p-3 mb-3"
        >
          <i
            class="fas fa-exclamation-triangle text-danger"
            style="font-size: 2rem;"
          ></i>
        </div>
        <h4 class="text-danger mb-1">Üye Silme Onayı</h4>
      </div>

      <div class="text-center">
        <h5 class="mb-1">{getFullName(selectedUser)}</h5>
        <p class="text-muted mb-0">
          <i class="fas fa-phone me-1"></i>
          Tel. No: {selectedUser.phoneNumber}
        </p>
      </div>
    </ModalBody>
    <ModalFooter class="d-flex justify-content-between">
      <Button color="link" class="text-muted" on:click={back}>
        <i class="fas fa-arrow-left me-1"></i>
        Geri
      </Button>
      <div class="d-flex gap-2">
        <Button color="secondary" on:click={close}>
          <i class="fas fa-times me-1"></i>
          İptal
        </Button>
        <Button
          color="danger"
          disabled={isDeleting}
          on:click={submit}
        >
          <i
            class={`fas fa-${isDeleting ? "spinner fa-spin" : "trash"} me-1`}
          ></i>
          {isDeleting ? "Siliniyor..." : "Evet, Sil"}
        </Button>
      </div>
    </ModalFooter>
  {/if}
</Modal>

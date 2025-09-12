<script lang="ts">
  import {
    Button,
    Col,
    Input,
    Form,
    Modal,
    ModalBody,
    ModalFooter
  } from "@sveltestrap/sveltestrap";
  import type { UserType } from "$lib/types/types";

  export let user: UserType;
  export let onDeleteAccount: () => Promise<void>;
  export let isDeleting = false;

  let deleteConfirmText = "";
  let deleteConfirmModal = false;

  $: deleteFormValid = deleteConfirmText.trim() === `${user.firstName} ${user.lastName}`;

  function handleDeleteRequest() {
    deleteConfirmModal = true;
  }

  async function handleAccountDelete(e: Event) {
    e.preventDefault();
    if (deleteFormValid) {
      await onDeleteAccount();
      deleteConfirmModal = false;
    }
  }
</script>

<div class="alert alert-danger">
  <h6 class="alert-heading">
    <i class="fas fa-exclamation-triangle me-1"></i>
    Bu işlem geri alınamaz!
  </h6>
  <p class="mb-3">Hesabı sildiğinizde:</p>
  <ul class="mb-3">
    <li>Kişisel veriler silinmeyecek fakat inaktif hale getirilecek</li>
    <li>Grup üyelikleri pasif hale getirilecek</li>
    <li>Geçmiş antrenman kayıtları silinmeyecek</li>
    <li>Bu işlem geri alınamayacak</li>
  </ul>
</div>

<div class="text-center">
  <Button
    color="danger"
    size="lg"
    on:click={handleDeleteRequest}
    class="px-4"
  >
    <i class="fas fa-trash-alt me-2"></i>
    Hesabı Sil
  </Button>
</div>

<Modal 
  isOpen={deleteConfirmModal} 
  toggle={() => deleteConfirmModal = false} 
  centered 
  size="md"
>
  <ModalBody class="p-4">
    <div class="mb-4 text-center">
      <div
        class="bg-danger-subtle rounded-circle d-inline-flex p-3 mb-3"
      >
        <i class="fas fa-trash-alt text-danger" style="font-size: 2rem;"></i>
      </div>
      <h4 class="text-danger mb-1">Hesap Silme Onayı</h4>
    </div>

    <Form
      id="delete-user-form"
      class="row g-3"
      on:submit={handleAccountDelete}
    >
      <div class="alert alert-danger">
        <h6 class="alert-heading">
          <i class="fas fa-warning me-1"></i>
          DİKKAT: Bu işlem geri alınamaz!
        </h6>
        <p class="mb-0">
          Hesabınızı sildiğinizde tüm verileriniz kalıcı olarak kaybolacaktır. 
          Bu işlem geri alınamaz.
        </p>
      </div>

      <p class="mb-0">
        Hesabınızı silmek istediğinizden emin misiniz? 
        Onaylamak için tam adınızı yazın:
      </p>

      <Col md="12">
        <Input
          type="text"
          bind:value={deleteConfirmText}
          placeholder="{user.firstName} {user.lastName}"
          class="mb-3"
          required
        />

        <small class="text-muted">
          Yazmanız gereken: 
          <strong>{user.firstName} {user.lastName}</strong>
        </small>
      </Col>
    </Form>
  </ModalBody>
  
  <ModalFooter>
    <Button color="secondary" on:click={() => deleteConfirmModal = false}>
      <i class="fas fa-times me-1"></i>
      İptal
    </Button>
    <Button
      color="danger"
      type="submit"
      form="delete-user-form"
      disabled={!deleteFormValid || isDeleting}
    >
      <i
        class={`fas fa-${isDeleting ? "spinner fa-spin" : "trash-alt"} me-1`}
      ></i>
      {isDeleting ? "Siliniyor..." : "Hesabı Sil"}
    </Button>
  </ModalFooter>
</Modal>

<style>
  .tab-description h5 {
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
</style>

<script lang="ts">
  import {
    Button,
    Col,
    Row,
    Modal,
    ModalBody,
    ModalFooter,
    Form,
    Input,
    InputGroup,
    InputGroupText,
  } from "@sveltestrap/sveltestrap";
  import type { UserType } from "$lib/types/types";
  import { createEventDispatcher } from "svelte";

  export let isOpen: boolean;
  export let selectedUser: UserType | null = null;
  export let isUpdatingEmail = false;

  const dispatch = createEventDispatcher();
  function close() {
    dispatch("close");
  }
  function submit() {
    dispatch("saveEmail");
  }
  function back() {
    dispatch("back");
  }

  $: fullName = selectedUser
    ? `${selectedUser.firstName || ""} ${selectedUser.lastName || ""}`.trim()
    : "";

  // Validation
  let validated = false;
  $: emailStr = (selectedUser?.email ?? "").toString().trim();
  $: emailProvided = emailStr.length > 0;
  $: emailFormatValid = /[^\s@]+@[^\s@]+\.[^\s@]+/.test(emailStr);
  $: emailValid = emailProvided && emailFormatValid;

  function onSubmit(e: Event) {
    e.preventDefault();
    validated = true;
    if (emailValid) submit();
  }

  function resetValidation() {
    if (validated) validated = false;
  }
</script>

<Modal {isOpen} toggle={close} centered size="md" scrollable>
  {#if selectedUser}
    <ModalBody class="p-4">
      <div class="mb-4 text-center">
        <div
          class="bg-info-subtle rounded-circle d-inline-flex p-3 mb-3"
        >
          <i
            class="fas fa-envelope text-info"
            style="font-size: 2rem;"
          ></i>
        </div>
        <h4 class="text-info mb-1">E-Posta Değiştirme Ekranı</h4>
      </div>

      <Row class="border-primary border-2 mb-2">
        <div class="text-center">
          <h5 class="mb-1">{fullName}</h5>
          <p class="text-muted mb-0">
            <i class="fas fa-phone me-1"></i>
            Tel. No: {selectedUser.phoneNumber}
          </p>
        </div>
      </Row>

      <Form
        id="update-email-form"
        class="g-3 mt-2"
        {validated}
        on:submit={onSubmit}
      >
        <Col md="12">
          <label class="form-label" for="edit-email">
            <i class="fas fa-envelope me-1"></i>Yeni E-Posta
          </label>
          <InputGroup class="mb-2">
            <Input
              id="edit-email"
              type="email"
              bind:value={selectedUser.email}
              required
              invalid={validated && !emailValid}
              feedback="E-posta gereklidir ve geçerli olmalıdır"
              on:input={resetValidation}
            />
            <InputGroupText>
              <div class="form-check form-switch m-0">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="new-email-verified-md"
                  checked={selectedUser.isEmailVerified}
                  on:change={(e) =>
                    (selectedUser.isEmailVerified =
                      e.currentTarget.checked)}
                  aria-label="E-posta doğrulama durumu"
                />
              </div>
              <i
                class={`ms-2 fas ${selectedUser.isEmailVerified ? "fa-check-circle text-success" : "fa-exclamation-circle text-warning"}`}
                title={selectedUser.isEmailVerified
                  ? "Doğrulanmış"
                  : "Doğrulanmamış"}
              ></i>
            </InputGroupText>
          </InputGroup>
        </Col>
      </Form>
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
          color="primary"
          type="submit"
          form="update-email-form"
          disabled={isUpdatingEmail}
        >
          <i
            class={`fas fa-${isUpdatingEmail ? "spinner fa-spin" : "save"} me-1`}
          ></i>
          {isUpdatingEmail ? "Kaydediliyor..." : "Kaydet"}
        </Button>
      </div>
    </ModalFooter>
  {/if}
</Modal>

<script lang="ts">
  import {
    Button,
    Col,
    Input,
    InputGroup,
    InputGroupText,
    Form
  } from "@sveltestrap/sveltestrap";
  import type { UserType } from "$lib/types/types";
  import { validateEmail } from "$lib/utils/validation";

  export let user: UserType;
  export let onEmailUpdate: (newEmail: string, isVerified: boolean) => Promise<void>;
  export let isSubmitting = false;

  let newEmail = user.email || "";
  let isEmailVerified = user.isEmailVerified;
  let emailValidated = false;
  let validationErrors: string[] = [];

  // Reactively set verification to false when email changes
  $: {
    if (newEmail !== user.email) {
      isEmailVerified = false;
    }
  }

  async function handleEmailUpdate(e: Event) {
    e.preventDefault();
    emailValidated = true;

    const validationResult = validateEmail(newEmail);
    validationErrors = validationResult.errors;

    if (validationResult.isValid) {
      await onEmailUpdate(newEmail, isEmailVerified);
    }
  }
</script>

<Form class="row g-3" on:submit={handleEmailUpdate}>
  {#if validationErrors.length > 0}
    <Col md="12">
      <div class="alert alert-danger">
        <ul>
          {#each validationErrors as error}
            <li>{error}</li>
          {/each}
        </ul>
      </div>
    </Col>
  {/if}

  <Col md="12">
    <label class="form-label" for="profile-email">
      <i class="fas fa-envelope me-1"></i>Yeni E-Posta
    </label>
    <InputGroup class="mb-2">
      <Input
        id="profile-email"
        type="email"
        bind:value={newEmail}
        required
        invalid={emailValidated && !newEmail}
        feedback="E-posta gereklidir"
      />
      <InputGroupText>
        <div class="form-check form-switch m-0">
          <input
            class="form-check-input"
            type="checkbox"
            id="profile-email-verified"
            bind:checked={isEmailVerified}
            aria-label="E-posta doğrulama durumu"
          />
        </div>
        <i
          class={`ms-2 fas ${isEmailVerified ? "fa-check-circle text-success" : "fa-exclamation-circle text-warning"}`}
          title={isEmailVerified ? "Doğrulanmış" : "Doğrulanmamış"}
        ></i>
      </InputGroupText>
    </InputGroup>
    {#if newEmail !== user.email}
      <small class="text-muted">
        <i class="fas fa-info-circle me-1"></i>
        E-posta değiştirildiğinden dolayı doğrulama otomatik olarak kaldırıldı.
      </small>
    {/if}
  </Col>
  
  <Col md="12" class="d-flex justify-content-end gap-2 mt-3">
    <Button
      color="primary"
      type="submit"
      disabled={isSubmitting}
    >
      <i
        class={`fas ${isSubmitting ? "fa-spinner fa-spin" : "fa-save"} me-1`}
      ></i>
      {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
    </Button>
  </Col>
</Form>

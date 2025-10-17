<script lang="ts">
  import {
    Button,
    Col,
    Input,
    Form,
    Badge
  } from "@sveltestrap/sveltestrap";
  import type { UserType } from "$lib/types/types";
  import { GENDERS } from "$lib/helpers/constants";
  import { ROLES } from "$lib/types/role";
  import RoleBadge from "$lib/components/RoleBadge.svelte";
  import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
  import { validateUserProfile } from "$lib/utils/validation";

  export let user: UserType;
  export let onSubmit: (updatedUser: UserType) => Promise<void>;
  export let isSubmitting = false;

  let editableUser: UserType = { ...user };
  let validated = false;
  let validationErrors: string[] = [];

  $: effectiveIsStudent = (editableUser?.isStudent ?? true) === true;

  function toggleRole(roleId: string, isChecked: boolean) {
    const currentRoles = editableUser.roles || [];
    editableUser.roles = isChecked
      ? [...currentRoles, roleId]
      : currentRoles.filter((id) => id !== roleId);
    validated = false;
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    validated = true;

    const validationResult = validateUserProfile(editableUser);
    validationErrors = validationResult.errors;

    if (validationResult.isValid) {
      try {
        await onSubmit(editableUser);
      } catch (error) {
        console.error('Profile submit error:', error);
      }
    }
  }
</script>

<Form class="row g-3" on:submit={handleSubmit}>
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

  <Col md="6">
    <label class="form-label" for="profile-firstName">
      <i class="fas fa-user me-1"></i>Ad *
    </label>
    <Input
      id="profile-firstName"
      type="text"
      bind:value={editableUser.firstName}
      required
      invalid={validated && !editableUser.firstName}
      feedback="İsim gereklidir"
    />
  </Col>

  <Col md="6">
    <label class="form-label" for="profile-lastName">
      <i class="fas fa-user me-1"></i>Soyad *
    </label>
    <Input
      id="profile-lastName"
      type="text"
      bind:value={editableUser.lastName}
      required
      invalid={validated && !editableUser.lastName}
      feedback="Soyisim gereklidir"
    />
  </Col>

  <Col md="6">
    <label class="form-label" for="profile-phone">
      <i class="fas fa-phone me-1"></i>Telefon *
    </label>
    <Input
      id="profile-phone"
      type="tel"
      bind:value={editableUser.phoneNumber}
      placeholder="+90XXXXXXXXXX"
      required
    />
  </Col>

  <Col md="6">
    <label class="form-label" for="profile-gender">
      <i class="fas fa-venus-mars me-1"></i>Cinsiyet *
    </label>
    <Input
      id="profile-gender"
      type="select"
      bind:value={editableUser.isMale}
      required
    >
      <option value="">Seçiniz...</option>
      {#each GENDERS as gender}
        <option value={gender.value}>{gender.label}</option>
      {/each}
    </Input>
  </Col>

  <Col md="6">
    <label class="form-label" for="profile-skillLevel">
      <i class="fas fa-tennis-ball me-1"></i>Tenis Seviyesi *
    </label>
    <Input
      id="profile-skillLevel"
      type="select"
      bind:value={editableUser.skillLevel}
      required
    >
      <option value="">Seçiniz...</option>
      {#each [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as lvl}
        <option value={lvl}>{lvl}</option>
      {/each}
    </Input>
  </Col>

  <Col md="12">
    <div class="form-label">
      <i class="fas fa-user-tag me-1"></i>
      Roller
      {#if editableUser.roles && editableUser.roles.length > 0}
        <Badge color="info" class="ms-1">{editableUser.roles.length}</Badge>
      {/if}
    </div>
    <div
      style="max-height: 250px; overflow-y: auto;"
      class="border rounded p-2"
    >
      {#each ROLES as role}
        <div class="form-check mb-2 mt-1">
          <input
            class="form-check-input"
            type="checkbox"
            id="profile-role-{role.id}"
            checked={editableUser.roles?.includes(role.id) || false}
            on:change={(e) => toggleRole(role.id, e.currentTarget.checked)}
          />
          <label
            class="form-check-label small"
            for="profile-role-{role.id}"
          >
            <RoleBadge roleId={role.id} variant="text" />
            <small class="text-muted d-block">{role.description}</small>
          </label>
        </div>
      {/each}
    </div>
  </Col>

  <Col md="12">
    <label class="form-label" for="profile-notes">
      <i class="fas fa-sticky-note me-1"></i>Notlar
    </label>
    <Input
      id="profile-notes"
      type="textarea"
      rows={3}
      bind:value={editableUser.notes}
      placeholder="Kullanıcı hakkında notlar..."
    />
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

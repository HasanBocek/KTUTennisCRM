<script lang="ts">
  import {
    Badge,
    Button,
    Col,
    Row,
    Modal,
    ModalBody,
    ModalFooter,
    Form,
    Input,
  } from "@sveltestrap/sveltestrap";
  import type { RoleType } from "$lib/types/role";
  import type { UserType } from "$lib/types/types";
  import { createEventDispatcher } from "svelte";
  import RoleBadge from "$lib/components/RoleBadge.svelte";
  import departments from '$lib/assets/departments.json';
  import {
    GRADES,
    GENDERS,
  } from "$lib/helpers/constants";

  export let isOpen: boolean;
  export let selectedUser: UserType | null = null;
  export let isUpdating = false;
  export let roles: RoleType[];

  const dispatch = createEventDispatcher();
  function close() {
    dispatch("close");
  }
  function submit() {
    dispatch("save");
  }
  function back() {
    dispatch("back");
  }

  function toggleRole(roleId: string, isChecked: boolean) {
    if (!selectedUser) return;
    // Mevcut rolleri alır, eğer null ise boş bir dizi ile başlar
    const currentRoles = selectedUser.roles || [];
    selectedUser.roles = isChecked
      ? [...currentRoles, roleId]
      : currentRoles.filter((id) => id !== roleId);
  }

  // Validation helpers
  let validated = false;
  const nameRegex = /^[a-zA-ZçğıöşüÇĞİÖŞÜ ]+$/;
  const e164Regex = /^\+[1-9]\d{1,14}$/;
  const allowedSkillLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  $: effectiveIsStudent = (selectedUser?.isStudent ?? true) === true;
  $: firstNameValid = nameRegex.test(
    (selectedUser?.firstName ?? "").toString().trim()
  );
  $: lastNameValid = nameRegex.test(
    (selectedUser?.lastName ?? "").toString().trim()
  );
  $: isMaleValid =
    selectedUser?.isMale === "1" || selectedUser?.isMale === "0";
  $: phoneValid = e164Regex.test(
    (selectedUser?.phoneNumber ?? "").toString().trim()
  );
  $: skillLevelValid = allowedSkillLevels.includes(
    Number(selectedUser?.skillLevel ?? NaN)
  );
  $: studentNumberValid = effectiveIsStudent
    ? /^\d{6}$/.test(
        (selectedUser?.studentNumber ?? "").toString().trim()
      )
    : true;
  $: departmentValid = effectiveIsStudent
    ? Object.values(departments).includes(
        (selectedUser?.department ?? "").toString()
      )
    : (selectedUser?.department ?? "") === "";
  $: gradeValid = effectiveIsStudent
    ? GRADES.includes((selectedUser?.grade ?? "").toString())
    : (selectedUser?.grade ?? "") === "";
  $: formValid =
    firstNameValid &&
    lastNameValid &&
    isMaleValid &&
    phoneValid &&
    skillLevelValid &&
    studentNumberValid &&
    departmentValid &&
    gradeValid;

  function onSubmit(e: Event) {
    e.preventDefault();
    validated = true;
    if (formValid) submit();
  }

  function resetValidation() {
    if (validated) validated = false;
  }

  // Not editing isStudent in this modal; it is used only for conditional validation
</script>

<Modal {isOpen} toggle={close} centered size="lg" scrollable>
  {#if selectedUser}
    <ModalBody class="p-4">
      <div class="mb-4 text-center">
        <div
          class="bg-warning-subtle rounded-circle d-inline-flex p-3 mb-3"
        >
          <i
            class="fa-solid fa-pen text-warning"
            style="font-size: 2rem;"
          ></i>
        </div>
        <h4 class="text-warning mb-1">Üyelik Düzenleme Ekranı</h4>
      </div>
      <Form
        id="edit-user-form"
        class="row g-3"
        {validated}
        on:submit={onSubmit}
      >
        <Col md="6">
          <label class="form-label" for="edit-firstName"
            ><i class="fas fa-user me-1"></i>Ad *</label
          >
          <Input
            id="edit-firstName"
            type="text"
            bind:value={selectedUser.firstName}
            required
            invalid={validated && !firstNameValid}
            feedback="İsim sadece harfler ve boşluklar içermelidir"
            on:input={resetValidation}
          />
        </Col>
        <Col md="6">
          <label class="form-label" for="edit-lastName"
            ><i class="fas fa-user me-1"></i>Soyad *</label
          >
          <Input
            id="edit-lastName"
            type="text"
            bind:value={selectedUser.lastName}
            required
            invalid={validated && !lastNameValid}
            feedback="Soyisim sadece harfler ve boşluklar içermelidir"
            on:input={resetValidation}
          />
        </Col>
        <Col md="6">
          <label class="form-label" for="edit-phoneNumber"
            ><i class="fas fa-phone me-1"></i>Telefon *</label
          >
          <Input
            id="edit-phoneNumber"
            type="tel"
            bind:value={selectedUser.phoneNumber}
            placeholder="+90XXXXXXXXXX"
            required
            invalid={validated && !phoneValid}
            feedback="Telefon numarası geçerli formatta olmalıdır (E.164)"
            on:input={resetValidation}
          />
        </Col>

        {#if effectiveIsStudent}
          <Col md="6">
            <label class="form-label" for="edit-studentNumber"
              ><i class="fas fa-id-card me-1"></i>Öğrenci No *</label
            >
            <Input
              id="edit-studentNumber"
              type="text"
              bind:value={selectedUser.studentNumber}
              required
              invalid={validated && !studentNumberValid}
              feedback="Öğrenci numarası 6 rakam olmalıdır"
              inputmode="numeric"
              on:input={resetValidation}
            />
          </Col>
          <Col md="6">
            <label class="form-label" for="edit-department"
              ><i class="fas fa-graduation-cap me-1"></i>Bölüm *</label
            >
            <Input
              id="edit-department"
              type="select"
              bind:value={selectedUser.department}
              required
              invalid={validated && !departmentValid}
              feedback="Bölüm seçiniz"
              on:change={resetValidation}
            >
              <option value="">Seçiniz...</option>
              {#each Object.entries(departments) as [code, name]}
                <option value={code}>{name}</option>
              {/each}
            </Input>
          </Col>
          <Col md="6">
            <label class="form-label" for="edit-grade"
              ><i class="fas fa-layer-group me-1"></i>Sınıf *</label
            >
            <Input
              id="edit-grade"
              type="select"
              bind:value={selectedUser.grade}
              required
              invalid={validated && !gradeValid}
              feedback="Sınıf seçiniz"
              on:change={resetValidation}
            >
              <option value="">Seçiniz...</option>
              {#each GRADES as grade}
                <option value={grade}>{grade}</option>
              {/each}
            </Input>
          </Col>
        {/if}
        <Col md="6">
          <label class="form-label" for="edit-isMale"
            ><i class="fas fa-venus-mars me-1"></i>Cinsiyet *</label
          >
          <Input
            id="edit-isMale"
            type="select"
            bind:value={selectedUser.isMale}
            required
            invalid={validated && !isMaleValid}
            feedback="Cinsiyet gereklidir"
            on:change={resetValidation}
          >
            <option value="">Seçiniz...</option>
            {#each GENDERS as gender}
              <option value={gender.value}>{gender.label}</option>
            {/each}
          </Input>
        </Col>
        <Col md="6">
          <label class="form-label" for="edit-skillLevel"
            ><i class="fas fa-tennis-ball me-1"></i>Tenis Seviyesi *</label
          >
          <Input
            id="edit-skillLevel"
            type="select"
            bind:value={selectedUser.skillLevel}
            required
            invalid={validated && !skillLevelValid}
            feedback="Yetenek seviyesi 1 ile 10 arasında olmalıdır"
            on:change={resetValidation}
          >
            <option value="">Seçiniz...</option>
            {#each allowedSkillLevels as lvl}
              <option value={lvl}>{lvl}</option>
            {/each}
          </Input>
        </Col>

        <Col md="12">
          <div class="form-label">
            <i class="fas fa-check-circle me-1"></i>E-posta Doğrulama
          </div>
          <div class="form-check form-switch mt-2">
            <input
              class="form-check-input"
              type="checkbox"
              id="edit-email-verified"
              checked={selectedUser.isEmailVerified}
              on:change={(e) =>
                (selectedUser.isEmailVerified =
                  e.currentTarget.checked)}
            />
            <label
              class="form-check-label small"
              for="edit-email-verified"
            >
              {selectedUser.isEmailVerified
                ? "Doğrulanmış"
                : "Doğrulanmamış"}
            </label>
          </div>
        </Col>
        <Col md="12">
          <div class="form-label">
            <i class="fas fa-user-tag me-1"></i>
            Roller
            {#if selectedUser.roles && selectedUser.roles.length > 0}
              <Badge color="info" class="ms-1"
                >{selectedUser.roles.length}</Badge
              >
            {/if}
          </div>
          <div
            style="max-height: 250px; overflow-y: auto;"
            class="border rounded p-2"
          >
            {#each roles as role}
              <div class="form-check mb-2 mt-1">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="edit-role-{role.id}"
                  checked={selectedUser.roles?.includes(role.id) ||
                    false}
                  on:change={(e) =>
                    toggleRole(role.id, e.currentTarget.checked)}
                />
                <label
                  class="form-check-label small"
                  for="edit-role-{role.id}"
                >
                  <RoleBadge roleId={role.id} variant="text" />
                  <small class="text-muted d-block"
                    >{role.description}</small
                  >
                </label>
              </div>
            {/each}
          </div>
        </Col>
        <Col md="12">
          <label class="form-label" for="edit-notes"
            ><i class="fas fa-sticky-note me-1"></i>Notlar</label
          >
          <textarea
            id="edit-notes"
            class="form-control"
            rows="3"
            bind:value={selectedUser.notes}
            placeholder="Ek notlar..."
          ></textarea>
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
          form="edit-user-form"
          disabled={isUpdating}
        >
          <i
            class={`fas fa-${isUpdating ? "spinner fa-spin" : "save"} me-1`}
          ></i>
          {isUpdating ? "Kaydediliyor..." : "Kaydet"}
        </Button>
      </div>
    </ModalFooter>
  {/if}
</Modal>

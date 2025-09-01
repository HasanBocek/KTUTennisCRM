<script lang="ts">
  import {
    Badge,
    Button,
    Col,
    Modal,
    ModalBody,
    ModalFooter,
    Form,
    Input,
    InputGroup,
    InputGroupText,
  } from "@sveltestrap/sveltestrap";
  import type { RoleType } from "$lib/types/role";
  import type { UserType } from "$lib/types/types";
  import RoleBadge from "$lib/components/RoleBadge.svelte";
  import { createEventDispatcher } from "svelte";

  export let isOpen: boolean;
  export let newUser: Partial<UserType> = {};
  export let isCreating = false;
  export let roles: RoleType[] = [];

  // Validation state & helpers
  let validated = false;
  if (newUser.isStudent === undefined) newUser.isStudent = true;

  const nameRegex = /^[a-zA-ZçğıöşüÇĞİÖŞÜ ]+$/;
  const e164Regex = /^\+[1-9]\d{1,14}$/;
  const allowedSkillLevels = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
  ];
  const allowedDepartments = [
    "Bilgisayar Mühendisliği",
    "Spor Bilimleri",
    "İşletme",
    "Elektrik Elektronik Mühendisliği",
    "Makine Mühendisliği",
    "Psikoloji",
    "İktisat",
    "Tıp",
    "Endüstri Mühendisliği",
  ];
  const allowedGrades = [
    "Hazırlık",
    "1. Sınıf",
    "2. Sınıf",
    "3. Sınıf",
    "4. Sınıf",
    "5. Sınıf",
    "6. Sınıf",
    "6+ Sınıf",
    "Mezun",
  ];

  $: effectiveIsStudent = (newUser.isStudent ?? true) === true;
  $: firstNameValid = nameRegex.test(
    (newUser.firstName ?? "").toString().trim()
  );
  $: lastNameValid = nameRegex.test(
    (newUser.lastName ?? "").toString().trim()
  );
  $: isMaleValid = newUser.isMale === "1" || newUser.isMale === "0";
  $: phoneValid = e164Regex.test(
    (newUser.phoneNumber ?? "").toString().trim()
  );
  $: skillLevelValid = allowedSkillLevels.includes(
    (newUser.skillLevel ?? "").toString()
  );
  $: studentNumberValid = effectiveIsStudent
    ? /^\d{6}$/.test((newUser.studentNumber ?? "").toString().trim())
    : true;
  // Department/grade required only if student; otherwise should be empty or ignored
  $: departmentValid = effectiveIsStudent
    ? allowedDepartments.includes(
        (newUser.department ?? "").toString()
      )
    : (newUser.department ?? "") === "";
  $: gradeValid = effectiveIsStudent
    ? allowedGrades.includes((newUser.grade ?? "").toString())
    : (newUser.grade ?? "") === "";
  // Email: required if not student, optional if student (but if provided must be valid)
  $: emailStr = (newUser.email ?? "").toString().trim();
  $: emailProvided = emailStr.length > 0;
  $: emailFormatValid =
    !emailProvided || /[^\s@]+@[^\s@]+\.[^\s@]+/.test(emailStr);
  $: emailValid = effectiveIsStudent
    ? emailFormatValid
    : emailProvided && emailFormatValid;
  $: formValid =
    firstNameValid &&
    lastNameValid &&
    isMaleValid &&
    phoneValid &&
    skillLevelValid &&
    studentNumberValid &&
    departmentValid &&
    gradeValid &&
    emailValid;

  const dispatch = createEventDispatcher();
  function close() {
    dispatch("close");
  }
  function submit() {
    dispatch("create");
  }

  function onSubmit(e: Event) {
    e.preventDefault();
    validated = true;
    if (formValid) submit();
  }

  function resetValidation() {
    if (validated) validated = false;
  }

  function onIsStudentChange(e: Event) {
    const target = e.currentTarget as
      | HTMLInputElement
      | HTMLSelectElement;
    let isStudent: boolean;
    if ((target as HTMLSelectElement).value !== undefined) {
      isStudent =
        ((target as HTMLSelectElement).value ?? "true") === "true";
    } else {
      isStudent = !!(target as HTMLInputElement).checked;
    }
    newUser.isStudent = isStudent;
    if (!isStudent) {
      newUser.studentNumber = undefined;
      newUser.department = undefined;
      newUser.grade = undefined;
    }
    resetValidation();
  }

  function handleNewRoleChange(roleId: string, event: Event) {
    if (!newUser.roles) newUser.roles = [];
    const input = event.target as HTMLInputElement;
    if (input.checked) {
      if (!newUser.roles.includes(roleId))
        newUser.roles = [...newUser.roles, roleId];
    } else {
      if (roleId !== "member")
        newUser.roles = newUser.roles.filter((r) => r !== roleId);
    }
  }
</script>

<Modal {isOpen} toggle={close} centered size="lg" scrollable>
  <ModalBody class="p-4">
    <div class="mb-4 text-center">
      <div
        class="bg-success-subtle rounded-circle d-inline-flex p-3 mb-3"
      >
        <i class="fas fa-plus text-success" style="font-size: 2rem;"
        ></i>
      </div>
      <h4 class="text-success mb-1">Yeni Üye Oluştur</h4>
    </div>
    <Form
      id="create-user-form"
      class="row g-3"
      {validated}
      on:submit={onSubmit}
    >
      <Col md="6">
        <label class="form-label" for="new-firstName"
          ><i class="fas fa-user me-1"></i>Ad *</label
        >
        <Input
          id="new-firstName"
          type="text"
          bind:value={newUser.firstName}
          required
          invalid={validated && !firstNameValid}
          feedback="İsim sadece harfler ve boşluklar içermelidir"
          on:input={resetValidation}
        />
      </Col>
      <Col md="6">
        <label class="form-label" for="new-lastName"
          ><i class="fas fa-user me-1"></i>Soyad *</label
        >
        <Input
          id="new-lastName"
          type="text"
          bind:value={newUser.lastName}
          required
          invalid={validated && !lastNameValid}
          feedback="Soyisim sadece harfler ve boşluklar içermelidir"
          on:input={resetValidation}
        />
      </Col>

      <Col md="6">
        <label class="form-label" for="new-phoneNumber"
          ><i class="fas fa-phone me-1"></i>Telefon *</label
        >
        <Input
          id="new-phoneNumber"
          type="tel"
          bind:value={newUser.phoneNumber}
          placeholder="+90XXXXXXXXXX"
          required
          invalid={validated && !phoneValid}
          feedback="Telefon numarası geçerli formatta olmalıdır (E.164)"
          on:input={resetValidation}
        />
      </Col>
      <Col md="6">
        <label
          id="label-new-email"
          class="form-label"
          for="new-email-md"
        >
          <i class="fas fa-envelope me-1"
          ></i>E-posta{#if !effectiveIsStudent}
            *{/if}
        </label>
        <InputGroup class="mb-2">
          <Input
            id="new-email-md"
            type="email"
            bind:value={newUser.email}
            required={!effectiveIsStudent}
            invalid={validated && !emailValid}
            feedback={effectiveIsStudent
              ? "Geçerli bir e-posta adresi girin"
              : "E-posta gereklidir ve geçerli olmalıdır"}
            on:input={resetValidation}
          />
          <InputGroupText>
            <div class="form-check form-switch m-0">
              <input
                class="form-check-input"
                type="checkbox"
                id="new-email-verified-md"
                checked={newUser.isEmailVerified}
                on:change={(e) =>
                  (newUser.isEmailVerified = e.currentTarget.checked)}
                aria-label="E-posta doğrulama durumu"
              />
            </div>
            <i
              class={`ms-2 fas ${newUser.isEmailVerified ? "fa-check-circle text-success" : "fa-exclamation-circle text-warning"}`}
              title={newUser.isEmailVerified
                ? "Doğrulanmış"
                : "Doğrulanmamış"}
            ></i>
          </InputGroupText>
        </InputGroup>
      </Col>

      <Col md="6">
        <label class="form-label" for="new-isMale"
          ><i class="fas fa-venus-mars me-1"></i>Cinsiyet *</label
        >
        <Input
          id="new-isMale"
          type="select"
          bind:value={newUser.isMale}
          required
          invalid={validated && !isMaleValid}
          feedback="Cinsiyet gereklidir"
          on:change={resetValidation}
        >
          <option value="">Seçiniz...</option>
          <option value="1">Erkek</option>
          <option value="0">Kadın</option>
        </Input>
      </Col>
      <Col md="6">
        <label class="form-label" for="new-skillLevel"
          ><i class="fas fa-tennis-ball me-1"></i>Tenis Seviyesi *</label
        >
        <Input
          id="new-skillLevel"
          type="select"
          bind:value={newUser.skillLevel}
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
      <Col md="6">
        <label class="form-label" for="new-isStudent">
          <i class="fas fa-user-graduate me-1"></i>Öğrenci mi?
        </label>
        <Input
          id="new-isStudent"
          type="select"
          value={effectiveIsStudent ? "true" : "false"}
          on:change={onIsStudentChange}
        >
          <option value="true">Evet</option>
          <option value="false">Hayır</option>
        </Input>
      </Col>
      {#if effectiveIsStudent}
        <Col md="6">
          <label class="form-label" for="new-studentNumber"
            ><i class="fas fa-id-card me-1"></i>Öğrenci No *</label
          >
          <Input
            id="new-studentNumber"
            type="text"
            bind:value={newUser.studentNumber}
            required
            invalid={validated && !studentNumberValid}
            feedback="Öğrenci numarası 6 rakam olmalıdır"
            inputmode="numeric"
            on:input={resetValidation}
          />
        </Col>
      {/if}
      {#if effectiveIsStudent}
        <Col md="6">
          <label class="form-label" for="new-department"
            ><i class="fas fa-graduation-cap me-1"></i>Bölüm *</label
          >
          <Input
            id="new-department"
            type="select"
            bind:value={newUser.department}
            required
            invalid={validated && !departmentValid}
            feedback="Bölüm seçiniz"
            on:change={resetValidation}
          >
            <option value="">Seçiniz...</option>
            {#each allowedDepartments as dep}
              <option value={dep}>{dep}</option>
            {/each}
          </Input>
        </Col>
        <Col md="6">
          <label class="form-label" for="new-grade"
            ><i class="fas fa-layer-group me-1"></i>Sınıf *</label
          >
          <Input
            id="new-grade"
            type="select"
            bind:value={newUser.grade}
            required
            invalid={validated && !gradeValid}
            feedback="Sınıf seçiniz"
            on:change={resetValidation}
          >
            <option value="">Seçiniz...</option>
            {#each allowedGrades as g}
              <option value={g}>{g}</option>
            {/each}
          </Input>
        </Col>
      {/if}

      <Col md="12">
        <label for="new-roles" class="form-label"
          ><i class="fas fa-user-tag me-1"></i>Roller {#if newUser.roles && newUser.roles.length > 0}<Badge
              color="info"
              class="ms-1">{newUser.roles.length}</Badge
            >{/if}</label
        >
        <div
          style="max-height: 250px; overflow-y: auto;"
          class="border rounded p-2"
        >
          {#each roles as role}
            <div class="form-check mb-2 mt-1">
              <input
                class="form-check-input"
                type="checkbox"
                name="newRole"
                id={`new-role-${role.id}`}
                checked={role.id === "member" ||
                  (newUser.roles && newUser.roles.includes(role.id))}
                disabled={role.id === "member"}
                on:change={(e) => handleNewRoleChange(role.id, e)}
              />
              <label
                class="form-check-label small"
                for={`new-role-${role.id}`}
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
        <label class="form-label" for="new-notes"
          ><i class="fas fa-sticky-note me-1"></i>Notlar</label
        >
        <textarea
          id="new-notes"
          class="form-control"
          rows="3"
          bind:value={newUser.notes}
          placeholder="Ek notlar..."
        ></textarea>
      </Col>
    </Form>
  </ModalBody>
  <ModalFooter>
    <Button color="secondary" on:click={close}>
      <i class="fas fa-times me-1"></i>
      İptal
    </Button>
    <Button
      color="success"
      type="submit"
      form="create-user-form"
      disabled={isCreating}
    >
      <i
        class={`fas fa-${isCreating ? "spinner fa-spin" : "plus"} me-1`}
      ></i>
      {isCreating ? "Üye Oluşturuluyor..." : "Üye Oluştur"}
    </Button>
  </ModalFooter>
</Modal>

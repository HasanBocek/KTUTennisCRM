<script lang="ts">
  import {
    Button,
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Col,
    Input,
    InputGroup,
    InputGroupText,
    Row,
    Form,
    Modal,
    ModalBody,
    ModalHeader,
    ModalFooter,
    TabContent,
    TabPane,
    Badge,
    Toast,
    ToastBody,
  } from "@sveltestrap/sveltestrap";
  import {
    GRADES,
    GENDERS,
  } from "$lib/helpers/constants";
  import type { UserType } from "$lib/types/types";
  import { ROLES } from "$lib/types/role";
  import RoleBadge from "$lib/components/RoleBadge.svelte";
  import { updateUser } from "$lib/stores/usersStore";
  import SettingCard from "$lib/components/SettingCard.svelte";
  import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
  import departments from "$lib/assets/departments.json";
  import { UserService } from "$lib/services/user/userService";
  import { page } from "$app/stores";
  import { addToast } from "$lib/components/ToastNotification.svelte";

  export let user: UserType;

  // State for tab navigation (not needed for SvelteStrap tabs)
  let isUpdating = false;
  let isUpdatingEmail = false;
  let isDeleting = false;
  let validated = false;
  let emailValidated = false;
  let deleteConfirmModal = false;

  // Local editable copies
  let editableUser: UserType;
  let newEmail = "";
  let deleteConfirmText = "";

  // Initialize editableUser when user prop changes - only when user actually changes
  let lastUserId: string | undefined;
  $: if (user?._id !== lastUserId) {
    editableUser = { ...user };
    newEmail = user.email || "";
    lastUserId = user?._id;
  }

  // Validation patterns
  const nameRegex = /^[a-zA-ZçğıöşüÇĞİÖŞÜ ]+$/;
  const e164Regex = /^\+[1-9]\d{1,14}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const allowedSkillLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // Profile validation
  $: effectiveIsStudent = (editableUser?.isStudent ?? true) === true;
  $: firstNameValid = nameRegex.test(
    (editableUser?.firstName ?? "").toString().trim()
  );
  $: lastNameValid = nameRegex.test(
    (editableUser?.lastName ?? "").toString().trim()
  );
  $: isMaleValid =
    editableUser?.isMale === "1" || editableUser?.isMale === "0";
  $: phoneValid = e164Regex.test(
    (editableUser?.phoneNumber ?? "").toString().trim()
  );
  $: skillLevelValid = allowedSkillLevels.includes(
    Number(editableUser?.skillLevel ?? NaN)
  );
  $: departmentValid = effectiveIsStudent
    ? Object.keys(departments).includes(editableUser?.department ?? "")
    : (editableUser?.department ?? "") === "";
  $: gradeValid = effectiveIsStudent
    ? GRADES.includes((editableUser?.grade ?? "").toString())
    : (editableUser?.grade ?? "") === "";

  // New field validations
  $: studentNumberValid =
    !effectiveIsStudent ||
    !editableUser?.studentNumber ||
    Number(editableUser?.studentNumber) > 0;
  $: rolesValid =
    !user.roles ||
    user.roles.length === 0 ||
    user.roles.every(
      (role) => typeof role === "string" && role.trim().length > 0
    );

  $: profileFormValid =
    firstNameValid &&
    lastNameValid &&
    isMaleValid &&
    phoneValid &&
    skillLevelValid &&
    departmentValid &&
    gradeValid &&
    studentNumberValid &&
    rolesValid;

  // Email validation
  $: emailValid =
    emailRegex.test(newEmail.trim()) && newEmail.trim() !== "";
  $: emailFormValid = emailValid;

  // Delete validation
  $: deleteFormValid =
    deleteConfirmText.trim() === user.firstName + " " + user.lastName;

  function resetValidation() {
    if (validated) validated = false;
  }

  function resetEmailValidation() {
    if (emailValidated) emailValidated = false;
  }

  function toggleRole(roleId: string, isChecked: boolean) {
    const currentRoles = editableUser.roles || [];
    editableUser.roles = isChecked
      ? [...currentRoles, roleId]
      : currentRoles.filter((id) => id !== roleId);
    resetValidation();
  }

  async function handleProfileUpdate(e: Event) {
    e.preventDefault();
    validated = true;
    if (!profileFormValid) return;

    isUpdating = true;
    try {
      const accessToken = $page.data.session?.accessToken;
      if (!accessToken) {
        throw new Error("Oturum açılmamış");
      }

      const result = await UserService.updateUser(
        user._id, 
        editableUser, 
        accessToken
      );

      if (result.success) {
        // Update the user in the global store
        updateUser(result.user);

        // Update the local user prop reference (this will trigger reactive updates)
        user = result.user;
        editableUser = { ...result.user };

        // Reset validation state
        validated = false;

        // Show success message
        addToast({
          message: result.message || "Profil bilgileri başarıyla güncellendi!",
          type: "success"
        });
      } else {
        // Show error messages
        if (result.errors && result.errors.length > 0) {
          result.errors.forEach(error => {
            addToast({
              message: error,
              type: "danger"
            });
          });
        } else {
          addToast({
            message: result.message || "Profil güncellenirken bir hata oluştu!",
            type: "danger"
          });
        }
      }
    } catch (error) {
      console.error("Profile update error:", error);
      addToast({
        message: "Profil güncellenirken bir hata oluştu!",
        type: "danger"
      });
    } finally {
      isUpdating = false;
    }
  }

  async function handleEmailUpdate(e: Event) {
    e.preventDefault();
    emailValidated = true;
    if (!emailFormValid) return;

    isUpdatingEmail = true;
    try {
      const accessToken = $page.data.session?.accessToken;
      if (!accessToken) {
        throw new Error("Oturum açılmamış");
      }

      const result = await UserService.updateUserEmail(
        user._id, 
        newEmail, 
        editableUser.isEmailVerified, 
        accessToken
      );

      if (result.success) {
        // Update the user in the global store
        updateUser(result.user);

        // Update local references
        user = result.user;
        editableUser = { ...result.user };

        // Reset form after successful update
        newEmail = user.email || "";
        emailValidated = false;

        // Show success message
        addToast({
          message: result.message || "E-posta adresi başarıyla güncellendi!",
          type: "success"
        });
      } else {
        // Show error messages
        if (result.errors && result.errors.length > 0) {
          result.errors.forEach(error => {
            addToast({
              message: error,
              type: "danger"
            });
          });
        } else {
          addToast({
            message: result.message || "E-posta güncellenirken bir hata oluştu!",
            type: "danger"
          });
        }
      }
    } catch (error) {
      console.error("Email update error:", error);
      addToast({
        message: "E-posta güncellenirken bir hata oluştu!",
        type: "danger"
      });
    } finally {
      isUpdatingEmail = false;
    }
  }

  async function handleAccountDelete() {
    isDeleting = true;
    try {
      const accessToken = $page.data.session?.accessToken;
      if (!accessToken) {
        throw new Error("Oturum açılmamış");
      }

      const result = await UserService.deleteUser(
        user._id, 
        accessToken
      );

      if (result.success) {
        // Redirect or handle successful deletion
        addToast({
          message: result.message || "Kullanıcı başarıyla silindi!",
          type: "success"
        });
        // You might want to add a redirect here, e.g.:
        // goto('/dashboard/users');
      } else {
        // Show error messages
        if (result.errors && result.errors.length > 0) {
          result.errors.forEach(error => {
            addToast({
              message: error,
              type: "danger"
            });
          });
        } else {
          addToast({
            message: result.message || "Kullanıcı silinemedi!",
            type: "danger"
          });
        }
      }
    } catch (error) {
      console.error("Account delete error:", error);
      addToast({
        message: "Kullanıcı silinemedi!",
        type: "danger"
      });
    } finally {
      isDeleting = false;
      deleteConfirmModal = false;
    }
  }

  function handleDeleteRequest() {
    deleteConfirmModal = true;
  }
</script>

<SettingCard title="Profil Ayarları">
  <!-- Tab Content -->
  <TabContent>
    <!-- Profile Tab -->
    <TabPane
      active
      tabId="profile"
      tab="Profil Düzenleme"
      class="pt-3"
    >
      <Form class="row g-3" on:submit={handleProfileUpdate}>
        <Col md="6">
          <label class="form-label" for="profile-firstName">
            <i class="fas fa-user me-1"></i>Ad *
          </label>
          <Input
            id="profile-firstName"
            type="text"
            bind:value={editableUser.firstName}
            required
            invalid={validated && !firstNameValid}
            feedback="İsim sadece harfler ve boşluklar içermelidir"
            on:input={resetValidation}
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
            invalid={validated && !lastNameValid}
            feedback="Soyisim sadece harfler ve boşluklar içermelidir"
            on:input={resetValidation}
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
            invalid={validated && !phoneValid}
            feedback="Telefon numarası geçerli formatta olmalıdır (E.164)"
            on:input={resetValidation}
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

        {#if effectiveIsStudent}
          <Col md="6">
            <label class="form-label" for="profile-department">
              <i class="fas fa-graduation-cap me-1"></i>Bölüm *
            </label>
            <Input
              id="profile-department"
              type="select"
              bind:value={editableUser.department}
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
            <label class="form-label" for="profile-grade">
              <i class="fas fa-layer-group me-1"></i>Sınıf *
            </label>
            <Input
              id="profile-grade"
              type="select"
              bind:value={editableUser.grade}
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
          <label class="form-label" for="profile-skillLevel">
            <i class="fas fa-tennis-ball me-1"></i>Tenis Seviyesi *
          </label>
          <Input
            id="profile-skillLevel"
            type="select"
            bind:value={editableUser.skillLevel}
            required
            invalid={validated && !skillLevelValid}
            feedback="Yetenek seviyesi 1 ile 10 arasında olmalıdır"
            on:change={resetValidation}
          >
            <option value="">Seçiniz...</option>
            {#each [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as lvl}
              <option value={lvl}>{lvl}</option>
            {/each}
          </Input>
        </Col>

        <Col md="6">
          <div class="form-label">
            <i class="fas fa-check-circle me-1"></i>E-posta Doğrulama
          </div>
          <div class="form-check form-switch mt-2">
            <input
              class="form-check-input"
              type="checkbox"
              id="profile-email-verified"
              checked={editableUser.isEmailVerified}
              on:change={(e) =>
                (editableUser.isEmailVerified =
                  e.currentTarget.checked)}
            />
            <label
              class="form-check-label small"
              for="profile-email-verified"
            >
              {editableUser.isEmailVerified
                ? "Doğrulanmış"
                : "Doğrulanmamış"}
            </label>
          </div>
        </Col>

        {#if effectiveIsStudent}
          <Col md="6">
            <label class="form-label" for="profile-studentNumber">
              <i class="fas fa-id-card me-1"></i>Öğrenci Numarası
            </label>
            <Input
              id="profile-studentNumber"
              type="number"
              bind:value={editableUser.studentNumber}
              placeholder="12345678"
              invalid={validated && !studentNumberValid}
              feedback="Geçerli bir öğrenci numarası girin"
              on:input={resetValidation}
            />
          </Col>
        {/if}

        <Col md="12">
          <div class="form-label">
            <i class="fas fa-user-tag me-1"></i>
            Roller
            {#if editableUser.roles && editableUser.roles.length > 0}
              <Badge color="info" class="ms-1"
                >{editableUser.roles.length}</Badge
              >
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
                  checked={editableUser.roles?.includes(role.id) ||
                    false}
                  on:change={(e) =>
                    toggleRole(role.id, e.currentTarget.checked)}
                />
                <label
                  class="form-check-label small"
                  for="profile-role-{role.id}"
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
          <label class="form-label" for="profile-notes">
            <i class="fas fa-sticky-note me-1"></i>Notlar
          </label>
          <Input
            id="profile-notes"
            type="textarea"
            rows={3}
            bind:value={editableUser.notes}
            placeholder="Kullanıcı hakkında notlar..."
            on:input={resetValidation}
          />
        </Col>

        <Col md="12" class="d-flex justify-content-end gap-2 mt-3">
          <Button color="primary" type="submit" disabled={isUpdating}>
            {#if isUpdating}
              <LoadingSpinner size="sm" showText={false} />
              <span class="ms-2">Kaydediliyor...</span>
            {:else}
              <i class="fas fa-save me-1"></i>
              Kaydet
            {/if}
          </Button>
        </Col>
      </Form>
    </TabPane>

    <!-- Email Tab -->
    <TabPane tabId="email" tab="E-posta Değiştirme" class="pt-3">
      <Form class="row g-3" on:submit={handleEmailUpdate}>
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
              invalid={emailValidated && !emailValid}
              feedback="E-posta gereklidir ve geçerli olmalıdır"
              on:input={resetEmailValidation}
            />
            <InputGroupText>
              <div class="form-check form-switch m-0">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="profile-email-verified"
                  checked={editableUser.isEmailVerified}
                  on:change={(e) =>
                    (editableUser.isEmailVerified =
                      e.currentTarget.checked)}
                  aria-label="E-posta doğrulama durumu"
                />
              </div>
              <i
                class={`ms-2 fas ${editableUser.isEmailVerified ? "fa-check-circle text-success" : "fa-exclamation-circle text-warning"}`}
                title={editableUser.isEmailVerified
                  ? "Doğrulanmış"
                  : "Doğrulanmamış"}
              ></i>
            </InputGroupText>
          </InputGroup>
        </Col>

        <Col md="12" class="d-flex justify-content-end gap-2 mt-3">
          <Button
            color="primary"
            type="submit"
            disabled={isUpdatingEmail}
          >
            <i
              class={`fas ${isUpdatingEmail ? "fa-spinner fa-spin" : "fa-save"} me-1`}
            ></i>
            {isUpdatingEmail ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </Col>
      </Form>
    </TabPane>

    <!-- Delete Account Tab -->
    <TabPane tabId="delete" tab="Hesap Silme" class="pt-3">
      <div class="tab-description mb-3">
        <h5 class="mb-2">Hesap Silme</h5>
      </div>

      <div class="alert alert-danger">
        <h6 class="alert-heading">
          <i class="fas fa-exclamation-triangle me-1"></i>
          Bu işlem geri alınamaz!
        </h6>
        <p class="mb-3">Hesabı sildiğinizde:</p>
        <ul class="mb-3">
          <li>
            Kişisel veriler silinmeyecek fakat inaktif hale
            getirilecek
          </li>
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
    </TabPane>
  </TabContent>
</SettingCard>

<!-- Delete Confirmation Modal -->
<Modal
  isOpen={deleteConfirmModal}
  toggle={() => (deleteConfirmModal = false)}
  centered
>
  <ModalHeader toggle={() => (deleteConfirmModal = false)}>
    <i class="fas fa-exclamation-triangle text-danger me-2"></i>
    Hesap Silme Onayı
  </ModalHeader>
  <ModalBody>
    <div class="alert alert-danger">
      <h6 class="alert-heading">
        <i class="fas fa-warning me-1"></i>
        DİKKAT: Bu işlem geri alınamaz!
      </h6>
      <p class="mb-0">
        Hesabınızı sildiğinizde tüm verileriniz kalıcı olarak
        kaybolacaktır. Bu işlem geri alınamaz.
      </p>
    </div>

    <p class="mb-3">
      Hesabınızı silmek istediğinizden emin misiniz? Onaylamak için
      tam adınızı yazın:
    </p>

    <Input
      type="text"
      bind:value={deleteConfirmText}
      placeholder="{user.firstName} {user.lastName}"
      class="mb-3"
    />

    <small class="text-muted">
      Yazmanız gereken: <strong
        >{user.firstName} {user.lastName}</strong
      >
    </small>
  </ModalBody>
  <ModalFooter>
    <Button
      color="secondary"
      outline
      on:click={() => (deleteConfirmModal = false)}
    >
      İptal
    </Button>
    <Button
      color="danger"
      disabled={!deleteFormValid || isDeleting}
      on:click={handleAccountDelete}
    >
      <i
        class={`fas ${isDeleting ? "fa-spinner fa-spin" : "fa-trash-alt"} me-1`}
      ></i>
      {isDeleting ? "Siliniyor..." : "Hesabı Sil"}
    </Button>
  </ModalFooter>
</Modal>

<style>
  /* Tab Content Styling */
  .nav-tabs .nav-link {
    padding: 0.75rem 1.5rem;
    color: #6c757d;
    transition: all 0.3s ease;
  }

  .nav-tabs .nav-link:hover {
    color: var(--bs-primary);
  }

  .nav-tabs .nav-link.active {
    color: var(--bs-primary);
  }

  /* Tab Content Styling */
  .tab-description h5 {
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .tab-description p {
    font-size: 0.9rem;
    line-height: 1.5;
  }

  /* Alert Styling */
  .alert {
    border-radius: 0.5rem;
    border: none;
  }

  .alert-info {
    background-color: rgba(13, 202, 240, 0.1);
    color: #0c63e4;
  }

  .alert-danger {
    background-color: rgba(220, 53, 69, 0.1);
    color: #721c24;
  }
  /* Tab Pane Animation */
  .tab-pane {
    animation: fadeIn 0.3s ease-in;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>

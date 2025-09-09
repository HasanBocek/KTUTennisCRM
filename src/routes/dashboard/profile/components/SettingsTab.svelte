<script lang="ts">
  import {
    Button,
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Col,
    Input,
    Row,
    Form,
  } from "@sveltestrap/sveltestrap";
  import {
    DEPARTMENTS,
    GRADES,
    GENDERS,
  } from "$lib/helpers/constants";
  import type { MeType } from "$lib/types/types";
  import departments from "$lib/assets/departments.json";
  import { ProfileService } from "$lib/services/profile/profileService";
  import SettingCard from "$lib/components/SettingCard.svelte";
  import { invalidateAll } from "$app/navigation";
  let isUpdating = false;
  let validated = false;

  // Local editable copy bound to inputs
  export let editableUser: MeType;
  // Clean up if component unmounts

  const nameRegex = /^[a-zA-ZçğıöşüÇĞİÖŞÜ ]+$/;
  const e164Regex = /^\+[1-9]\d{1,14}$/;
  const allowedSkillLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

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
  
  // Improved department validation
  $: departmentValid = !effectiveIsStudent || 
    (editableUser.department && 
     Object.keys(departments).includes(editableUser.department));
  
  $: gradeValid = effectiveIsStudent
    ? GRADES.includes((editableUser?.grade ?? "").toString())
    : (editableUser?.grade ?? "") === "";
  
  $: formValid =
    firstNameValid &&
    lastNameValid &&
    isMaleValid &&
    phoneValid &&
    skillLevelValid &&
    departmentValid &&
    gradeValid;

  function resetValidation() {
    if (validated) validated = false;
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    validated = true;
    
    if (!formValid) return;
    
    isUpdating = true;
    
    try {
      // Use ProfileService to update user profile
      const result = await ProfileService.updateProfile(editableUser);
      
      // Check the result of the update
      if (result.success) {
        invalidateAll();
        validated = false;
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      // Error handling is now managed in the ProfileService
    } finally {
      isUpdating = false;
    }
  }
</script>

<SettingCard title="Kişisel Bilgiler">
  <Form class="row g-3" on:submit={handleSubmit}>
    <Col md="6">
      <label class="form-label" for="profile-firstName"
        ><i class="fas fa-user me-1"></i>Ad *</label
      >
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
      <label class="form-label" for="profile-lastName"
        ><i class="fas fa-user me-1"></i>Soyad *</label
      >
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
      <label class="form-label" for="profile-phone"
        ><i class="fas fa-phone me-1"></i>Telefon *</label
      >
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
      <label class="form-label" for="profile-gender"
        ><i class="fas fa-venus-mars me-1"></i>Cinsiyet *</label
      >
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
        <label class="form-label" for="profile-department"
          ><i class="fas fa-graduation-cap me-1"></i>Bölüm *</label
        >
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
        <label class="form-label" for="profile-grade"
          ><i class="fas fa-layer-group me-1"></i>Sınıf *</label
        >
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
      <label class="form-label" for="profile-skillLevel"
        ><i class="fas fa-tennis-ball me-1"></i>Tenis Seviyesi *</label
      >
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

    <Col md="12" class="d-flex justify-content-end gap-2 mt-2">
      <Button color="primary" type="submit" disabled={isUpdating}>
        <i
          class={`fas fa-${isUpdating ? "spinner fa-spin" : "save"} me-1`}
        ></i>
        {isUpdating ? "Kaydediliyor..." : "Kaydet"}
      </Button>
    </Col>
  </Form>
</SettingCard>
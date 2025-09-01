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
    Badge,
    Toast,
    ToastBody,
  } from "@sveltestrap/sveltestrap";
  import type { GroupType } from "$lib/types/types";
  import type { UserType } from "$lib/types/types";
  import { updateGroup } from "$lib/stores/groupsStore";
  import { UserData } from "$lib/assets/data/mock/data";
  import SettingCard from "$lib/components/SettingCard.svelte";

  export let group: GroupType;
  export let coaches: UserType[] = [];

  let isUpdating = false;
  let validated = false;

  // Toast notifications
  let showSuccessToast = false;
  let toastMessage = "";

  // Local editable copy
  let editableGroup: GroupType;
  let lastGroupId: string | null = null;

  // Initialize editableGroup when group prop changes (only when group ID changes)
  $: if (group && group._id && group._id !== lastGroupId) {
    editableGroup = { ...group };
    if (!editableGroup.schedule) editableGroup.schedule = [];
    if (!editableGroup.payment) {
      editableGroup.payment = {
        amount: 0,
        billingCycle: "Dönemlik",
        includesEquipment: true,
      };
    }
    if (!editableGroup.coaches) editableGroup.coaches = [];
    lastGroupId = group._id;
  } else if (group && group._id && !editableGroup) {
    // Fallback initialization
    editableGroup = { ...group };
    if (!editableGroup.schedule) editableGroup.schedule = [];
    if (!editableGroup.payment) {
      editableGroup.payment = {
        amount: 0,
        billingCycle: "Dönemlik",
        includesEquipment: true,
      };
    }
    if (!editableGroup.coaches) editableGroup.coaches = [];
  }

  // Local non-null alias to satisfy type checker in template bindings
  $: groupPayment = editableGroup?.payment;

  // Calculate current member count
  $: currentMemberCount = editableGroup
    ? UserData.filter((user) =>
        user.memberships?.some(
          (membership) => membership.group._id === editableGroup._id && membership.status === "active"
        )
      ).length
    : 0;

  // Validation functions
  $: nameValid = editableGroup
    ? (editableGroup.name ?? "").trim().length >= 3
    : false;
  $: descriptionValid = editableGroup
    ? (editableGroup.description ?? "").trim().length >= 10
    : false;
  $: maxMembersValid = editableGroup
    ? editableGroup.maxMembers &&
      editableGroup.maxMembers >= currentMemberCount &&
      editableGroup.maxMembers <= 50
    : false;
  $: paymentAmountValid = editableGroup
    ? editableGroup.payment && editableGroup.payment.amount >= 0
    : false;
  $: scheduleValid = editableGroup
    ? editableGroup.schedule &&
      editableGroup.schedule.length > 0 &&
      editableGroup.schedule.every(
        (s) =>
          s.dayOfWeek &&
          s.startTime &&
          s.endTime &&
          s.startTime < s.endTime
      )
    : false;
  $: coachesValid = editableGroup
    ? editableGroup.coaches && editableGroup.coaches.length > 0
    : false;

  $: formValid =
    nameValid &&
    descriptionValid &&
    maxMembersValid &&
    paymentAmountValid &&
    scheduleValid &&
    coachesValid;

  // Handle form submission
  async function handleSubmit(event: Event) {
    event.preventDefault();
    validated = true;

    if (!formValid) {
      return;
    }

    isUpdating = true;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      updateGroup(editableGroup);

      toastMessage = "Grup bilgileri başarıyla güncellendi!";
      showSuccessToast = true;

      // Reset validation state after successful submission
      validated = false;

      setTimeout(() => {
        showSuccessToast = false;
      }, 3000);
    } catch (error) {
      toastMessage = "Güncelleme sırasında bir hata oluştu!";
      showSuccessToast = true;
      // Keep validation state on error so user can see what needs to be fixed
    } finally {
      isUpdating = false;
    }
  }

  function resetValidation() {
    if (validated) validated = false;
  }

  // Add schedule entry
  function addScheduleItem() {
    if (!editableGroup.schedule) editableGroup.schedule = [];
    editableGroup.schedule = [
      ...editableGroup.schedule,
      {
        dayOfWeek: "",
        startTime: "",
        endTime: "",
        duration: NaN,
      },
    ];
  }

  // Remove schedule entry
  function removeScheduleItem(index: number) {
    // Do not allow removing if only one item left
    if (editableGroup.schedule && editableGroup.schedule.length > 1) {
      editableGroup.schedule = editableGroup.schedule.filter(
        (_, i) => i !== index
      );
    }
  }

  function updateScheduleDuration(index: number) {
    if (editableGroup.schedule && editableGroup.schedule[index]) {
      const item = editableGroup.schedule[index];
      if (item.startTime && item.endTime) {
        const [startHour, startMin] = item.startTime
          .split(":")
          .map(Number);
        const [endHour, endMin] = item.endTime.split(":").map(Number);
        const duration =
          endHour * 60 + endMin - (startHour * 60 + startMin);
        editableGroup.schedule[index].duration = duration;
        // Force reactivity so validators recompute
        editableGroup.schedule = [...editableGroup.schedule];
      }
    }
  }

  function touchSchedule() {
    if (editableGroup.schedule) {
      editableGroup.schedule = [...editableGroup.schedule];
    }
  }

  function handleCoachChange(coachId: string, event: Event) {
    if (!editableGroup.coaches) editableGroup.coaches = [];
    const input = event.target as HTMLInputElement;
    const coach = coaches.find((c) => c._id === coachId);
    if (input.checked && coach) {
      if (!editableGroup.coaches.some((c) => c._id === coachId)) {
        // Convert UserType to CoachType
        const coachData = {
          _id: coach._id,
          firstName: coach.firstName || "",
          lastName: coach.lastName || "",
          email: coach.email,
          phoneNumber: coach.phoneNumber,
        };
        editableGroup.coaches = [...editableGroup.coaches, coachData];
      }
    } else {
      editableGroup.coaches = editableGroup.coaches.filter(
        (c) => c._id !== coachId
      );
    }
  }

  function handleMembershipOpenChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    editableGroup.membershipOpen = value === "true";
    resetValidation();
  }

  function handleIncludesEquipmentChange(event: Event) {
    if (!groupPayment) return;
    const value = (event.target as HTMLSelectElement).value;
    groupPayment.includesEquipment = value === "true";
    resetValidation();
  }

  // Day options for schedule
  const daysOfWeek = [
    { value: "Monday", label: "Pazartesi" },
    { value: "Tuesday", label: "Salı" },
    { value: "Wednesday", label: "Çarşamba" },
    { value: "Thursday", label: "Perşembe" },
    { value: "Friday", label: "Cuma" },
    { value: "Saturday", label: "Cumartesi" },
    { value: "Sunday", label: "Pazar" },
  ];
</script>

{#if editableGroup && editableGroup._id}
  <SettingCard title="Grup Ayarları">
    <Form
      id="update-group-form"
      class="row g-3"
      {validated}
      on:submit={handleSubmit}
    >
      <Col md="12">
        <label class="form-label" for="groupName">
          <i class="fas fa-users me-1"></i>Grup Adı *
        </label>
        <Input
          id="groupName"
          type="text"
          bind:value={editableGroup.name}
          required
          invalid={validated && !nameValid}
          feedback="Grup adı en az 3 karakter olmalıdır"
          on:input={resetValidation}
        />
      </Col>

      <Col md="12">
        <label class="form-label" for="description">
          <i class="fas fa-info-circle me-1"></i>Açıklama *
        </label>
        <textarea
          id="description"
          class="form-control"
          rows="3"
          bind:value={editableGroup.description}
          required
          class:is-invalid={validated && !descriptionValid}
          on:input={resetValidation}
        ></textarea>
        {#if validated && !descriptionValid}
          <div class="invalid-feedback">
            Açıklama en az 10 karakter olmalıdır
          </div>
        {/if}
      </Col>

      <Col md="6">
        <label class="form-label" for="maxMembers">
          <i class="fas fa-user-friends me-1"></i>Maksimum Üye Sayısı
          *
          <small class="text-muted"
            >(Mevcut: {currentMemberCount} üye)</small
          >
        </label>
        <Input
          id="maxMembers"
          type="number"
          bind:value={editableGroup.maxMembers}
          min={currentMemberCount}
          max="50"
          required
          invalid={validated && !maxMembersValid}
          on:input={resetValidation}
        />
        {#if validated && !maxMembersValid}
          <div class="invalid-feedback">
            Maksimum üye sayısı mevcut üye sayısından ({currentMemberCount})
            az olamaz ve 50'den fazla olamaz
          </div>
        {/if}
      </Col>

      <Col md="6">
        <label class="form-label" for="membershipOpen">
          <i class="fas fa-door-open me-1"></i>Üyelik Durumu
        </label>
        <Input
          id="membershipOpen"
          type="select"
          value={editableGroup.membershipOpen ? "true" : "false"}
          on:change={handleMembershipOpenChange}
        >
          <option value="true">Açık</option>
          <option value="false">Kapalı</option>
        </Input>
      </Col>

      <!-- Schedule Section -->
      <Col md="12">
        <div class="d-flex align-items-center mb-2">
          <div class="form-label mb-0">
            <i class="fas fa-calendar-alt me-1"></i>Ders Programı *
          </div>
          <Button
            color="primary"
            size="sm"
            class="ms-2"
            on:click={addScheduleItem}
            type="button"
          >
            <i class="fas fa-plus me-1"></i>Ekle
          </Button>
        </div>
        {#if validated && !scheduleValid}
          <div class="text-danger small">
            En az bir tarife eklemelisiniz
          </div>
        {/if}
        {#if editableGroup.schedule && editableGroup.schedule.length > 0}
          {#each editableGroup.schedule as item, index}
            <div class="border rounded p-2 mb-2">
              <div class="row g-2 align-items-center">
                <Col md="3">
                  <Input
                    type="select"
                    bind:value={item.dayOfWeek}
                    required
                    on:change={() => {
                      touchSchedule();
                      resetValidation();
                    }}
                  >
                    <option value="">Gün Seçiniz...</option>
                    {#each daysOfWeek as day}
                      <option value={day.value}>{day.label}</option>
                    {/each}
                  </Input>
                </Col>
                <Col md="3">
                  <Input
                    type="text"
                    bind:value={item.startTime}
                    required
                    placeholder="Başlangıç Saati"
                    on:change={() => {
                      updateScheduleDuration(index);
                      resetValidation();
                    }}
                  />
                </Col>
                <Col md="3">
                  <Input
                    type="text"
                    bind:value={item.endTime}
                    required
                    placeholder="Bitiş Saati"
                    on:change={() => {
                      updateScheduleDuration(index);
                      resetValidation();
                    }}
                  />
                </Col>
                <Col md="2">
                  <Input
                    type="number"
                    bind:value={item.duration}
                    placeholder="Süre (dk)"
                  />
                </Col>
                <Col md="1">
                  <Button
                    color="danger"
                    size="sm"
                    on:click={() => removeScheduleItem(index)}
                    type="button"
                    disabled={editableGroup.schedule.length === 1}
                    title={editableGroup.schedule.length === 1
                      ? "Son program silinemez"
                      : undefined}
                  >
                    <i class="fas fa-trash"></i>
                  </Button>
                </Col>
              </div>
            </div>
          {/each}
        {:else}
          <div class="text-muted">Henüz program eklenmedi</div>
        {/if}
      </Col>

      <!-- Payment Section -->
      <Col md="4">
        <label class="form-label" for="amount">Ücret (TL) *</label>
        <Input
          id="amount"
          type="number"
          bind:value={groupPayment.amount}
          min="0"
          required
          invalid={validated && !paymentAmountValid}
          feedback="Ücret 0 veya daha büyük olmalıdır"
          on:input={resetValidation}
        />
      </Col>

      <Col md="4">
        <label class="form-label" for="billingCycle"
          >Ödeme Periyodu *</label
        >
        <Input
          id="billingCycle"
          type="text"
          bind:value={groupPayment.billingCycle}
          placeholder="Örn. Aylık"
          on:input={resetValidation}
        />
      </Col>

      <Col md="4">
        <label class="form-label" for="includesEquipment"
          >Ekipman Dahil mi?</label
        >
        <Input
          id="includesEquipment"
          type="select"
          value={groupPayment.includesEquipment ? "true" : "false"}
          on:change={handleIncludesEquipmentChange}
        >
          <option value="true">Evet</option>
          <option value="false">Hayır</option>
        </Input>
      </Col>

      <Col md="12">
        <label class="form-label" for="payment-notes"
          >Ödeme Notları</label
        >
        <textarea
          id="payment-notes"
          class="form-control"
          rows="2"
          bind:value={groupPayment.notes}
          placeholder="Ödeme ile ilgili ek notlar..."
        ></textarea>
      </Col>

      <!-- Coaches Section -->
      <Col md="12">
        <label for="coaches" class="form-label">
          <i class="fas fa-chalkboard-teacher me-1"></i>Antrenörler *
          {#if editableGroup.coaches && editableGroup.coaches.length > 0}
            <Badge color="info" class="ms-1"
              >{editableGroup.coaches.length}</Badge
            >
          {/if}
        </label>
        {#if validated && !coachesValid}
          <div class="text-danger small">
            En az bir antrenör seçmelisiniz
          </div>
        {/if}
        <div
          style="max-height: 250px; overflow-y: auto;"
          class="border rounded p-2"
        >
          {#if coaches && coaches.length > 0}
            {#each coaches as coach}
              <div class="form-check mb-2 mt-1">
                <input
                  class="form-check-input"
                  type="checkbox"
                  name="coach"
                  id={`coach-${coach._id}`}
                  checked={editableGroup.coaches &&
                    editableGroup.coaches.some(
                      (c) => c._id === coach._id
                    )}
                  on:change={(e) => handleCoachChange(coach._id, e)}
                />
                <label
                  class="form-check-label"
                  for={`coach-${coach._id}`}
                >
                  <strong>{coach.firstName} {coach.lastName}</strong>
                  {#if coach.email}
                    <small class="text-muted d-block"
                      >{coach.email}</small
                    >
                  {/if}
                </label>
              </div>
            {/each}
          {:else}
            <div class="text-muted">Henüz antrenör bulunmuyor</div>
          {/if}
        </div>
      </Col>

      <Col md="12">
        <label class="form-label" for="notes">
          <i class="fas fa-sticky-note me-1"></i>Genel Notlar
        </label>
        <textarea
          id="notes"
          class="form-control"
          rows="3"
          bind:value={editableGroup.notes}
          placeholder="Grup ile ilgili ek notlar..."
        ></textarea>
      </Col>

      <!-- Submit Button -->
      <Col md="12">
        <div class="d-flex justify-content-end">
          <Button type="submit" color="success" disabled={isUpdating}>
            <i
              class={`fas fa-${isUpdating ? "spinner fa-spin" : "save"} me-1`}
            ></i>
            {isUpdating
              ? "Güncelleniyor..."
              : "Değişiklikleri Kaydet"}
          </Button>
        </div>
      </Col>
    </Form>
  </SettingCard>
{/if}

<!-- Success Toast -->
<Toast
  bind:isOpen={showSuccessToast}
  class="position-fixed top-0 end-0 m-3"
  style="z-index: 9999;"
>
  <ToastBody>
    <div class="d-flex align-items-center">
      <i class="fas fa-check-circle text-success me-2"></i>
      {toastMessage}
    </div>
  </ToastBody>
</Toast>

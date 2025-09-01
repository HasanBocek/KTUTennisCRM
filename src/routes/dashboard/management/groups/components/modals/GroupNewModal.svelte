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
  } from "@sveltestrap/sveltestrap";
  import type { GroupType } from "$lib/types/types";
  import type { CoachType } from "$lib/types/types";
  import { createEventDispatcher } from "svelte";

  export let isOpen: boolean;
  export let newGroup: Partial<GroupType> = {};
  export let isCreating = false;
  export let coaches: CoachType[] = [];

  // Validation state & helpers
  let validated = false;

  // Initialize defaults (ensure on first load)
  if (!newGroup.schedule) newGroup.schedule = [];
  if (!newGroup.payment)
    newGroup.payment = {
      amount: 0,
      billingCycle: "Dönemlik",
      includesEquipment: true,
    };
  if (newGroup.membershipOpen === undefined)
    newGroup.membershipOpen = true;

  // Re-apply sane defaults whenever modal opens
  $: if (isOpen) {
    validated = false;
    if (!newGroup.schedule || newGroup.schedule.length === 0) {
      newGroup.schedule = [
        { dayOfWeek: "", startTime: "", endTime: "", duration: NaN },
      ];
    }
    if (!newGroup.payment) {
      newGroup.payment = {
        amount: 0,
        billingCycle: "Dönemlik",
        includesEquipment: true,
      };
    }
    if (newGroup.membershipOpen === undefined) {
      newGroup.membershipOpen = true;
    }
  }

  // Local non-null alias to satisfy type checker in template bindings
  let groupPayment = newGroup.payment as GroupType["payment"];
  $: groupPayment = newGroup.payment as GroupType["payment"];

  const daysOfWeek = [
    { value: "Monday", label: "Pazartesi" },
    { value: "Tuesday", label: "Salı" },
    { value: "Wednesday", label: "Çarşamba" },
    { value: "Thursday", label: "Perşembe" },
    { value: "Friday", label: "Cuma" },
    { value: "Saturday", label: "Cumartesi" },
    { value: "Sunday", label: "Pazar" },
  ];

  // billingCycle serbest metin olacak; sabit seçenek listesi kaldırıldı

  // Validation functions
  $: nameValid = (newGroup.name ?? "").trim().length >= 3;
  $: descriptionValid =
    (newGroup.description ?? "").trim().length >= 10;
  $: maxMembersValid =
    newGroup.maxMembers &&
    newGroup.maxMembers > 0 &&
    newGroup.maxMembers <= 50;
  $: paymentAmountValid =
    newGroup.payment && newGroup.payment.amount >= 0;
  $: scheduleValid =
    newGroup.schedule &&
    newGroup.schedule.length > 0 &&
    newGroup.schedule.every(
      (s) =>
        s.dayOfWeek &&
        s.startTime &&
        s.endTime &&
        s.startTime < s.endTime
    );
  $: coachesValid = newGroup.coaches && newGroup.coaches.length > 0;

  $: formValid =
    nameValid &&
    descriptionValid &&
    maxMembersValid &&
    paymentAmountValid &&
    scheduleValid &&
    coachesValid;

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

  function addScheduleItem() {
    if (!newGroup.schedule) newGroup.schedule = [];
    newGroup.schedule = [
      ...newGroup.schedule,
      {
        dayOfWeek: "",
        startTime: "",
        endTime: "",
        duration: NaN,
      },
    ];
  }

  function removeScheduleItem(index: number) {
    // Do not allow removing the first row
    if (index === 0) return;
    if (newGroup.schedule) {
      newGroup.schedule = newGroup.schedule.filter(
        (_, i) => i !== index
      );
    }
  }

  function updateScheduleDuration(index: number) {
    if (newGroup.schedule && newGroup.schedule[index]) {
      const item = newGroup.schedule[index];
      if (item.startTime && item.endTime) {
        const [startHour, startMin] = item.startTime
          .split(":")
          .map(Number);
        const [endHour, endMin] = item.endTime.split(":").map(Number);
        const duration =
          endHour * 60 + endMin - (startHour * 60 + startMin);
        newGroup.schedule[index].duration = duration;
        // Force reactivity so validators recompute
        newGroup.schedule = [...newGroup.schedule];
      }
    }
  }

  function touchSchedule() {
    if (newGroup.schedule) {
      newGroup.schedule = [...newGroup.schedule];
    }
  }

  function handleCoachChange(coachId: string, event: Event) {
    if (!newGroup.coaches) newGroup.coaches = [];
    const input = event.target as HTMLInputElement;
    const coach = coaches.find((c) => c._id === coachId);
    if (input.checked && coach) {
      if (!newGroup.coaches.some((c) => c._id === coachId)) {
        newGroup.coaches = [...newGroup.coaches, coach];
      }
    } else {
      newGroup.coaches = newGroup.coaches.filter(
        (c) => c._id !== coachId
      );
    }
  }

  function handleMembershipOpenChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    newGroup.membershipOpen = value === "true";
    resetValidation();
  }

  function handleIncludesEquipmentChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    groupPayment.includesEquipment = value === "true";
    resetValidation();
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
      <h4 class="text-success mb-1">Yeni Grup Oluştur</h4>
    </div>
    <Form
      id="create-group-form"
      class="row g-3"
      {validated}
      on:submit={onSubmit}
    >
      <Col md="12">
        <label class="form-label" for="new-groupName"
          ><i class="fas fa-users me-1"></i>Grup Adı *</label
        >
        <Input
          id="new-groupName"
          type="text"
          bind:value={newGroup.name}
          required
          invalid={validated && !nameValid}
          feedback="Grup adı en az 3 karakter olmalıdır"
          on:input={resetValidation}
        />
      </Col>
      <Col md="12">
        <label class="form-label" for="new-description"
          ><i class="fas fa-info-circle me-1"></i>Açıklama *</label
        >
        <textarea
          id="new-description"
          class="form-control"
          rows="3"
          bind:value={newGroup.description}
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
        <label class="form-label" for="new-maxMembers">
          <i class="fas fa-user-friends me-1"></i>Maksimum Üye Sayısı
          *
        </label>
        <Input
          id="new-maxMembers"
          type="number"
          bind:value={newGroup.maxMembers}
          min="1"
          max="50"
          required
          invalid={validated && !maxMembersValid}
          feedback="Maksimum üye sayısı 1-50 arasında olmalıdır"
          on:input={resetValidation}
        />
      </Col>
      <Col md="6">
        <label class="form-label" for="new-membershipOpen">
          <i class="fas fa-door-open me-1"></i>Üyelik Durumu
        </label>
        <Input
          id="new-membershipOpen"
          type="select"
          value={newGroup.membershipOpen ? "true" : "false"}
          on:change={handleMembershipOpenChange}
        >
          <option value="true">Açık</option>
          <option value="false">Kapalı</option>
        </Input>
      </Col>

      <!-- Schedule Section -->
      <Col md="12">
        <div class="d-flex align-items-center mb-2">
          <label class="form-label mb-0">
            <i class="fas fa-calendar-alt me-1"></i>Ders Programı *
          </label>
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
        {#if newGroup.schedule && newGroup.schedule.length > 0}
          {#each newGroup.schedule as item, index}
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
                    disabled={index === 0}
                    title={index === 0
                      ? "İlk satır silinemez"
                      : undefined}
                  >
                    <i class="fas fa-trash"></i>
                  </Button>
                </Col>
              </div>
            </div>
          {/each}
        {:else}
          <div class="text-muted">Henüz tarife eklenmedi</div>
        {/if}
      </Col>

      <!-- Payment Section -->
      <Col md="4">
        <label class="form-label" for="new-amount">Ücret (TL) *</label
        >
        <Input
          id="new-amount"
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
        <label class="form-label" for="new-billingCycle"
          >Ödeme Periyodu *</label
        >
        <Input
          id="new-billingCycle"
          type="text"
          bind:value={groupPayment.billingCycle}
          placeholder="Örn. Aylık"
          on:input={resetValidation}
        />
      </Col>
      <Col md="4">
        <label class="form-label" for="new-includesEquipment"
          >Ekipman Dahil mi?</label
        >
        <Input
          id="new-includesEquipment"
          type="select"
          value={groupPayment.includesEquipment ? "true" : "false"}
          on:change={handleIncludesEquipmentChange}
        >
          <option value="true">Evet</option>
          <option value="false">Hayır</option>
        </Input>
      </Col>
      <Col md="12">
        <label class="form-label" for="new-payment-notes"
          >Ödeme Notları</label
        >
        <textarea
          id="new-payment-notes"
          class="form-control"
          rows="2"
          bind:value={groupPayment.notes}
          placeholder="Ödeme ile ilgili ek notlar..."
        ></textarea>
      </Col>

      <!-- Coaches Section -->
      <Col md="12">
        <label for="new-coaches" class="form-label">
          <i class="fas fa-chalkboard-teacher me-1"></i>Antrenörler *
          {#if newGroup.coaches && newGroup.coaches.length > 0}
            <Badge color="info" class="ms-1"
              >{newGroup.coaches.length}</Badge
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
                  name="newCoach"
                  id={`new-coach-${coach._id}`}
                  checked={newGroup.coaches &&
                    newGroup.coaches.some((c) => c._id === coach._id)}
                  on:change={(e) => handleCoachChange(coach._id, e)}
                />
                <label
                  class="form-check-label"
                  for={`new-coach-${coach._id}`}
                >
                  <strong>{coach.firstName} {coach.lastName}</strong>
                  {#if coach.phoneNumber}
                    <small class="text-muted d-block"
                      >{coach.phoneNumber}</small
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
        <label class="form-label" for="new-notes">
          <i class="fas fa-sticky-note me-1"></i>Genel Notlar
        </label>
        <textarea
          id="new-notes"
          class="form-control"
          rows="3"
          bind:value={newGroup.notes}
          placeholder="Grup ile ilgili ek notlar..."
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
      form="create-group-form"
      disabled={isCreating}
    >
      <i
        class={`fas fa-${isCreating ? "spinner fa-spin" : "plus"} me-1`}
      ></i>
      {isCreating ? "Oluşturuluyor..." : "Grup Oluştur"}
    </Button>
  </ModalFooter>
</Modal>

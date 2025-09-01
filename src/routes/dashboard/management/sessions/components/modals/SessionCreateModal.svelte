<script lang="ts">
  import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    Form,
    Input,
    Label,
    Col,
    Badge,
  } from "@sveltestrap/sveltestrap";
  import { GroupData } from "$lib/assets/data/mock/data";
  import { UserData } from "$lib/assets/data/mock/data";
  import type {
    CoachType,
    GroupType,
    SessionType,
  } from "$lib/types/types";
  import { createEventDispatcher } from "svelte";

  export let isOpen = false;

  const dispatch = createEventDispatcher();

  let selectedGroupId = "";
  let selectedScheduleIndex = -1;
  let sessionNotes = "";
  let selectedCoaches: string[] = [];
  let isCreating = false;
  let error = "";
  let success = "";
  let statusDirty = false;
  let selectedStatus: "completed" | "cancelled" = "completed";

  // Get available coaches (users with coach role)
  $: coaches = UserData.filter((user) =>
    user.roles?.includes("coach")
  );
  $: selectedGroup = GroupData.find((g) => g._id === selectedGroupId);
  $: selectedSchedule =
    selectedGroup?.schedule[selectedScheduleIndex];

  // Auto-select group coaches when group is selected
  $: if (selectedGroup) {
    selectedCoaches = selectedGroup.coaches.map((coach) => coach._id);
  }

  function closeModal() {
    isOpen = false;
    dispatch("close");
    resetForm();
  }

  function resetForm() {
    selectedGroupId = "";
    selectedScheduleIndex = -1;
    sessionNotes = "";
    selectedCoaches = [];
    error = "";
    success = "";
    statusDirty = false;
    selectedStatus = "cancelled";
  }

  function handleCreateSession() {
    error = "";
    success = "";

    if (!selectedGroupId) {
      error = "Lütfen bir grup seçin";
      return;
    }

    if (selectedScheduleIndex < 0 || !selectedSchedule) {
      error = "Lütfen bir program seçin";
      return;
    }

    if (selectedCoaches.length === 0) {
      error = "Lütfen en az bir antrenör seçin";
      return;
    }

    isCreating = true;

    // Create session start/end based on today's date and selected schedule
    const now = new Date();
    const [startHour, startMinute] = selectedSchedule.startTime
      .split(":")
      .map(Number);
    const [endHour, endMinute] = selectedSchedule.endTime
      .split(":")
      .map(Number);
    const startTime = new Date();
    startTime.setHours(startHour, startMinute, 0, 0);
    const endTime = new Date();
    endTime.setHours(endHour, endMinute, 0, 0);

    // Get group members for attendance
    const groupMembers = UserData.filter((user) =>
      user.memberships?.some(
        (membership) =>
          membership.group._id === selectedGroupId &&
          membership.status === "active"
      )
    );

    const sessionData: Partial<SessionType> = {
      group: selectedGroup as GroupType,
      coaches: selectedCoaches.map(
        (coach) =>
          UserData.find((user) => user._id === coach) as CoachType
      ) as CoachType[],
      status: selectedStatus,
      startTime,
      endTime,
      notes:
        sessionNotes ||
        `${selectedGroup?.name} grup dersi - ${selectedSchedule.dayOfWeek} ${selectedSchedule.startTime}-${selectedSchedule.endTime}`,
      attendance: groupMembers.map((member) => ({
        user: member,
        status: "present" as const,
        note: "",
      })),
      isActive: false,
      createdAt: now,
      updatedAt: now,
    };

    // Simulate API call
    setTimeout(() => {
      const sessionId = `sess-${Date.now()}-${selectedGroupId}`;
      success = "Ders başarıyla oluşturuldu!";
      isCreating = false;

      dispatch("sessionCreated", { sessionId, sessionData });

      closeModal();
    }, 300);
  }

  const getDayName = (day: string) => {
    switch (day) {
      case "Monday":
        return "Pazartesi";
      case "Tuesday":
        return "Salı";
      case "Wednesday":
        return "Çarşamba";
      case "Thursday":
        return "Perşembe";
      case "Friday":
        return "Cuma";
      case "Saturday":
        return "Cumartesi";
      case "Sunday":
        return "Pazar";
      default:
        return day;
    }
  };
</script>

<Modal {isOpen} toggle={closeModal} size="lg" centered scrollable>
  <ModalBody class="p-4">
    <div class="mb-4 text-center">
      <div
        class="bg-success-subtle rounded-circle d-inline-flex p-3 mb-3"
      >
        <i class="fas fa-plus text-success" style="font-size: 2rem;"
        ></i>
      </div>
      <h4 class="text-success mb-1">Yeni Ders Oluştur</h4>
    </div>

    <Form id="create-session-form" class="row g-3">
      <Col md="6">
        <Label for="group">Grup Seçimi *</Label>
        <Input
          type="select"
          id="group"
          bind:value={selectedGroupId}
          disabled={isCreating}
        >
          <option value="">Grup seçin...</option>
          {#each GroupData as group}
            <option value={group._id}>{group.name}</option>
          {/each}
        </Input>
      </Col>

      <!-- Schedule Selection -->
      {#if selectedGroup}
        <Col md="6">
          <Label for="schedule">Program Seçimi *</Label>
          <Input
            type="select"
            id="schedule"
            bind:value={selectedScheduleIndex}
            disabled={isCreating}
          >
            <option value={-1}>Program seçin...</option>
            {#each selectedGroup.schedule as schedule, index}
              <option value={index}>
                {getDayName(schedule.dayOfWeek)} - {schedule.startTime}
                / {schedule.endTime}
                ({schedule.duration} dk)
              </option>
            {/each}
          </Input>
        </Col>
      {:else}
        <Col md="6">
          <Label for="error">Program Seçimi *</Label>
          <Input
            type="text"
            class="text-muted"
            id="error"
            disabled
            value="Lütfen önce bir grup seçiniz"
          />
        </Col>
      {/if}

      <!-- Status Selection (auto suggestion preselected) -->
      <Col md="12">
        <Label for="status">Durum</Label>
        <Input
          id="status"
          type="select"
          bind:value={selectedStatus}
          on:change={() => (statusDirty = true)}
          disabled={isCreating}
        >
          <option value="completed">Tamamlandı</option>
          <option value="cancelled">İptal Edildi</option>
        </Input>
      </Col>

      {#if selectedGroup}
        <Col md="12">
          <label for="new-coaches" class="form-label">
            <i class="fas fa-chalkboard-teacher me-1"></i>Antrenörler
            *
            {#if coaches && coaches.length > 0}
              <Badge color="info" class="ms-1">{coaches.length}</Badge
              >
            {/if}
          </label>
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
                    checked={selectedCoaches.some(
                      (c) => c === coach._id
                    )}
                    bind:group={selectedCoaches}
                    value={coach._id}
                  />
                  <Label
                    class="form-check-label"
                    for={`coach-${coach._id}`}
                  >
                    <strong>{coach.firstName} {coach.lastName}</strong
                    >
                    {#if coach.phoneNumber}
                      <small class="text-muted d-block"
                        >{coach.phoneNumber}</small
                      >
                    {/if}
                  </Label>
                </div>
              {/each}
            {:else}
              <div class="text-muted">Henüz antrenör bulunmuyor</div>
            {/if}
          </div>
        </Col>
      {/if}

      <!-- Session Notes -->
      <Col md="12">
        <Label for="notes">Ders Notları</Label>
        <Input
          type="textarea"
          id="notes"
          bind:value={sessionNotes}
          placeholder="Ders hakkında notlar..."
          rows={3}
          disabled={isCreating}
        />
      </Col>
    </Form>
  </ModalBody>

  <ModalFooter>
    <Button
      color="secondary"
      on:click={closeModal}
      disabled={isCreating}
    >
      <i class="fas fa-times me-1"></i>
      İptal
    </Button>
    <Button
      color="success"
      type="submit"
      form="create-session-form"
      on:click={handleCreateSession}
      disabled={isCreating ||
        !selectedGroupId ||
        selectedScheduleIndex < 0 ||
        selectedCoaches.length === 0}
    >
      <i
        class={`fas fa-${isCreating ? "spinner fa-spin" : "plus"} me-1`}
      ></i>
      {isCreating ? "Ders Oluşturuluyor..." : "Ders Oluştur"}
    </Button>
  </ModalFooter>
</Modal>

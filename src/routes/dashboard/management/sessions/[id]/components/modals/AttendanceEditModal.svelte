<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import {
    Modal,
    ModalBody,
    Button,
    FormGroup,
    Label,
    Row,
  } from "@sveltestrap/sveltestrap";
  import { format } from "date-fns";
  import { tr } from "date-fns/locale";
  import type { SessionType } from "$lib/types/types";

  export let isOpen = false;
  export let session: SessionType | null = null;
  export let currentStatus: string = "";
  export let currentNote: string = "";

  const dispatch = createEventDispatcher();

  let selectedStatus = "";
  let attendanceNote = "";

  const attendanceOptions = [
    { value: "present", label: "Geldi", color: "success", icon: "fas fa-check" },
    { value: "absent", label: "Gelmedi", color: "danger", icon: "fas fa-times" },
    { value: "late", label: "Geç Geldi", color: "warning", icon: "fas fa-clock" },
    { value: "excused", label: "Mazeretli", color: "info", icon: "fas fa-user-check" },
  ];

  $: if (isOpen) {
    selectedStatus = currentStatus || "present";
    attendanceNote = currentNote || "";
  }

  function handleSave() {
    if (!session || !selectedStatus) return;
    dispatch("save", {
      sessionId: session._id,
      status: selectedStatus,
      note: attendanceNote.trim(),
    });
    handleClose();
  }

  function handleClose() {
    selectedStatus = "";
    attendanceNote = "";
    dispatch("close");
  }
</script>

<Modal {isOpen} toggle={handleClose} size="md" centered>
  <ModalBody class="p-4 pb-0">
    <div class="text-center mb-3">
      <h4 class="mb-3">Katılım Durumu Düzenle</h4>
      {#if session}
        <Row class="border-primary border-2 mb-2">
          <div class="text-center">
            <h5 class="mb-1">{session.group.name}</h5>
            <p class="text-muted mb-0">
              <i class="fas fa-clock me-1"></i>
              {format(new Date(session.startTime), "dd MMMM yyyy", { locale: tr })}
              <span class="day-name">{format(new Date(session.startTime), "EEEE", { locale: tr })}</span>
            </p>
          </div>
        </Row>
      {/if}
    </div>
    <!-- Katılım Durumu Seçimi -->
    <FormGroup>
      <div class="row g-2">
        {#each attendanceOptions as option}
          <div class="col-6">
            <label class="attendance-option" class:selected={selectedStatus === option.value}>
              <input type="radio" bind:group={selectedStatus} value={option.value} class="d-none" />
              <div class="option-content text-{option.color}">
                <i class="{option.icon} me-2"></i>
                {option.label}
              </div>
            </label>
          </div>
        {/each}
      </div>
    </FormGroup>

    <!-- Not Alanı -->
    <FormGroup>
      <Label class="fw-bold">
        Katılım Notu <span class="text-muted fw-normal">(isteğe bağlı)</span>
      </Label>
      <textarea
        bind:value={attendanceNote}
        class="form-control"
        rows="3"
        placeholder="Katılım ile ilgili not ekleyebilirsiniz (örn: 15 dk geç geldi, sağlık sorunu, vb.)"
        maxlength="200"
      ></textarea>
      <div class="form-text text-end">{attendanceNote.length}/200 karakter</div>
    </FormGroup>
  </ModalBody>

  <div class="modal-footer">
    <Button color="secondary" on:click={handleClose}>
      <i class="fas fa-times me-1"></i>
      İptal
    </Button>
    <Button color="primary" on:click={handleSave} disabled={!selectedStatus}>
      <i class="fas fa-save me-1"></i>
      Kaydet
    </Button>
  </div>
</Modal>

<style>
  .attendance-option {
    display: block;
    cursor: pointer;
    padding: 12px;
    border: 2px solid var(--bs-border-color);
    border-radius: 8px;
    transition: all 0.2s ease;
    background: var(--bs-light);
  }

  .attendance-option:hover {
    border-color: var(--bs-primary);
    background: var(--bs-primary-bg-subtle);
  }

  .attendance-option.selected {
    border-color: var(--bs-primary);
    background: var(--bs-primary-bg-subtle);
    box-shadow: 0 2px 4px rgba(var(--bs-primary-rgb), 0.2);
  }

  .option-content {
    text-align: center;
    font-weight: 500;
    font-size: 0.9rem;
  }

  .modal-footer {
    border-top: 1px solid var(--bs-border-color);
    padding: 1rem;
  }
</style>


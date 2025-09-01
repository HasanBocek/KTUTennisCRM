<script lang="ts">
  import {
    Modal,
    ModalBody,
    ModalFooter,
    Button,
  } from "@sveltestrap/sveltestrap";
  import type { GroupListType } from "$lib/types/types";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let isOpen = false;
  export let selectedGroup: GroupListType | null = null;
  export let isSubmitting = false;

  let applicationSuccess = false;
  function formatSchedule(
    schedule: GroupListType["schedule"]
  ): string {
    return schedule
      .map((s) => {
        const dayNames: Record<string, string> = {
          Monday: "Pazartesi",
          Tuesday: "Salı",
          Wednesday: "Çarşamba",
          Thursday: "Perşembe",
          Friday: "Cuma",
          Saturday: "Cumartesi",
          Sunday: "Pazar",
        };
        return `${dayNames[s.dayOfWeek] || s.dayOfWeek} ${s.startTime}-${s.endTime}`;
      })
      .join(", ");
  }

  function close() {
    dispatch("close");
  }

  function submit() {
    if (!selectedGroup) return;
    dispatch("submit", { groupId: selectedGroup._id });
  }
</script>

<!-- Application Modal -->
<Modal {isOpen} toggle={close} centered size="lg" scrollable>
  {#if selectedGroup}
    <ModalBody class="p-4">
      <div class="mb-4 text-center">
        <div
          class="bg-success-subtle rounded-circle d-inline-flex p-3 mb-3"
        >
          <i
            class="fas fa-user-plus text-success"
            style="font-size: 2rem;"
          ></i>
        </div>
        <h4 class="text-success mb-1">Grup Başvurusu</h4>
        <p class="text-muted mb-0">
          <i class="fas fa-users me-1"></i>
          {selectedGroup.name}
        </p>
      </div>

      <div class="mb-4">
        <p class="text-muted mb-3">{selectedGroup.description}</p>
        <div class="row g-3">
          <div class="col-md-6">
            <div class="border rounded p-3 h-100">
              <h6 class="text-secondary mb-2">
                <i class="fas fa-calendar-alt me-1"></i>
                Eğitmenler
              </h6>
              <p class="mb-0 small">
                {selectedGroup.coaches
                  .map(
                    (coach) => coach.firstName + " " + coach.lastName
                  )
                  .join(", ")}
              </p>
            </div>
          </div>
          <div class="col-md-6">
            <div class="border rounded p-3 h-100">
              <h6 class="text-secondary mb-2">
                <i class="fas fa-calendar-alt me-1"></i>
                Program
              </h6>
              <p class="mb-0 small">
                {formatSchedule(selectedGroup.schedule)}
              </p>
            </div>
          </div>
          <div class="col-md-6">
            <div class="border rounded p-3 h-100">
              <h6 class="text-secondary mb-2">
                <i class="fas fa-money-bill-wave me-1"></i>
                Ücret
              </h6>
              <p class="mb-0">
                <span class="fw-bold text-primary"
                  >₺{selectedGroup.payment.amount}</span
                >
                <small class="text-muted"
                  >/ {selectedGroup.payment.billingCycle}</small
                >
              </p>
            </div>
          </div>
        </div>

        {#if selectedGroup.payment.notes}
          <div
            class="mt-3 p-3 border-start border-info border-3 bg-info-subtle"
          >
            <small class="text-info">
              <i class="fas fa-info-circle me-1"></i>
              {selectedGroup.payment.notes}
            </small>
          </div>
        {/if}
      </div>
    </ModalBody>
    <ModalFooter class="d-flex justify-content-between">
      <Button color="link" class="text-muted" on:click={close}>
        <i class="fas fa-times me-1"></i>
        İptal
      </Button>
      <div class="d-flex gap-2">
        <Button
          color="primary"
          disabled={isSubmitting ||
            applicationSuccess ||
            (selectedGroup && !selectedGroup.membershipOpen)}
          on:click={submit}
        >
          {#if isSubmitting}
            <span
              class="spinner-border spinner-border-sm me-1"
              role="status"
            ></span>
            Gönderiliyor...
          {:else if applicationSuccess}
            <i class="fas fa-check me-1"></i>
            Gönderildi
          {:else}
            <i class="fas fa-paper-plane me-1"></i>
            Başvuruyu Gönder
          {/if}
        </Button>
      </div>
    </ModalFooter>
  {/if}
</Modal>

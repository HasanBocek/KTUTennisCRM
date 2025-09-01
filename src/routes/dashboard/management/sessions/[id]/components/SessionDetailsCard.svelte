<script lang="ts">
  import {
    FormGroup,
    Label,
    Input,
    Button,
    Row,
    Col,
    Badge,
  } from "@sveltestrap/sveltestrap";
  import type { SessionType } from "$lib/types/types";
  import { UserData } from "$lib/assets/data/mock/data";
  import SettingCard from "$lib/components/SettingCard.svelte";

  // sessionStatus no longer needed
  export let session: SessionType;
  export let isUpdating: boolean = false;
  // isEndingSession removed
  export let onUpdate: (payload: {
    coaches: string[];
    status: string;
    startTime: Date;
    endTime?: Date;
    notes: string;
  }) => void;
  // End session action removed

  // Build coach options from mock users (include phone)
  const coachOptions = UserData.filter((u) =>
    (u.roles ?? []).includes("coach")
  ).map((u) => ({
    id: u._id,
    label: `${u.firstName} ${u.lastName}`,
    phone: u.phoneNumber,
  }));

  // Local editable state initialized from session
  let selectedCoachIds: string[] = session.coaches.map((c) => c._id);
  let selectedStatus: string = (session.status as string) ?? "active";
  function toLocalInputValue(dateLike: Date | string): string {
    const d = new Date(dateLike);
    const pad = (n: number) => `${n}`.padStart(2, "0");
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mi = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
  }

  let startLocal: string = toLocalInputValue(session.startTime);
  let endLocal: string = session.endTime
    ? toLocalInputValue(session.endTime)
    : "";
  let notes: string = session.notes ?? "";

  // Only resync local form state when the session identity changes
  let lastSessionId: string = session._id;
  $: if (session && session._id !== lastSessionId) {
    selectedCoachIds = session.coaches.map((c) => c._id);
    selectedStatus = (session.status as string) ?? "active";
    startLocal = toLocalInputValue(session.startTime);
    endLocal = session.endTime
      ? toLocalInputValue(session.endTime)
      : "";
    notes = session.notes ?? "";
    lastSessionId = session._id;
  }

  function handleCoachChange(coachId: string, event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.checked) {
      if (!selectedCoachIds.includes(coachId)) {
        selectedCoachIds = [...selectedCoachIds, coachId];
      }
    } else {
      selectedCoachIds = selectedCoachIds.filter(
        (id) => id !== coachId
      );
    }
  }

  function handleSave() {
    const payload = {
      coaches: selectedCoachIds,
      status: selectedStatus,
      startTime: new Date(startLocal),
      endTime: endLocal ? new Date(endLocal) : undefined,
      notes: notes,
    };
    onUpdate(payload);
  }
</script>

<SettingCard title="Ders Detayları">
  <Row>
    <Col md="12">
      <FormGroup>
        <label for="new-coaches" class="form-label">
          <i class="fas fa-chalkboard-teacher me-1"></i>Antrenörler
          {#if selectedCoachIds && selectedCoachIds.length > 0}
            <Badge color="info" class="ms-1"
              >{selectedCoachIds.length}</Badge
            >
          {/if}
        </label>
        <div
          style="max-height: 200px; overflow-y: auto;"
          class="border rounded p-2"
        >
          {#if coachOptions && coachOptions.length > 0}
            {#each coachOptions as coach}
              <div class="form-check mb-2 mt-1">
                <input
                  class="form-check-input"
                  type="checkbox"
                  name="sessionCoach"
                  id={`session-coach-${coach.id}`}
                  checked={selectedCoachIds.includes(coach.id)}
                  on:change={(e) => handleCoachChange(coach.id, e)}
                />
                <label
                  class="form-check-label"
                  for={`session-coach-${coach.id}`}
                >
                  <strong>{coach.label}</strong>
                  <small class="text-muted d-block"
                    >{coach.phone || "-"}</small
                  >
                </label>
              </div>
            {/each}
          {:else}
            <div class="text-muted">Henüz antrenör bulunmuyor</div>
          {/if}
        </div>
      </FormGroup>
    </Col>

    <Col md="6">
      <FormGroup>
        <Label>Başlangıç</Label>
        <Input type="datetime-local" bind:value={startLocal} />
      </FormGroup>
    </Col>
    <Col md="6">
      <FormGroup>
        <Label>Bitiş</Label>
        <Input type="datetime-local" bind:value={endLocal} />
      </FormGroup>
    </Col>

    <Col md="12">
      <FormGroup>
        <Label>Durum</Label>
        <Input type="select" bind:value={selectedStatus}>
          <option value="completed">Tamamlandı</option>
          <option value="cancelled">İptal Edildi</option>
        </Input>
      </FormGroup>
    </Col>

    <Col md="12">
      <FormGroup>
        <Label>Ders Notları</Label>
        <Input
          type="textarea"
          bind:value={notes}
          rows={4}
          placeholder="Ders hakkında notlar..."
        />
      </FormGroup>
    </Col>

    <Col md="12" class="d-flex gap-2">
      <Button
        color="primary"
        size="sm"
        on:click={handleSave}
        disabled={isUpdating}
      >
        {#if isUpdating}
          <i class="fas fa-spinner fa-spin me-1"></i>Güncelleniyor...
        {:else}
          <i class="fas fa-save me-1"></i>Güncelle
        {/if}
      </Button>
      <!-- End session action removed by request -->
    </Col>
  </Row>
</SettingCard>

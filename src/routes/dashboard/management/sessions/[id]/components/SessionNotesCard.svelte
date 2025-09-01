<script lang="ts">
  import { Card, CardHeader, CardTitle, CardBody, FormGroup, Input, Button } from "@sveltestrap/sveltestrap";
  export let sessionStatus: string;
  export let editedNotes: string;
  export let isUpdating: boolean = false;
  export let isEndingSession: boolean = false;
  export let onUpdate: () => void;
  export let onEndClick: () => void;
</script>

<Card>
  <CardHeader
    ><CardTitle class="mb-0"
      ><i class="fas fa-sticky-note me-2"></i>Ders Notları</CardTitle
    ></CardHeader
  >
  <CardBody>
    <FormGroup>
      <Input
        type="textarea"
        bind:value={editedNotes}
        placeholder="Ders hakkında notlar..."
        rows={4}
        disabled={sessionStatus === "completed"}
      />
    </FormGroup>
    {#if sessionStatus === "active"}
      <div class="d-flex gap-2">
        <Button
          color="primary"
          size="sm"
          on:click={onUpdate}
          disabled={isUpdating}
        >
          {#if isUpdating}<i class="fas fa-spinner fa-spin me-1"></i>Güncelleniyor...{:else}<i class="fas fa-save me-1"></i>Güncelle{/if}
        </Button>
        <Button
          color="danger"
          size="sm"
          on:click={onEndClick}
          disabled={isUpdating || isEndingSession}
        >
          <i class="fas fa-stop me-1"></i>Dersi Bitir
        </Button>
      </div>
    {/if}
  </CardBody>
</Card>


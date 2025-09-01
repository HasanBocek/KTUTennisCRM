<script lang="ts">
  import { Card, CardBody, Button } from "@sveltestrap/sveltestrap";
  export let onBack: () => void;
</script>

<Card>
  <CardBody class="text-center py-5">
    <i class="fas fa-exclamation-triangle text-warning fa-3x mb-3"></i>
    <h5>Grup Bulunamadı</h5>
    <p class="text-muted">
      Aradığınız grup bulunamadı veya silinmiş olabilir.
    </p>
    <Button color="primary" on:click={onBack}>
      <i class="fas fa-arrow-left me-1"></i>Grup Listesine Dön
    </Button>
  </CardBody>
</Card> 
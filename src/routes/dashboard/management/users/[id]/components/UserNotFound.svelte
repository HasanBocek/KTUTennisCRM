<script lang="ts">
  import { Card, CardBody, Button } from "@sveltestrap/sveltestrap";
  import { goto } from "$app/navigation";
</script>

<Card>
  <CardBody class="text-center py-5">
    <i class="fas fa-exclamation-triangle text-warning fa-3x mb-3"></i>
    <h5>Kullanıcı Bulunamadı</h5>
    <p class="text-muted">
      Aradığınız kullanıcı bulunamadı veya silinmiş olabilir.
    </p>
    <Button color="primary" on:click={() => goto("/dashboard/management/users")}>
      <i class="fas fa-arrow-left me-1"></i>Kullanıcı Listesine Dön
    </Button>
  </CardBody>
</Card> 
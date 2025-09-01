<script lang="ts">
  import { Badge } from "@sveltestrap/sveltestrap";
  
  export let status: string;
  export let variant: 'badge' | 'text' = 'badge';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let showIcon: boolean = false;

  // Status mapping
  const statusConfig = {
    // Attendance statuses
    present: { label: 'Geldi', color: 'success', icon: 'fas fa-check' },
    absent: { label: 'Gelm.', color: 'danger', icon: 'fas fa-times' },
    late: { label: 'Geç', color: 'warning', icon: 'fas fa-clock' },
    excused: { label: 'Maz.', color: 'info', icon: 'fas fa-info-circle' },
    
    // Session statuses
    active: { label: 'Devam Ediyor', color: 'primary', icon: 'fas fa-play' },
    completed: { label: 'Tamamlandı', color: 'success', icon: 'fas fa-check-circle' },
    cancelled: { label: 'İptal', color: 'danger', icon: 'fas fa-ban' },
    
    // Membership statuses
    approvementPending: { label: 'Onay Bekliyor', color: 'warning', icon: 'fas fa-hourglass-half' },
    paymentPending: { label: 'Ödeme Bekliyor', color: 'warning', icon: 'fas fa-credit-card' },
    rejected: { label: 'Reddedildi', color: 'danger', icon: 'fas fa-times-circle' },
    expired: { label: 'Süresi Doldu', color: 'secondary', icon: 'fas fa-calendar-times' },
    
    // Default
    default: { label: 'Bilinmiyor', color: 'secondary', icon: 'fas fa-question' }
  };

  $: config = statusConfig[status as keyof typeof statusConfig] || statusConfig.default;
</script>

{#if variant === 'badge'}
  <Badge color={config.color} class="d-flex align-items-center justify-content-center gap-1">
    {#if showIcon}
      <i class={config.icon}></i>
    {/if}
    {config.label}
  </Badge>
{:else}
  <span class="text-{config.color} d-flex align-items-center gap-1 t">
    {#if showIcon}
      <i class={config.icon}></i>
    {/if}
    {config.label}
  </span>
{/if} 
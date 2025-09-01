<script lang="ts">
    import { layout } from "$lib/stores/layout";
    const logoSm = "/images/logo-sm.png";
</script>

<a href="/" class="logo">
    {#if $layout.leftSideBarSize === 'collapsed'}
        <img src={logoSm} alt="logo-small" class="logo-sm" />
    {:else}
        <img src={logoSm} alt="logo-large" class="logo-lg" />
    {/if}
</a>

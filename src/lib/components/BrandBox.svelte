<script lang="ts">
    import { layout } from "$lib/stores/layout";
    const logoSm = "/images/logo-sm.png";
</script>

<a href="/" class="logo">
        <img src={logoSm} alt="logo-small" class="{$layout.leftSideBarSize === 'collapsed' ? 'logo-sm' : 'logo-lg'}" />
</a>

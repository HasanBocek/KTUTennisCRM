<script lang="ts">

    import type {SubMenus} from "$lib/types/menu";
    import {page} from "$app/stores";
    import {Badge} from "@sveltestrap/sveltestrap";

    const currentRoute = $page.url.pathname
    export let item: SubMenus['item'];
    export let className: SubMenus['className']

</script>

<a
    class={`${className} ${currentRoute === item.url && 'active'}`}
    href={item.url}
>
    {#if item.icon}
        <i class="menu-icon {item.icon}" />
    {/if}
    <span>{item.label}</span>

    {#if item.badge}
        <Badge color="" class="rounded text-success bg-success-subtle ms-1">
            {item.badge.text}
        </Badge>
    {/if}
</a>
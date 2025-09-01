<script lang="ts">

    import {page} from "$app/stores";
    import type {SubMenus} from "$lib/types/menu";
    import {Badge, Collapse} from "@sveltestrap/sveltestrap";
    import {menuItemActive} from "$lib/components/AppMenu/menuActivation";
    import {layout} from "$lib/stores/layout";
    import MenuItem from "$lib/components/AppMenu/MenuItem.svelte";
    import MenuItemWithChildren from "$lib/components/AppMenu/MenuItemWithChildren.svelte"

    const currentRoute = $page.url.pathname

    export let item: SubMenus['item'];
    export let className: SubMenus['className'];
    export let subMenuClassName: SubMenus['subMenuClassName'];
    export const linkClassName: SubMenus['linkClassName'] = '';

    let isOpen = menuItemActive(item.key, currentRoute) ?? false;

    let currentLeftSideBarSize: 'collapsed' | 'default';

    $: {
        const {leftSideBarSize} = $layout;
        currentLeftSideBarSize = leftSideBarSize;
    }

</script>

<li class="{className}">
    <a href={"#"} class={`nav-link ${menuItemActive(item.key, currentRoute) && 'active'}`} tabindex="-1" role="button"
       data-bs-toggle="collapse"
       on:click={() => isOpen = !isOpen} aria-expanded="{isOpen}">
        {#if item.icon}
            <i class="menu-icon {item.icon}"/>
        {/if}

        <span> {item.label}</span>


        {#if item.badge}
            <Badge color="" class="rounded text-success bg-success-subtle ms-1">
                {item.badge.text}
            </Badge>
        {/if}
    </a>

    <Collapse {isOpen} id={item.key} class={currentLeftSideBarSize === 'collapsed' ? 'collapse':''}>
        <ul class="{subMenuClassName}">
            {#each item.children || [] as link (link.key)}
                {#if link.children}
                    <MenuItemWithChildren item={link} className="nav-item"
                                          subMenuClassName="nav flex-column"
                                          linkClassName="nav-link"/>
                {:else}
                    <MenuItem item={link} className="nav-item" linkClassName="nav-link"/>
                {/if}
            {/each}
        </ul>
    </Collapse>
</li>
<script lang="ts">
    import type {MenuItemType} from "$lib/types/menu";
    import MenuItemWithChildren from "$lib/components/AppMenu/MenuItemWithChildren.svelte";
    import MenuItem from "$lib/components/AppMenu/MenuItem.svelte";

    export let menuItems: Array<MenuItemType>
</script>

<ul class="navbar-nav mb-auto w-100">
    {#each menuItems || [] as item,idx}

        {#if (item.isTitle)}
            <li class="menu-label {!idx ? 'pt-0 mt-0' : 'mt-2'}">
                <small class="label-border">
                    <div class="border_left hidden-xs"></div>
                    <div class="border_right"></div>
                </small>
                <span>{item.label}</span>
            </li>

        {:else }
            {#if (item.children)}
                <MenuItemWithChildren item={item} className='nav-item' linkClassName='nav-link'
                                      subMenuClassName='nav flex-column'/>
            {:else}
                <MenuItem item={item} linkClassName="nav-link" className="nav-item"/>
            {/if}
        {/if}
    {/each}
</ul>
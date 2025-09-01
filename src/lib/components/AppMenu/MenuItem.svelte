<script lang="ts">

    import type {SubMenus} from "$lib/types/menu";
    import MenuItemLink from "$lib/components/AppMenu/MenuItemLink.svelte";

    export let item: SubMenus['item'];
    export let className: SubMenus['className'];

    export let linkClassName: SubMenus['linkClassName'];
</script>

<li class={className}>
    <MenuItemLink item={item} className={linkClassName}/>
</li>
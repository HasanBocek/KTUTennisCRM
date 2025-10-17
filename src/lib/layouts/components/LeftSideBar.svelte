<script lang="ts">
  import "simplebar";
  import BrandBox from "$lib/components/BrandBox.svelte";
  import {
    getMenuItems,
    filterMenuByPermissions,
  } from "$lib/helpers/menu";
  import AppMenu from "$lib/components/AppMenu/index.svelte";
  import { layout, setLeftSideBarSize } from "$lib/stores/layout";
  import { onMount, onDestroy } from "svelte";
  import { browser } from "$app/environment";
  import { page } from "$app/stores";
  import type { MenuItemType } from "$lib/types/menu";

  let currentLeftSideBarSize: "collapsed" | "default";
  let menuItems: MenuItemType[] = [];

  layout.subscribe((value) => {
    currentLeftSideBarSize = value.leftSideBarSize;
  });

  // Filter menu items based on permissions from server
  $: {
    const permissions: string[] = $page.data.permissions || [];
    menuItems = filterMenuByPermissions(getMenuItems(), permissions);
  }

  const adjustLayout = () => {
    if (browser && window.innerWidth <= 1140) {
      return setLeftSideBarSize("collapsed");
    } else {
      return setLeftSideBarSize(
        currentLeftSideBarSize === "collapsed"
          ? "default"
          : currentLeftSideBarSize
      );
    }
  };

  onMount(() => {
    if (browser) {
      adjustLayout();
      document.addEventListener("resize", adjustLayout);
    }
  });

  onDestroy(() => {
    if (browser) {
      document.removeEventListener("resize", adjustLayout);
    }
  });
</script>

<div class="startbar shadow-sm d-print-none" id="startbar">
  <div class="startbar-menu">
    <div class="brand">
      <BrandBox />
    </div>
    <div
      class="startbar-collapse"
      id="startbarCollapse"
      data-simplebar
    >
      <div class="d-flex align-items-start flex-column w-100">
        <AppMenu {menuItems} />
        <!-- <div class="update-msg text-center">
                    <div
                            class="d-flex justify-content-center align-items-center thumb-lg update-icon-box rounded-circle mx-auto">
                        <i class="iconoir-peace-hand h3 align-self-center mb-0 text-primary"></i>
                    </div>
                    <h5 class="mt-3">title</h5>
                    <p class="mb-3 text-muted">description</p>
                    <a href={"#"} class="btn text-primary shadow-sm rounded-pill">link</a>
                </div> -->
      </div>
    </div>
  </div>
</div>
<!--<div class="startbar-overlay d-print-none"></div>-->

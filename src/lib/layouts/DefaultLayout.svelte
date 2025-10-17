<script lang="ts">
  import TopBar from "$lib/layouts/components/TopBar.svelte";
  import Footer from "$lib/layouts/components/Footer.svelte";
  import LeftSideBar from "$lib/layouts/components/LeftSideBar.svelte";
  import { layout, setLeftSideBarSize } from "$lib/stores/layout";
  import { onMount, onDestroy } from "svelte";
  import { browser } from "$app/environment";
  import type { MeType, GroupType, UserType } from "$lib/types/types";

  export let user: MeType;
  export let targetGroup: GroupType | null = null;
  export let targetUser: UserType | null = null;
  let currentLeftSideBarSize: "collapsed" | "default";
  let isMobile: boolean = false; // Default for SSR

  $: {
    const { leftSideBarSize } = $layout;
    currentLeftSideBarSize = leftSideBarSize;
    if (browser) {
      isMobile = window.innerWidth <= 1024;

      // Add startbar-enable class when sidebar is open on mobile
      if (isMobile && currentLeftSideBarSize === "default") {
        document.body.classList.add("startbar-enable");
      } else {
        document.body.classList.remove("startbar-enable");
      }
    }
  }

  function handleClickOutside(event: MouseEvent) {
    // No need for browser check here as isMobile implicitly handles it

    const sidebarElement = document.getElementById("startbar");
    const topbarToggleButton = document.getElementById("togglemenu");

    // Check if the sidebar is open, it's a mobile view, and the click is outside the sidebar AND not on the toggle button itself
    if (
      currentLeftSideBarSize === "default" &&
      isMobile &&
      sidebarElement &&
      !sidebarElement.contains(event.target as Node) &&
      topbarToggleButton &&
      !topbarToggleButton.contains(event.target as Node)
    ) {
      setLeftSideBarSize("collapsed");
    }
  }

  const handleResize = () => {
    isMobile = window.innerWidth <= 1024;
  };

  onMount(() => {
    // Only add event listener if in browser, for reactivity `isMobile` handles window.innerWidth
    if (browser) {
      window.addEventListener("resize", handleResize);
      document.addEventListener("click", handleClickOutside);
    }
  });

  onDestroy(() => {
    if (browser) {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("click", handleClickOutside);
    }
  });
</script>

<TopBar user={user} targetGroup={targetGroup} targetUser={targetUser} />

<LeftSideBar />

{#if currentLeftSideBarSize === "default" && isMobile}
  <div
    class="startbar-overlay"
    on:click={handleClickOutside}
    aria-hidden="true"
  ></div>
{/if}

<div class="page-wrapper">
  <div class="page-content">
    <div class="mb-3 container-xxl">
      <slot />
    </div>

    <Footer />
  </div>
</div>

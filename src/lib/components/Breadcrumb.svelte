<script lang="ts">
  import { page } from "$app/stores";
  import { breadcrumbTranslations } from "$lib/helpers/breadcrumbTranslations";
  import type { UserType } from "$lib/types/types";
  import type { GroupType } from "$lib/types/types";

  export let targetUser: UserType | null = null;
  export let targetGroup: GroupType | null = null;

  let currentPath: string = "";
  let segments: string[] = [];

  $: currentPath = $page.url.pathname;
  $: segments = currentPath.split("/").filter(Boolean);

  // Dynamic segment display logic
  function getSegmentDisplay(segment: string, index: number): string {
    // Check if this is a group ID (previous segment is "groups")
    if (index > 0 && segments[index - 1] === "groups" && targetGroup) {
      return targetGroup.name;
    }
    
    if (index > 0 && segments[index - 1] === "users" && targetUser) {
      const fullName = `${targetUser.firstName || ""} ${targetUser.lastName || ""}`.trim();
      return fullName || `Kullanıcı ${segment}`;
    }

    // Use translation or fallback to segment
    return breadcrumbTranslations[segment] ?? segment;
  }
</script>

<nav aria-label="breadcrumb">
    <ol class="breadcrumb">
        {#each segments as segment, i}
            <li
                class="breadcrumb-item {i === segments.length - 1
                    ? 'active'
                    : ''}"
                aria-current="page"
            >
                <span class="text-muted">
                    {getSegmentDisplay(segment, i)}
                </span>
            </li>
        {/each}
    </ol>
</nav>
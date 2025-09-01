<script lang="ts">
    import { page } from "$app/stores";
  import { breadcrumbTranslations } from "$lib/helpers/breadcrumbTranslations";
  import { getGroupById } from "$lib/stores/groupsStore";
  import { getUserById } from "$lib/stores/usersStore";

  let currentPath: string = "";
  let segments: string[] = [];

  $: currentPath = $page.url.pathname;
  $: segments = currentPath.split("/").filter(Boolean);

  // Dynamic segment display logic
  function getSegmentDisplay(segment: string, index: number): string {
    // Check if this is a group ID (previous segment is "groups")
    if (index > 0 && segments[index - 1] === "groups") {
      const group = getGroupById(segment);
      return group ? group.name : segment;
    }
    
    if (index > 0 && segments[index - 1] === "users") {
      const user = getUserById(segment);
      if (user) {
        const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
        return fullName || `Kullanıcı ${segment}`;
      }
      return `Kullanıcı ${segment}`;
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
<script lang="ts">
    import { Badge } from "@sveltestrap/sveltestrap";
    import { getRoleById, getRoleNameById, getRoleColorById } from "$lib/types/role";

    export let roleId: string;
    export let showDescription: boolean = false;
    export let size: "sm" | "md" | "lg" = "md";
    export let variant: "badge" | "text" | "pill" = "badge";

    $: role = getRoleById(roleId);
    $: roleName = getRoleNameById(roleId);
    $: roleColor = getRoleColorById(roleId);

    // Convert hex color to a more readable text color
    function getContrastColor(hexColor: string): string {
        // Remove the # if present
        const hex = hexColor.replace('#', '');
        
        // Convert to RGB
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        // Calculate luminance
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        
        // Return black or white based on luminance
        return luminance > 0.5 ? '#000000' : '#ffffff';
    }

    $: textColor = getContrastColor(roleColor);
</script>

{#if variant === "badge"}
    <Badge 
        color="custom" 
        size={size}
        style="background-color: {roleColor}; color: {textColor}; border: 1px solid {roleColor};"
        title={showDescription && role ? role.description : roleName}
    >
        {roleName}
    </Badge>
{:else if variant === "text"}
    <span 
        style="color: {roleColor}; font-weight: 500;"
        title={showDescription && role ? role.description : roleName}
    >
        {roleName}
    </span>
{:else if variant === "pill"}
    <span 
        class="badge rounded-pill"
        style="background-color: {roleColor}; color: {textColor}; padding: 0.375rem 0.75rem; font-size: 0.875rem;"
        title={showDescription && role ? role.description : roleName}
    >
        {roleName}
    </span>
{/if} 
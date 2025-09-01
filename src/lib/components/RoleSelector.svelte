<script lang="ts">
    import { ROLES, getRoleById } from "$lib/types/role";

    export let selectedRoleId: string = "";
    export let disabled: boolean = false;
    export let required: boolean = false;
    export let placeholder: string = "Rol seçiniz...";
    export let showDescription: boolean = false;
    export let size: "sm" | "md" | "lg" = "md";
    export let excludeRoles: string[] = [];

    $: availableRoles = ROLES.filter(role => !excludeRoles.includes(role.id));
    $: selectedRole = getRoleById(selectedRoleId);
</script>

<div class="role-selector">
    <select
        class="form-select form-select-{size}"
        bind:value={selectedRoleId}
        {disabled}
        {required}
    >
        <option value="" disabled={required}>
            {placeholder}
        </option>
        {#each availableRoles as role}
            <option value={role.id}>
                {role.name}
            </option>
        {/each}
    </select>
    
    {#if showDescription && selectedRole}
        <small class="form-text text-muted mt-1">
            {selectedRole.description}
        </small>
    {/if}
</div> 
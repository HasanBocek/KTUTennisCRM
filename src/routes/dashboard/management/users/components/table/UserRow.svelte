<script lang="ts">
  import { Badge } from "@sveltestrap/sveltestrap";
  import { goto } from "$app/navigation";
  import RoleBadge from "$lib/components/RoleBadge.svelte";
  import type { UserType } from "$lib/types/types";
  import { createEventDispatcher } from "svelte";
  import { getRoleById } from "$lib/types/role";

  export let user: UserType;

  const dispatch = createEventDispatcher();

  // En yüksek seviye rolü hesapla (daha okunabilir)
  function getHighestLevelRoleId(userRoles: string[] | undefined) {
    if (!userRoles || userRoles.length === 0) return undefined;
    const rolesSorted = userRoles
      .map((roleId) => getRoleById(roleId))
      .filter((role) => role !== undefined)
      .sort((a, b) => (b?.level || 0) - (a?.level || 0));
    return rolesSorted[0]?.id;
  }

  $: highestLevelRoleId = getHighestLevelRoleId(user.roles);

  function openActions() {
    dispatch("openActions", user);
  }

  function redirectToProfile() {
    goto(`/dashboard/management/users/${user._id}`);
  }
</script>

<tr>
  <td class="text-truncate">
    <a
      href={`/dashboard/management/users/${user._id}`}
      class="btn btn-link p-0 fw-medium text-decoration-none text-primary text-truncate"
    >
      {user.firstName || "Veri"}
      {user.lastName || "Yok"}
    </a>
    <br />
    <small class="text-muted text-truncate">
      {user.isMale == "1" ? "Erkek" : "Kadın"}
    </small>
  </td>
  <td class="d-none d-md-table-cell text-truncate"
    >{user.studentNumber || "Veri Yok"}</td
  >
  <td class="text-truncate">{user.phoneNumber || "Veri Yok"}</td>
  <td class="d-none d-md-table-cell text-truncate">
    <span
      class="text-truncate d-inline-block"
      style="max-width: 150px;"
    >
      {user.email || "Veri Yok"}
    </span>
    {#if user.isEmailVerified}
      <i
        class="fas fa-check-circle text-success ms-1"
        title="E-posta doğrulandı"
      ></i>
    {:else}
      <i
        class="fas fa-exclamation-circle text-warning ms-1"
        title="E-posta doğrulanmadı"
      ></i>
    {/if}
  </td>
  <td class="d-none d-lg-table-cell text-center text-truncate">
    {#if highestLevelRoleId}
      <RoleBadge roleId={highestLevelRoleId} variant="text" />
    {:else}
      <span class="text-muted">Rol Yok</span>
    {/if}
  </td>
  <td class="d-none d-lg-table-cell text-truncate">
    {#if user.memberships}
      <div class="text-truncate">
        {#each user.memberships as membership}
            <Badge
              class="bg-info-subtle text-info text-decoration-none p-1 me-1"
              >{membership.group.name} - {#if membership.status === "active"}
                <span class="text-success">Aktif</span>
              {:else if membership.status === "paymentPending"}
                <span class="text-warning">Ödeme Bekliyor</span>
              {:else if membership.status === "approvementPending"}
                <span class="text-warning">Beklemede</span>
              {:else if membership.status === "rejected"}
                <span class="text-danger">Reddedildi</span>
              {:else if membership.status === "expired"}
                <span class="text-danger">Süresi Doldu</span>
              {/if}</Badge
            >
        {/each}
      </div>
    {:else}
      <span class="text-muted">Grup Yok</span>
    {/if}
  </td>
  <td class="text-center text-muted">
    <button
      type="button"
      class="btn btn-link p-0 text-muted"
      on:click={openActions}
      title="Düzenle"
      aria-label="Kullanıcı ayarlarını düzenle"
    >
      <i class="fas fa-edit"></i>
    </button>
  </td>
</tr>

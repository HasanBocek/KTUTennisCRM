<script lang="ts">
  import DefaultLayout from "$lib/layouts/DefaultLayout.svelte";
  import { Row, Col } from "@sveltestrap/sveltestrap";
  import UserInfo from "./components/UserInfo.svelte";
  import UserDetails from "./components/UserDetails.svelte";
import UserTabs from "./components/UserTabs.svelte";
  import UserNotFound from "./components/UserNotFound.svelte";
  import {
    initializeUsers,
    usersStore,
  } from "$lib/stores/usersStore";
  import { UserData } from "$lib/assets/data/mock/data";
  import { goto } from "$app/navigation";
  import type { MeType, UserType } from "$lib/types/types";
  export let data: {
    user: MeType,
    targetUser: UserType;
  };

  // Initialize users store
  initializeUsers(UserData);

  // Get user reactively from store instead of static data
  $: targetUser =
    $usersStore.find((u) => u._id === data.targetUser?._id) || data.targetUser;

  function handleBackToUsers() {
    goto("/dashboard/management/users");
  }
</script>

<DefaultLayout user={data.user}>
  {#if !targetUser}
    <Row>
      <Col>
        <UserNotFound onBack={handleBackToUsers} />
      </Col>
    </Row>
  {:else}
    <Row class="justify-content-center">
                  <UserInfo user={targetUser} />
    </Row>

    <Row class="justify-content-center">
      <UserDetails user={targetUser} />
      <UserTabs user={targetUser} />
    </Row>
  {/if}
</DefaultLayout>

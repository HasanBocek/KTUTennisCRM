<script lang="ts">
  import DefaultLayout from "$lib/layouts/DefaultLayout.svelte";
  import { Row, Col } from "@sveltestrap/sveltestrap";
  import UserInfo from "./components/UserInfo.svelte";
  import UserDetails from "./components/UserDetails.svelte";
import UserTabs from "./components/UserTabs.svelte";
  import UserNotFound from "./components/UserNotFound.svelte";
  import type { PageData } from "./$types";
  import {
    initializeUsers,
    usersStore,
  } from "$lib/stores/usersStore";
  import { UserData } from "$lib/assets/data/mock/data";
  import { goto } from "$app/navigation";

  export let data: PageData;

  // Initialize users store
  initializeUsers(UserData);

  // Get user reactively from store instead of static data
  $: user =
    $usersStore.find((u) => u._id === data.user?._id) || data.user;

  function handleBackToUsers() {
    goto("/dashboard/management/users");
  }
</script>

<DefaultLayout>
  {#if !user}
    <Row>
      <Col>
        <UserNotFound onBack={handleBackToUsers} />
      </Col>
    </Row>
  {:else}
    <Row class="justify-content-center">
                  <UserInfo {user} />
    </Row>

    <Row class="justify-content-center">
      <UserDetails {user} />
      <UserTabs {user} />
    </Row>
  {/if}
</DefaultLayout>

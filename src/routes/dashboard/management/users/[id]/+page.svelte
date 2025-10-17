<script lang="ts">
  import DefaultLayout from "$lib/layouts/DefaultLayout.svelte";
  import { Row, Col } from "@sveltestrap/sveltestrap";
  import UserInfo from "./components/UserInfo.svelte";
  import UserDetails from "./components/UserDetails.svelte";
  import UserTabs from "./components/UserTabs.svelte";
  import UserNotFound from "./components/UserNotFound.svelte";
  import { usersStore } from "$lib/stores/usersStore";
  import type { MeType, SessionType, UserType } from "$lib/types/types";
  export let data: {
    user: MeType;
    sessions: SessionType[];
    targetUser: UserType;
  };

  // Get user reactively from store instead of static data
  $: targetUser =
    $usersStore.find((u) => u._id === data.targetUser?._id) ||
    data.targetUser;
</script>

<DefaultLayout user={data.user} targetUser={targetUser}>
  {#if !targetUser}
    <Row>
      <Col>
        <UserNotFound />
      </Col>
    </Row>
  {:else}
    <Row class="justify-content-center">
      <UserInfo user={targetUser} sessionsData={data.sessions} />
    </Row>

    <Row class="justify-content-center">
      <UserDetails user={targetUser} />
      <UserTabs user={targetUser} sessionsData={data.sessions} />
    </Row>
  {/if}
</DefaultLayout>

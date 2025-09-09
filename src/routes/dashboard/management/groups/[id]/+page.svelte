<script lang="ts">
  import DefaultLayout from "$lib/layouts/DefaultLayout.svelte";
  import { Row, Col } from "@sveltestrap/sveltestrap";
  import GroupInfo from "./components/GroupInfo.svelte";
  import GroupDetails from "./components/GroupDetails.svelte";
  import GroupTabs from "./components/GroupTabs.svelte";
  import GroupNotFound from "./components/GroupNotFound.svelte";
  import {
    initializeGroups,
    groupsStore,
  } from "$lib/stores/groupsStore";
  import { GroupData } from "$lib/assets/data/mock/data";
  import { goto } from "$app/navigation";
  import type { MeType, GroupType } from "$lib/types/types";
  export let data: {
    user: MeType;
    id: string;
    group: GroupType;
  };

  // Initialize groups store
  initializeGroups(GroupData);

  // Get group reactively from store instead of static data
  $: data.group =
    $groupsStore.find((g) => g._id === data.id) ||
    data.group;
  function handleBackToGroups() {
    goto("/dashboard/management/groups");
  }
</script>

<DefaultLayout user={data.user}>
  {#if !data.group}
    <Row>
      <Col>
        <GroupNotFound onBack={handleBackToGroups} />
      </Col>
    </Row>
  {:else}
    <Row class="justify-content-center">
      <GroupInfo group={data.group} />
    </Row>

    <Row class="justify-content-center">
      <GroupDetails group={data.group} />
      <GroupTabs group={data.group} />
    </Row>
  {/if}
</DefaultLayout>

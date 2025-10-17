<script lang="ts">
  import DefaultLayout from "$lib/layouts/DefaultLayout.svelte";
  import { Row, Col } from "@sveltestrap/sveltestrap";
  import GroupInfo from "./components/GroupInfo.svelte";
  import GroupDetails from "./components/GroupDetails.svelte";
  import GroupTabs from "./components/GroupTabs.svelte";
  import GroupNotFound from "./components/GroupNotFound.svelte";
  import {
    groupsStore,
  } from "$lib/stores/groupsStore";
  import { goto } from "$app/navigation";
  import type { MeType, GroupType } from "$lib/types/types";
  export let data: {
    user: MeType;
    id: string;
    group: GroupType;
  };

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

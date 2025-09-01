<script lang="ts">
  import { Col, TabContent, TabPane } from "@sveltestrap/sveltestrap";
  import GroupMemberships from "./GroupMemberships.svelte";
import GroupAttendance from "./GroupAttendance.svelte";
import GroupSettings from "./GroupSettings.svelte";
  import type { GroupType } from "$lib/types/types";
  import {
    coachesStore,
    initializeUsers,
  } from "$lib/stores/usersStore";
  import { UserData } from "$lib/assets/data/mock/data";

  export let group: GroupType;

  // Initialize users store if not already done
  initializeUsers(UserData);
</script>

<Col md="8">
  <TabContent class="mb-3">
    <TabPane active tabId="members" tab="Üyeler" class="pt-3">
      <GroupMemberships {group} />
    </TabPane>
    <TabPane tabId="attendance" tab="Devam" class="pt-3">
      <GroupAttendance {group} />
    </TabPane>
    <TabPane tabId="settings" tab="Grup Ayarları" class="pt-3">
      <GroupSettings {group} coaches={$coachesStore} />
    </TabPane>
  </TabContent>
</Col>

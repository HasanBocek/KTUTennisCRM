<script lang="ts">

    import {Col, TabContent, TabPane} from "@sveltestrap/sveltestrap";
    import MembershipsTab from "./MembershipsTab.svelte";
    import SettingsTab from "./SettingsTab.svelte";
    import type { MeType } from "$lib/types/types";
    export let user: MeType;
</script>

<Col md="8">

    <TabContent class="mb-3">
        <TabPane active tabId="memberships" tab="Üyelikler" class="pt-3">
            <MembershipsTab {user}/>
        </TabPane>
        <TabPane tabId="settings" tab="Profil Ayarları" class="pt-3">
            <SettingsTab editableUser={user}/>
        </TabPane>
    </TabContent>

</Col>  
<script lang="ts">
    import {Col, TabContent, TabPane} from "@sveltestrap/sveltestrap";
    import UserMemberships from "./UserMemberships.svelte";
import UserSettings from "./UserSettings.svelte";
    import type { UserType, SessionType } from "$lib/types/types";

    export let user: UserType;
    export let sessionsData: SessionType[];
</script>

<Col md="8">

    <TabContent class="mb-3">
        <TabPane active tabId="memberships" tab="Üyelikler" class="pt-3">
            <UserMemberships {user} {sessionsData}/>
        </TabPane>
        <TabPane tabId="settings" tab="Profil Ayarları" class="pt-3">
            <UserSettings {user}/>
        </TabPane>
    </TabContent>

</Col>  
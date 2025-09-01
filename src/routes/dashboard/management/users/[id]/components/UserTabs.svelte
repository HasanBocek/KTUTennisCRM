<script lang="ts">
    import {Col, TabContent, TabPane} from "@sveltestrap/sveltestrap";
    import UserMemberships from "./UserMemberships.svelte";
import UserSettings from "./UserSettings.svelte";
    import type { UserType } from "$lib/types/types";

    export let user: UserType;
</script>

<Col md="8">

    <TabContent class="mb-3">
        <TabPane active tabId="memberships" tab="Üyelikler" class="pt-3">
            <UserMemberships {user}/>
        </TabPane>
        <TabPane tabId="settings" tab="Profil Ayarları" class="pt-3">
            <UserSettings {user}/>
        </TabPane>
    </TabContent>

</Col>  
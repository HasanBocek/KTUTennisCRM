<script lang="ts">
    import DefaultLayout from "$lib/layouts/DefaultLayout.svelte";
    import {Row, Col} from "@sveltestrap/sveltestrap";
    import GroupInfo from "./components/GroupInfo.svelte";
    import GroupDetails from "./components/GroupDetails.svelte";
import GroupTabs from "./components/GroupTabs.svelte";
    import GroupNotFound from "./components/GroupNotFound.svelte";
    import type { PageData } from './$types';
    import { initializeGroups, groupsStore } from "$lib/stores/groupsStore";
    import { GroupData } from "$lib/assets/data/mock/data";
    import { goto } from "$app/navigation";

    export let data: PageData;
    
    // Initialize groups store
    initializeGroups(GroupData);
    
    // Get group reactively from store instead of static data
    $: group = $groupsStore.find(g => g._id === data.group?._id) || data.group;

    function handleBackToGroups() {
        goto("/dashboard/management/groups");
    }
</script>
    
<DefaultLayout>
    {#if !group}
        <Row>
            <Col>
                <GroupNotFound onBack={handleBackToGroups} />
            </Col>
        </Row>
    {:else}
        <Row class="justify-content-center">
            <GroupInfo {group}/>
        </Row>
    
        <Row class="justify-content-center">
                    <GroupDetails {group}/>
        <GroupTabs {group}/>
        </Row>
    {/if}
</DefaultLayout>
<script lang="ts">
    import DefaultLayout from "$lib/layouts/DefaultLayout.svelte";
    import type { MeType } from "$lib/types/types";
    export let data: { user: MeType };
</script>

<DefaultLayout user={data.user}>

</DefaultLayout>
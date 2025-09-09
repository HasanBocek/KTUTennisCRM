<script lang="ts">
  import DefaultLayout from "$lib/layouts/DefaultLayout.svelte";
  import { Row } from "@sveltestrap/sveltestrap";
  import type { MeType } from "$lib/types/types";
  import ProfileInfo from "./components/ProfileInfo.svelte";
  import PersonalInformation from "./components/PersonalInformation.svelte";
  import ProfileTabs from "./components/ProfileTabs.svelte";
  export let data: {
    user: MeType;
  };
</script>

<DefaultLayout user={data.user}>
  <Row class="justify-content-center">
    <ProfileInfo user={data.user} />
  </Row>

  <Row class="justify-content-center">
    <PersonalInformation user={data.user} />
    <ProfileTabs user={data.user} />
  </Row>
</DefaultLayout>

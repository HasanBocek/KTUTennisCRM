<script lang="ts">
  import DefaultLayout from "$lib/layouts/DefaultLayout.svelte";
  import { Row } from "@sveltestrap/sveltestrap";
  import ProfileInfo from "./components/ProfileInfo.svelte";
  import PersonalInformation from "./components/PersonalInformation.svelte";
  import ProfileTabs from "./components/ProfileTabs.svelte";
</script>

<DefaultLayout>
  <Row class="justify-content-center">
    <ProfileInfo />
  </Row>

  <Row class="justify-content-center">
    <PersonalInformation />
    <ProfileTabs />
  </Row>
</DefaultLayout>

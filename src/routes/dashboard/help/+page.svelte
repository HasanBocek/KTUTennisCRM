<script lang="ts">

    import DefaultLayout from "$lib/layouts/DefaultLayout.svelte";
    import {Row} from "@sveltestrap/sveltestrap";
    import AskedQuestions from "./components/AskedQuestions.svelte";
    import QuestionsWithAccordion from "./components/QuestionsWithAccordion.svelte";
    import HaveMoreQuestions from "./components/HaveMoreQuestions.svelte";
</script>

<DefaultLayout>
    <Row class="justify-content-center">
        <AskedQuestions/>
    </Row>
</DefaultLayout>
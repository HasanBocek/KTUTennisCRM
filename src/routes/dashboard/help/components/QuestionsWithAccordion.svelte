<script lang="ts">

    import {Accordion, AccordionItem, Col} from "@sveltestrap/sveltestrap";
    import UIComponentCard from "$lib/components/UIComponentCard.svelte";
</script>

<Col md="6" lg="6">
    <UIComponentCard title="Questions With Accordion">
        <Accordion>
            <AccordionItem header="What is Rizz?" active>
                <strong>This is the first item's accordion body.</strong> It is hidden by default, until the collapse
                plugin adds the appropriate classes that we use to style each element. These classes control the
                overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this
                with custom CSS or overriding our default variables. It's also worth noting that just about any HTML
                can go within the <code>.accordion-body</code>, though the transition does limit overflow.
            </AccordionItem>
            <AccordionItem header="How to buy Rizz on coin?">
                <strong>This is the second item's accordion body.</strong> It is hidden by default, until the collapse
                plugin adds the appropriate classes that we use to style each element. These classes control the
                overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this
                with custom CSS or overriding our default variables. It's also worth noting that just about any HTML
                can go within the <code>.accordion-body</code>, though the transition does limit overflow.
            </AccordionItem>
            <AccordionItem header="What cryptocurrency can i use to buy Rizz?">
                <strong>This is the third item's accordion body.</strong> It is hidden by default, until the collapse
                plugin adds the appropriate classes that we use to style each element. These classes control the
                overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this
                with custom CSS or overriding our default variables. It's also worth noting that just about any HTML
                can go within the <code>.accordion-body</code>, though the transition does limit overflow.
            </AccordionItem>
        </Accordion>
    </UIComponentCard>
</Col>

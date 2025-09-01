<script lang="ts">

    import {Button, Col, Form, Input, Row} from "@sveltestrap/sveltestrap";
    import UIComponentCard from "$lib/components/UIComponentCard.svelte";
</script>

<Col md="6" lg="6">
    <UIComponentCard title="Have More Questions">
        <Form>
            <div class="form-group row">
                <Col lg="6">
                    <Input type="text" id="name" placeholder="Name" class="mb-2"/>
                </Col>
                <Col lg="6">
                    <Input type="email" id="example-email-input3" placeholder="Email" class="mb-2"/>
                </Col>
            </div>

            <Row>
                <Col xs="12">
                    <Input type="text" class="mb-2" placeholder="Subject" id="subject2"/>
                </Col>
            </Row>
            <div class="mb-2">
                <Input type="textarea" rows="{4}" id="exampleFormControlTextarea1" placeholder="Your message"/>
            </div>

            <Button type="submit" color="primary" class="btn-block px-4 mt-2">Send Email</Button>
        </Form>
    </UIComponentCard>
</Col>
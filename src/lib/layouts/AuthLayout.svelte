<script lang="ts">
    import {CardBody, Col, Row} from "@sveltestrap/sveltestrap";
</script>

<div class="container-xxl">
    <Row class="vh-100 d-flex justify-content-center">
        <Col xs="12" class="align-self-center">
            <CardBody>
                <Row>
                    <slot/>
                </Row>
            </CardBody>
        </Col>
    </Row>
</div>
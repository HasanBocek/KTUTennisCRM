<script lang="ts">
    import {
        currentYear,
        developedBy,
        developedByLink,
    } from "$lib/helpers/constants";
    import { Card, CardBody, Col, Row } from "@sveltestrap/sveltestrap";
</script>

<footer class="footer text-center text-sm-start d-print-none">
    <div class="container-xxl">
        <Row>
            <Col xs="12">
                <Card class="mb-0 rounded-bottom-0">
                    <CardBody>
                        <p class="text-muted mb-0">
                            ©
                            {currentYear}
                            <span
                                class="text-muted float-end"
                            >
                                Made with ❤️ by <a href={developedByLink}
                                    >{developedBy}
                                </a></span
                            >
                        </p>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    </div>
</footer>

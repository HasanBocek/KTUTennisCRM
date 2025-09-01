<script lang="ts">
    import AuthLayout from "$lib/layouts/AuthLayout.svelte";
    import {Card, CardBody, Col} from "@sveltestrap/sveltestrap";

    const logoSm = '/images/logo-sm.png';
    const error = '/images/extra/error.svg';
</script>

<AuthLayout>
    <Col lg="4" class="mx-auto">
        <Card>
            <CardBody class="p-0 bg-black auth-header-box rounded-top">
                <div class="text-center p-3">
                    <a href="/" class="logo logo-admin">
                        <img src="{logoSm}" height="50" alt="logo" class="auth-logo">
                    </a>
                    <h4 class="mt-3 mb-1 fw-semibold text-white fs-18">Oops! Sorry page does not found</h4>
                    <p class="text-muted fw-medium mb-0">Back to dashboard</p>
                </div>
            </CardBody>
            <CardBody class="pt-0">
                <div class="ex-page-content text-center">
                    <img src="{error}" alt="0" class="" height="170">
                    <h1 class="my-2">404!</h1>
                    <h5 class="fs-16 text-muted mb-3">Somthing went wrong</h5>
                </div>
                <a class="btn btn-primary w-100" href="/">Back to Dashboard <i
                        class="fas fa-redo ms-1"></i></a>
            </CardBody>
        </Card>
    </Col>
</AuthLayout>
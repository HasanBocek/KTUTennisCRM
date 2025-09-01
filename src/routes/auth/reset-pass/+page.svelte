<script lang="ts">
    const logoSm = '/images/logo-sm.png';
    import AuthLayout from "$lib/layouts/AuthLayout.svelte";
    import {Button, Card, CardBody, Col, Form, Input, Row} from "@sveltestrap/sveltestrap";
</script>

<AuthLayout>
    <Col lg="4" class="mx-auto">
        <Card>
            <CardBody class="p-0 auth-header-box rounded-top">
                <div class="text-center p-3">
                    <a href="/" class="logo logo-admin">
                        <img src="{logoSm}" height="100" alt="logo" class="auth-logo">
                    </a>
                    <h4 class="mt-3 mb-0 fw-semibold fs-18">Şifremi Unuttum</h4>
                    <p class="text-muted fw-medium mb-0 mt-3">
                        E-posta adresinize şifre sıfırlama linki gönderilecektir.
                    </p>
                </div>
            </CardBody>
            <CardBody class="pt-0 mt-0">
                <Form class="my-4 mt-0">
                    <div class="form-group mb-2">
                        <label class="form-label" for="identifier">Kimlik</label>
                        <Input type="text" name="identifier" class="mb-2" placeholder="Öğrenci numaranızı veya e-posta adresinizi giriniz" id="identifier"/>
                    </div>

                    <Row class="mb-0 row">
                        <Col xs="12">
                            <div class="d-grid mt-3">
                                <Button color="primary" type="button">Şifremi Sıfırla <i class="fas fa-sign-in-alt ms-1"></i>
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
                <div class="text-center  mb-2">
                    <a href="/auth/login" class="text-primary ms-2">
                        Şifrenizi hatırladınız mı?
                    </a>
                </div>
            </CardBody>
        </Card>
    </Col>
</AuthLayout>
<script lang="ts">
    import AuthLayout from "$lib/layouts/AuthLayout.svelte";
    import {Button, Card, CardBody, Col, Form, Input, Row} from "@sveltestrap/sveltestrap";
    import type {Actions} from "@sveltejs/kit";
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    const logoSm = '/images/logo-sm.png';

    export let form: { redirect?: string; invalid?: boolean; credentials?: boolean } | undefined;

    $: {
        if (form?.redirect) {
            goto(form.redirect);
        }
    }
</script>

<AuthLayout>
    <Col lg="4" class="mx-auto">
        <Card>
            <CardBody class="p-0 auth-header-box rounded-top">
                <div class="text-center p-3">
                    <a href="/" class="logo logo-admin">
                        <img src="{logoSm}" height="100" alt="logo" class="auth-logo">
                    </a>
                    <h4 class="mt-3 mb-0 fw-semibold fs-18">Sisteme Giriş</h4>
                </div>
            </CardBody>
            <CardBody class="pt-0">
                <Form method="GET" action="/dashboard/profile" class="my-4 mt-0">
                    {#if form?.invalid}
                        <div class="mb-2 text-center text-danger">Kimlik ve şifre gereklidir.</div>
                    {/if}
                    {#if form?.credentials}
                        <div class="mb-2 text-center text-danger">Kimlik ve şifre hatalı.</div>
                    {/if}

                    <div class="form-group mb-2">
                        <label class="form-label" for="email">E-posta</label>
                        <Input type="email" placeholder="E-posta adresiniz" id="email" name="email" value="user@demo.com"/>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="password">Şifre</label>
                        <Input type="password" placeholder="Şifre giriniz" id="password" name="password" value="123456"/>
                    </div>

                    <div class=" row mt-3">
                        <Col sm="12" class="text-end">
                            <a href="/auth/reset-pass" class="text-muted font-13"><i class="dripicons-lock"></i>
                                Şifremi unuttum
                            </a>
                        </Col>
                    </div>

                    <Row class="mb-0">
                        <Col xs="12">
                            <div class="d-grid mt-3">
                                <Button color="primary" type="submit">Giriş Yap <i class="fas fa-sign-in-alt ms-1"></i>
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
                <div class="text-center mb-2">
                    <a href="/auth/register" class="text-primary">
                        Hesabınız yok mu?
                    </a>
                </div>
            </CardBody>
        </Card>
    </Col>
</AuthLayout>
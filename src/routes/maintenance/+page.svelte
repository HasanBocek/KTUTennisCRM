<script lang="ts">
    const maintenance = '/images/extra/card/maintenance.png';
    import AuthLayout from "$lib/layouts/AuthLayout.svelte";
    import {Card, CardBody, Col} from "@sveltestrap/sveltestrap";
</script>

<AuthLayout>
    <Col lg="6" class="mx-auto">
        <Card>
            <CardBody class="p-5">
                <div class="text-center">
                    <img src="{maintenance}" alt="" class="img-fluid mb-3">
                    <h6 class="mb-3 fw-medium text-dark fs-24">Biz şu an bakımdayız</h6>
                    <p class="text-muted mb-0 text-wrap fs-15">Sitemizi iyileştirmek için çalışıyoruz. <br> Lütfen daha sonra tekrar deneyiniz.</p>
                    <div class="mt-4 text-center">
                        <a class="btn btn-primary w-50" href="/">
                            Ana Sayfaya Dön <i class="fas fa-redo ms-1"></i>
                        </a>
                    </div>
                </div>
            </CardBody>
        </Card>
    </Col>
</AuthLayout>
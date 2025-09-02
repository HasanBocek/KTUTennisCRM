<script lang="ts">
  const logoSm = "/images/logo-sm.png";
  const maintenance = "/images/extra/card/maintenance.png";
  import AuthLayout from "$lib/layouts/AuthLayout.svelte";
  import { Card, CardBody, Col } from "@sveltestrap/sveltestrap";
</script>

<AuthLayout>
  <Col lg="4" class="mx-auto">
    <Card>
      <CardBody class="p-0 auth-header-box rounded-top">
        <div class="text-center mt-4">
          <a href="/" class="logo logo-admin">
            <img
              src={logoSm}
              height="100"
              alt="logo"
              class="auth-logo"
            />
          </a>
          <h4 class="mt-3 mb-1 fw-semibold fs-18">
            Şu an bakımdayız
          </h4>
        </div>
      </CardBody>
      <CardBody class="pt-3">
        <div class="text-center">
          <img
            src={maintenance}
            alt=""
            width="170"
            class="img-fluid mb-3"
          />
          <h5 class="fs-16 fw-normal text-muted mb-3">
            Sitemizi iyileştirmek için çalışıyoruz. <br /> Lütfen daha
            sonra tekrar deneyiniz.
          </h5>
          <div class="d-flex flex-column gap-2 mt-3">
            <a class="btn btn-primary w-100" href="/"
              >Ana sayfaya dön <i class="fas fa-redo ms-1"></i></a
            >
          </div>
        </div>
      </CardBody>
    </Card>
  </Col>
</AuthLayout>

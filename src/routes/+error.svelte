<script lang="ts">
  import AuthLayout from "$lib/layouts/AuthLayout.svelte";
  import { Card, CardBody, Col } from "@sveltestrap/sveltestrap";

  const logoSm = "/images/logo-sm.png";
  const error = "/images/extra/error.svg";
</script>

<AuthLayout>
  <Col lg="4" class="mx-auto">
    <Card>
      <CardBody class="p-0 auth-header-box rounded-top">
        <div class="text-center p-3">
          <a href="/" class="logo logo-admin">
            <img
              src={logoSm}
              height="100"
              alt="logo"
              class="auth-logo"
            />
          </a>
          <h4 class="mt-3 mb-1 fw-semibold fs-18">
            Oops! Sayfa bulunamadı
          </h4>
        </div>
      </CardBody>
      <CardBody class="pt-0">
        <div class="ex-page-content text-center">
          <img src={error} alt="0" class="" height="170" />
          <h5 class="fs-16 text-muted mb-3">Bir şeyler ters gitti</h5>
        </div>
        <div class="d-flex flex-column gap-2 mt-3">
          <a class="btn btn-primary w-100" href="/dashboard/profile"
            >Profil sayfasına dön <i class="fas fa-redo ms-1"></i></a
          >
          <a class="btn btn-primary w-100" href="/"
            >Ana sayfaya dön <i class="fas fa-redo ms-1"></i></a
          >
        </div>
      </CardBody>
    </Card>
  </Col>
</AuthLayout>

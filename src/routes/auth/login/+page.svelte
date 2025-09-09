<script lang="ts">
  import AuthLayout from "$lib/layouts/AuthLayout.svelte";
  import {
    Button,
    Card,
    CardBody,
    Col,
    Form,
    Input,
    Row,
  } from "@sveltestrap/sveltestrap";
  import { goto } from "$app/navigation";
  import { LoginService } from "$lib/services/auth/loginService";
  import type { LoginCredentials } from "$lib/types/types";
  import { addToast } from "$lib/components/ToastNotification.svelte";
  import ToastNotification from "$lib/components/ToastNotification.svelte";
import departments from "$lib/assets/departments.json";
  const logoSm = "/images/logo-sm.png";

  let identifier: string = "";
  let password: string = "";
  let isLoading = false;

  async function handleLogin(event: Event) {
    event.preventDefault();
    isLoading = true;

    // Basic validation
    if (!identifier || !password) {
      addToast({
        message: "Kimlik ve şifre gereklidir.",
        type: "danger",
      });
      isLoading = false;
      return;
    }

    const credentials: LoginCredentials = { identifier, password };

    try {
      const response = await LoginService.login(credentials);

      if (response.success) {
        // Redirect to dashboard or home page
        await goto("/dashboard/profile");
      } else {
        response.errors?.forEach((error) => {
          addToast({
            message: error || "Giriş başarısız oldu.",
            type: "danger",
          });
        });
      }
    } catch (error) {
      addToast({
        message: "Bir hata oluştu. Lütfen tekrar deneyin.",
        type: "danger",
      });
    } finally {
      isLoading = false;
    }
  }
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
          <h4 class="mt-3 mb-0 fw-semibold fs-18">Sisteme Giriş</h4>
        </div>
      </CardBody>
      <CardBody class="pt-0">
        <form on:submit={handleLogin} class="my-4 mt-0">
          <div class="form-group mb-2">
            <label class="form-label" for="identifier">Kimlik</label>
            <Input
              type="text"
              placeholder="E-Posta adresinizi veya öğrenci numaranızı giriniz"
              id="identifier"
              name="identifier"
              bind:value={identifier}
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="password">Şifre</label>
            <Input
              type="password"
              placeholder="Şifre giriniz"
              id="password"
              name="password"
              bind:value={password}
            />
          </div>

          <div class="row mt-3">
            <Col sm="12" class="text-end">
              <a href="/auth/reset-pass" class="text-muted font-13">
                <i class="dripicons-lock"></i>
                Şifremi unuttum
              </a>
            </Col>
          </div>

          <Row class="mb-0">
            <Col xs="12">
              <div class="d-grid mt-3">
                <Button
                  color="primary"
                  type="submit"
                  disabled={isLoading}
                >
                  {#if isLoading}
                    <span
                      class="spinner-border spinner-border-sm me-1"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  {/if}
                  Giriş Yap <i class="fas fa-sign-in-alt ms-1"></i>
                </Button>
              </div>
            </Col>
          </Row>
        </form>
        <div class="text-center mb-2">
          <a href="/auth/register" class="text-primary">
            Hesabınız yok mu?
          </a>
        </div>
      </CardBody>
    </Card>
  </Col>

  <ToastNotification />
</AuthLayout>

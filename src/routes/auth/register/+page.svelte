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
  import { addToast } from "$lib/components/ToastNotification.svelte";
  import { RegisterService } from "$lib/services/auth/registerService";
  import type { RegisterCredentials } from "$lib/types/types";
  import departments from "$lib/assets/departments.json";

  const logoSm = '/images/logo-sm.png';

  let showPassword = false;
  let isLoading = false;
  let termsAccepted = false;

  let formData: RegisterCredentials = {
    firstName: '',
    lastName: '',
    studentNumber: '',
    department: '',
    grade: '',
    isMale: '',
    phoneNumber: '',
    skillLevel: '',
    password: ''
  };

  function togglePasswordVisibility() {
    showPassword = !showPassword;
  }

  async function handleRegister(event: Event) {
    event.preventDefault();
    
    // Validation
    const errors: string[] = [];
    
    if (!formData.firstName.trim()) errors.push('İsim gereklidir');
    if (!formData.lastName.trim()) errors.push('Soyisim gereklidir');
    if (!formData.studentNumber.trim()) errors.push('Öğrenci numarası gereklidir');
    if (!formData.department) errors.push('Program kodu seçilmelidir');
    if (!formData.grade) errors.push('Sınıf seçilmelidir');
    if (!formData.isMale) errors.push('Cinsiyet seçilmelidir');
    if (!formData.phoneNumber.trim()) errors.push('Telefon numarası gereklidir');
    if (!formData.skillLevel) errors.push('Beceri seviyesi seçilmelidir');
    if (!formData.password.trim()) errors.push('Şifre gereklidir');
    if (!termsAccepted) errors.push('Kullanım koşulları kabul edilmelidir');

    if (errors.length > 0) {
      errors.forEach(error => {
        addToast({
          message: error,
          type: 'danger'
        });
      });
      return;
    }

    isLoading = true;

    try {
      const response = await RegisterService.register(formData);

      if (response.success) {
        addToast({
          message: response.message || 'Kayıt başarılı!',
          type: 'success'
        });
        addToast({
          message: 'Lütfen E-Posta adresinize gelen doğrulama linkini kullanarak hesabınızı doğrulayınız.',
          type: 'success'
        });
      } else {
        response.errors?.forEach(error => {
          addToast({
            message: error,
            type: 'danger'
          });
        });
      }
    } catch (error) {
      addToast({
        message: 'Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.',
        type: 'danger'
      });
    } finally {
      isLoading = false;
    }
  }
</script>

<AuthLayout>
  <Col lg="8" xl="6" class="mx-auto lg:mt-5">
    <Card>
      <CardBody class="p-0 auth-header-box rounded-top">
        <div class="text-center p-3">
          <a href="/" class="logo logo-admin">
            <img src="{logoSm}" height="100" alt="logo" class="auth-logo">
          </a>
          <h4 class="mt-3 mb-0 fw-semibold fs-18">Hesap Oluştur</h4>
          <p class="text-muted fw-medium mb-0 mt-3">
            Karadeniz Teknik Üniversitesi öğrencisi değilseniz lütfen bizimle iletişime geçiniz.
          </p>
        </div>
      </CardBody>
      <CardBody class="pt-0">
        <Form on:submit={handleRegister} class="my-4 mt-0">
          <div class="form-group mb-2">
            <Row>
              <Col sm="6" class="mb-2">
                <label class="form-label" for="firstName">İsim</label>
                <Input 
                  type="text" 
                  name="firstName" 
                  placeholder="İsminizi giriniz" 
                  id="firstName"
                  bind:value={formData.firstName}
                />
              </Col>
              <Col sm="6">
                <label class="form-label" for="lastName">Soyisim</label>
                <Input 
                  type="text" 
                  name="lastName" 
                  placeholder="Soyisminizi giriniz" 
                  id="lastName"
                  bind:value={formData.lastName}
                />
              </Col>
            </Row>
          </div>  

          <div class="form-group mb-2">
            <Row>
              <Col sm="6" class="mb-2">
                <label class="form-label" for="studentNumber">Öğrenci Numarası</label>
                <Input 
                  type="text" 
                  name="studentNumber" 
                  placeholder="6 haneli öğrenci numaranızı giriniz" 
                  id="studentNumber"
                  bind:value={formData.studentNumber}
                />
              </Col>
              <Col sm="6">
                <label class="form-label" for="department">Program Kodu</label>
                <Input 
                  type="select" 
                  name="department" 
                  placeholder="Program kodunuzu giriniz" 
                  id="department"
                  bind:value={formData.department}
                >
                  <option value="">Program kodunuzu seçiniz</option>
                  {#each Object.entries(departments) as [code, name]}
                    <option value={code}>{name}</option>
                  {/each}
                </Input>
              </Col>
            </Row>
          </div>

          <div class="form-group mb-2">   
            <Row>
              <Col sm="6" class="mb-2">
                <label class="form-label" for="grade">Sınıf</label>
                <Input 
                  type="select" 
                  name="grade" 
                  id="grade"
                  bind:value={formData.grade}
                >
                  <option value="">Sınıfınızı seçiniz</option>
                  <option value="Hazırlık">Hazırlık</option>
                  <option value="1. Sınıf">1. Sınıf</option>
                  <option value="2. Sınıf">2. Sınıf</option>
                  <option value="3. Sınıf">3. Sınıf</option>
                  <option value="4. Sınıf">4. Sınıf</option>
                  <option value="5. Sınıf">5. Sınıf</option>
                  <option value="6. Sınıf">6. Sınıf</option>
                  <option value="6+ Sınıf">6+ Sınıf</option>
                  <option value="Mezun">Mezun</option>
                </Input>
              </Col>
              <Col sm="6">
                <label class="form-label" for="isMale">Cinsiyet</label>
                <Input 
                  type="select" 
                  name="isMale" 
                  id="isMale"
                  bind:value={formData.isMale}
                >
                  <option value="">Cinsiyetinizi seçiniz</option>
                  <option value="1">Erkek</option>
                  <option value="0">Kadın</option>
                </Input>
              </Col>
            </Row>
          </div>

          <div class="form-group mb-2">
            <Row>
              <Col sm="6" class="mb-2">
                <label class="form-label" for="phoneNumber">Telefon Numarası</label>
                <Input 
                  type="text" 
                  name="phoneNumber" 
                  placeholder="+905551234567" 
                  id="phoneNumber"
                  bind:value={formData.phoneNumber}
                />
              </Col>
              <Col sm="6">
                <label class="form-label" for="skillLevel">Beceri Seviyesi</label>
                <Input 
                  type="select" 
                  name="skillLevel" 
                  id="skillLevel"
                  bind:value={formData.skillLevel}
                >
                  <option value="">Beceri seviyenizi seçiniz</option>
                  <option value="1">1 - Başlangıç</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5 - Orta</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10 - Uzman</option>
                </Input>
              </Col>
            </Row>
          </div>

          <div class="form-group mb-2">
            <label class="form-label" for="password">Şifre</label>
            <div class="position-relative">
              <Input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                placeholder="Şifrenizi giriniz" 
                id="password"
                class="pr-5"
                bind:value={formData.password}
              />
              <button 
                type="button" 
                class="btn btn-link position-absolute" 
                style="right: 10px; top: 50%; transform: translateY(-50%); z-index: 10;"
                on:click={togglePasswordVisibility}
              >
                <i class="fas {showPassword ? 'fa-eye-slash' : 'fa-eye'}"></i>
              </button>
            </div>
          </div>

          <Row class="form-group mt-3">
            <Col sm="12">
              <div class="form-check form-switch form-switch-success">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  id="customSwitchSuccess"
                  bind:checked={termsAccepted}
                />
                <label class="form-check-label" for="customSwitchSuccess">
                  <a href={"#"} class="text-primary">Kullanım Koşullarını</a> ve <a href={"#"} class="text-primary">Gizlilik Politikasını</a> okudum ve kabul ediyorum.
                </label>
              </div>
            </Col>
          </Row>
          <Row class="mb-0">
            <Col sm="12">
              <div class="d-grid mt-3">
                <Button 
                  color="primary" 
                  type="submit"
                  disabled={isLoading}
                >
                  {#if isLoading}
                    <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                  {/if}
                  Kayıt Ol <i class="fas fa-sign-in-alt ms-1"></i>
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
        <div class="text-center">
          <a href="/auth/login" class="text-primary">
            Hesabınız var mı?
          </a>
        </div>
      </CardBody>
    </Card>
  </Col>
</AuthLayout>

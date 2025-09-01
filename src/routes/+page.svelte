<script lang="ts">
  // Doğru tenis logosu
  const logoSm = '/images/logo-sm.png';
</script>

<svelte:head>
  <title>KTUTenis Demo</title>
  <meta name="description" content="KTUTenis Demo - Tenis Kulübü Yönetim Sistemi" />
</svelte:head>

<div class="main-container">
  <div class="content-wrapper">
    <!-- Logo -->
    <div class="logo-section">
      <img 
        src={logoSm} 
        alt="Tenis Kulübü" 
        class="main-logo"
      >
      <h1 class="brand-name">KTUTenis Demo</h1>
    </div>
    
    <!-- Buttons -->
    <div class="button-section">
      <a href="/auth/login" class="btn btn-primary btn-lg">
        <i class="fas fa-sign-in-alt me-2"></i>
        Giriş Yap
      </a>
      <a href="/auth/register" class="btn btn-teal btn-lg">
        <i class="fas fa-user-plus me-2"></i>
        Kayıt Ol
      </a>
    </div>
  </div>
</div>

<style>
  .main-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    padding: 2rem;
  }
  
  .content-wrapper {
    text-align: center;
    background: white;
    padding: 3rem 2rem;
    border-radius: 20px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    max-width: 500px;
    width: 100%;
  }
  
  .logo-section {
    margin-bottom: 3rem;
  }
  
  .main-logo {
    width: 120px;
    height: 120px;
    margin-bottom: 1rem;
    border-radius: 20px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  }
  
  .brand-name {
    font-size: 2.5rem;
    font-weight: 700;
    color: #0d6efd;
    margin: 0;
    text-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .button-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .btn {
    padding: 1rem 2rem;
    font-size: 1.1rem;
    font-weight: 600;
    border-radius: 12px;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  }
  
  .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.15);
    text-decoration: none;
  }
  
  .btn-primary {
    background: linear-gradient(135deg, #0d6efd, #4A90E2);
    border: none;
    color: white;
    box-shadow: 0 4px 15px rgba(13, 110, 253, 0.3);
  }
  
  .btn-primary:hover {
    background: linear-gradient(135deg, #0056b3, #004085);
    color: white;
    box-shadow: 0 6px 20px rgba(13, 110, 253, 0.4);
  }
  
  .btn-teal {
    background: linear-gradient(135deg, #22c5ad, #1a9b87);
    border: none;
    color: white;
    box-shadow: 0 4px 15px rgba(34, 197, 173, 0.3);
  }
  
  .btn-teal:hover {
    background: linear-gradient(135deg, #1a9b87, #157a69);
    color: white;
    box-shadow: 0 6px 20px rgba(34, 197, 173, 0.4);
    text-decoration: none;
  }
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    .main-container {
      padding: 1rem;
    }
    
    .content-wrapper {
      padding: 2rem 1.5rem;
    }
    
    .main-logo {
      width: 100px;
      height: 100px;
    }
    
    .brand-name {
      font-size: 2rem;
    }
    
    .btn {
      padding: 0.875rem 1.5rem;
      font-size: 1rem;
    }
  }
  
  @media (max-width: 480px) {
    .main-logo {
      width: 80px;
      height: 80px;
    }
    
    .brand-name {
      font-size: 1.75rem;
    }
  }
</style>
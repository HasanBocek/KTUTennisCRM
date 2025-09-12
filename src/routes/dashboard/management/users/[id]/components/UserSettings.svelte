<script lang="ts">
  import { 
    TabContent, 
    TabPane 
  } from "@sveltestrap/sveltestrap";
  import type { UserType } from "$lib/types/types";
  import { updateUser } from "$lib/stores/usersStore";
  import { UserService } from "$lib/services/user/userService";
  import { addToast } from "$lib/components/ToastNotification.svelte";
  import { goto, invalidateAll } from '$app/navigation';

  // Ensure SettingCard is imported as a Svelte component
  import SettingCard from '$lib/components/SettingCard.svelte';

  import ProfileForm from "./profile/ProfileForm.svelte";
  import EmailUpdateForm from "./profile/EmailUpdateForm.svelte";
  import DeleteAccountForm from "./profile/DeleteAccountForm.svelte";

  export let user: UserType;

  let isUpdating = false;
  let isUpdatingEmail = false;
  let isDeleting = false;

  async function handleProfileUpdate(updatedUser: UserType) {
    isUpdating = true;
    try {
      const result = await UserService.updateUser(user._id, updatedUser);

      if (result.success) {
        updateUser(result.user);
        user = result.user;

        addToast({
          message: result.message || "Profil bilgileri başarıyla güncellendi!",
          type: "success"
        });

        invalidateAll();
      } else {
        result.errors?.forEach(error => {
          addToast({
            message: error,
            type: "danger"
          });
        });
      }
    } catch (error) {
      console.error("Profile update error:", error);
      addToast({
        message: "Profil güncellenirken bir hata oluştu!",
        type: "danger"
      });
    } finally {
      isUpdating = false;
    }
  }

  async function handleEmailUpdate(newEmail: string, isVerified: boolean) {
    isUpdatingEmail = true;
    try {
      const result = await UserService.updateUserEmail(
        user._id, 
        newEmail, 
        isVerified
      );

      if (result.success) {
        updateUser(result.user);
        user = result.user;

        addToast({
          message: result.message || "E-posta adresi başarıyla güncellendi!",
          type: "success"
        });

        invalidateAll();
      } else {
        result.errors?.forEach(error => {
          addToast({
            message: error,
            type: "danger"
          });
        });
      }
    } catch (error) {
      console.error("Email update error:", error);
      addToast({
        message: "E-posta güncellenirken bir hata oluştu!",
        type: "danger"
      });
    } finally {
      isUpdatingEmail = false;
    }
  }

  async function handleAccountDelete() {
    isDeleting = true;
    try {
      const result = await UserService.deleteUser(user._id);

      if (result.success) {
        addToast({
          message: result.message || "Kullanıcı başarıyla silindi!",
          type: "success"
        });

        // Redirect or handle successful deletion
        invalidateAll();
      } else {
        result.errors?.forEach(error => {
          addToast({
            message: error,
            type: "danger"
          });
        });
      }
    } catch (error) {
      console.error("Account delete error:", error);
      addToast({
        message: "Kullanıcı silinemedi!",
        type: "danger"
      });
    } finally {
      isDeleting = false;
    }
  }
</script>

<SettingCard title="Profil Ayarları">
  <TabContent>
    <TabPane
      active
      tabId="profile"
      tab="Profil Düzenleme"
      class="pt-3"
    >
      <ProfileForm 
        {user} 
        onSubmit={handleProfileUpdate} 
        isSubmitting={isUpdating} 
      />
    </TabPane>

    <TabPane 
      tabId="email" 
      tab="E-posta Değiştirme" 
      class="pt-3"
    >
      <EmailUpdateForm 
        {user} 
        onEmailUpdate={handleEmailUpdate} 
        isSubmitting={isUpdatingEmail} 
      />
    </TabPane>

    <TabPane 
      tabId="delete" 
      tab="Hesap Silme" 
      class="pt-3"
    >
      <DeleteAccountForm 
        {user} 
        onDeleteAccount={handleAccountDelete} 
        isDeleting={isDeleting} 
      />
    </TabPane>
  </TabContent>
</SettingCard>

<style>
  /* Inherited styles from previous implementation */
  .nav-tabs .nav-link {
    padding: 0.75rem 1.5rem;
    color: #6c757d;
    transition: all 0.3s ease;
  }

  .nav-tabs .nav-link:hover {
    color: var(--bs-primary);
  }

  .nav-tabs .nav-link.active {
    color: var(--bs-primary);
  }

  .tab-pane {
    animation: fadeIn 0.3s ease-in;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>

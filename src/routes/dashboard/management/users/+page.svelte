<script lang="ts">
  import DefaultLayout from "$lib/layouts/DefaultLayout.svelte";
  import {
    Button,
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Col,
    Row,
  } from "@sveltestrap/sveltestrap";
  // Using real users from server load instead of mock data
  import { GroupData } from "$lib/assets/data/mock/data";
  import type { RoleType } from "$lib/types/role";
  import type { UserType, GroupType } from "$lib/types/types";
  import { ROLES } from "$lib/types/role";
  import UserFilters from "./components/UserFilters.svelte";
  import UserTable from "./components/UserTable.svelte";
  import UserInfoModal from "./components/modals/UserInfoModal.svelte";
  import UserEditModal from "./components/modals/UserEditModal.svelte";
  import UserDeleteModal from "./components/modals/UserDeleteModal.svelte";
  import UserNewModal from "./components/modals/UserNewModal.svelte";
  import UserEmailModal from "./components/modals/UserEmailModal.svelte";
  import UserActionsModal from "./components/modals/UserActionsModal.svelte";
  import type { MeType } from "$lib/types/types";
  import { UserService } from "$lib/services/user/userService";
  import { addToast } from "$lib/components/ToastNotification.svelte";
  import { invalidateAll } from "$app/navigation";
  export let data: {
    user: MeType;
    users: any[];
  };

  function toDate(value: unknown): Date {
    return value ? new Date(value as string) : new Date(0);
  }

  // Normalize API users to local UserType shape
  function normalizeUsers(users: any[]): UserType[] {
    return users.map((u: any) => ({
      _id: u._id ?? u.id,
      firstName: u.firstName ?? "",
      lastName: u.lastName ?? "",
      isMale: String(
        u.isMale ??
          (u.gender === "male"
            ? "1"
            : u.gender === "female"
              ? "0"
              : "1")
      ),
      phoneNumber: u.phoneNumber ?? "",
      email: u.email ?? "",
      roles: Array.isArray(u.roles) ? u.roles : [],
      studentNumber: u.studentNumber ?? undefined,
      isStudent: Boolean(u.isStudent),
      department: u.department ?? undefined,
      grade: u.grade ?? undefined,
      createdAt: toDate(u.createdAt),
      lastLoginAt: toDate(u.lastLoginAt),
      skillLevel:
        typeof u.skillLevel === "number"
          ? u.skillLevel
          : Number(u.skillLevel ?? 0),
      notes: u.notes ?? undefined,
      isEmailVerified: Boolean(u.isEmailVerified),
      memberships: (u.memberships ?? []).map((m: any) => ({
        _id: m._id ?? m.id,
        joinDate: toDate(m.joinDate),
        group: (m.group as GroupType) ?? ({} as GroupType),
        status: m.status ?? "active",
      })),
    }));
  }

  // Re-normalize users when data changes (after invalidateAll)
  $: UserData = normalizeUsers(data.users);

  // Directly using page data (no usersStore)

  // filtre panelini göster/gizle
  let showFilters = false;

  let modals = {
    info: false,
    edit: false,
    delete: false,
    new: false,
    email: false,
    actions: false,
  };
  let selectedUser: UserType | null = null;
  let newUser: Partial<UserType> = {};
  let isUpdating = false;
  let isUpdatingEmail = false;
  let isDeleting = false;
  let isCreating = false;

  function openInfo(user: UserType) {
    selectedUser = { ...user };
    modals.info = true;
  }
  function closeInfo() {
    modals.info = false;
  }
  function openEdit(user: UserType) {
    selectedUser = { ...user };
    modals.edit = true;
  }
  function openActions(user: UserType) {
    selectedUser = { ...user };
    modals.actions = true;
  }
  function closeActions() {
    modals.actions = false;
    selectedUser = null;
  }
  function closeEdit() {
    modals.edit = false;
    selectedUser = null;
  }
  function openEmail(user: UserType) {
    selectedUser = { ...user };
    modals.email = true;
  }
  function closeEmail() {
    modals.email = false;
    selectedUser = null;
  }
  function openDelete(user: UserType) {
    selectedUser = { ...user };
    modals.delete = true;
  }
  function closeDelete() {
    modals.delete = false;
    selectedUser = null;
  }
  function openNew() {
    newUser = {
      roles: ["member"],
    };
    modals.new = true;
  }
  function closeNew() {
    modals.new = false;
    newUser = {};
  }

  async function handleUpdateUser() {
    if (!selectedUser) return;
    isUpdating = true;

    const accessToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];

    if (!accessToken) {
      addToast({
        message: "Oturum açılmamış",
        type: "danger",
      });
      isUpdating = false;
      return;
    }

    const result = await UserService.updateUser(
      selectedUser._id,
      selectedUser,
      accessToken
    );

    if (result.success) {
      addToast({
        message: result.message,
        type: "success",
      });
      // Refresh the page data to get updated user list
      await invalidateAll();
      closeEdit();
    } else {
      result.errors?.forEach((error) => {
        addToast({
          message: error,
          type: "danger",
        });
      });
    }

    isUpdating = false;
  }
  async function handleUpdateEmail() {
    if (!selectedUser) return;
    isUpdatingEmail = true;

    const accessToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];

    if (!accessToken) {
      addToast({
        message: "Oturum açılmamış",
        type: "danger",
      });
      isUpdatingEmail = false;
      return;
    }

    const result = await UserService.updateUserEmail(
      selectedUser._id,
      selectedUser.email,
      selectedUser.isEmailVerified,
      accessToken
    );

    if (result.success) {
      addToast({
        message: result.message,
        type: "success",
      });
      // Refresh the page data to get updated user list
      await invalidateAll();
      closeEmail();
    } else {
      result.errors?.forEach((error) => {
        addToast({
          message: error,
          type: "danger",
        });
      });
    }

    isUpdatingEmail = false;
  }
  async function handleDeleteUser() {
    if (!selectedUser) return;
    isDeleting = true;

    const accessToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];

    if (!accessToken) {
      addToast({
        message: "Oturum açılmamış",
        type: "danger",
      });
      isDeleting = false;
      return;
    }

    const result = await UserService.deleteUser(
      selectedUser._id,
      accessToken
    );

    if (result.success) {
      addToast({
        message: result.message,
        type: "success",
      });
      // Refresh the page data to get updated user list
      await invalidateAll();
      closeDelete();
    } else {
      result.errors?.forEach((error) => {
        addToast({
          message: error,
          type: "danger",
        });
      });
    }

    isDeleting = false;
  }
  async function handleCreateUser() {
    isCreating = true;

    const accessToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];

    if (!accessToken) {
      addToast({
        message: "Oturum açılmamış",
        type: "danger",
      });
      isCreating = false;
      return;
    }

    const result = await UserService.createUser({
      ...newUser,
      isStudent: newUser.isStudent === true || newUser.isStudent === 'true' || newUser.isStudent === undefined,
      roles: newUser.roles ?? ['member']
    }, accessToken);

    if (result.success) {
      addToast({
        message: result.message,
        type: "success",
      });
      // Refresh the page data to get updated user list
      await invalidateAll();
      closeNew();
    } else {
      const errorMessage = result.message || 'Kullanıcı oluşturulamadı';
      addToast({
        message: errorMessage,
        type: "danger",
      });
      console.error('User creation error:', result);
    }

    isCreating = false;
  }

  // seçili filtreler
  let filters = {
    searchTerm: "" as string,
    classes: [] as string[],
    departments: [] as string[],
    genders: [] as string[],
    levels: [] as string[],
    roles: [] as string[],
    groups: [] as string[],
  };

  const roles: RoleType[] = ROLES;
  const groups: GroupType[] = GroupData;

  // istatistikler
  $: activeFilterCount = Object.entries(filters).reduce(
    (sum, [key, value]) => {
      if (key === "searchTerm") {
        return sum + ((value as string).trim() ? 1 : 0);
      } else {
        return sum + (value as string[]).length;
      }
    },
    0
  );
  $: hasActiveFilters = activeFilterCount > 0;
  $: totalUsers = UserData.length;

  // filtrelenmiş kullanıcılar
  $: filteredUsers = UserData.filter((u: UserType) => {
    // Search term filtresi - kelime kelime arama (OR mantığı)
    const searchWords = filters.searchTerm
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    const matchSearch =
      searchWords.length === 0 ||
      searchWords.some((word) => {
        const fullName =
          `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase();
        const email = (u.email || "").toLowerCase();
        const studentNumber = (
          u.studentNumber?.toString() || ""
        ).toLowerCase();
        const phone = (u.phoneNumber || "").toLowerCase();
        const department = (u.department || "").toLowerCase();

        return (
          fullName.includes(word) ||
          email.includes(word) ||
          studentNumber.includes(word) ||
          phone.includes(word) ||
          department.includes(word)
        );
      });

    const matchClass =
      !filters.classes.length ||
      filters.classes.includes(u.grade || "");
    const matchDept =
      !filters.departments.length ||
      filters.departments.includes(u.department || "");
    const matchGender =
      !filters.genders.length ||
      filters.genders.includes(u.isMale == "1" ? "Erkek" : "Kadın");
    const matchLevel =
      !filters.levels.length ||
      filters.levels.includes(u.skillLevel?.toString() || "");
    const matchRole =
      !filters.roles.length ||
      (u.roles &&
        u.roles.some((roleId) => filters.roles.includes(roleId)));
    const matchGroup =
      !filters.groups.length ||
      (u.memberships &&
        u.memberships.some(
          (m) =>
            filters.groups.includes(m.group.name) &&
            m.status === "active"
        ));
    return (
      matchSearch &&
      matchClass &&
      matchDept &&
      matchGender &&
      matchLevel &&
      matchRole &&
      matchGroup
    );
  })
    // Varsayılan sıralama: createdAt'e göre en yeni en üstte
    .sort((a: UserType, b: UserType) => {
      const at =
        a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
      const bt =
        b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
      return bt - at;
    });
  $: filteredCount = filteredUsers.length;
</script>

<DefaultLayout user={data.user}>
  <Row>
    <Col xs="12">
      <Card>
        <CardHeader>
          <Row class="align-items-center">
            <div class="col">
              <CardTitle>Üye Yönetimi</CardTitle>
            </div>
            <div class="col-auto">
              <Button
                color=""
                class="bg-primary-subtle text-primary hover-effect"
                on:click={openNew}
                ><i class="fas fa-plus me-1"></i> Yeni Üye Oluştur
              </Button>
            </div>
          </Row>
        </CardHeader>
        <CardBody class="pt-0">
          <!-- Filtreler -->
          <UserFilters
            bind:showFilters
            bind:filters
            {UserData}
            {roles}
            {groups}
            {activeFilterCount}
            {hasActiveFilters}
            {filteredCount}
            {totalUsers}
          />

          <!-- Tablo -->
          <UserTable
            {filteredUsers}
            on:openActions={(e) => openActions(e.detail)}
            on:openInfo={(e) => openInfo(e.detail)}
            on:openEdit={(e) => openEdit(e.detail)}
            on:openEmail={(e) => openEmail(e.detail)}
            on:openDelete={(e) => openDelete(e.detail)}
          />
          <UserActionsModal
            isOpen={modals.actions}
            {selectedUser}
            on:close={closeActions}
            on:openInfo={() => {
              modals.actions = false;
              modals.info = true;
            }}
            on:openEdit={() => {
              modals.actions = false;
              modals.edit = true;
            }}
            on:openEmail={() => {
              modals.actions = false;
              modals.email = true;
            }}
            on:openDelete={() => {
              modals.actions = false;
              modals.delete = true;
            }}
          />
        </CardBody>
      </Card>
    </Col>
  </Row>

  <!-- Modal'lar -->
  <UserInfoModal
    isOpen={modals.info}
    {selectedUser}
    on:close={closeInfo}
    on:back={() => {
      modals.info = false;
      modals.actions = true;
    }}
  />
  <UserEditModal
    isOpen={modals.edit}
    {selectedUser}
    {isUpdating}
    {roles}
    on:close={closeEdit}
    on:back={() => {
      modals.edit = false;
      modals.actions = true;
    }}
    on:save={handleUpdateUser}
  />
  <UserDeleteModal
    isOpen={modals.delete}
    {selectedUser}
    {isDeleting}
    on:close={closeDelete}
    on:back={() => {
      modals.delete = false;
      modals.actions = true;
    }}
    on:confirm={handleDeleteUser}
  />
  <UserNewModal
    isOpen={modals.new}
    bind:newUser
    {isCreating}
    {roles}
    on:close={closeNew}
    on:create={handleCreateUser}
  />
  <UserEmailModal
    isOpen={modals.email}
    {selectedUser}
    {isUpdatingEmail}
    on:close={closeEmail}
    on:back={() => {
      modals.email = false;
      modals.actions = true;
    }}
    on:saveEmail={handleUpdateEmail}
  />
</DefaultLayout>

<style>
  .hover-effect {
    transition: all 0.3s ease;
    transform: translateY(0px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .hover-effect:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(13, 110, 253, 0.25);
    background-color: var(--bs-primary) !important;
    color: white !important;
  }

  .hover-effect:hover i {
    color: white !important;
  }

  /* Preserved from previous monolithic modal for consistent visual styling */
  .shadow-sm {
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
  }
  .bg-danger-subtle {
    background-color: rgba(220, 53, 69, 0.1) !important;
  }
  .border-danger {
    border-color: #dc3545 !important;
  }
  .border-2 {
    border-width: 2px !important;
  }
</style>

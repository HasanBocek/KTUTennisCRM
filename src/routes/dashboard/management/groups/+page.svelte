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
  import { GroupData } from "$lib/assets/data/mock/data";
  import type { GroupType } from "$lib/types/types";
  import { UserData } from "$lib/assets/data/mock/data";
  import {
    groupsStore,
    initializeGroups,
    addGroup,
  } from "$lib/stores/groupsStore";
  import {
    coachesStore,
    initializeUsers,
  } from "$lib/stores/usersStore";
  import GroupFilters from "./components/GroupFilters.svelte";
  import GroupTable from "./components/GroupTable.svelte";
  import GroupNewModal from "./components/modals/GroupNewModal.svelte";

  // Initialize stores with mock data
  initializeUsers(UserData);
  initializeGroups(GroupData);

  let showNewModal = false;
  let newGroup: Partial<GroupType> = {};
  let isCreating = false;

  function openNew() {
    newGroup = {};
    showNewModal = true;
  }
  function closeNew() {
    showNewModal = false;
    newGroup = {};
  }
  async function handleCreateGroup() {
    isCreating = true;
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 300));

    // Create group and add to store
    const createdGroup: GroupType = {
      _id: Date.now().toString(),
      name: newGroup.name || "",
      description: newGroup.description || "",
      coaches: newGroup.coaches || [],
      schedule: newGroup.schedule || [],
      maxMembers: newGroup.maxMembers || 0,
      membershipOpen: newGroup.membershipOpen || true,
      payment: newGroup.payment || {
        amount: 0,
        billingCycle: "Dönemlik",
        includesEquipment: false,
      },
      notes: newGroup.notes,
    };
    addGroup(createdGroup);

    isCreating = false;
    closeNew();
  }

  let searchTerm = "";

  $: filteredGroups = $groupsStore.filter((g) => {
    if (!searchTerm.trim()) return true;
    const search = searchTerm.toLowerCase();
    return (
      g.name.toLowerCase().includes(search) ||
      g.description.toLowerCase().includes(search) ||
      (g.notes || "").toLowerCase().includes(search)
    );
  });
</script>

<DefaultLayout>
  <Row>
    <Col xs="12">
      <Card>
        <CardHeader>
          <Row class="align-items-center">
            <div class="col">
              <CardTitle>Grup Yönetimi</CardTitle>
            </div>
            <div class="col-auto">
              <Button
                color=""
                class="bg-primary-subtle text-primary hover-effect"
                on:click={openNew}
                ><i class="fas fa-plus me-1"></i> Yeni Grup Oluştur
              </Button>
            </div>
          </Row>
        </CardHeader>
        <CardBody class="pt-0">
          <!-- Filtreler -->
          <GroupFilters bind:searchTerm />

          <!-- Tablo -->
          <GroupTable {filteredGroups} />
        </CardBody>
      </Card>
    </Col>
  </Row>

  <!-- Modal'lar -->
  <GroupNewModal
    isOpen={showNewModal}
    bind:newGroup
    coaches={$coachesStore}
    {isCreating}
    on:close={closeNew}
    on:create={handleCreateGroup}
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
</style>

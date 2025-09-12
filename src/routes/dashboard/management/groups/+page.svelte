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
  import type { MeType, GroupType } from "$lib/types/types";
  import { ROLES } from "$lib/types/role";
  import GroupFilters from "./components/GroupFilters.svelte";
  import GroupTable from "./components/GroupTable.svelte";
  import GroupNewModal from "./components/modals/GroupNewModal.svelte";
  import { addToast } from "$lib/components/ToastNotification.svelte";
  import { invalidateAll } from "$app/navigation";
  import { GroupService } from "$lib/services/group/groupService"; // Create this service
  import type { RoleType } from "$lib/types/role";

  export let data: {
    user: MeType;
    groups: any[];
    coaches: any[];
  };

  // Normalize API groups to local GroupType shape
  function normalizeGroups(groups: any[]): GroupType[] {
    return groups.map((g: any) => ({
      _id: g._id ?? g.id,
      name: g.name ?? "",
      description: g.description ?? "",
      coaches: g.coaches ?? [],
      schedule: g.schedule ?? [],
      maxMembers: g.maxMembers ?? 0,
      membershipOpen: g.membershipOpen ?? true,
      payment: g.payment ?? {
        amount: 0,
        billingCycle: "Dönemlik",
        includesEquipment: false,
      },
      notes: g.notes ?? undefined,
    }));
  }

  // Re-normalize groups when data changes (after invalidateAll)
  $: GroupData = normalizeGroups(data.groups);
  $: coaches = data.coaches;

  // filtre panelini göster/gizle
  let showFilters = false;

  let modals = {
    new: false,
  };
  let newGroup: Partial<GroupType> = {};
  let isCreating = false;

  function openNew() {
    newGroup = {
      membershipOpen: true,
      payment: {
        amount: 0,
        billingCycle: "Dönemlik",
        includesEquipment: false,
      },
    };
    modals.new = true;
  }

  function closeNew() {
    modals.new = false;
    newGroup = {};
  }

  async function handleCreateGroup() {
    isCreating = true;

    try {
      const result = await GroupService.createGroup(newGroup);

      if (result.success) {
        addToast({
          message: result.message || "Grup başarıyla oluşturuldu!",
          type: "success",
        });

        // Refresh the page data to get updated group list
        await invalidateAll();
        closeNew();
      } else {
        result.errors?.forEach((error) => {
          addToast({
            message: error,
            type: "danger",
          });
        });
      }
    } catch (error) {
      console.error("Group creation error:", error);
      addToast({
        message: "Grup oluşturulurken bir hata oluştu!",
        type: "danger",
      });
    } finally {
      isCreating = false;
    }
  }

  // seçili filtreler
  let filters = {
    searchTerm: "" as string,
    coaches: [] as string[],
  };

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
  $: totalGroups = GroupData.length;

  // filtrelenmiş gruplar
  $: filteredGroups = GroupData.filter((g: GroupType) => {
    // Search term filtresi - kelime kelime arama (OR mantığı)
    const searchWords = filters.searchTerm
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    const matchSearch =
      searchWords.length === 0 ||
      searchWords.some((word) => {
        const name = (g.name || "").toLowerCase();
        const description = (g.description || "").toLowerCase();
        const notes = (g.notes || "").toLowerCase();

        return (
          name.includes(word) ||
          description.includes(word) ||
          notes.includes(word)
        );
      });

    const matchCoach =
      !filters.coaches.length ||
      g.coaches.some((coachId) => filters.coaches.includes(coachId));

    return matchSearch && matchCoach;
  })
    // Varsayılan sıralama: oluşturulma tarihine göre en yeni en üstte
    .sort((a: GroupType, b: GroupType) => {
      // Eğer API'den oluşturulma tarihi geliyorsa bu kısım güncellenecek
      return 0;
    });

  $: filteredCount = filteredGroups.length;
</script>

<DefaultLayout user={data.user}>
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
          <GroupFilters
            bind:showFilters
            bind:filters
            {GroupData}
            {coaches}
            {activeFilterCount}
            {hasActiveFilters}
            {filteredCount}
            {totalGroups}
          />

          <!-- Tablo -->
          <GroupTable {filteredGroups} />
        </CardBody>
      </Card>
    </Col>
  </Row>

  <!-- Modal'lar -->
  <GroupNewModal
    isOpen={modals.new}
    bind:newGroup
    {coaches}
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

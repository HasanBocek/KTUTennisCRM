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
  import type { MeType, GroupType, CoachType } from "$lib/types/types";
  import GroupTable from "./components/GroupTable.svelte";
  import GroupNewModal from "./components/modals/GroupNewModal.svelte";
  import { addToast } from "$lib/components/ToastNotification.svelte";
  import { invalidateAll } from "$app/navigation";
  import { GroupService } from "$lib/services/group/groupService"; // Create this service

  export let data: {
    user: MeType;
    groups: any[];
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
      memberships: g.memberships ?? [],
    }));
  }

  // Re-normalize groups when data changes (after invalidateAll)
  $: GroupData = normalizeGroups(data.groups);
  $: coaches = GroupData.map((group) => group.coaches).flat();

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
      const result = await GroupService.createGroup({...newGroup, coaches: newGroup.coaches?.map((c) => c._id)});

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
  $: totalGroups = GroupData.length;

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
          <!-- Tablo -->
          <GroupTable groups={GroupData} totalGroups={totalGroups}  />
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

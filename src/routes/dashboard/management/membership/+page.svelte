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
  import type { MembershipType } from "$lib/types/types";
  import { goto } from "$app/navigation";
  import MembershipTable from "./components/MembershipTable.svelte";
  import MembershipFilters from "./components/MembershipFilters.svelte";
  import MembershipApprovalModal from "./components/modals/MembershipApprovalModal.svelte";
  import { membershipStore, pendingMemberships, membershipActions } from "$lib/stores/membershipStore";

  // Store'dan veri al
  $: membershipData = $membershipStore;
  $: pendingData = $pendingMemberships;

  // Modal state
  let showCreateModal = false;
  let showApprovalModal = false;
  let selectedMembership: MembershipType | null = null;

  // filtre panelini göster/gizle
  let showFilters = false;

  // seçili filtreler
  let filters = {
    searchTerm: "" as string,
    groups: [] as string[],
    statuses: [] as string[],
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
  $: totalMemberships = pendingData.length;

  // filtrelenmiş üyelikler - pending store'dan al ve filtrele
  $: filteredMemberships = pendingData
    .filter((membership: MembershipType) => {
      // Search term filtresi - kelime kelime arama (OR mantığı)
      const searchWords = filters.searchTerm
        .toLowerCase()
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0);
      const matchSearch =
        searchWords.length === 0 ||
        searchWords.some((word) => {
          const groupName = membership.group.name.toLowerCase();
          const userName = `${membership.user.firstName} ${membership.user.lastName}`.toLowerCase();
          const userPhone = membership.user.phoneNumber.toLowerCase();
          const studentNumber = membership.user.studentNumber?.toString() || "";

          return (
            groupName.includes(word) ||
            userName.includes(word) ||
            userPhone.includes(word) ||
            studentNumber.includes(word)
          );
        });

      const matchGroup =
        !filters.groups.length ||
        filters.groups.includes(membership.group.name);
      
      const matchStatus =
        !filters.statuses.length ||
        filters.statuses.includes(membership.status || "");

      return (
        matchSearch &&
        matchGroup &&
        matchStatus
      );
    })
    // Varsayılan sıralama: joinDate'e göre en yeni en üstte
    .sort((a: MembershipType, b: MembershipType) => {
      return b.joinDate.getTime() - a.joinDate.getTime();
    });
  $: filteredCount = filteredMemberships.length;

  function handleApproveMembership(event: CustomEvent<MembershipType>) {
    // Üyelik onaylama işlemi - store action kullan
    const membership = event.detail;
    console.log("Onaylanacak membership ID:", membership._id);
    console.log("Store'daki veriler (öncesi):", $membershipStore.map(m => ({ id: m._id, status: m.status })));
    membershipActions.approveMembership(membership._id);
    console.log("Store'daki veriler (sonrası):", $membershipStore.map(m => ({ id: m._id, status: m.status })));
  }

  function handleRejectMembership(event: CustomEvent<MembershipType>) {
    // Üyelik reddetme işlemi - store action kullan
    const membership = event.detail;
    membershipActions.rejectMembership(membership._id);
  }

  function handleShowApprovalModal(event: CustomEvent<MembershipType>) {
    selectedMembership = event.detail;
    showApprovalModal = true;
  }

  function closeApprovalModal() {
    showApprovalModal = false;
    selectedMembership = null;
  }

  function handleModalApprove(event: CustomEvent<MembershipType>) {
    const membership = event.detail;
    membershipActions.approveMembership(membership._id);
    closeApprovalModal();
  }

  function handleModalReject(event: CustomEvent<MembershipType>) {
    const membership = event.detail;
    membershipActions.rejectMembership(membership._id);
    closeApprovalModal();
  }

  function handleModalFullApprove(event: CustomEvent<MembershipType>) {
    const membership = event.detail;
    // Direkt aktif statüye geçir
    membershipActions.updateMembershipStatus(membership._id, "active");
    closeApprovalModal();
  }
</script>

<DefaultLayout>
  <Row>
    <Col xs="12">
      <Card>
        <CardHeader>
          <Row class="align-items-center">
            <div class="col">
              <CardTitle>Üyelik Başvuruları</CardTitle>
            </div>
            <div class="col-auto">
              <Button
                color="outline-secondary"
                size="sm"
                on:click={() => membershipActions.resetStore()}
                title="Store'u Yenile (Debug)"
              >
                <i class="fas fa-refresh me-1"></i> Yenile
              </Button>
            </div>
          </Row>
        </CardHeader>
        <CardBody class="pt-0">
          <!-- Filtreler -->
          <MembershipFilters
            bind:showFilters
            bind:filters
            membershipData={pendingData}
            {activeFilterCount}
            {hasActiveFilters}
            {filteredCount}
            totalMemberships={totalMemberships}
          />

          <!-- Tablo -->
          <MembershipTable
            {filteredMemberships}
            on:showApprovalModal={handleShowApprovalModal}
          />
        </CardBody>
      </Card>
    </Col>
  </Row>

  <!-- Approval Modal -->
  <MembershipApprovalModal
    isOpen={showApprovalModal}
    membership={selectedMembership}
    on:approve={handleModalApprove}
    on:reject={handleModalReject}
    on:fullApprove={handleModalFullApprove}
    on:close={closeApprovalModal}
  />
</DefaultLayout>

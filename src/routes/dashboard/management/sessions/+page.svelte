<script lang="ts">
  import DefaultLayout from "$lib/layouts/DefaultLayout.svelte";
  import type { MeType } from "$lib/types/types";
  export let data: { user: MeType };
  import {
    Button,
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Col,
    Row,
  } from "@sveltestrap/sveltestrap";
  import { SessionData } from "$lib/assets/data/mock/data";
  import type { SessionType } from "$lib/types/types";
  import { goto } from "$app/navigation";
  import SessionTable from "./components/SessionTable.svelte";
  import SessionCreateModal from "./components/modals/SessionCreateModal.svelte";
  import SessionFilters from "./components/SessionFilters.svelte";

  let sessionData: SessionType[] = [...SessionData];

  // Modal state
  let showCreateModal = false;

  // filtre panelini göster/gizle
  let showFilters = false;

  // seçili filtreler
  let filters = {
    searchTerm: "" as string,
    groups: [] as string[],
    coaches: [] as string[],
    statuses: [] as string[],
    months: [] as string[],
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
  $: totalSessions = sessionData.length;

  // filtrelenmiş dersler
  $: filteredSessions = sessionData
    .filter((session: SessionType) => {
      // Search term filtresi - kelime kelime arama (OR mantığı)
      const searchWords = filters.searchTerm
        .toLowerCase()
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0);
      const matchSearch =
        searchWords.length === 0 ||
        searchWords.some((word) => {
          const groupName = session.group.name.toLowerCase();
          const coachNames = session.coaches
            .map((c) => c.firstName + " " + c.lastName)
            .join(" ");
          const notes = (session.notes || "").toLowerCase();

          return (
            groupName.includes(word) ||
            coachNames.includes(word) ||
            notes.includes(word)
          );
        });

      const matchGroup =
        !filters.groups.length ||
        filters.groups.includes(session.group.name);
      const matchCoach =
        !filters.coaches.length ||
        session.coaches.some((coach) =>
          filters.coaches.includes(
            coach.firstName + " " + coach.lastName
          )
        );
      const matchStatus =
        !filters.statuses.length ||
        filters.statuses.includes(session.status || "");

      const sessionMonth = `${session.startTime.getFullYear()}-${String(session.startTime.getMonth() + 1).padStart(2, "0")}`;
      const matchMonth =
        !filters.months.length ||
        filters.months.includes(sessionMonth);

      return (
        matchSearch &&
        matchGroup &&
        matchCoach &&
        matchStatus &&
        matchMonth
      );
    })
    // Varsayılan sıralama: startTime'a göre en yeni en üstte
    .sort((a: SessionType, b: SessionType) => {
      return b.startTime.getTime() - a.startTime.getTime();
    });
  $: filteredCount = filteredSessions.length;

  function handleCreateSession() {
    showCreateModal = true;
  }

  function handleSessionCreated(event: CustomEvent) {
    // Refresh sessions list or add new session
    // In real app, this would refetch from API
    showCreateModal = false;
  }

  function handleOpenSession(event: CustomEvent<SessionType>) {
    goto(`/dashboard/management/sessions/${event.detail._id}`);
  }

  function handleViewDetails(event: CustomEvent<SessionType>) {
    goto(`/dashboard/management/sessions/${event.detail._id}`);
  }
</script>

<DefaultLayout user={data.user}>
  <Row>
    <Col xs="12">
      <Card>
        <CardHeader>
          <Row class="align-items-center">
            <div class="col">
              <CardTitle>Ders Yönetimi</CardTitle>
            </div>
            <div class="col-auto">
              <Button
                color=""
                class="bg-primary-subtle text-primary hover-effect"
                on:click={handleCreateSession}
              >
                <i class="fas fa-plus me-1"></i> Yeni Ders Oluştur
              </Button>
            </div>
          </Row>
        </CardHeader>
        <CardBody class="pt-0">
          <!-- Filtreler -->
          <SessionFilters
            bind:showFilters
            bind:filters
            {sessionData}
            {activeFilterCount}
            {hasActiveFilters}
            {filteredCount}
            {totalSessions}
          />

          <!-- Tablo -->
          <SessionTable
            {filteredSessions}
            on:openSession={handleOpenSession}
            on:viewDetails={handleViewDetails}
          />
        </CardBody>
      </Card>
    </Col>
  </Row>

  <!-- Create Session Modal -->
  <SessionCreateModal
    bind:isOpen={showCreateModal}
    on:sessionCreated={handleSessionCreated}
    on:close={() => (showCreateModal = false)}
  />
</DefaultLayout>

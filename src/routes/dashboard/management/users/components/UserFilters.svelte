<script lang="ts">
  import {
    Badge,
    Button,
    Card,
    CardBody,
    Col,
    Row,
  } from "@sveltestrap/sveltestrap";
  import { slide } from "svelte/transition";
  import type { RoleType } from "$lib/types/role";
  import type { GroupType, UserType } from "$lib/types/types";

  export let showFilters: boolean = false;
  export let filters: {
    searchTerm: string;
    classes: string[];
    departments: string[];
    genders: string[];
    levels: string[];
    roles: string[];
    groups: string[];
  };
  export let UserData: UserType[];
  export let roles: RoleType[];
  export let groups: GroupType[];
  export let activeFilterCount: number;
  export let hasActiveFilters: boolean;
  export let filteredCount: number;
  export let totalUsers: number;

  // sabit sınıf seçenekleri
  const classes: string[] = [
    "Hazırlık",
    "1. Sınıf",
    "2. Sınıf",
    "3. Sınıf",
    "4. Sınıf",
    "5. Sınıf",
    "6. Sınıf",
    "+6. Sınıf",
  ];

  // veri tabanlı seçenekler
  $: departments = Array.from(
    new Set(UserData.map((u) => u.department || ""))
  ).filter(Boolean);
  $: genders = Array.from(
    new Set(
      UserData.map((u) => (u.isMale == "1" ? "Erkek" : "Kadın"))
    )
  ).filter(Boolean);
  $: levels = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
  ].filter(Boolean);

  // toggle fonksiyonları
  function toggleFilter(
    category: keyof typeof filters,
    value: string
  ) {
    if (category === "searchTerm") {
      // searchTerm string olduğu için özel işlem
      filters[category] = value;
    } else {
      // Diğerleri array olduğu için mevcut mantık
      const list = filters[category] as string[];
      filters[category] = list.includes(value)
        ? list.filter((v) => v !== value)
        : [...list, value];
    }
  }

  function onClearFilters() {
    filters = {
      searchTerm: "",
      classes: [],
      departments: [],
      genders: [],
      levels: [],
      roles: [],
      groups: [],
    };
  }
</script>

<!-- Arama ve Filtre toggle -->
<Row class="mb-3">
  <Col xs="12">
    <!-- Arama Kutusu ve Filtre Butonu -->
    <div class="d-flex gap-2 mb-3">
      <!-- Filtre Butonu -->
      <div class="d-flex align-items-stretch">
        <Button
          color="outline-primary"
          on:click={() => (showFilters = !showFilters)}
          class="d-flex align-items-center gap-2 position-relative"
          style="white-space: nowrap;"
        >
          <i class="fas fa-filter"></i>
          <span class="d-none d-md-inline">Filtreler</span>
          {#if activeFilterCount > 0}
            <Badge
              color="primary"
              class="position-absolute top-0 start-100 translate-middle"
            >
              {activeFilterCount}
            </Badge>
          {/if}
          <i class="fas fa-chevron-{showFilters ? 'up' : 'down'}"></i>
        </Button>
      </div>

      <!-- Arama Kutusu -->
      <div class="flex-fill">
        <div class="input-group">
          <span class="input-group-text">
            <i class="fas fa-search"></i>
          </span>
          <input
            type="text"
            class="form-control"
            placeholder="Ad soyad, email, öğrenci no, telefon veya bölüm ile ara..."
            bind:value={filters.searchTerm}
          />
          {#if filters.searchTerm}
            <button
              class="btn btn-outline-secondary"
              type="button"
              on:click={() => (filters.searchTerm = "")}
              title="Aramayı temizle"
            >
              <i class="fas fa-times"></i>
            </button>
          {/if}
        </div>
      </div>
    </div>

    <!-- Filtre kartı -->
    {#if showFilters}
      <div transition:slide={{ duration: 300 }}>
        <Row>
          <Col xs="12">
            <Card class="border-light bg-light">
              <CardBody class="py-2">
                <Row class="g-3">
                  <!-- Gruplar -->
                  <Col md="3">
                    <label
                      class="form-label small mb-2"
                      for="filter-groups"
                      ><strong>Gruplar</strong
                      >{#if filters.groups.length}<Badge
                          color="primary"
                          class="ms-1">{filters.groups.length}</Badge
                        >{/if}</label
                    >
                    <div
                      id="filter-groups"
                      class="border rounded p-2"
                      style="max-height:150px;overflow-y:auto;"
                    >
                      {#each groups as group}
                        <div class="form-check form-check-sm">
                          <input
                            id="group-{group._id}"
                            type="checkbox"
                            class="form-check-input"
                            checked={filters.groups.includes(
                              group.name
                            )}
                            on:change={() =>
                              toggleFilter("groups", group.name)}
                          />
                          <label
                            for="group-{group._id}"
                            class="form-check-label small"
                            >{group.name}</label
                          >
                        </div>
                      {/each}
                    </div>
                  </Col>

                  <!-- Tenis Seviyesi -->
                  <Col md="2">
                    <label
                      class="form-label small mb-2"
                      for="filter-levels"
                      ><strong>Tenis Seviyesi</strong
                      >{#if filters.levels.length}<Badge
                          color="primary"
                          class="ms-1">{filters.levels.length}</Badge
                        >{/if}</label
                    >
                    <div
                      id="filter-levels"
                      class="border rounded p-2"
                      style="max-height:150px;overflow-y:auto;"
                    >
                      {#each levels as lvl}
                        <div class="form-check form-check-sm">
                          <input
                            id="lvl-{lvl}"
                            type="checkbox"
                            class="form-check-input"
                            checked={filters.levels.includes(lvl)}
                            on:change={() =>
                              toggleFilter("levels", lvl)}
                          />
                          <label
                            for="lvl-{lvl}"
                            class="form-check-label small"
                            >{lvl}</label
                          >
                        </div>
                      {/each}
                    </div>
                  </Col>

                  <!-- Sınıf -->
                  <Col md="2">
                    <label
                      class="form-label small mb-2"
                      for="filter-classes"
                      ><strong>Sınıf</strong
                      >{#if filters.classes.length}<Badge
                          color="primary"
                          class="ms-1">{filters.classes.length}</Badge
                        >{/if}</label
                    >
                    <div
                      id="filter-classes"
                      class="border rounded p-2"
                      style="max-height:150px;overflow-y:auto;"
                    >
                      {#each classes as cls}
                        <div class="form-check form-check-sm">
                          <input
                            id="class-{cls}"
                            type="checkbox"
                            class="form-check-input"
                            checked={filters.classes.includes(cls)}
                            on:change={() =>
                              toggleFilter("classes", cls)}
                          />
                          <label
                            for="class-{cls}"
                            class="form-check-label small"
                            >{cls}</label
                          >
                        </div>
                      {/each}
                    </div>
                  </Col>

                  <!-- Cinsiyet -->
                  <Col md="2">
                    <label
                      class="form-label small mb-2"
                      for="filter-genders"
                      ><strong>Cinsiyet</strong
                      >{#if filters.genders.length}<Badge
                          color="primary"
                          class="ms-1">{filters.genders.length}</Badge
                        >{/if}</label
                    >
                    <div
                      id="filter-genders"
                      class="border rounded p-2"
                      style="max-height:150px;overflow-y:auto;"
                    >
                      {#each genders as gend}
                        <div class="form-check form-check-sm">
                          <input
                            id="gend-{gend}"
                            type="checkbox"
                            class="form-check-input"
                            checked={filters.genders.includes(gend)}
                            on:change={() =>
                              toggleFilter("genders", gend)}
                          />
                          <label
                            for="gend-{gend}"
                            class="form-check-label small"
                            >{gend}</label
                          >
                        </div>
                      {/each}
                    </div>
                  </Col>

                  <!-- Roller -->
                  <Col md="3">
                    <label
                      class="form-label small mb-2"
                      for="filter-roles"
                      ><strong>Roller</strong
                      >{#if filters.roles.length}<Badge
                          color="primary"
                          class="ms-1">{filters.roles.length}</Badge
                        >{/if}</label
                    >
                    <div
                      id="filter-roles"
                      class="border rounded p-2"
                      style="max-height:150px;overflow-y:auto;"
                    >
                      {#each roles as role}
                        <div class="form-check form-check-sm">
                          <input
                            id="role-{role.id}"
                            type="checkbox"
                            class="form-check-input"
                            checked={filters.roles.includes(role.id)}
                            on:change={() =>
                              toggleFilter("roles", role.id)}
                          />
                          <label
                            for="role-{role.id}"
                            class="form-check-label small d-flex align-items-center"
                          >
                            <span style="color: {role.color};"
                              >{role.name}</span
                            >
                          </label>
                        </div>
                      {/each}
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    {/if}

    <!-- Bilgi satırı - Filtre kartının altında -->
    {#if filters.searchTerm.trim() || hasActiveFilters}
      <div class="d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center gap-3">
          {#if filters.searchTerm.trim()}
            <small class="text-muted">
              <i class="fas fa-search me-1"></i>
              Aranan:
              <strong
                >{filters.searchTerm
                  .trim()
                  .split(/\s+/)
                  .join(", ")}</strong
              >
            </small>
          {/if}
          <small class="text-muted">
            <i class="fas fa-users me-1"></i>
            <strong>{filteredCount}</strong> / {totalUsers} üye gösteriliyor
          </small>
        </div>
        <Button
          color="outline-danger"
          size="sm"
          on:click={onClearFilters}
          title="Tüm Filtreleri ve Aramayı Temizle"
        >
          <i class="fas fa-times me-1"></i>
          <span class="d-none d-sm-inline">Temizle</span>
        </Button>
      </div>
    {/if}
  </Col>
</Row>

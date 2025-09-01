<script lang="ts">
    import { Badge, Button, Card, CardBody, Col, Row } from "@sveltestrap/sveltestrap";
    import { slide } from "svelte/transition";
    import type { SessionType } from "$lib/types/types";

    export let showFilters: boolean = false;
    export let filters: {
        searchTerm: string;
        groups: string[];
        coaches: string[];
        statuses: string[];
        months: string[];
    };
    export let sessionData: SessionType[];
    export let activeFilterCount: number;
    export let hasActiveFilters: boolean;
    export let filteredCount: number;
    export let totalSessions: number;

    // Dinamik seçenekler
    $: groups = Array.from(
        new Set(sessionData.map((s) => s.group.name))
    ).sort();

    $: coaches = Array.from(
        new Set(sessionData.flatMap((s) => s.coaches.map(c => c.firstName + " " + c.lastName)))
    ).sort();

    const statuses = [
        { value: "completed", label: "Tamamlandı" },  
        { value: "cancelled", label: "İptal Edildi" }
    ];

    $: months = Array.from(
        new Set(sessionData.map((s) => {
            const date = new Date(s.startTime);
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        }))
    ).sort().reverse(); // En yeni ay önce

    function getMonthLabel(monthValue: string): string {
        const [year, month] = monthValue.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return date.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long' });
    }

    // toggle fonksiyonları
    function toggleFilter(category: keyof typeof filters, value: string) {
        if (category === 'searchTerm') {
            filters[category] = value;
        } else {
            const list = filters[category] as string[];
            filters[category] = list.includes(value)
                ? list.filter((v) => v !== value)
                : [...list, value];
        }
    }

    function onClearFilters() {
        filters = {
            searchTerm: "",
            groups: [],
            coaches: [],
            statuses: [],
            months: [],
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
                        <Badge color="primary" class="position-absolute top-0 start-100 translate-middle">
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
                        placeholder="Grup adı, antrenör adı veya notlarda ara..."
                        bind:value={filters.searchTerm}
                    />
                    {#if filters.searchTerm}
                        <button 
                            class="btn btn-outline-secondary" 
                            type="button"
                            on:click={() => filters.searchTerm = ""}
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
                                        <label class="form-label small mb-2" for="filter-groups">
                                            <strong>Gruplar</strong>
                                            {#if filters.groups.length}
                                                <Badge color="primary" class="ms-1">
                                                    {filters.groups.length}
                                                </Badge>
                                            {/if}
                                        </label>
                                        <div id="filter-groups"
                                            class="border rounded p-2"
                                            style="max-height:150px;overflow-y:auto;"
                                        >
                                            {#each groups as group}
                                                <div class="form-check form-check-sm">
                                                    <input
                                                        id="group-{group}"
                                                        type="checkbox"
                                                        class="form-check-input"
                                                        checked={filters.groups.includes(group)}
                                                        on:change={() => toggleFilter("groups", group)}
                                                    />
                                                    <label
                                                        for="group-{group}"
                                                        class="form-check-label small"
                                                    >
                                                        {group}
                                                    </label>
                                                </div>
                                            {/each}
                                        </div>
                                    </Col>

                                    <!-- Antrenörler -->
                                    <Col md="3">
                                        <label class="form-label small mb-2" for="filter-coaches">
                                            <strong>Antrenörler</strong>
                                            {#if filters.coaches.length}
                                                <Badge color="primary" class="ms-1">
                                                    {filters.coaches.length}
                                                </Badge>
                                            {/if}
                                        </label>
                                        <div id="filter-coaches"
                                            class="border rounded p-2"
                                            style="max-height:150px;overflow-y:auto;"
                                        >
                                            {#each coaches as coach}
                                                <div class="form-check form-check-sm">
                                                    <input
                                                        id="coach-{coach}"
                                                        type="checkbox"
                                                        class="form-check-input"
                                                        checked={filters.coaches.includes(coach)}
                                                        on:change={() => toggleFilter("coaches", coach)}
                                                    />
                                                    <label
                                                        for="coach-{coach}"
                                                        class="form-check-label small"
                                                    >
                                                        {coach}
                                                    </label>
                                                </div>
                                            {/each}
                                        </div>
                                    </Col>

                                    <!-- Durum -->
                                    <Col md="2">
                                        <label class="form-label small mb-2" for="filter-statuses">
                                            <strong>Durum</strong>
                                            {#if filters.statuses.length}
                                                <Badge color="primary" class="ms-1">
                                                    {filters.statuses.length}
                                                </Badge>
                                            {/if}
                                        </label>
                                        <div id="filter-statuses"
                                            class="border rounded p-2"
                                            style="max-height:150px;overflow-y:auto;"
                                        >
                                            {#each statuses as status}
                                                <div class="form-check form-check-sm">
                                                    <input
                                                        id="status-{status.value}"
                                                        type="checkbox"
                                                        class="form-check-input"
                                                        checked={filters.statuses.includes(status.value)}
                                                        on:change={() => toggleFilter("statuses", status.value)}
                                                    />
                                                    <label
                                                        for="status-{status.value}"
                                                        class="form-check-label small"
                                                    >
                                                        {status.label}
                                                    </label>
                                                </div>
                                            {/each}
                                        </div>
                                    </Col>

                                    <!-- Ay -->
                                    <Col md="4">
                                        <label class="form-label small mb-2" for="filter-months">
                                            <strong>Aylar</strong>
                                            {#if filters.months.length}
                                                <Badge color="primary" class="ms-1">
                                                    {filters.months.length}
                                                </Badge>
                                            {/if}
                                        </label>
                                        <div id="filter-months"
                                            class="border rounded p-2"
                                            style="max-height:150px;overflow-y:auto;"
                                        >
                                            {#each months as month}
                                                <div class="form-check form-check-sm">
                                                    <input
                                                        id="month-{month}"
                                                        type="checkbox"
                                                        class="form-check-input"
                                                        checked={filters.months.includes(month)}
                                                        on:change={() => toggleFilter("months", month)}
                                                    />
                                                    <label
                                                        for="month-{month}"
                                                        class="form-check-label small"
                                                    >
                                                        {getMonthLabel(month)}
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
                            Aranan: <strong>{filters.searchTerm.trim().split(/\s+/).join(', ')}</strong>
                        </small>
                    {/if}
                    <small class="text-muted">
                        <i class="fas fa-chalkboard-teacher me-1"></i>
                        <strong>{filteredCount}</strong> / {totalSessions} ders gösteriliyor
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
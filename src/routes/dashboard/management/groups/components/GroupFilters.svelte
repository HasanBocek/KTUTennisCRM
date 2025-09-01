<script lang="ts">
  import { Col, Row } from "@sveltestrap/sveltestrap";
  export let searchTerm: string = "";
</script>

<!-- Arama ve Filtre toggle -->
<Row class="mb-3">
  <Col xs="12">
    <!-- Arama Kutusu ve Filtre Butonu -->
    <div class="d-flex gap-2 mb-3">
      <!-- Arama Kutusu -->

      <div class="flex-fill">
        <div class="input-group">
          <span class="input-group-text">
            <i class="fas fa-search"></i>
          </span>
          <input
            type="text"
            class="form-control"
            placeholder="Grup adı, açıklama veya notlarda ara..."
            bind:value={searchTerm}
          />
          {#if searchTerm}
            <button
              class="btn btn-outline-secondary"
              type="button"
              on:click={() => (searchTerm = "")}
              title="Aramayı temizle"
            >
              <i class="fas fa-times"></i>
            </button>
          {/if}
        </div>
      </div>
    </div>
  </Col>
</Row>
<script lang="ts">
  import DefaultLayout from "$lib/layouts/DefaultLayout.svelte";
  import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Col,
    Row,
  } from "@sveltestrap/sveltestrap";
  import { GroupListData } from "$lib/assets/data/mock/data";
  import type { MeType } from "$lib/types/types";
  export let data: { user: MeType };
  import GroupTable from "./components/GroupTable.svelte";
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
          </Row>
        </CardHeader>
        <CardBody class="pt-0">
          <!-- Tablo -->
          <GroupTable {GroupListData} />
        </CardBody>
      </Card>
    </Col>
  </Row>
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

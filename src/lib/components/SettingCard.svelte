<script lang="ts">
    import { Card, CardHeader, CardTitle, CardBody, Form, Input, Button, Row, Col } from "@sveltestrap/sveltestrap";

    export let title: string;
</script>

<Card>
    <CardHeader>
      <Row class="align-items-center">
        <Col>
          <CardTitle>{title}</CardTitle>
        </Col>
      </Row>
    </CardHeader>
    <CardBody class="pt-0">
        <slot />
    </CardBody>
  </Card>
  
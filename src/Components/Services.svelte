<!-- services component -->
<script>
  import { Col, Row, Container } from "sveltestrap";

  export let serviceData = {};
  const { heading, description, services_list } = serviceData;
</script>

<!--START SERVICES-->
<section class="section pt-5 common-section" id="services">
  <Container>
    <Row>
      <Col lg={{ size: 8, offset: 2 }}>
        <h1 class="section-title text-center">{heading}</h1>
        <div class="section-title-border mt-3" />
        <p class="section-subtitle text-muted text-center pt-4 font-secondary">
          {description}
        </p>
      </Col>
    </Row>
    <Row class="mt-4">
      {#each services_list as list}
        <Col lg="4" class="mt-3">
          <div class="services-box text-center hover-effect">
            <i class="{list.icon} text-primary" />
            <h4 class="pt-3">{list.label}</h4>
            <p class="pt-3 text-muted">{list.text}</p>
          </div>
        </Col>
      {/each}
    </Row>
  </Container>
</section>
<!--START SERVICES-->

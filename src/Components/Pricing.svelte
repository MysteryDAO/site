<!-- pricing component -->
<script>
  import { Col, Row, Container } from "sveltestrap";

  export let pricingData = {};
  const { title, description, pricing_list } = pricingData;
</script>

<!--START PRICING-->
<section class="section pt-5 common-section" id="pricing">
  <Container>
    <Row>
      <Col lg={{ size: 8, offset: 2 }}>
        <h1 class="section-title text-center">{title}</h1>
        <div class="section-title-border mt-3" />
        <p class="section-subtitle font-secondary text-muted text-center pt-4">
          {description}
        </p>
      </Col>
    </Row>
    <Row class="mt-5">
      {#each pricing_list as list}
        <Col lg="4">
          <div class="text-center pricing-box hover-effect">
            <h4 class="text-uppercase">{list.title}</h4>
            <h1>{list.price}</h1>
            <h6 class="text-uppercase text-muted">Billing Per Month</h6>
            <div class="pricing-border" />
            <div class="plan-features mt-4">
              <p>Bandwidth: <b class="text-primary">{list.bandwidth}</b></p>
              <p>Onlinespace: <b class="text-primary">{list.space}</b></p>
              <p>Support: <b class="text-primary">{list.support}</b></p>
              <p><b class="text-primary">1</b> Domain</p>
              <p><b class="text-primary">No</b> Hidden Fees</p>
            </div>
            <a href={"#"} class="btn btn-primary waves-effect waves-light mt-4"
              >Join Now</a
            >
          </div>
        </Col>
      {/each}
    </Row>
  </Container>
</section>
<!--ENd PRICING-->

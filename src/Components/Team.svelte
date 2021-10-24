<!-- Team component -->
<script>
  import { Col, Row, Container } from "sveltestrap";

  export let teamData = {};
  const { title, description, team_list } = teamData;
</script>

<!--START TEAM-->
<section class="section pt-4 common-section" id="team">
  <Container>
    <Row>
      <Col lg={{ size: 8, offset: 2 }}>
        <h1 class="section-title text-center">{title}</h1>
        <div class="section-title-border mt-3" />
        <p class="section-subtitle text-muted text-center font-secondary pt-4">
          {description}
        </p>
      </Col>
    </Row>
    <Row class="mt-5">
      {#each team_list as list}
        <Col lg="3" sm="6">
          <div class="team-box text-center hover-effect">
            <div class="team-wrapper">
              <div class="team-member">
                <img alt="" src={list.profile} class="img-fluid rounded" />
              </div>
            </div>
            <h4 class="team-name">{list.name}</h4>
            <p class="text-uppercase team-designation">{list.designation}</p>
          </div>
        </Col>
      {/each}
    </Row>
  </Container>
</section>
<!--END TEAM-->

<!--START PROCESS-->
<section class="section bg-light">
  <Container>
    <Row>
      <Col lg={{ size: 8, offset: 2 }}>
        <h1 class="section-title text-center">Work Process</h1>
        <div class="section-title-border mt-3" />
        <p class="section-subtitle text-muted text-center font-secondary pt-4">
          In an ideal world this website wouldn’t exist, a client would
          acknowledge the importance of having web copy before the Proin vitae
          ipsum vel ex finibus semper design starts.
        </p>
      </Col>
    </Row>
    <Row>
      <Col lg="6" class="text-center process-left-icon-1">
        <i class="pe-7s-angle-right" />
      </Col>
      <Col lg="6" class="text-center process-left-icon-2">
        <i class="pe-7s-angle-right" />
      </Col>
    </Row>
    <Row class="mt-5">
      <Col lg="4" class="plan-line">
        <div class="text-center process-box">
          <i class="pe-7s-pen text-primary" />
          <h4 class="pt-3">Tell us what you need</h4>
          <p class="text-muted">The Big Oxmox advised her not to do so.</p>
        </div>
      </Col>
      <Col lg="4" class="plan-line">
        <div class="text-center process-box">
          <i class="pe-7s-id text-primary" />
          <h4 class="pt-3">Get free quotes</h4>
          <p class="text-muted">Little Blind Text didn’t listen.</p>
        </div>
      </Col>
      <Col lg="4">
        <div class="text-center process-box">
          <i class="pe-7s-target text-primary" />
          <h4 class="pt-3">Deliver high quality product</h4>
          <p class="text-muted">When she reached the first hills.</p>
        </div>
      </Col>
      <div class="text-center mx-auto">
        <a href={"#"} class="btn btn-primary waves-light waves-effect mt-5"
          >Get Started <i class="mdi mdi-arrow-right" /></a
        >
      </div>
    </Row>
  </Container>
</section>
<!--END PROCESS-->

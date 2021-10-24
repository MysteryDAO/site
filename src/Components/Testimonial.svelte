<!-- Testimonial component -->
<script>
  import { Col, Row, Container } from "sveltestrap";

  export let testimonialData = {};
  const { title, description, testimonial_list } = testimonialData;
</script>

<!--START TESTIMONIAL-->
<section class="section" id="testi">
  <Container>
    <Row>
      <Col lg={{size:8, offset: 2}}>
        <h1 class="section-title text-center">{title}</h1>
        <div class="section-title-border mt-3" />
        <p class="section-subtitle text-muted text-center font-secondary pt-4">
          {description}
        </p>
      </Col>
    </Row>
    <Row class="mt-5">
      {#each testimonial_list as list}
        <Col lg="4">
          <div class="testimonial-box hover-effect mt-4">
            <img
              src={list.profile}
              alt=""
              class="img-fluid d-block img-thumbnail rounded-circle"
            />
            <div class="testimonial-decs">
              <p class="text-muted text-center mb-0">“{list.description}”</p>
            </div>
            <h5 class="text-center text-uppercase pt-3">
              {list.name}<span class="text-muted text-capitalize"
                >{list.text}</span
              >
            </h5>
          </div>
        </Col>
      {/each}
    </Row>
  </Container>
</section>
<!--END TESTIMONIAL-->

<!--START GET STARTED-->
<section class="section section-lg bg-get-start">
  <div class="bg-overlay" />
  <Container>
    <Row>
      <Col lg={{size:8, offset: 2}} class="text-center">
        <h1 class="get-started-title text-white">Let's Get Started</h1>
        <div class="section-title-border mt-4 bg-white" />
        <p class="section-subtitle font-secondary text-white text-center pt-4">
          Far far away, behind the word mountains, far from the countries
          Vokalia and Consonantia, there live the blind texts.
        </p>
        <a href="{'#'}" class="btn btn-white waves-effect mt-3 mb-4"
          >Get Started <i class="mdi mdi-arrow-right" />
        </a>
      </Col>
    </Row>
  </Container>
  <div class="bg-pattern-effect">
    <img src="images/bg-pattern-light.png" alt="" />
  </div>
</section>
<!--END GET STARTED-->

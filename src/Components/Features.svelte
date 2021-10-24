<!-- Features Component -->
<script>
  import { Col, Row, Container} from "sveltestrap";

  export let featureData = {};
  const { title, text, feature_list } = featureData;
</script>

<!--END ABOUT US-->
<section class="section bg-light common-section" id="features">
  <Container>
    <Row class="vertical-content">
      <Col lg="5">
        <div class="features-box">
          <h3>
            {title}
          </h3>
          <p class="text-muted web-desc">
            {text}
          </p>
          <ul class="text-muted list-unstyled mt-4 features-item-list">
            {#each feature_list as list}
              <li class="">{list}</li>
            {/each}
          </ul>
          <a href="{'#'}" class="btn btn-primary mt-4 waves-effect waves-light"
            >Learn More <i class="mdi mdi-arrow-right" /></a
          >
        </div>
      </Col>
      <Col lg="7">
        <div class="features-img features-right text-end">
          <img
            src="images/online-world.png"
            alt="macbook"
            class="img-fluid"
          />
        </div>
      </Col>
    </Row>
  </Container>
</section>
<!--END ABOUT US-->

<!--START WEBSITE-DESCRIPTION-->
<section class="section section-lg bg-web-desc">
  <div class="bg-overlay" />
  <Container>
    <Row>
      <Col lg="12" class="text-center">
        <h2 class="text-white" id="trade">Buy MysteryDAO</h2>
        <p class="pt-3 home-desc">
          Buy MysteryDAO token
        </p>
        <a href="{'#'}" class="btn btn-white mt-4 waves-effect waves-light mb-5"
          >Trade now!</a
        >
      </Col>
    </Row>
  </Container>
  <div class="bg-pattern-effect">
    <img src="images/bg-pattern.png" alt="" />
  </div>
</section>

<!--END WEBSITE-DESCRIPTION-->

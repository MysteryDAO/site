<!-- Footer Component -->
<script>
  import { Col, Row, Container } from "sveltestrap";
</script>

<!--START FOOTER-->
<footer class="footer">
  <Container>
    <Row>
      <Col lg="3" class="mt-4">
        <h4>MYSTERYDAO</h4>
        <div class="text-muted mt-4">
          <ul class="list-unstyled footer-list">
            <li><a href={"#"}>Home</a></li>
            <li><a href={"#"}>About</a></li>
            <li><a href={"#"}>Tokenomics</a></li>
            <li><a href={"#"}>Trade</a></li>
          </ul>
        </div>
      </Col>
      <Col lg="3" class="mt-4">
        <h4>Socials</h4>
        <div class="text-muted mt-4">
          <ul class="list-unstyled footer-list">
            <li><a href={"#"}>Twitter</a></li>
            <li><a href={"#"}>Telegram</a></li>
            <li><a href={"#"}>Discord</a></li>
          </ul>
        </div>
      </Col>
      <Col lg="3" class="mt-4">
        <div class="text-muted mt-4">
          </div>
        </Col>
     <!-- <Col lg="3" class="mt-4">
        <h4>Support</h4>
        <div class="text-muted mt-4">
          <ul class="list-unstyled footer-list">
            <li><a href={"#"}>FAQ</a></li>
            <li><a href={"#"}>Contact</a></li>
            <li><a href={"#"}>Disscusion</a></li>
          </ul>
        </div>
      </Col> -->
      <Col lg="3" class="mt-4">
        <h4>Subscribe</h4>
        <div class="text-muted mt-4">
        </div>
        <form class="form subscribe">
          <input placeholder="Email" class="form-control" required />
          <a href={"#"} class="submit"><i class="pe-7s-paper-plane" /></a>
        </form>
      </Col>
    </Row>
  </Container>
</footer>
<!--END FOOTER-->

<!--START FOOTER ALTER-->
<div class="footer-alt">
  <Container>
    <Row>
      <Col lg="12">
        <div class="float-start pull-none ">
          <p class="copy-rights text-muted">
            {new Date().getFullYear()}
            © MysterDAO - Only on Lamden
          </p>
        </div>
        <div class="float-end pull-none ">
        </div>
        <div class="clearfix" />
      </Col>
    </Row>
  </Container>
</div>
<!--START FOOTER ALTER-->

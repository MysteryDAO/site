<!-- Index-3 component -->
<script>
  import { Modal, ModalBody, ModalHeader } from "sveltestrap";

  import Navbar from "../Components/Navbar.svelte";
  import Services from "../Components/Services.svelte";
  import Features from "../Components/Features.svelte";
  import Pricing from "../Components/Pricing.svelte";
  import Team from "../Components/Team.svelte";
  import Testimonial from "../Components/Testimonial.svelte";
  import Blog from "../Components/Blog.svelte";
  import Contact from "../Components/Contact.svelte";
  import Footer from "../Components/Footer.svelte";
  import Switcher from "../Components/Switcher.svelte";

  import data from "../Data/data";

  let open = false;
  const toggle = () => {
    size = "lg";
    open = !open;
  };

</script>

<!-- STRAT NAVBAR -->
<Navbar />
<!-- END NAVBAR -->
<!--START HOME-->
<section
  class="section bg-home vh-100 common-section"
  id="home"
  data-image-src="images/bg-home.png"
>
  <div class="bg-overlay" />
  <div class="display-table">
    <div class="display-table-cell">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8 text-white text-center">
            <h1 class="home-title">We help startups launch their products</h1>
            <p class="pt-3 home-desc">
              Etiam sed.Interdum consequat proin vestibulum class at a euismod
              mus luctus quam.Lorem ipsum dolor sit amet, consectetur
              adipisicing eli.
            </p>
            <p class="play-shadow mt-4" on:click={toggle}>
              <a href={"#"} class="play-btn video-play-icon"
                ><i class="mdi mdi-play text-center" /></a
              >
            </p>
            <Modal isOpen={open} {toggle} size = "lg">
              <ModalHeader {toggle} />
              <ModalBody>
                <video
                  id="VisaChipCardVideo"
                  class="video-box"
                  src="https://www.w3schools.com/html/mov_bbb.mp4"
                  controls
                >
                  <track default kind="captions" type="video/mp4" />
                </video>
              </ModalBody>
            </Modal>
            <!-- Modal -->
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="bg-pattern-effect">
    <img src="images/bg-pattern.png" alt="" />
  </div>
</section>
<!--END HOME-->
<Services serviceData={data.SERVICE_DATA} />
<Features featureData={data.FEATURES_DATA} />
<Pricing pricingData={data.PRICING_DATA} />
<Team teamData={data.TEAM_DATA} />
<Testimonial testimonialData={data.TESATIMONIAL_DATA} />
<Blog blogData={data.BLOG_DATA} />
<Contact />
<Footer />
<Switcher />

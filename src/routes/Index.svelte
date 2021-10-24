<!-- Index-1 component -->
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
  /**
   * Toggle modal
   */
  const toggle = () => {
    open = !open;
  };

</script>

<!-- STRAT NAVBAR -->
<Navbar />
<!-- END NAVBAR -->
<!--START HOME-->

<section
  class="section bg-home home-half active common-section"
  id="home"
  data-image-src="images/bg-home.png"
>
  <div class="bg-overlay" />
  <div class="display-table">
    <div class="display-table-cell">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8 text-white text-center">
            <div class="mt-4">
              <div style="width:100%;height:0px;position:relative;padding-bottom:56.250%;">
                <iframe src="https://streamable.com/e/5nu1sd?nocontrols=1" frameborder="0" width="100%" height="80%" allowfullscreen style="width:100%;height:100%;position:absolute;left:0px;top:0px;overflow:hidden;" title="video"></iframe></div>
            </div>
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
<Footer />
<Switcher />

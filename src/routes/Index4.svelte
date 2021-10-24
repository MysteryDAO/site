<!-- Index-4 component -->
<script>
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
</script>

<!-- STRAT NAVBAR -->
<Navbar />
<!-- END NAVBAR -->

<!--START HOME-->
<section
  class="section bg-home home-half home-registration common-section"
  id="home"
  data-image-src="images/bg-home.png"
>
  <div class="bg-overlay" />
  <div class="display-table">
    <div class="display-table-cell">
      <div class="container">
        <div class="row vertical-content">
          <div class="col-lg-7 text-white text-start mt-4">
            <h1 class="home-title">We help startups launch their products</h1>
            <p class="pt-3 home-desc home-subtitle-width-100">
              Etiam sed.Interdum consequat proin vestibulum class at a euismod
              mus luctus quam.Lorem ipsum dolor sit amet, consectetur
              adipisicing eli.
            </p>
            <a href={"#"} class="btn btn-primary mt-4 waves-effect waves-light"
              >Get Started <i class="mdi mdi-arrow-right" /></a
            >
          </div>
          <div class="col-lg-4 offset-lg-1 mt-4">
            <div class="home-registration-form bg-white">
              <h4 class="form-heading text-center mt-2">
                Get 30 day FREE Trial
              </h4>
              <form class="registration-form" id="registration-form">
                <input
                  type="text"
                  id="exampleInputName1"
                  class="form-control registration-input-box"
                  placeholder="Name"
                />
                <input
                  type="email"
                  id="exampleInputEmail1"
                  class="form-control registration-input-box"
                  placeholder="Email"
                />
                <textarea
                  class="form-control registration-textarea-box"
                  rows="4"
                  placeholder="Message"
                />
                <button class="btn btn-primary w-100 waves-effect waves-light"
                  >Send Detail</button
                >
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
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

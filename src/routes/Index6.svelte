<!-- Index-6 component -->
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
<section class="section bg-home home-half common-section" id="home">
  <div class="bg-overlay" />
  <div class="display-table">
    <div class="home-cell-bottom">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8 text-white text-center">
            <h1 class="home-title">We help startups launch their products</h1>
            <p class="pt-3 home-desc">
              Etiam sed.Interdum consequat proin vestibulum class at a euismod
              mus luctus quam.Lorem ipsum dolor sit amet, consectetur
              adipisicing eli.
            </p>
            <div class="text-center subscribe-form mt-5">
              <form action="#">
                <input type="text" placeholder="Email" />
                <button type="submit" class="btn btn-primary">Subscribe</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
<!--END HOME-->
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

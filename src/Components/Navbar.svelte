<!-- Navbar component -->
<script>
  import { Link } from "svelte-routing";

  import { scrollto } from "svelte-scrollto";
  import { onMount } from "svelte";
  import { Button } from "sveltestrap";

  /**
   * Toggle menu
   */
  const toggleMenu = () => {
    document.getElementById("navbarCollapse").classList.toggle("show");
  };

  /**
   * Component mount
   */
  onMount(() => {
    var section = document.querySelectorAll(".common-section");
    var sections = {};
    var i = 0;

    Array.prototype.forEach.call(section, function (e) {
      sections[e.id] = e.offsetTop;
    });

    window.onscroll = function () {
      var scrollPosition =
        document.documentElement.scrollTop || document.body.scrollTop;
      for (i in sections) {
        if (sections[i] <= scrollPosition) {
          document.querySelector(".active").setAttribute("class", " ");
          document
            .querySelector("a[href*=" + i + "]")
            .setAttribute("class", "active");
        }
      }
    };
  });

  /**
   * Scroll method
   */
  const handleScroll = () => {
    var navbar = document.getElementById("navbar");
    if (
      document.body.scrollTop > 50 ||
      document.documentElement.scrollTop > 50
    ) {
      navbar.classList.add("is-sticky");
    } else {
      navbar.classList.remove("is-sticky");
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: false });
</script>

<!-- STRAT NAVBAR -->

<div id="navbar">
  <nav
    class="navbar navbar-expand-lg fixed-top navbar-custom sticky sticky-dark"
    id="navbar"
  >
    <div class="container">
      <!-- LOGO -->
      <Link class="navbar-brand logo text-uppercase" to="/"> <img src="/images/logo.png" alt="Logo" height="100px;"> </Link>
      <Button class="navbar-toggler" on:click={toggleMenu}>
        <i class="mdi mdi-menu" />
      </Button>
      <div class="collapse navbar-collapse" id="navbarCollapse">
        <ul class="navbar-nav navbar-center" id="navbar-navlist">
          <li class="nav-item">
            <a use:scrollto={"#home"} href={"#home"} class="nav-link active"
              >Home</a
            >
          </li>
          <li class="nav-item">
            <a use:scrollto={"#services"} href={"#services"} class="nav-link"
              >About</a
            >
          </li>
          <li class="nav-item">
            <a use:scrollto={"#features"} href={"#features"} class="nav-link"
              >Tokenomics</a
            >
          </li>
          <li class="nav-item">
            <a use:scrollto={"#trade"} href={"#trade"} class="nav-link"
              >Trade</a
            >
          </li>
          
          <li class="nav-item">
            <a use:scrollto={"#features"} href={"#features"} class="nav-link"
              >Link</a
            >
          </li>
          <li class="nav-item">
            <a use:scrollto={"#features"} href={"#features"} class="nav-link"
              >Link</a
            >
          </li>
        </ul>

      </div>
    </div>
  </nav>
</div>
<!-- END NAVBAR -->

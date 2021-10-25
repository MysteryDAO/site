<script>
  import { Router, Route } from "svelte-routing";

  import Index1 from "./routes/Index.svelte";
  import Index2 from "./routes/Index2.svelte";
  import Index3 from "./routes/Index3.svelte";
  import Index4 from "./routes/Index4.svelte";
  import Index5 from "./routes/Index5.svelte";
  import Index6 from "./routes/Index6.svelte";
  import Index7 from "./routes/Index7.svelte";
  import Index8 from "./routes/Index8.svelte";
  import Login from "./routes/login.svelte";
  import Signup from "./routes/signup.svelte";
  import Password_forget from "./routes/password_forget.svelte";

  export let url = "";
</script>

<Router {url}>
  <div>
    <Route path="/"><Index1 /></Route>
  </div>
</Router>

<!-- Login component -->
<script>
  import { Link } from "svelte-routing";
</script>

<div class="account-home-btn d-none d-sm-block">
  <Link to="/" class="text-white"><i class="mdi mdi-home h1" /></Link>
</div>

<section class="bg-account-pages vh-100">
  <div class="display-table">
    <div class="display-table-cell">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-5">
            <div class="card account-card">
              <div class="card-body">
                <div class="text-center mt-3">
                  <h3 class="fw-bold">
                    <Link
                      to="/"
                      class="text-dark text-uppercase account-pages-logo"
                      >Dorsin</Link
                    >
                  </h3>
                  <p class="text-muted">Sign in to continue to Dorsin.</p>
                </div>
                <div class="p-3">
                  <form>
                    <div class="form-group">
                      <label for="username">Username</label>
                      <input
                        type="text"
                        class="form-control"
                        id="username"
                        placeholder="Enter username"
                      />
                    </div>

                    <div class="form-group">
                      <label for="userpassword">Password</label>
                      <input
                        type="password"
                        class="form-control"
                        id="userpassword"
                        placeholder="Enter password"
                      />
                    </div>

                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckDefault"
                      />
                      <label class="form-check-label" for="flexCheckDefault">
                        Remember me
                      </label>
                    </div>

                    <div class="d-grid mt-3">
                      <button type="submit" class="btn btn-primary"
                        >Log In</button
                      >
                    </div>

                    <div class="mt-4 mb-0 text-center">
                      <Link to="/password_forget" class="text-dark"
                        ><i class="mdi mdi-lock" /> Forgot your password?</Link
                      >
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <!-- end card -->
          </div>
          <!-- end col -->
        </div>
        <!-- end row -->
      </div>
    </div>
  </div>
</section>
<!-- end account-pages  -->

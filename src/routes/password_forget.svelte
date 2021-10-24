<!-- Password-forget component -->
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
                  <p class="text-muted">Reset Password</p>
                </div>
                <div class="p-3">
                  <div class="alert alert-warning  text-center" role="alert">
                    Enter your email address and we'll send you an email with
                    instructions to reset your password.
                  </div>
                  <form>
                    <div class="form-group">
                      <label for="email">Email</label>
                      <input
                        type="password"
                        class="form-control"
                        id="email"
                        placeholder="Enter Email"
                      />
                    </div>

                    <div class="d-grid mt-3">
                      <button type="submit" class="btn btn-primary"
                        >Reset your Password</button
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

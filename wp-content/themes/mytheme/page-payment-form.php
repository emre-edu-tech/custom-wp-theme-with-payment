<?php get_header() ?>
    <div class="container">
        <div class="row mt-5">
            <div class="col-10">
                <div class="sr-root">
                    <div class="sr-main">
                        <form id="payment-form" class="sr-payment-form">

                            <input type="text" name="paymentAmount" id="paymentAmount" placeholder="Enter payment" disabled class="mb-3">

                            <div class="sr-combo-inputs-row">
                                <div class="sr-input sr-card-element" id="card-element">
                                    <!-- Card elements will be loaded here -->
                                </div>
                            </div>

                            <!-- We'll put the error messages in this element -->
                            <div class="sr-field-error" id="card-errors" role="alert"></div>

                            <button class="btn btn-primary mt-3" id="submit">
                                <div class="spinner hidden" id="spinner"></div>
                                <span id="button-text">Pay</span><span id="order-amount"></span>
                            </button>
                        </form>

                        <div class="sr-result hidden">
                            <p>Payment completed<br /></p>
                            <pre>
                                <code></code>
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
<?php get_footer(); ?>
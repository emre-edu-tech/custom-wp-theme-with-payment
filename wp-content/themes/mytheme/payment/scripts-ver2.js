// A reference to stripe object in Stripe.js for global usage
var stripe = undefined;

var orderData = {
    items: [
        {
            id: 'photo-subscription'
        }
    ],
    currency: 'usd'
};

// Disable the button until we have Stripe setup on the page
var submitBtn = document.querySelector('button');
submitBtn.disabled = true;

fetch('/wp-content/themes/mytheme/payment/create-payment-intent-v2.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData)
}).then(function(result) {
    return result.json();
}).then(function(data) {
    // data comes from php file and we send it as parameter to setupElements() function
    // Then this function returns stripe, card and clientsecret as an object to closure function as parameter
    return setupElements(data);
}).then(function({ stripe, card, clientSecret }) {
    // card elements are ready enable submit button
    submitBtn.disabled = false;

    // handle form submission
    var form = document.getElementById('payment-form');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        // initate payment when submit button is clicked
        pay(stripe, card, clientSecret);
    });
});

// Set up Stripe.js and Elements to use in checkout form
// return stripe, card and clientsecret
var setupElements = function(data) {
    // Create stripe objects and html elements
    stripe = Stripe(data.publishableKey);
    var elements = stripe.elements();
    var elementsStyle = {
        base: {
            color: "#32325d",
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: "antialiased",
            fontSize: "16px",
            "::placeholder": {
                color: "#aab7c4"
            }
        },
        invalid: {
            color: "#fa755a",
            iconColor: "#fa755a"
        }
    };

    var card = elements.create('card', {style: elementsStyle});
    card.mount('#card-element');

    // return stripe, card and client secret
    return {
        stripe: stripe,
        card: card,
        clientSecret: data.clientSecret
    };
}

/**
 *  calls stripe.confirmCardPayment which creates a pop-up modal
 *  to prompt the user to enter extra authentication details without leaving page
 */
var pay = function(stripe, card, clientSecret) {
    changeLoadingState(true);

    // initiate the payment
    // If authentication is required, confirmCardPayment will automatically display a modal
    stripe.confirmCardPayment(clientSecret, {
        payment_method: {
            card: card,
            billing_details: {
                name: 'Media Pons',
                email: 'payment@media-pons.de',
                address: {
                    city: 'Frankfurt'
                }
            }
        }
    } ).then(function(result) {
            if(result.error) {
                // Show error to your customer
                showError(result.error.message);
            } else {
                // The payment has been processed
                Swal.fire({
                    title: 'Success',
                    text: 'Payment Completed',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                orderComplete(clientSecret);
            }
        });
}

/**------- Post-payment helpers ----------- */
var changeLoadingState = function(isLoading) {
    if (isLoading) {
        submitBtn.disabled = true;
        document.querySelector("#spinner").classList.remove("hidden");
        document.querySelector("#button-text").classList.add("hidden");
    } else {
        submitBtn.disabled = false;
        document.querySelector("#spinner").classList.add("hidden");
        document.querySelector("#button-text").classList.remove("hidden");
    }
}

var showError = function(errorMsgText) {
    changeLoadingState(false);

    var errorMsg = document.querySelector('.sr-field-error');
    errorMsg.textContent = errorMsgText;
    // empty error message after 4 seconds
    setTimeout(() => {
        errorMsg.textContent = '';
    }, 4000);
}

// Shows a success / error message when the payment is complete
var orderComplete = function(clientSecret) {
    stripe.retrievePaymentIntent(clientSecret)
        .then(function(result) {
            var paymentIntent = result.paymentIntent;
            var paymentIntentJson = JSON.stringify(paymentIntent, null, 2);

            document.querySelector('.sr-payment-form').classList.add('hidden');
            document.querySelector('pre').textContent = paymentIntentJson;

            document.querySelector('.sr-result').classList.remove('hidden');
            setTimeout(() => {
               document.querySelector('.sr-result').classList.add('expand'); 
            }, 200);

            changeLoadingState(false);
        })
}
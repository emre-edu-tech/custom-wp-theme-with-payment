var stripe = Stripe('pk_test_1FjxJ13xDitXp8rC6EJvzZaE');
var elements = stripe.elements();
var style = {
	base: {
		color: "#32325d",
	}
};

var cardElement = elements.create("card", { style: style });
cardElement.mount("#card-element");

cardElement.on('change', function(event) {
	var displayError = document.getElementById('card-errors');
	if (event.error) {
		displayError.textContent = event.error.message;
	} else {
		displayError.textContent = '';
	}
});

var form = document.getElementById('payment-form');

form.addEventListener('submit', function(ev) {
	ev.preventDefault();
    var paymentInput = $('#paymentAmount');
	$.ajax({
        url: '/wp-content/themes/mytheme/payment/create-payment-intent.php',
        data: {
            paymentAmount: paymentInput.val(),
        },
        method: 'POST',
        dataType: 'json',
        success: function(data){
            let clientSecret = data.clientSecret;
            stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: 'Media Pons',
                        email: 'info@media-pons.de',
                        address: {
                            city: 'Frankfurt'
                        }
                    }
                }
            }).then(function(result) {
                if (result.error) {
                    // Show error to your customer (e.g., insufficient funds)
                    console.log(result.error.message);
                } else {
                    // The payment has been processed!
                    if (result.paymentIntent.status === 'succeeded') {
                        cardElement.clear();    // empty card elements
                        paymentInput.val('');   // empty form values other than card elements
                        alert('You have successfully made the payment');
                        // Show a success message to your customer
                        // There's a risk of the customer closing the window before callback
                        // execution. Set up a webhook or plugin to listen for the
                        // payment_intent.succeeded event that handles any business critical
                        // post-payment actions.
                    }
                }
            });
        },
        error: function(error) {
            console.log(error);
        }
    });
});
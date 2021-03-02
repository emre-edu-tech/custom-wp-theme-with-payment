<?php

require_once 'shared.php';

$orderAmount = floatval(trim($_POST['paymentAmount'])) * 100; // convert amount to cents

$paymentIntent = \Stripe\PaymentIntent::create([
    'amount' => $orderAmount,
    'currency' => 'usd',
    // Verify your integration in this guide by including this parameter
    'metadata' => ['integration_check' => 'accept_a_payment'],
]);

$output = [
    'publishableKey' => $config['stripe_publishable_key'],
    'clientSecret' => $paymentIntent->client_secret,
];

echo json_encode($output);
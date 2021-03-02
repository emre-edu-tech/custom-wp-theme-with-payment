<?php

require 'vendor/autoload.php';

header('Content-Type: application/json');

// config file includes Stripe publishable and secret keys also webhook secret
$config = parse_ini_file('config.ini');

// Make sure the configuratio file is ok
if(!$config) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Internal Server Error'
    ]);
    exit;
}

\Stripe\Stripe::setVerifySslCerts(false);   // use this line only on development
\Stripe\Stripe::setApiKey($config['stripe_secret_key']);

$input = file_get_contents('php://input');
$body = json_decode($input);

if ($_SERVER['REQUEST_METHOD'] !== 'POST' || json_last_error() !== JSON_ERROR_NONE) {
	http_response_code(400);
	echo json_encode([ 'error' => 'Invalid request.' ]);
	exit;
}
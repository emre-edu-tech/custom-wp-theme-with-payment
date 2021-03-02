<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>
	<?php wp_head(); ?>
	<?php if (is_page('payment-form')): ?>
    	<script src="https://js.stripe.com/v3/"></script>
		<link rel="stylesheet" href="<?php echo get_template_directory_uri() . '/payment/payment.css' ?>">
	<?php endif ?>
</head>
<body <?php body_class() ?>>
	
</body>
</html>
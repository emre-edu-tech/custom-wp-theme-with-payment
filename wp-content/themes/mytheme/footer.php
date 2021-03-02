<?php wp_footer() ?>
<?php if (is_page('payment-form')): ?>
    <script src="<?php echo get_template_directory_uri() . '/payment/sweetalert2.all.min.js' ?>"></script>
    <script src="<?php echo get_template_directory_uri() . '/payment/scripts-ver2.js' ?>"></script>
<?php endif ?>

</body>
</html>
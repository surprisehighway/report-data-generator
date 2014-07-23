<?php

require 'vendor/autoload.php';

$config = [
    'numberEvents' => 30,
    'start' => date('Y-m-01'),
    'end' => date('Y-m-t')
];

$generator = new DataGenerator($config);

# Pretty Print Json
// echo '<pre>';
// echo $generator->display(true);
// echo '</pre>';

# Don't pretty print
# Download JSONView to auto-format JSON in chrome.
# https://chrome.google.com/webstore/detail/jsonview/chklaanhfefbnpoihckbnefhakgolnmc
echo $generator->display();
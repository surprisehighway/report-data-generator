<?php

require 'vendor/autoload.php';

$config = [
    'numberEvents' => 4,
    'start' => date('Y-m-01'),
    'end' => date('Y-m-t')
];

$generator = new DataGenerator($config);

# Pretty Print Json
echo '<pre>';
echo $generator->display(true);
echo '</pre>';

# Don't pretty print
// echo $generator->display();
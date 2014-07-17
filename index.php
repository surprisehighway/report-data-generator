<?php

require 'vendor/autoload.php';

$config = [
    'numberEvents' => 50,
    'start' => date('Y-m-01'),
    'end' => date('Y-m-t')
];

$generator = new DataGenerator($config);

echo $generator->prettyPrint();
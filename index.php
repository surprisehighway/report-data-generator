<?php

require 'vendor/autoload.php';

$config = [
    'numberEvents' => ( isset($_GET["events"]) ? $_GET["events"] : 30 ),
    'groups' => ( isset($_GET["groups"]) && $_GET["groups"] <= 5 ? $_GET["groups"] : 5 ),
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
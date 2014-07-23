<?php

class DataGenerator {

    public $config;

    public function __construct($config)
    {
        $this->config = $config;
    }

    public function generate()
    {
        $numEvents = $this->config['numberEvents'];
        $groups = 4;
        $data = [];

        //Create a reference to dummy entries
        $entries = [];

        for ($c=1; $c < $numEvents + 1; $c++) {
            $entries[$c] = array($c, $this->randomDate(), rand(0, 400));
        }

        //Generate dummy data
        for ($i=1; $i < $groups + 1; $i++) {

            $events = new stdClass;

            switch ($i) {
                case 1:
                   $events->group = "Old Members";
                    break;
                case 2:
                    $events->group = "New Members";
                    break;
                case 3:
                    $events->group = "Transfers";
                    break;
                case 4:
                    $events->group = "Visitors";
                    break;
            }

            $events->values = [];

            for ($n=1; $n < $numEvents + 1; $n++) {
                $obj = new stdClass;

                $obj->id = $entries[$n][0];
                $obj->time = $entries[$n][1];
                $obj->total = $entries[$n][2];
                $obj->type = $events->group;
                $obj->y = rand(10, 80);

                $events->values[] = $obj;
            }

            $data['groups'][] = $events;
        }

        return $data;
    }

    public function randomDate()
    {
        $start = new DateTime($this->config['start']);
        $end = new DateTime($this->config['end']);
        $timestamp = rand($start->getTimestamp(), $end->getTimestamp());
        return date('Y-m-d', $timestamp);
    }

    public function display($prettyPrint = false)
    {
        if ($prettyPrint) {
            return json_encode($this->generate(), JSON_PRETTY_PRINT);
        }

        return json_encode($this->generate());
    }
}
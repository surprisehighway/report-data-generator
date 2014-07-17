<?php

use Carbon\Carbon;

class DataGenerator {

    public $config;

    public function __construct($config)
    {
        $this->config = $config;
    }

    public function generate()
    {
        $numEvents = $this->config['numberEvents'];
        $data = [];
        for ($i=1; $i < $numEvents + 1; $i++) { 
            $event = new EventData;
            $event->id = $i;
            $event->date = $this->randomDate();
            $event->oldMembers = rand(0, 80);
            $event->newMembers = rand(0, 80);
            $event->transfers = rand(0, 80);
            $event->visitors = rand(0, 80);
            $data[] = $event;
        }
        return $data;
    }

    public function randomDate()
    {
        $start = new Carbon($this->config['start']);
        $end = new Carbon($this->config['end']);
        $timestamp = rand($start->getTimestamp(), $end->getTimestamp());
        return date('Y-m-d', $timestamp);
    }

    public function prettyPrint()
    {
        return json_encode($this->generate(), JSON_PRETTY_PRINT);
    }
}
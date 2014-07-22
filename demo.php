<!DOCTYPE html>
<html class="no-js">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title></title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link rel="stylesheet" href="/assets/css/normalize.min.css">
        <link rel="stylesheet" href="/assets/css/main.css">

        <script src="/assets/js/libs/modernizr-2.6.2.min.js"></script>
        <script src="/assets/js/libs/jquery-1.11.1.min.js"></script>
        <script src="/assets/js/libs/d3.min.js"></script>
        <script src="/assets/js/libs/underscore-min.js"></script>

        <style>
        .axis path, .axis line {
            fill: none;
            stroke: black;
            shape-rendering: crispEdges;
        }

        .axis text {
            font-family: sans-serif;
            font-size: 11px;
        }

        .dot {
          stroke: #000;
        }

        .legend {
            padding: 5px;
            font: 10px sans-serif;
            background: yellow;
            box-shadow: 2px 2px 1px #888;
        }

        .tooltip {
            position: absolute;
            top: 0;
            left: 0;
        }
        </style>
    </head>
    <body>

        <div>
            <div id="mbars"></div>
        </div>

        <script src="/assets/js/app/main.js"></script>
    </body>
</html>

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
            /* SVG specific styling must be introduced via D3 or Javascript */
            /*.axis path, .axis line {
                fill: none;
                stroke: black;
                shape-rendering: crispEdges;
            }*/

            /*.axis text {
                font-family: sans-serif;
                font-size: 11px;
            }*/

            /*.legend {
                padding: 5px;
                font: 10px sans-serif;
                background: yellow;
                box-shadow: 2px 2px 1px #888;
            }*/

            body{ padding: 20px;}

            .barchart-tooltip-wrap {
                height: 50px;
                width: 200px;
                padding: 5px 10px;
                position: absolute;
                top: 0;
                left: 0;
                border: 1px solid #c0c0c0;
                border-radius: 4px;
                box-shadow: 4px 4px 6px 0px rgba(0,0,0,0.35);
                background-color: #fff;
                font-size: 11px;
            }

            #export { display: none; }

        </style>
    </head>
    <body>

        <div>
            Number of Events:
            <input type="number" min="1" value="30" name="events">
            Number of Groups:
            <input type="number" min="1" max="5" value="5" name="groups">
            <button id="draw-chart">Draw Chart</button>
        </div>


        <div id="stacked-chart-container">
        </div>

        <button id="save">Save as Image</button>

        <canvas width="600" height="600" id="export"></canvas>

        <script src="/assets/js/app/main.js"></script>
        <script type="text/javascript">
            (function($) {
                $(document).ready(function() {
                    //Call our stacked chart.
                    Chart.stackedChart('http://local.report-generator.com/?events=30&groups=5');

                    $("#save").on("click", function(){
                        Chart.exportPNG();
                    });

                    $(window).on("resize", function() {
                        Chart.resize();
                    });

                    $("#draw-chart").on("click", function() {
                        var events = $("input[name=events]").val();
                        var groups = $("input[name=groups]").val();
                        Chart.clear();
                        Chart.stackedChart("http://local.report-generator.com/?events="+events+"&groups="+groups+"");
                    });

                });
            })(jQuery);
        </script>
    </body>
</html>

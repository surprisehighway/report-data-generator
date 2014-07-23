/* Declare a namespace for the site */
var Site = window.Site || {};

(function($) {
	$(document).ready(function() {

	});
})(jQuery);

// Create the tool tip placeholder
var $tooltip = $('<div>').addClass('barchart-tooltip-wrap tooltip').hide().appendTo('body');

var initTooltip = function(){
	$('.chartTooltip').on('mousemove',function(e) {
		var mousex = e.pageX - 100; //Get X coordinates
		var mousey = e.pageY - 40; //Get Y coordinates
		$tooltip.css({ top: mousey, left: mousex });
	});
};

var w = 600; //Width
var h = 600; //Height
var yTicks = 16; //Ticks to display on Y Axis
var padding = {top: 40, right: 100, bottom: 100, left:40};
var dataset;
var dataRef;

//Set up stack method,
var stack = d3.layout.stack().values(function(d) { return d.values; });

d3.json("http://local.report-generator.com/",function(json){
	dataset = json.groups;
	dataRef = dataset[0].values;

	var indices = d3.range(0, dataRef.length);

	//Create an array of lables to be refrenced for our x axis.
	var labels = [];
	for(var i=0; i<dataRef.length; i++)  {
		labels.push(dataRef[i].time);
	}

	var color_hash = {
	    0 : ["Old Members","#1f77b4"],
		1 : ["New Members","#2ca02c"],
		2 : ["Transfers","#ff7f0e"],
		3 : ["Visitors","#ff0000"]
	};

	//Data, stacked
	stack(dataset);

	//Set up scales
	var xScale = d3.scale.ordinal()
		// .domain( dataRef.map( function(d) {
		// 	return d.time;
		// }))
		.domain(indices)
		.rangeRoundBands([0, w-padding.left-padding.right], 0.1);

	var yScale = d3.scale.linear()
		.domain([0,
			d3.max(dataset, function(d) {
				return d3.max(d.values, function(d) {
					return d.y0 + d.y;
				});
			})
		])
		.range([h-padding.bottom-padding.top,0]);


	//Set up axis
	var xAxis = d3.svg.axis()
				   .scale(xScale)
				   .orient("bottom")
				   .tickFormat(function(d){
						return labels[d];
				   });

	var yAxis = d3.svg.axis()
				   .scale(yScale)
				   .orient("left")
				   .ticks(yTicks);

	//Easy colors accessible via a 10-step ordinal scale
	var colors = d3.scale.category10();

	//Create SVG element
	var svg = d3.select("#mbars")
		.append("svg")
		.attr("width", w)
		.attr("height", h);

	//Create a backdrop
	svg.append("g")
		.attr("class", "background")
		.append("rect")
			.attr("x", 0)
			.attr("y", 0)
			.attr("width", w)
			.attr("height", h)
			.attr("fill", '#ffffff');

	//Create grid lines
	svg.append("g")
		.attr("class", "y grid")
		.selectAll("line.horizontalGrid").data(yScale.ticks(16)).enter()
		.append("line")
			.attr({
				"class":"horizontalGrid",
				"x1": padding.left,
				"x2": w-padding.right,
				"y1": function(d){ return yScale(d)+padding.top;},
				"y2": function(d){ return yScale(d)+padding.top;},
				"fill": "none",
				"shape-rendering" : "crispEdges",
				"stroke": "#c0c0c0",
				"stroke-width": "1px"
			});


	// Add a group for each row of data
	var groups = svg.selectAll("g.rgroups")
		.data(dataset)
		.enter()
		.append("g")
		.attr("class", "rgroups")
		.attr("transform","translate("+ padding.left + "," + (h - padding.bottom) +")")
		.style("fill", function(d, i) {
			return color_hash[dataset.indexOf(d)][1];
		});


	// Add a rect for each data value
	var rects = groups.selectAll("rect")
		.data(function(d) { return d.values; })
		.enter()
		.append("rect")
		.attr("width", xScale.rangeBand())
		.attr("class", "chartTooltip")
		.style("fill-opacity",1e-6)
		.on("mouseover", function(d) {
			d3.select(this)
				.style("fill-opacity",0.35);
			$tooltip.html(_.template(Templates.chartTooltip, { d: d })).fadeIn(150);
		})
		.on("mouseout", function(d) {
			d3.select(this)
				.style("fill-opacity",1);
			$tooltip.hide();
		})
		.call(initTooltip);

	rects.transition()
	    .duration(function(d,i){
			return 75 * i;
	    })
	    .ease("linear")
		.attr("x", function(d, i) { return xScale(i); })
		.attr("y", function(d) {
			return -(- yScale(d.y0) - yScale(d.y) + (h - padding.top - padding.bottom)*2);
		})
		.attr("height", function(d) {
			return -yScale(d.y) + (h - padding.top - padding.bottom);
		})
		// .attr("width", 18) // disable width transition
		.style("fill-opacity",1);


	// add axis
	svg.append("g")
		.attr("class","x axis")
		.attr("transform","translate(40," + (h - padding.bottom) + ")")
		.call(xAxis)
		.selectAll("text")
			.style("text-anchor", "end")
			.attr("dx", "-.8em")
			.attr("dy", ".15em")
			.attr("transform", function(d) {
				return "rotate(-65)";
			});

	svg.append("g")
		.attr("class","y axis")
		.attr("transform","translate(" + padding.left + "," + padding.top + ")")
		.call(yAxis);


	// adding legend
	var legend = svg.append("g")
		.attr("class","legend")
		.attr("x", w - 65)
		.attr("y", 25)
		.attr("height", 100)
		.attr("width",100);

	legend.selectAll("g").data(dataset)
		.enter()
		.append('g')
		.each(function(d,i){
			var g = d3.select(this);
			g.append("rect")
				.attr("x", w - 95)
				.attr("y", i*25 + 40)
				.attr("width", 10)
				.attr("height",10)
				.style("fill",color_hash[String(i)][1]);

			g.append("text")
				.attr("class", "legend-text")
				.attr("x", w - 80)
				.attr("y", i*25 + 50)
				.attr("height",30)
				.attr("width",100)
				.style("fill",color_hash[String(i)][1])
				.text(color_hash[String(i)][0]);
		});

	// Inject styles
	// External CSS will not be rendered in image output
	$('.axis path, .axis line').css({
		"fill" : "none",
		"stroke" : "black",
		"shape-rendering" : "crispEdges"
	});

	$('.axis text').css({
		"font-family" : "sans-serif",
		"font-size" : "11px"
	});

	$('.legend').css({
		"padding" : "5px",
		"font-size" : "10px",
		"box-shadow": "2px 2px 1px #888"
	});

});

//Declare namespace for underscore templates.
Templates = {};

Templates.chartTooltip = [
	'<div class="barchart-tooltip-container">',
		'<p>On <strong><%= d.time %></strong> there were <strong><%= d.y %>  <%= d.type %></strong> out of <%= d.total %> attenders (<%= Templates.percent(d.y, d.total) %>%)</p>',
	'</div>'
].join('\n');

//Calculate percentage.
Templates.percent = function(val1, val2) {
	var pcnt = (val1 / val2)*100;
	return pcnt.toFixed(1);
};

//SVG Export
d3.select("#save").on("click", function(){

	var svghtml = d3.select("svg")
        .attr("version", 1.1)
        .attr("background-color", "#ffffff")
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .node().parentNode.innerHTML;

	var imgsrc = 'data:image/svg+xml;base64,'+ btoa(svghtml);
	var canvas = document.querySelector("canvas"),
		context = canvas.getContext("2d");

	var image = new Image();
		image.src = imgsrc;

	image.onload = function() {
		context.drawImage(image, 0, 0);

		var canvasdata = canvas.toDataURL("image/png");

		var pngimg = '<img src="'+canvasdata+'">';

		//d3.select("#pngdataurl").html(pngimg);

		var a = document.createElement("a");
			a.download = "chart.png";
			a.href = canvasdata;

		a.click();
  };

});

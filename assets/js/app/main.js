/* Declare a namespace for the site */
var Site = window.Site || {};

(function($) {

	$(document).ready(function() {

		//alert('ready!');

	});

})(jQuery);

var w = 600; //width
var h = 600; //height
var padding = {top: 40, right: 40, bottom: 100, left:40};
var dataset;
var dataRef;

//Set up stack method,
var stack = d3.layout.stack().values(function(d) { return d.values; });

d3.json("/assets/js/app/demo-data.json",function(json){
	dataset = json.groups;

	dataRef = dataset[0].values;
	//console.log(items.length);

	var color_hash = {
	    0 : ["Old Members","#1f77b4"],
		1 : ["New Members","#2ca02c"],
		2 : ["Transfers","#ff7f0e"],
		3 : ["Visitors","#ff0000"]
	};

	//Data, stacked
	stack(dataset);

	// Set up scales
	var xScale = d3.scale.ordinal()
		.domain( dataRef.map( function(d) {
			return d.time;
		}))
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

	var xAxis = d3.svg.axis()
				   .scale(xScale)
				   .orient("bottom")
				   .ticks(xScale.rangeBand());

	var yAxis = d3.svg.axis()
				   .scale(yScale)
				   .orient("left")
				   .ticks(15);



	//Easy colors accessible via a 10-step ordinal scale
	var colors = d3.scale.category10();

	//Create SVG element
	var svg = d3.select("#mbars")
		.append("svg")
		.attr("width", w)
		.attr("height", h);

	// Add a group for each row of data
	var groups = svg.selectAll("g")
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
		.style("fill-opacity",1e-6);


	rects.transition()
	    .duration(function(d,i){
			return 750 * i;
	    })
	    .ease("linear")
		.attr("x", function(d) { return xScale(d.time); })
		.attr("y", function(d) {
			return -(- yScale(d.y0) - yScale(d.y) + (h - padding.top - padding.bottom)*2);
		})
		.attr("height", function(d) {
			return -yScale(d.y) + (h - padding.top - padding.bottom);
		})
		// .attr("width", 18) // disable width transition
		.style("fill-opacity",1);

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
		.attr("x", w - padding.right - 65)
		.attr("y", 25)
		.attr("height", 100)
		.attr("width",100);

	legend.selectAll("g").data(dataset)
		.enter()
		.append('g')
		.each(function(d,i){
			var g = d3.select(this);
			g.append("rect")
				.attr("x", w - padding.right - 65)
				.attr("y", i*25 + 10)
				.attr("width", 10)
				.attr("height",10)
				.style("fill",color_hash[String(i)][1]);

			g.append("text")
			 .attr("x", w - padding.right - 50)
			 .attr("y", i*25 + 20)
			 .attr("height",30)
			 .attr("width",100)
			 .style("fill",color_hash[String(i)][1])
			 .text(color_hash[String(i)][0]);
		});

	svg.append("text")
		.attr("transform","rotate(-90)")
		.attr("y", 0 - 5)
		.attr("x", 0-(h/2))
		.attr("dy","1em")
		.text("Y Axis");

	svg.append("text")
	   .attr("class","xtext")
	   .attr("x",w/2 - padding.left)
	   .attr("y",h - 5)
	   .attr("text-anchor","middle")
	   .text("X Axis");

	svg.append("text")
	    .attr("class","title")
	    .attr("x", (w / 2))
	    .attr("y", 20)
	    .attr("text-anchor", "middle")
	    .style("font-size", "16px")
	    .style("text-decoration", "underline")
	    .text("Chart Title");
});
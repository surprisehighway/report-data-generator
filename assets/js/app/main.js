(function (){

	/* Declare a namespace for our charts */
	var Chart = {};
	Chart.dataset = null;

	var w = 1080; //Width
	var h = 600; //Height
	var yTicks = 16; //Ticks to display on Y Axis
	var padding = {top: 40, right: 100, bottom: 100, left:40};

	//Create SVG element
	var svg = d3.select("#stacked-chart-container")
		.append("svg")
		.attr("width", w)
		.attr("height", h)
		.attr("viewBox", "0 0 "+w+" "+h)
		.attr("id", "stacked-chart");

	//Set up stack method,
	var stack = d3.layout.stack().values(function(d) { return d.values; });

	//Create the tool tip placeholder
	var $tooltip = $('<div>').addClass('barchart-tooltip-wrap tooltip').appendTo('body').hide();

	var initTooltip = function(){
		$('.chartTooltip').on('mousemove',function(e) {
			var mousex = e.pageX - 100; //Get X coordinates
			var mousey = e.pageY - 70; //Get Y coordinates
			$tooltip.css({ top: mousey, left: mousex });
		});
	};

	Chart.stackedChart = function(dataURL) {

		d3.json(dataURL, function(json) {

			Chart.dataset = json.groups;
			dataref = Chart.dataset[0].values;

			var indices = d3.range(0, dataref.length);

			//Determine our group names and specify associated colors
			dataGroups = {};
			var colors = d3.scale.category10();

			Chart.dataset.forEach(function (d, i) {
				dataGroups[i] = [];
				dataGroups[i][0] = d.group;
				dataGroups[i][1] = colors(i);
			});

			//Create an array of lables to be refrenced for our x axis.
			var labels = [];
			for(var i=0; i<dataref.length; i++)  {
				labels.push(dataref[i].time);
			}

			//Data, stacked
			stack(Chart.dataset);

			//Set up scales
			var xScale = d3.scale.ordinal()
				.domain(indices)
				.rangeRoundBands([0, w-padding.left-padding.right], 0.1);

			var yScale = d3.scale.linear()
				.domain([0,
					d3.max(Chart.dataset, function(d) {
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
				.data(Chart.dataset)
				.enter()
				.append("g")
				.attr("class", "rgroups")
				.attr("transform","translate("+ padding.left + "," + (h - padding.bottom) +")")
				.style("fill", function(d, i) {
					return dataGroups[Chart.dataset.indexOf(d)][1];
				});


			// Add a rect for each data value
			var rects = groups.selectAll("rect")
				.data(function(d) { return d.values; })
				.enter()
				.append("rect")
				.attr("width", 0)
				.attr("class", function(d) {
					if (d.total > 0) {
						return "chartTooltip";
					} else {
						return "chartTooltip zero-attnd";
					}
				})
				.style(function(d){
					if (d.total > 0) {
						return "fill-opacity", 1e-6;
					} else {
						return "fill-opacity", 0;
					}
				})
				.on("mouseover", function(d) {
					if (d.total > 0) d3.select(this).style("fill-opacity", 0.35);
					$tooltip.html(_.template(Chart.templates.chartTooltip, { d: d })).fadeIn(150);
				})
				.on("mouseout", function(d) {
					if (d.total > 0) d3.select(this).style("fill-opacity", 1);
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
					if ( d.total === 0 && d.type == "Old Members" ) {
						return -(h - padding.top - padding.bottom);
					} else {
						return -(- yScale(d.y0) - yScale(d.y) + (h - padding.top - padding.bottom)*2);
					}
				})
				.attr("height", function(d) {
					if ( d.total === 0 && d.type == "Old Members" ) {
						return h - padding.top - padding.bottom;
					} else {
						return -yScale(d.y) + (h - padding.top - padding.bottom);
					}
				})
				.attr("width", xScale.rangeBand()) // disable width transition
				.style(function(d){
					if (d.total > 0) {
						return "fill-opacity", 1;
					} else {
						return "fill-opacity", 0;
					}
				});

			//Draw axis
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

			//Add a legend
			var legend = svg.append("g")
				.attr("class","legend")
				.attr("x", w - 65)
				.attr("y", 25)
				.attr("height", 100)
				.attr("width",100);

			legend.selectAll("g").data(Chart.dataset)
				.enter()
				.append('g')
				.each(function(d,i){
					var g = d3.select(this);
					g.append("rect")
						.attr("x", w - 95)
						.attr("y", i*25 + 40)
						.attr("width", 10)
						.attr("height",10)
						.style("fill",dataGroups[String(i)][1]);

					g.append("text")
						.attr("class", "legend-text")
						.attr("x", w - 80)
						.attr("y", i*25 + 49)
						.attr("height",30)
						.attr("width",100)
						.style("fill",dataGroups[String(i)][1])
						.text(dataGroups[String(i)][0]);
				});

			addStyles();
		});

	};

	//Inject styles
	//External CSS will not be rendered in image output
	function addStyles() {
		d3.selectAll('rect.zero-attnd') //Hide "false" column for zero attenance
			.attr('fill', '#ffffff')
			.style({
				"fill-opacity": 0,
				"font-family": "arial",
				"font-size": "11px"
			});

		d3.selectAll('.axis path, .axis line').style({
			"fill": "none",
			"stroke": "#000000",
			"shape-rendering": "crispEdges"
		});

		d3.selectAll('.axis text').style({
			"font-family": "arial",
			"font-size": "11px"
		});

		d3.selectAll('.legend').style({
			"padding": "5px",
			"font-size": "10px",
			"font-family": "arial"
		});

		d3.selectAll('.legend-text').style({
			"fill": "#000000"
		});
	}

	//SVG Export
	Chart.exportPNG = function() {
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

			//Insert png as image src
			//var pngimg = '<img src="'+canvasdata+'">';
			//d3.select("#pngdataurl").html(pngimg);

			var a = document.createElement("a");
				a.download = "chart.png";
				a.href = canvasdata;

			a.click();
	  };
	};

	Chart.clear = function () {
	  svg.selectAll("*").remove();
	};

	//Declare namespace for underscore templates.
	Chart.templates = {};

	Chart.templates.chartTooltip = [
		'<% if (d.total > 0) { %>',
			'<div class="barchart-tooltip-container">',
				'<p>On <strong><%= d.time %></strong> there were <strong><%= d.y %>  <%= d.type %></strong> out of <%= d.total %> attenders (<%= Chart.templates.percent(d.y, d.total) %>%)</p>',
			'</div>',
		'<% } else { %>',
			'<p>There were no attendees for <strong><%= d.time %></strong></p>',
		'<% } %>'
	].join('\n');

	//Calculate percentage.
	Chart.templates.percent = function(val1, val2) {
		var pcnt = (val1 / val2)*100;
		return pcnt.toFixed(1);
	};

	Chart.resize = function () {
	    var aspect = w / h;
	    var chart = $("#stacked-chart");
	    var targetWidth = chart.parent().width();
	    chart.attr("width", targetWidth);
	    chart.attr("height", targetWidth / aspect);
	};

	window.Chart = Chart;

}());
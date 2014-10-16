// Create d3 directive module
var d3directives = angular.module('d3directives', ['d3']);

d3directives.directive('d3Histogram', ['d3', function(d3) {
	return {
		restrict : 'EA',
		scope : {
			data : "="
		},
		link : function(scope, iElement, iAttrs) {
			// watch for data changes and re-render
			scope.$watch('data', function(newVals, oldVals) {
				return scope.render(newVals);
			}, true);

			/**
			 * D3 code for creating the histogram
			 */
			// A formatter for counts.
			var formatCount = d3.format(",.0f");

			var margin = {top: 10, right: 30, bottom: 30, left: 30},
			    width = 550 - margin.left - margin.right,
			    height = 550 - margin.top - margin.bottom;

			// Here the domain is hard coded
			var x = d3.scale.linear()
			    .domain([0, 100])
			    .range([0, width]);

			var xAxis = d3.svg.axis()
			    .scale(x)
			    .orient("bottom");

			// Append the svg graphic to the binded element
			var svg = d3.select(iElement[0]).append("svg")
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
			  	.append("g")
			    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			// Render function for the histogram chart
			scope.render = function(students) {
				// remove all previous items before render
	            svg.selectAll("*").remove();

				// Get student grades
				var grades = students.map(function(s){return s.grade;});

				// Generate a histogram using uniformly-spaced bins.
				var data = d3.layout.histogram()
				    .bins(x.ticks(10))
				    (grades);

				var y = d3.scale.linear()
				    .domain([0, d3.max(data, function(d) { return d.y; })])
				    .range([height, 0]);

				var bar = svg.selectAll(".bar")
				    .data(data)
				  	.enter().append("g")
				    .attr("class", "bar")
				    .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

				bar.append("rect")
				    .attr("x", 1)
				    .attr("width", x(data[0].dx) - 1)
				    .attr("height", function(d) { return height - y(d.y); });

				bar.append("text")
				    .attr("dy", ".75em")
				    .attr("y", 6)
				    .attr("x", x(data[0].dx) / 2)
				    .attr("text-anchor", "middle")
				    .text(function(d) { return formatCount(d.y); });

				svg.append("g")
				    .attr("class", "x axis")
				    .attr("transform", "translate(0," + height + ")")
				    .call(xAxis);
			}
			
		}
	};
}]);

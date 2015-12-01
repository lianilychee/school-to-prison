$(document).ready(function() {

var disabilitycolor = d3.scale.ordinal()
    .range(["#CC3D03", "#99644F"]);
var racecolor = d3.scale.ordinal()
    .range(["#333333", "#555555, #777777, #999999, #bbbbbb, #dddddd"]);

createpie(400, 400, "http://localhost:8000/mitch_piechart_disability.csv", disabilitycolor)
createpie(400, 400, "http://localhost:8000/mitch_piechart_race.csv", racecolor)

function createpie(width, height, datacsv, color) {
  var radius = Math.min(width, height) / 2;

  var arc = d3.svg.arc()
      .outerRadius(radius - 10)
      .innerRadius(0);

  var labelArc = d3.svg.arc()
      .outerRadius(radius - 40)
      .innerRadius(radius - 40);

  var pie = d3.layout.pie()
      .sort(null)
      .value(function(d) { return d.population; });

  var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  d3.csv(datacsv, function(error, data) {
    if (error) throw error;
console.log(data)
    var g = svg.selectAll(".arc")
        .data(pie(data))
      .enter().append("g")
        .attr("class", "arc");

    g.append("path")
        .attr("d", arc)
        .style("fill", function(d) { return color(d.data.age); });

    g.append("text")
        .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .text(function(d) { return d.data.age; });
  });
}

});
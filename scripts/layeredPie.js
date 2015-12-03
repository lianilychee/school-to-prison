function layeredPie(csv_data){
	data = [
		{label:"1", pop:1, susp:.3 },
		{label:"2", pop:2, susp:.1},
		{label:"3", pop:3, susp:.5},
		{label:"5", pop:5, susp:.7},
		{label:"10", pop:10, susp:.2},
		{label:"1", pop:1, susp:.3}
	]
	var radius = 100
	var color = d3.scale.category10();
    var color2 = d3.scale.category20();

	width = 300
	height = 300


	var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) { return d.pop; });
    var arc = d3.svg.arc()
        .outerRadius(radius)
        .innerRadius(0)
    var arc2 = d3.svg.arc()
        .outerRadius(function(d){
            console.log(d);
            return radius * d.data.susp;
        })
        .innerRadius(0)
    var labelArc = d3.svg.arc()
        .outerRadius(radius + 100)
        .innerRadius(0)

	var g = svg.selectAll(".arc")
        .data(pie(data))
        .enter()
        .append("g")
        .attr("class", "arc");

    g.append("path")
        .attr("d", arc)
        .style("fill", function(d,i) { return color(i); });

    g.append("path")
        .attr("d", arc2)
        .style("fill", function(d,i) { return color2(i); });

    g.append("text")
        .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .text(function(d,i) { return d.data.label; });
}
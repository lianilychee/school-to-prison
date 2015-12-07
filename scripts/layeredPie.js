var disability = ""
var race = ""

function layeredPie(csv_data){

	dataset = [
		{label:"WD", pop:csv_data[49]['Students WD Enrollment'], susp:(csv_data[49]['Suspended Students WD']/csv_data[49]['Students WD Enrollment']), selected:false},
		{label:"WOD", pop:csv_data[49]['Students WOD Enrollment'], susp:(csv_data[49]['Suspended Students WOD']/csv_data[49]['Students WOD Enrollment']), selected:false},
	]
    
	var radius = 100
	var color = d3.scale.category10();
    var color2 = "white";

    // dimensions of the svg
	width = 300
	height = 300

    // stick an SVG to the body of index.html
	var svg = d3.select("#pie").append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // initialize pie chart
    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) { return d.pop; });

    // initialize the outer slice
    var arc = d3.svg.arc()
        .outerRadius(radius)
        .innerRadius(0)

    // initialize the inner slice
    var arc2 = d3.svg.arc()
        .outerRadius(function(d){
            return radius * d.data.susp;
        })
        .innerRadius(0)

    // initialize labels
    var labelArc = d3.svg.arc()
        .outerRadius(radius + 100)
        .innerRadius(0)


    // DRAW ALL THE OBJECTS
    function update(){
        svg.selectAll("g").remove()
    	var g = svg.selectAll(".arc")
            .data(pie(dataset))
            .enter()
            .append("g")
            .attr("class", "arc")
            .on("click", function(d,i) {
                dataset[i]["selected"] = !dataset[i]["selected"];
                update();
            });

        g.append("path")
            .attr("d", arc)
            .style("fill", function(d,i) { return d.data.selected ? d3.rgb(color(i)).darker(2) : color(i); });


        g.append("path")
            .attr("d", arc2)
            .style("fill", function(d,i) { return d.data.selected ? color(i) : d3.rgb(color(i)).brighter(2); });

        g.append("text")
            .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
            .attr("dy", ".35em")
            .text(function(d,i) { return d.data.label; });
    }
    update();
}
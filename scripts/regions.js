var disability = "";
var race = "";

// basically all my helper functions
var REGIONS = {

  cleanData: [],  // to be updated based on selections

  natAvg: 10.08,

  /** updates the dataset, to be reflected in cleanData.  Assume state input is GLOBAL.selectionState. **/
  update: function(selection, bar) {

    REGIONS.cleanData = [];

    for (var i = 1; i < 14; i++) {
    // for (var i = 0; i < REGIONS.regData.length; i++) {
        REGIONS.cleanData.push({
            'District Name': REGIONS.regData[i]['District Name'],
            'likelihood': Number(parseFloat(REGIONS.regData[i][selection]) / REGIONS.natAvg).toFixed(2),
            'poverty': parseFloat(REGIONS.regData[i]["% 5-17 under poverty line"]),
            'row_number':i
        });
    }
    REGIONS.render(selection,REGIONS.cleanData);
  },

  /** renders the national comparison.  Renders the regional comparison. **/
  render: function(selection, regions_data) {
    console.log(selection);
    d3.select("#nat-comparison").selectAll("svg").remove();
    d3.select("#reg-comparison").selectAll("svg").remove();
    colorCirc = "#C30017"; // some shade of red
    colorText = "white";
    circleRad = 24

    // BUILD THE NATL PART
    natLike = Number(parseFloat(REGIONS.regData[0][selection]) / REGIONS.natAvg).toFixed(2);

    var natContainer = d3.select("#nat-comparison").append("svg");

    var natG = natContainer.append("g")
    .attr("cx", 222)
    .attr("cy", 75)
    .on("click",function(){
      console.log("nat")
      LAYEREDPIE.update(0);
    });
    var natTitle = natG.append("text")
      .attr({
        "x": 222,
        "y": 20,
        "fill": colorText,
        "font-weight": "bold",
        "text-anchor":"middle"
      })
      .text("National");

    var natCirc = natG.append("circle")
      .attr("cx", 222)
      .attr("cy", 90)
      .attr("stroke-width", 3)
      .attr("stroke", colorCirc)
      .attr("fill-opacity", 0)
      .attr("r", 60);

    var natText = natG.append("text")
      .attr({
        "x": 222,
        "y": 95,
        "fill": colorText,
        "font-weight": "bold"
      })
      .text(function() {
        text = natLike + "x";
        return text;
      })
      .style("text-anchor", "middle");

    $('#natl-comparison').append(natLike);


    // BUILD THE REGIONAL PART
    var bbox = d3.select("#reg-comparison").node().getBoundingClientRect()

    // this is the axis
    var povPlot = d3.select('#reg-comparison').append('svg')
      .attr('height', bbox.height-10)
      .attr('width', bbox.width-10)

    yScale = d3.scale.linear()
      .domain([0,65])
      .range([bbox.height - 25, 0])

    var yAxis = d3.svg.axis()
      .orient('left')
      .scale(yScale);

    povPlot.append('g')
      .attr('class', 'yAxis')
      .attr('height', d3.select('#reg-comparison').attr('height'))
      .attr('transform', 'translate(30 50)')
      .call(yAxis);


    var regionG = povPlot.
      selectAll("g .region")
      .data(buildCircleData(regions_data,yScale,circleRad,circleRad*2+30,100))
      .enter()
      .append("g")
      .attr("class","region")
      .attr("transform",function(d,i){
        return "translate(" + d.x + " " + d.y +")"   
      }).on("click",function(d){
        LAYEREDPIE.update(d.row.row_number);
      });
    //Circle
    regionG.append("circle")
    .attr("r",circleRad)
    .attr("stroke", colorCirc)
    .attr("stroke-width",3)
    .attr("fill-opacity", 0);

    //Multiplier
    regionG.append("text")
    .text(function(d) {
      return d.row.likelihood + "x";

    })
    .attr({
      "fill": colorText,
      "font-weight": "bold",
      "dy":".4em"
    })
    .style("text-anchor","middle");

    regionG.append("text")
    .text(function(d){
      return d.row["District Name"]
    })
    .attr({
      "fill":colorText,
      "font-size":10,
      "dy":"2em"
    })
    .style("text-anchor","middle");
    // these are the circles
    // povPlot.selectAll("circle")
    //   .data(regions_data, function(d) { return d["District Name"]; })
    //   .enter()
    //   .append('circle')
    //   .attr({
    //     'cx': function(d, i) { 
    //       pos_intended = 60 + 50*i;
    //       console.log(60 + 50*(i-1));
    //       if (Math.abs(pos_intended) < 50) {
    //         console.log('overlap');
    //       }
    //       return 60+50*i;
    //     },
    //     'cy': function(d) { return yScale(d["poverty"]); },
    //     'r': 20,
    //     'stroke': colorCirc,
    //     'stroke-width': 3,
    //     'fill': 'none',
    //   });

    // povPlot.selectAll('text')
    //   .data(regions_data)
    //   .enter()
    //   .append('text')
    //   .text(function(d) {
    //     console.log(d);
    //     text = d.likelihood + "x";
    //     return text;
    //   })
    //   .attr({
    //     "fill": colorText,
    //     "font-weight": "bold",
    //     "x": function(d,i) { console.log(i); return 60; },
    //     "y": function(d) { return yScale(d["poverty"]); },
    //   })
    //   .style("text-anchor","middle");
  },

};

function buildCircleData(regions_data, yScale, circle_radius, column_width, x_margin){
  columns = []
  data = []
  for(var i = 0; i < regions_data.length; i++){
    var datum = {row:regions_data[i]}
    datum.y = yScale(regions_data[i]["poverty"]);
    var placed = false
    for(var j = 0; j < columns.length; j++){
      if(datum.y < columns[j] - circle_radius*2){
        columns[j] = datum.y;
        datum.x = j*column_width + x_margin;
        placed = true
        break;
      }
    }
    if(!placed){
      datum.x = columns.length*column_width + x_margin;
      columns.push(datum.y);
    }
    data.push(datum);
  }
  return data;
}
//Note that regions_data must be sorted by poverty rate

function regions(regions_data, csv_data) {

    REGIONS.regData = regions_data;
    REGIONS.natData = csv_data;

    // Percentage of students are suspended, regardless of disability status

    defaultSelection = 'All Students Rates';  // TODO pipe from layeredPie

    // update the data to be passed into render function
    REGIONS.update(defaultSelection, REGIONS.natlAvg);


}
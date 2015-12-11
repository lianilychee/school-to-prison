var disability = "";
var race = "";

// basically all my helper functions
var REGIONS = {

  cleanData: [],  // to be updated based on selections

  natAvg: 10.07,

  /** updates the dataset, to be reflected in cleanData.  Assume state input is GLOBAL.selectionState. **/
  update: function(selection, bar) {

    REGIONS.cleanData = [];

    for (var i = 0; i < 14; i++) {
    // for (var i = 0; i < REGIONS.regData.length; i++) {
        REGIONS.cleanData.push({
            'District Name': REGIONS.regData[i]['District Name'],
            'likelihood': Number(parseFloat(REGIONS.regData[i][selection]) / REGIONS.natAvg).toFixed(2),
            'poverty': parseFloat(REGIONS.regData[i]["% 5-17 under poverty line"])
        });
    }
    return REGIONS.cleanData;
  },

  /** renders the national comparison.  Renders the regional comparison. **/
  render: function(selection, regions_data) {
    console.log(selection);

    colorCirc = "#C30017"; // some shade of red
    colorText = "black";

    // BUILD THE NATL PART
    natLike = REGIONS.natData[49][selection];

    var natContainer = d3.select("#nat-comparison").append("svg");

    var natCirc = natContainer.append("circle")
      .attr("cx", 222)
      .attr("cy", 75)
      .attr("stroke-width", 3)
      .attr("stroke", colorCirc)
      .attr("fill", "none")
      .attr("r", 60);

    var natCirc = natContainer.append("text")
      .attr({
        "x": 222,
        "y": 80,
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

    heightOfDiv = 600

    // this is the axis
    var povPlot = d3.select('#reg-comparison').append('svg')
      .attr('height', heightOfDiv)

    yScale = d3.scale.linear()
      .domain([0,100])
      .range([heightOfDiv - 25, 0])

    var yAxis = d3.svg.axis()
      .orient('left')
      .scale(yScale);

    povPlot.append('g')
      .attr('class', 'yAxis')
      .attr('height', d3.select('#reg-comparison').attr('height'))
      .attr('transform', 'translate(30)')
      .call(yAxis);

    // these are the circles
    povPlot.selectAll("circle")
      .data(regions_data, function(d) { return d["District Name"]; })
      .enter()
      .append('circle')
      .attr({
        'cx': function(d, i) { 
          pos_intended = 60 + 50*i;
          console.log(60 + 50*(i-1));
          if (Math.abs(pos_intended) < 50) {
            console.log('overlap');
          }
          return 60+50*i;
        },
        'cy': function(d) { return yScale(d["poverty"]); },
        'r': 20,
        'stroke': colorCirc,
        'stroke-width': 3,
        'fill': 'none',
      });

    povPlot.selectAll('text')
      .data(regions_data)
      .enter()
      .append('text')
      .text(function(d) {
        text = d.likelihood + "x";
        return text;
      })
      .attr({
        "fill": colorText,
        "font-weight": "bold",
        "x": function(d,i) { console.log(i); return 60; },
        "y": function(d) { return yScale(d["poverty"]); },
      })
      .style("text-anchor","middle");
  },

};


function regions(regions_data, csv_data) {

    REGIONS.regData = regions_data;
    REGIONS.natData = csv_data;

    // Percentage of students are suspended, regardless of disability status

    dummySelection = 'Latino Students Rates';  // TODO pipe from layeredPie

    // update the data to be passed into render function
    regData = REGIONS.update(dummySelection, REGIONS.natAvg);

    REGIONS.render(dummySelection, regData);

}
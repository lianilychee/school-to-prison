var disability = "";
var race = "";

// basically all my helper functions
var REGIONS = {

  cleanData: [],  // to be updated based on selections

  natAvg: 10.07,

  /** updates the dataset, to be reflected in cleanData.  Assume state input is GLOBAL.selectionState. **/
  update: function(selection, bar) {

    REGIONS.cleanData = [];

    for (var i = 0; i < REGIONS.regData.length; i++) {
        REGIONS.cleanData.push({
            'District Name': REGIONS.regData[i]['District Name'],
            'likelihood': Number(parseFloat(REGIONS.regData[i][selection]) / REGIONS.natAvg).toFixed(2)
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

    var regCirc = d3.select("#reg-comparison").append("svg")
      .attr("width", "100%")
      .selectAll(".regCirc")
      .data(regions_data, function(d){ return d["District Name"]; })
      .enter()
      .append("g")
      .attr("class","regCirc")

    regCirc.append("circle")
        .attr({
          "class":"regCirc",
          "stroke-width": 3,
          "r": 30,
          "stroke": colorCirc,
          "cx": function(d,i) { return i*50; },
          "cy": 50,
          "fill": "none",
        })

    regCirc.append("text")
        .attr({
          "fill": colorText,
          "font-weight": "bold",
          "x": function(d,i) { return i*50; },
          "y": 55,
        })
        .text(function(d) {
          text = d.likelihood + "x";
          return text
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
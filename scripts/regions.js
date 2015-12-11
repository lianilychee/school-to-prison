var disability = "";
var race = "";

// basically all my helper functions
var REGIONS = {

  cleanData: [],  // to be updated based on selections

  /** updates the dataset, to be reflected in cleanData.  Assume state input is GLOBAL.selectionState. **/
  update: function(selection, bar) {

    REGIONS.cleanData = [];
    natlAvg = 10.88;  

    for (var i = 0; i < REGIONS.regData.length; i++) {
        REGIONS.cleanData.push({
            'District Name': REGIONS.regData[i]['District Name'],
            'likelihood': Number(parseFloat(REGIONS.regData[i][selection]) / natlAvg).toFixed(2)
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

    // BUILD THE NATL BIT
    natLike = REGIONS.natData[49][selection];

    console.log(natLike);

    var natContainer = d3.select("#nat-comparison").append("svg");

    var natCirc = natContainer.append("circle")
      .attr("cx", 40)
      .attr("cy", 40)
      .attr("stroke-width", 3)
      .attr("stroke", colorCirc)
      .attr("fill", "none")
      .attr("r", 30);

    var natText = natContainer.append("text")
      .attr("x", 21)
      .attr("y", 43)
      .attr("fill", colorText)
      .attr("font-weight", "bold")
      .text(function() {
        text = natLike + "x"
        return text;
        });

    $('#natl-comparison').append(natLike);


    // BUILD THE REGIONAL BIT
    // console.log(regions_data);

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
          "cx": function(d,i) {
            return i*50;
          },
          "cy": 50,
          "fill": "none",
        });
      
    regCirc.append("text")
        .attr({
          // "fill": colorText,
          // "font-weight": "bold",
          "x": function(d,i) { return i*50; },
          "y": 50,
        })
        .text(function(d) { return d.likelihood });

  },

};


function regions(regions_data, csv_data) {

    REGIONS.regData = regions_data;
    REGIONS.natData = csv_data;

    // Percentage of students are suspended, regardless of disability status
    natlAvg = 10.07;

    dummySelection = 'Latino Students Rates';  // TODO pipe from layeredPie

    // update the data to be passed into render function
    REGIONS.update(dummySelection, natlAvg);

    // create the divs based on the number of districts in regions_data
    // for (var i = 0; i < regions_data.length; i++) {
    // for (var i = 0; i < regions_data.length; i++) {

    //     // calculate the bar per person

    //     // build the strings that form the HTML
    //     input_html = "<div class='regional'>" +

    //                     // append District Name string
    //                     regions_data[i]["District Name"] + ":  <br>" +

    //                     // create containers for person
    //                     "<div class='person-container'>" +
    //                         "<div class='person-fill'></div>" +
    //                         "<div class='person-image'><img src='images/person3.png'></div>" +
    //                     "<div>" + 

    //                     // append comparison to nat'l average
    //                     // (Number((parseFloat(regions_data[i][dummySelection]) / natlAvg)).toFixed(2)) +
    //                     // "x more likely than the NATL avg to be suspended <br>" +

    //                     // append comparison to regional average
    //                     (Number((parseFloat(regions_data[i][dummySelection]) / (parseFloat(regions_data[i]["All Students Rates"])))).toFixed(2)) +            
    //                     "x more likely than the REG avg to be suspended" +

    //                     "</div>";

    //     $('ul').append(input_html);
    // };

    // when the pie is clicked, call this function

}
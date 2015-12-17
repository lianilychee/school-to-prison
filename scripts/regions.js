var disability = "";
var race = "";

// basically all my helper functions
var REGIONS = {

    sortBy: "All Students Enrollment",

    cleanData: [],    // to be updated based on selections

    sortCleanData: [],  // cleanData sorted by the button click

    natAvg: 10.08,

    /** updates the dataset, to be reflected in cleanData.    Assume state input is GLOBAL.selectionState. **/
    update: function(selection, bar, sort) {

        REGIONS.cleanData = [];

        for (var i = 1; i < 14; i++) {
        // for (var i = 0; i < REGIONS.regData.length; i++) {
            REGIONS.cleanData.push({
                'district_name': REGIONS.regData[i]['District Name'],
                'likelihood': Number(parseFloat(REGIONS.regData[i][selection]) / REGIONS.natAvg).toFixed(1),
                'poverty': parseFloat(REGIONS.regData[i]["% 5-17 under poverty line"]),
                'sort_column': parseFloat(REGIONS.regData[i][REGIONS.sortBy]),
                'row_number':i
            });
        }

        // console.log(REGIONS.cleanData)
        REGIONS.sortCleanData = REGIONS.cleanData.sort( function(a,b) { return b['sort_column'] - a['sort_column'] });
        // console.log(REGIONS.sortCleanData)

        REGIONS.render(selection,REGIONS.sortCleanData);
    },

    /** renders the national comparison.    Renders the regional comparison. **/
    render: function(selection, regions_data) {
        d3.select("#nat-comparison").selectAll("svg").remove();
        d3.select("#reg-comparison").selectAll("svg").remove();
        colorCirc = "#C30017"; // some shade of red
        colorText = "white";
        circleRad = 30

        var bbox = d3.select("#reg-comparison").node().getBoundingClientRect()

        var povPlot = d3.select('#reg-comparison').append('svg')
            .attr('height', bbox.height-10)
            .attr('width', bbox.width-10)

        yScale = d3.scale.linear()
            .domain([0,65])
            .range([bbox.height - 25, 0])

        var regionG = povPlot.
            selectAll("g .region")
            .data(buildCircleData(regions_data,yScale,circleRad,circleRad*2+30,100))
            .enter()
            .append("g")
            .attr({
                "class":"region",
                "transform": function(d,i) {
                    return "translate(" + d.x + " " + d.y +")"     
                }
            })
            .on("click",function(d){
                LAYEREDPIE.update(d.row.row_number);
            });
        //Circle
        regionG.append("circle")
            .attr({
                "r": circleRad,
                "stroke": colorCirc,
                "stroke-width": 3,
                "fill-opacity": 0
            });

        //Multiplier
        regionG.append("text")
        .text(function(d) {
            return d.row.likelihood + "x";

        })
        .attr({
            "fill": colorText,
            "font-weight": "bold",
            "dy":".4em",
            "font-size": 24,
        })
        .style("text-anchor","middle");

        // school district label
        regionG.append("text")
        .text(function(d){
            return d.row["district_name"]
        })
        .attr({
            "fill":colorText,
            "font-size":10,
            "dy":"4.5em"
        })
        .style("text-anchor","middle");
    },

};

function buildCircleData(regions_data, yScale, circle_radius, column_width, x_margin){
    columns = []
    data = []
    for(var i = 0; i < regions_data.length; i++){

        var scoot = 10;

        var datum = {row:regions_data[i]}

        // define columns
        if (i%2 == 0) {
            datum.x = ($('#reg-comparison').width()) / 4;
        } else {
            datum.x = ($('#reg-comparison').width() * 3) / 4;
        }
        datum.y = Math.floor(i/2) * 85 + 40

        // define rows
        // if ((i%2)/2 == 0) {
        //     datum.y = ((i)/2).toFixed(0) + scoot;        
        // }
        // if ((i%2)/2 !== 0) {
        //     datum.y = ( (((i-1))/2).toFixed(0) + scoot );
        // }

        data.push(datum);
    }

    return data;
}
//Note that regions_data must be sorted by poverty rate

function regions(regions_data, csv_data) {

        REGIONS.regData = regions_data;
        REGIONS.natData = csv_data;

        // Percentage of students are suspended, regardless of disability status

        defaultSelection = 'All Students Rates';

        // update the data to be passed into render function
        REGIONS.update(defaultSelection, REGIONS.natlAvg, REGIONS.sortBy);

        // upon sortBy click, update REGIONS.sortBy
        $("button").click( function() {
            id = $(this).attr("id")

            if (id == "poverty") { REGIONS.sortBy = "% 5-17 under poverty line"; };

            if (id == "english") { REGIONS.sortBy = "EL Enrollment"; };

            if (id == "arrests") { REGIONS.sortBy = "Juvenile Arrest Rate"; };

            if (id == "enrollment") { REGIONS.sortBy = "All Students Enrollment"; };

            // console.log(REGIONS.sortBy);

            REGIONS.update(defaultSelection, REGIONS.natlAvg, REGIONS.sortBy);
        });
}




    // /** Sort based on button click
    // **/
    // sort: function() {
    //     $("button").onClick( function() {
    //         return ($(this).attr("id"));
    //     })
    // }
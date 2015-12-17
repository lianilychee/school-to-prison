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
        var natData = {
            'district_name': "National",
            'likelihood': Number(parseFloat(REGIONS.regData[0][selection]) / REGIONS.natAvg).toFixed(1),
            'sort_column': parseFloat(REGIONS.regData[0][REGIONS.sortBy]),
            'row_number':0
        }
        for (var i = 1; i < 11; i++) {
        // for (var i = 0; i < REGIONS.regData.length; i++) {
            REGIONS.cleanData.push({
                'district_name': REGIONS.regData[i]['District Name'],
                'likelihood': Number(parseFloat(REGIONS.regData[i][selection]) / REGIONS.natAvg).toFixed(1),
                'sort_column': parseFloat(REGIONS.regData[i][REGIONS.sortBy]),
                'row_number':i
            });
        }

        console.log(REGIONS.cleanData)
        REGIONS.sortCleanData = REGIONS.cleanData.sort( function(a,b) { return b['sort_column'] - a['sort_column'] });
        // console.log(REGIONS.sortCleanData)
        REGIONS.sortCleanData.unshift(natData);
        REGIONS.render(selection,REGIONS.sortCleanData);
    },

    /** renders the national comparison.    Renders the regional comparison. **/
    render: function(selection, regions_data) {
        d3.select("#reg-comparison").selectAll("svg").remove();
        colorCirc = "#C30017"; // some shade of red
        colorText = "white";
        circleRad = 25

        var bbox = d3.select("#reg-comparison").node().getBoundingClientRect()

        var povPlot = d3.select('#reg-comparison').append('svg')
            .attr('height', bbox.height-10)
            .attr('width', bbox.width-10)

        yScale = d3.scale.linear()
            .domain([0,65])
            .range([bbox.height - 25, 0])

        var regionG = povPlot.
            selectAll("g .region")
            .data(buildCircleData(regions_data))
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
                "r": function(d,i){
                    return i == 0 ? circleRad *(8/7): circleRad;
                },
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
            "font-size": 20,
        })
        .style("text-anchor","middle");
        // .style("cursor","pointer");

        // school district label
        regionG.append("text")
        .text(function(d){
            return d.row["district_name"]
        })
        .attr({
            "fill":colorText,
            "font-size":11,
            "dy":"3.75em"
        })
        .style("text-anchor","middle");
    },

};

function buildCircleData(regions_data){
    data = []
    
    var scoot = 40;
    var row_spacing = 85;
    //National circle
    data.push({
        row:regions_data[0],
        x: ($('#reg-comparison').width() / 2),
        y: scoot
    });

    for(var i = 1; i < regions_data.length; i++){
        var datum = {row:regions_data[i]}

        // define columns
        if ((i-1)%2 == 0) {
            datum.x = ($('#reg-comparison').width()) / 4;
        } else {
            datum.x = ($('#reg-comparison').width() * 3) / 4;
        }
        datum.y = (Math.floor((i-1)/2) + 1) * row_spacing + scoot;

        data.push(datum);
    }

    return data;
}
//Note that regions_data must be sorted by poverty rate

function regions(regions_data) {

        REGIONS.regData = regions_data;

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
$(document).ready(function() {


    // Click handlers
    $('#sel-1').click(function() {
        MAP.update('sel-1');
    })

    $('#sel-2').click(function() {
        MAP.update('sel-2');
    })

    $('#sel-3').click(function() {
        MAP.update('sel-3');
    })

    // load CSVs
    d3.csv("http://localhost:8000/DisabilityStateGap.csv", function(csv_data) {

        // var color = d3.scale.linear()
        //     .domain([100, 1000])
        //     .range(["white", "black"]);

        // var state_fills = {}

        // var fillKeys = {}

        // for (var i = 0; i < csv_data.length; i++) {
        //     fillKeys[csv_data[i]["State"]] = {fillKey: csv_data[i]["State"]}
        //     state_fills[csv_data[i]["State"]] = color(parseFloat(csv_data[i]["Diff: B WD vs WOD"]))
        // }

        // // draw map of US
        // var map = new Datamap({
        //     element: document.getElementById('map'),
        //     scope: 'usa',
        //     geographyConfig: {
        //         popupOnHover: false,
        //         highlightOnHover: false
        //     },
        //     fills: state_fills,
        //     data: fillKeys
        // });
    });


    




})
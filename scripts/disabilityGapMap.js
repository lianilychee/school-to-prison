$(document).ready(function() {

    // load CSVs

    d3.csv("http://localhost:8000/DisabilityStateGap.csv", function(csv_data) {
        console.log("done loading");
        var color = d3.scale.linear()
            .domain([100, 400])
            .range(["white", "black"]);
        var state_fills = {}
        var fillKeys = {}
        for (var i = 0; i < csv_data.length; i++) {
            fillKeys[csv_data[i]["State"]] = {fillKey: csv_data[i]["State"]}
            state_fills[csv_data[i]["State"]] = color(parseFloat(csv_data[i]["Diff"]))

        }
        console.log(state_fills, fillKeys)
            // draw blank map of US
        var map = new Datamap({
            element: document.getElementById('map'),
            scope: 'usa',
            geographyConfig: {
                popupOnHover: false,
                highlightOnHover: false
            },
            fills: state_fills,
            data: fillKeys

        });
    });






})
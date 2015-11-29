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
    d3.csv("datasets/DisabilityStateGap.csv", function(csv_data) {

        var color = d3.scale.linear()
            .domain([0, 50])
            .range(["white", "red"]);

        var state_fills = {}

        var fillKeys = {}

        for (var i = 0; i < csv_data.length; i++) {
            fillKeys[csv_data[i]["State"]] = {fillKey: csv_data[i]["State"]}
            console.log(parseFloat(csv_data[i]["Norm Poverty Percent"]));
		state_fills[csv_data[i]["State"]] = color(parseFloat(csv_data[i]["Norm Poverty Percent"]))
        }

        // draw map of US
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

        // if ($('.selector').attr('id') == 'sel-2') {
        //     console.log('clicked: sel-2')
        // }

        // if ($('.selector').attr('id') == 'sel-3') {
        //     console.log('clicked: sel-3')
        // }
    




})

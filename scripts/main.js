$(document).ready(function() {
	console.log('main.js loaded');

    // load CSVs

    // d3.csv("http://localhost:8000/Are_We_Closing_Elementary.csv", function(csv_data) {
    //     data = csv_data;
    //     console.log("done loading");
    //     buildSelectors();
    //     drawGraph();
    // });

    // d3.csv("http://localhost:8000/Gaz_unsd_national.csv", function(csv_data) {
    //     data = csv_data;
    //     console.log("done loading");
    //     buildSelectors();
    //     drawGraph();
    // });

    // draw blank map of US
    var map = new Datamap({
        element: document.getElementById('map'),
        scope: 'usa',
        geographyConfig: {
            popupOnHover: false,
            highlightOnHover: false
        }
    });

    // draw a single bubble
    var bubbles = [{
        radius: 25,
        latitude: 42.2,
        longitude: -71.2
    }];

    map.bubbles(bubbles);

    // on click, show ID
    $('.selector').click(function() {
        console.log('clicked: ', $('.selector').attr('id'))
    })

})
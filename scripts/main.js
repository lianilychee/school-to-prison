$(document).ready(function() {
	console.log('main.js loaded');

    var map = new Datamap({
        element: document.getElementById('container'),
        scope: 'usa',
        geographyConfig: {
            popupOnHover: false,
            highlightOnHover: false
        }
    });

    var bubbles = [{
        radius: 25,
        latitude: 42.2,
        longitude: -71.2
    }];

    map.bubbles(bubbles);

})
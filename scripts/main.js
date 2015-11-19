$(document).ready(function() {

    // load CSVs

    d3.csv("http://localhost:8000/Are_We_Closing_Elementary.csv", function(csv_data) {
        school_data = csv_data;
        console.log("scjpp; done loading");
        // drawGraph();

        d3.csv("http://localhost:8000/Gaz_unsd_national.csv", function(csv_data) {
                latlon_data = csv_data;
                console.log("latlon done loading");
                // drawGraph();

                for (var i = 0; i < latlon_data.length; i++) {

                    for (var j = 0; i < school_data.length; j++) {
                        console.log(i, j);
                    }

                    if (latlon_data[i]['GEOID'] == school_data)

                }


                // /**Draw one bubble per school district**/
                // var districts = [];

                // // draw one bubble per district
                // for (var i = 0; i < latlon_data.length; i++) {

                //     district_single = {
                //         radius: 1,
                //         latitude: parseFloat(latlon_data[i]['INTPTLAT']),
                //         longitude: parseFloat(latlon_data[i]['INTPTLONG']),
                //         fillKey: 'standard',
                //         borderWidth: 0

                //     }; 

                //     districts.push(district_single);
                // }

                // // console.log(districts);

                // map.bubbles(districts);

                // console.log('done drawing');
                // /****/

            });

    });



    // draw blank map of US
    var map = new Datamap({
        element: document.getElementById('map'),
        scope: 'usa',
        geographyConfig: {
            popupOnHover: false,
            highlightOnHover: false
        },
        fills: {
            'standard': '#FF530D'
        }

    });






    // on click, show ID
    $('.selector').click(function() {
        console.log('clicked: ', $('.selector').attr('id'))
    })

})
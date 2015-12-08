var disability = ""
var race = ""

function regions(regions_data, csv_data){

    console.log(regions_data);


    // Percentage of students are suspended, regardless of disability status
    natlAvg = 10.08;

    // whatever the person clicks in the center panel
    selector = "Black Students WD Rates"

    // create the divs based on the number of districts in regions_data
    // for (var i = 0; i < regions_data.length; i++) {
    for (var i = 0; i < regions_data.length; i++) {

        // calculate the bar per person

        // build the strings that form the HTML
        input_html = "<div class='regional'>" +

                        // append District Name string
                        regions_data[i]["District Name"] + ":  <br>" +

                        // create containers for person
                        "<div class='person-container'>" +
                            "<div class='person-fill'></div>" +
                            "<div class='person-image'><img src='images/person3.png'></div>" +
                        "<div>" + 

                        // append comparison to nat'l average
                        // (Number((parseFloat(regions_data[i][selector]) / natlAvg)).toFixed(2)) +
                        // "x more likely than the NATL avg to be suspended <br>" +

                        // append comparison to regional average
                        (Number((parseFloat(regions_data[i][selector]) / (parseFloat(regions_data[i]["All Students Rates"])))).toFixed(2)) +            
                        "x more likely than the REG avg to be suspended" +

                        "</div>";

        $('ul').append(input_html);
    };

}
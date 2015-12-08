var disability = ""
var race = ""

function regions(regions_data, csv_data){

    // // for every iD in container, return that iD
    // cityList = $('.regions').children('.regional');

    // for (var i = 0; i < cityList.length; i++) {
    //     console.log((cityList[i]))
    // }

    console.log(regions_data);


    // Percentage of students are suspended, regardless of disability status
    natlAvg = 10.08;

    // whatever the person clicks in the center panel
    selector = "Black Students WOD Rates"

    // create the divs
    for (var i = 0; i < regions_data.length; i++) {
         $('ul').append("<div>",
            regions_data[i]["District Name"],
            ":  <br>",
            Number((parseFloat(regions_data[i][selector]) / natlAvg)).toFixed(2),
            "x more likely than the NATL avg to be suspended",
            "<br>",
            Number((parseFloat(regions_data[i][selector]) / (parseFloat(regions_data[i]["All Students Rates"])))).toFixed(2),            
            "x more likely than the REG avg to be suspended",
            "</div><br>")
    };
    
    // $('.regional').each( function(attr) {
    //     console.log($(this).attr('id'));
    // }) 





    // append(show, "x more likely to be suspended");

}
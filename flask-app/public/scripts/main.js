$(document).ready(function() {

    d3.csv("datasets/Are_We_Closing_Secondary_regions.csv", function(regions_data) {     

          layeredPie(regions_data);
          regions(regions_data);
          introSequence();

    });

});

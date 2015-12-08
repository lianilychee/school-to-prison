$(document).ready(function() {

    // load CSV data
    d3.csv("http://localhost:8000/SuspensionByStateAndTotal.csv", function(csv_data) {

        d3.csv("http://localhost:8000/Are_We_Closing_Secondary_regions.csv", function(regions_data) {

            layeredPie(csv_data);
            regions(regions_data, csv_data);

        })
    })

 
    percentage = 0.2

    var containerHeight = $('.person-image').height();

    // console.log(containerHeight)

    var svgContainer = d3.select('.person-fill').append('svg')
                                                .attr('width', '100%')
                                                .attr('height', '100%')

    // console.log(percentage)

    var personFill = svgContainer.append('rect')
                               .attr('x', 0)
                               .attr('y', function() {
                                    return(containerHeight - containerHeight*percentage);
                               })
                               .attr('width', '100%')
                               .attr('height', function() {
                                    return (containerHeight*percentage);
                               })
                               .attr('fill', 'purple')
})

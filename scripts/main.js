$(document).ready(function() {

    layeredPie("http://localhost:8000/SuspensionByStateAndTotal.csv");
 
    percentage = 0.5

    var containerHeight = $('#person-image').height();

    console.log(containerHeight)

    var svgContainer = d3.select('#person').append('svg')
                                                .attr('width', '100%')
                                                .attr('height', '100%')

    console.log(percentage)

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
});
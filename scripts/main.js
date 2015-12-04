$(document).ready(function() {

    // Click handlers
    $('#sel-1').click(function() {
        PERSON.update('sel-1');
    })

    $('#sel-2').click(function() {
        PERSON.update('sel-2');
    })

    $('#sel-3').click(function() {
        PERSON.update('sel-3');
    })

    // load CSVs
    d3.csv("http://localhost:8000/DisabilityStateGap.csv", function(csv_data) {

        var percentage = 0.40; // TWEAK THIS NUMBER

        var containerHeight = $('#person-fill').height();

        var svgContainer = d3.select('#person-fill').append('svg')
                                                    .attr('width', '100%')
                                                    .attr('height', '100%')

        var dudeFill = svgContainer.append('rect')
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
})
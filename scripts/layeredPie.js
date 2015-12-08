var pie_state = "default"
var row_number = 49
var raceColumns = ["White", "Black", "Latino", "Asian American", "American Indian","Hawaiian/Pacific Islander"];
var WDcolor = "#FF8139"
var WODcolor = "#00DFDD"


/** Returns a list of elements, where each element represents an arc in the pie.
    Each arc contains a label, population, suspension rate, color, and selection Y/N. **/
function buildDataset(csv_data, row_number, pie_state){
    var dataset = []
    if (pie_state == "default" || pie_state == "WOD"){
        dataset.push(
            {label:"WD",
            pop:csv_data[row_number]['Students WD Enrollment'],
            susp:(csv_data[row_number]['Suspended Students WD']/csv_data[row_number]['Students WD Enrollment']),
            color:WDcolor,
            selected:false});
    }
    if (pie_state == "WD"){
        for (var i = 0; i < raceColumns.length; i++){
            dataset.push(
                {label:raceColumns[i] + "s WD",
                pop:csv_data[row_number][raceColumns[i] + 's WD Enrollment'],
                susp:(csv_data[row_number]['Suspended '+ raceColumns[i] + 's WD']/csv_data[row_number][raceColumns[i]+'s WD Enrollment']),
                color:d3.rgb(WDcolor).darker(i*.25),
                selected:false});
        }
    }
    if (pie_state == "default" || pie_state == "WD"){
        dataset.push(
            {label:"WOD",
            pop:csv_data[row_number]['Students WOD Enrollment'],
            susp:(csv_data[row_number]['Suspended Students WOD']/csv_data[row_number]['Students WOD Enrollment']),
            color:WODcolor,
            selected:false});
    }
    if (pie_state == "WOD"){
        for (var i = 0; i < raceColumns.length; i++){
            dataset.push(
                {label:raceColumns[i] + "s WOD",
                pop:csv_data[row_number][raceColumns[i] + 's WOD Enrollment'],
                susp:(csv_data[row_number]['Suspended '+ raceColumns[i] + 's WOD']/csv_data[row_number][raceColumns[i]+'s WOD Enrollment']),
                color:d3.rgb(WODcolor).darker(i*.25),
                selected:false});
        }
    }
    return dataset
}


/** Build the layered pie. **/
function layeredPie(csv_data){

    var outer_radius = 300
    var inner_radius = 120
    

    // dimensions of the svg
    width = 600
    height = 600

    // stick an SVG to the body of index.html
    var svg = d3.select("#pie").append("svg")
        .attr("width", width)
        .attr("height", height);

    var state_label = svg.append("text")
        .attr("transform", "translate(" + width / 20 + "," + height / 15 + ")")
        .style("font-family","sans-serif")
        .style("font-size","20px");
        
    var back_button = svg.append("foreignObject")
        .attr("transform", "translate(" + 17 * width / 20 + "," + height / 15 + ")")
        // .style("font-family","sans-serif")
        // .style("font-size","20px")
        // .text("Back")
        .style("visibility", "hidden")
        .append("xhtml:body")
            .html("<button class=\"back-button\">Back</button>");

    var infog = svg.append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
        .style("text-anchor", "middle")
        .style("font-family","sans-serif");
    var info_text = {
            line1:infog.append("text").attr('dy','-20'),
            line2:infog.append("text").attr('dy','0'),
            line3:infog.append("text").attr('dy','20'),
        }   

    var pieg = svg.append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // initialize pie chart
    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) { return d.pop; });

    // initialize the outer slice
    var arc = d3.svg.arc()
        .outerRadius(outer_radius)
        .innerRadius(inner_radius)

    // initialize the inner slice
    var susp_arc = d3.svg.arc()
        .outerRadius(function(d){
            // console.log(d.data.susp);
            return Math.sqrt(d.data.susp*(Math.pow(outer_radius,2) - Math.pow(inner_radius,2)) + Math.pow(inner_radius,2));
        })
        .innerRadius(inner_radius)


    /** On element click, update the dataset. **/
    function update(csv_data){
        state_label.text(csv_data[row_number]['State']);
        state_label.on("click",function(){
            row_number = (row_number + 1) % 50;
            update(csv_data);
        });
        var dataset = buildDataset(csv_data, row_number, pie_state);
        pieg.selectAll("g").remove();
        var g = pieg.selectAll(".arc")
            .data(pie(dataset))
            .enter()
            .append("g")
            .attr("class", "arc")
            .on("click", function(d,i) {

                if(d.data.label == "WD" || d.data.label == "WOD"){
                    pie_state = d.data.label;
                    update(csv_data);
                } else {
                    d.data.selected = !d.data.selected;
                    var arcs = pieg.selectAll(".arc");
                    arcs.each(function(e,j) {
                        d3.select(this).transition().duration(200).style("fill-opacity", d.data.selected && d!==e ? .6 : 1);
                        e.data.selected = d===e && e.data.selected;
                    });
                    if (d.data.selected) {
                        setInfog(d);
                        arcs.on("mouseover", null).on("mouseout", null);
                    } else {
                        arcs.on("mouseover", setInfog).on("mouseout", hideInfog);
                    };
                }
            })
            .on("mouseover", setInfog)
            .on("mouseout", hideInfog);

        g.append("path")
            .attr("d", arc)
            .attr("class","whole_arc")
            .style("fill", function(d,i) { return d.data.color; })
            .each(function(d) { this._current = d });


        g.append("path")
            .attr("d", susp_arc)
            .attr("class","susp_arc")
            .style("fill", function(d,i) { return d3.rgb(d.data.color).brighter(1); })
            .each(function(d) { this._current = d });

        if (pie_state != "default") {
            var pieSwoosh = d3.layout.pie()
                .sort(null)
                .value(function(d) {
                    // console.log(d.label, pie_state);
                    // console.log(d.label.indexOf(pie_state));
                    return d.label.indexOf(pie_state) < 0 ? 0 : d.pop;
                });
            console.log(g.data());
            g = g.data(pieSwoosh(dataset));
            console.log(g.data());
            g.selectAll(".whole_arc").transition().duration(750).attrTween("d", arcTween);
            g.selectAll(".susp_arc").transition().duration(750).attrTween("d", arcTween);
            back_button.style("visibility", "visible");

            back_button.on("click", function() {
                g = g.data(pie(dataset));
                g.selectAll(".whole_arc").transition().duration(750).attrTween("d", arcTween);
                g.selectAll(".susp_arc").transition().duration(750).attrTween("d", arcTween);
                pie_state = "default";
                setTimeout(function() { update(csv_data); }, 750);
                // update(csv_data);
            });
        } else {
            back_button.style("visibility", "hidden");
        };
    }

    function arcTween(d, i, a) {
        var i = d3.interpolate(this._current, d3.select(this.parentNode).datum());
        console.log(d);
        console.log(this._current);
        console.log(i(0));
        console.log(i(1));
        this._current = i(0);
        if (d3.select(this).attr("class") == "whole_arc") {
            return function(t) {
                // console.log(t);
                // console.log(arc(i(t)));
                return arc(i(t));
            };
        } else {
            return function(t) {
                return susp_arc(i(t));
            };
        };
    }

    function setInfog(d) {
        infog.style("visibility", "visible");
        info_text.line1.text((d.data.susp*100).toFixed(2) + "% of");
        info_text.line2.text(d.data.label);
        info_text.line3.text("Suspended");
    }

    function hideInfog() {
        infog.style("visibility", "hidden");
    }
 
    update(csv_data);
 }
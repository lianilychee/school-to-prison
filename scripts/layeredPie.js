var GLOBAL = {};
GLOBAL.selectionState = "None";
var pie_state = "default";
var row_number = 49;
var raceColumns = ["White", "Black", "Latino", "Asian American", "American Indian","Hawaiian/Pacific Islander"];
var WDcolor = "#FF8139";
var WODcolor = '#A2DFDD'// LIANI original: "#00DFDD";
var regions = false;



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
        var totalSusp = 0;
        var totalEnroll = 0;
        for (var i = 0; i < raceColumns.length; i++){
            totalSusp += parseInt(csv_data[row_number]['Suspended '+ raceColumns[i] + 's WD']);
            totalEnroll += parseInt(csv_data[row_number][raceColumns[i]+'s WD Enrollment']);
            dataset.push(
                {label:raceColumns[i] + "s WD",
                pop:csv_data[row_number][raceColumns[i] + 's WD Enrollment'],
                susp:(csv_data[row_number]['Suspended '+ raceColumns[i] + 's WD']/csv_data[row_number][raceColumns[i]+'s WD Enrollment']),
                color:d3.rgb(WDcolor).darker(i*.25),
                selected:false});
        }
        dataset.push({label:"Other WD",
            pop:csv_data[row_number]['Students WD Enrollment'] - totalEnroll,
            susp:((csv_data[row_number]['Suspended Students WD'] - totalSusp)/(csv_data[row_number]['Students WD Enrollment'] - totalEnroll)),
            color:d3.rgb(WDcolor).darker(i*.25),
            selected:false});
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
        var totalSusp = 0;
        var totalEnroll = 0;
        for (var i = 0; i < raceColumns.length; i++){
            totalSusp += parseInt(csv_data[row_number]['Suspended '+ raceColumns[i] + 's WOD']);
            totalEnroll += parseInt(csv_data[row_number][raceColumns[i]+'s WOD Enrollment']);
            dataset.push(
                {label:raceColumns[i] + "s WOD",
                pop:csv_data[row_number][raceColumns[i] + 's WOD Enrollment'],
                susp:(csv_data[row_number]['Suspended '+ raceColumns[i] + 's WOD']/csv_data[row_number][raceColumns[i]+'s WOD Enrollment']),
                color:d3.rgb(WODcolor).darker(i*.25),
                selected:false});
        }
        dataset.push({label:"Other WOD",
            pop:csv_data[row_number]['Students WOD Enrollment'] - totalEnroll,
            susp:((csv_data[row_number]['Suspended Students WOD'] - totalSusp)/(csv_data[row_number]['Students WOD Enrollment'] - totalEnroll)),
            color:d3.rgb(WODcolor).darker(i*.25),
            selected:false});
    }
    // console.log(dataset)
    return dataset
}

// TODO: uncomment all of the below
/** Build the layered pie. **/
function layeredPie(csv_data){

    console.log('layeredPie()');

    // var outer_radius = 320
    // var inner_radius = 120
    // var label_radius = 340


    // // dimensions of the svg
    // width = 1000
    // height = 1000


    // // stick an SVG to the body of index.html
    // var svg = d3.select("body").append("svg")
    //     .attr("width", width)
    //     .attr("height", height);

    // var state_label = svg.append("text")
    //     .attr("transform", "translate(" + width / 20 + "," + height / 15 + ")")
    //     .style("font-family","sans-serif")
    //     .style("font-size","20px");

    // var back_button = svg.append("foreignObject")
    //     .attr("transform", "translate(" + 17 * width / 20 + "," + height / 15 + ")")
    //     // .style("font-family","sans-serif")
    //     // .style("font-size","20px")
    //     // .text("Back")
    //     .style("visibility", "hidden")
    //     .append("xhtml:body")
    //         .html("<button class=\"back-button\">Back</button>");

    // var infog = svg.append("g")
    //     .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
    //     .style("text-anchor", "middle")
    //     .style("font-family","sans-serif");
    // var info_text = {
    //         line1:infog.append("text").attr('dy','-20'),
    //         line2:infog.append("text").attr('dy','0'),
    //         line3:infog.append("text").attr('dy','20'),
    //     }   

    // var pieg = svg.append("g")
    //     .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // // initialize pie chart
    // var pie = d3.layout.pie()
    //     .sort(null)
    //     .value(function(d) { return d.pop; });

    // // initialize the outer slice
    // var arc = d3.svg.arc()
    //     .outerRadius(outer_radius)
    //     .innerRadius(inner_radius);

    // // initialize the inner slice
    // var susp_arc = d3.svg.arc()
    //     .outerRadius(function(d){
    //         // console.log(d.data.susp);
    //         var r = Math.sqrt(d.data.susp*(Math.pow(outer_radius,2) - Math.pow(inner_radius,2)) + Math.pow(inner_radius,2));
    //         return r != NaN ? r : inner_radius;
    //     })
    //     .innerRadius(inner_radius)

    // /** On element click, update the dataset. **/
    // function update(csv_data){
    //     GLOBAL.selectionState = pie_state;
    //     state_label.text(csv_data[row_number]['State']);
    //     state_label.on("click",function(){
    //         row_number = (row_number + 1) % 50;
    //         update(csv_data);
    //     });
    //     var dataset = buildDataset(csv_data, row_number, pie_state);
    //     pieg.selectAll("g").remove();
    //     pieg.selectAll(".arc-label").remove();
    //     var g = pieg.selectAll(".arc")
    //         .data(pie(dataset))
    //         .enter()
    //         .append("g")
    //         .attr("class", "arc")
    //         .on("click", function(d,i) {
    //             if(d.data.label == "WD" || d.data.label == "WOD"){
    //                 pie_state = d.data.label;
    //                 update(csv_data);
    //             } else {
    //                 d.data.selected = !d.data.selected;
    //                 var arcs = pieg.selectAll(".arc");
    //                 arcs.each(function(e,j) {
    //                     d3.select(this).transition().duration(200).style("fill-opacity", d.data.selected && d!==e ? .2 : 1);  // LIANI change the first # in ratio to change opacity of selected
    //                     e.data.selected = d===e && e.data.selected;
    //                 });
    //                 if (d.data.selected) {
    //                     setInfog(d);
    //                     arcs.on("mouseover", null).on("mouseout", null);
    //                     GLOBAL.selectionState = d.data.label;
    //                 } else {
    //                     arcs.on("mouseover", setInfog).on("mouseout", hideInfog);
    //                     GLOBAL.selectionState = pie_state;
    //                 };
    //             }
    //         })
    //         .on("mouseover", setInfog)
    //         .on("mouseout", hideInfog);

    //     g.append("path")
    //         .attr("d", arc)
    //         .attr("class","whole_arc")
    //         .style("fill", function(d,i) { return d.data.color; })
    //         .each(function(d) { this._current = d });


    //     g.append("path")
    //         .attr("d", susp_arc)
    //         .attr("class","susp_arc")
    //         .style("fill", function(d,i) { return d3.rgb(d.data.color).darker(1); }) // LIANI control the inner color
    //         .each(function(d) { this._current = d });


    //     if (pie_state != "default") {
    //         var pieSwoosh = d3.layout.pie()
    //             .sort(null)
    //             .value(function(d) {
    //                 // console.log(d.label, pie_state);
    //                 // console.log(d.label.indexOf(pie_state));
    //                 return d.label.indexOf(pie_state) < 0 ? 0 : d.pop;
    //             });
    //         g = g.data(pieSwoosh(dataset));
    //         g.selectAll(".whole_arc").transition().duration(750).attrTween("d", arcTween);
    //         g.selectAll(".susp_arc").transition().duration(750).attrTween("d", arcTween);
    //         back_button.style("visibility", "visible");

    //         back_button.on("click", function() {
    //             pieg.selectAll(".arc-label").transition().duration(750).style("fill-opacity",0);
    //             g = g.data(pie(dataset));
    //             g.selectAll(".whole_arc").transition().duration(750).attrTween("d", arcTween);
    //             g.selectAll(".susp_arc").transition().duration(750).attrTween("d", arcTween);
    //             pie_state = "default";
    //             setTimeout(function() { update(csv_data); }, 750);
    //             // update(csv_data);
    //         });

    //     } else {
    //         back_button.style("visibility", "hidden");

    //     };

    //     var labels = []
    //     g.each(function(d,i){
    //         var label = {}
    //         label.desc =  d.data.label + " " + ((d.endAngle - d.startAngle)*100/(2*Math.PI)).toFixed(2) + "%";
    //         var ang = (d.startAngle + d.endAngle)/2
    //         label.x = Math.sin(ang) * label_radius
    //         label.y = Math.cos(ang) * -label_radius
    //         if(d.value > 0){
    //             d3.select(this)
    //             .append('text')
    //             .attr('class', 'arc-label')
    //             .attr('x', label.x)
    //             .attr('y', label.y)
    //             .attr('text-anchor', label.x >= 0 ? "start" : "end")
    //             .style("fill-opacity",0)
    //             .text(label.desc);
    //         }
    //     });
    //     arrangeLabels();
    //     if (pie_state != "default"){
    //         pieg.selectAll(".arc-label").transition().delay(700).duration(500).style("fill-opacity",1);
    //     } else {
    //         pieg.selectAll(".arc-label").style("fill-opacity",1);
    //     }
    // }

    // function arcTween(d, i, a) {
    //     var i = d3.interpolate(this._current, d3.select(this.parentNode).datum());
    //     this._current = i(0);
    //     if (d3.select(this).attr("class") == "whole_arc") {
    //         return function(t) {
    //             // console.log(t);
    //             // console.log(arc(i(t)));
    //             return arc(i(t));
    //         };
    //     } else {
    //         return function(t) {
    //             return susp_arc(i(t));
    //         };
    //     };
    // }

    // function setInfog(d) {
    //     infog.style("visibility", "visible");
    //     info_text.line1.text((d.data.susp*100).toFixed(2) + "% of");
    //     info_text.line2.text(d.data.label);
    //     info_text.line3.text("Suspended");
    // }

    // function hideInfog() {
    //     infog.style("visibility", "hidden");
    // }
    // function arrangeLabels() {
    //   var move = 1;
    //   while(move > 0) {
    //     move = 0;
    //     pieg.selectAll(".arc-label")
    //        .each(function() {
    //          var that = this,
    //              a = this.getBoundingClientRect();
    //          pieg.selectAll(".arc-label")
    //             .each(function() {
    //               if(this != that) {
    //                 var b = this.getBoundingClientRect();
    //                 if((Math.abs(a.left - b.left) * 2 < (a.width + b.width)) &&
    //                    (Math.abs(a.top - b.top) * 2 < (a.height + b.height))) {
    //                   // overlap, move labels
    //                   var dy = (Math.max(0, a.bottom - b.top) +
    //                            Math.min(0, a.top - b.bottom)) * 0.02,
    //                       tt = d3.transform(d3.select(this).attr("transform")),
    //                       to = d3.transform(d3.select(that).attr("transform"));
    //                   move += Math.abs(dy);

    //                   to.translate = [ to.translate[0], to.translate[1] + dy ];
    //                   tt.translate = [ tt.translate[0], tt.translate[1] - dy ];
    //                   d3.select(this).attr("transform", "translate(" + tt.translate + ")");
    //                   d3.select(that).attr("transform", "translate(" + to.translate + ")");
    //                   a = this.getBoundingClientRect();
    //                 }
    //               }
    //             });
    //        });
    //     }
    // }
 
    // update(csv_data);
 }

var LAYEREDPIE = {}
var selection_state = "";
var pie_state = "default";
var row_number = 0;
var races = ["W","B","L","AA"/*,"AI","PI"*/];
var color = {
    "WD":d3.rgb("#BE1E2D").brighter(2),
    "WOD":d3.rgb("#3C3CBF")
}// LIANI original: "#00DFDD";


// text is for csv column lookup, display is for labeling
var magicText = {
    "WD":{
        "text":"Disabled",
    },
    "WOD":{
        "text":"Non-Disabled"
    },
    "W":{
        "text": "White",
        "display": "White"
    },
    "B":{
        "text": "Black",
        "display": "Black"
    },
    "L":{
        "text": "Latino",
        "display": "Latino"
    },
    "AA":{
        "text": "Asian American",
        "display": "Asian"
    },
    "AI":{
        "text": "American Indian",
        "display": "American Indian"
    },
    "PI":{
        "text": "Hawaiian/Pacific Islander",
        "display": "Hawaiian/Pacific Islander"
    },
    "O":{
        "text": "other",
        "display": "other"
    }
}


// references columns in csv for databuilding
var raceStringBuilder = function(code){
    return {
        text:magicText[code].text,
        display:magicText[code].display,
        enrolled:function(dis){
            return magicText[code].text + "s " + dis + " Enrollment";
        },
        suspended:function(dis){
            return "Suspended " + magicText[code].text + "s " + dis;
        },
        suspRate:function(dis){
            return magicText[code].text + " Students " + dis + " Rates"
        }
    }
}

/** Returns a list of elements, where each element represents an arc in the pie.
    Each arc contains a label, population, suspension rate, color, and selection Y/N. 

    Has the code that builds the race arcs.  **/
function buildDataset(csv_data, row_number, pie_state){
    var dataset = []
    if (pie_state == "default"){
        dataset.push(disabilityArcInfo(csv_data,"WD"));
        dataset.push(disabilityArcInfo(csv_data,"WOD"));
    }
    if (pie_state == "WD" || pie_state == "WOD"){
        if (pie_state == "WOD"){
            dataset.push(disabilityArcInfo(csv_data,"WD"));
        }
        var totalSusp = 0;
        var totalEnroll = 0;
        for (var i = 0; i < races.length; i++){
            var rsb = raceStringBuilder(races[i]);
            totalSusp += parseInt(csv_data[row_number][rsb.suspended(pie_state)]);
            totalEnroll += parseInt(csv_data[row_number][rsb.enrolled(pie_state)]);
            dataset.push({
                id:races[i],
                label:rsb.display,
                pop:csv_data[row_number][rsb.enrolled(pie_state)],
                susp:(csv_data[row_number][rsb.suspended(pie_state)]/csv_data[row_number][rsb.enrolled(pie_state)]),
                color:d3.rgb(color[pie_state]).darker(i*3),
                selected:false});
        }
        var other = {
            id:"O",
            label:"Other",
            pop:csv_data[row_number]["Students "+pie_state+" Enrollment"] - totalEnroll,
            susp:((csv_data[row_number]["Suspended Students "+pie_state+""] - totalSusp)/(csv_data[row_number]["Students "+pie_state+" Enrollment"] - totalEnroll)),
            color:d3.rgb(color[pie_state]).darker(i*.5),
            selected:false}
        if (other.pop > 0 && other.susp > 0){
            dataset.push(other);
        }
        if (pie_state == "WD"){
            dataset.push(disabilityArcInfo(csv_data,"WOD"));
        }
    }
    
    // console.log(dataset)
    return dataset
}

/** Basically builds datasets for the not-race arcs. **/
function disabilityArcInfo(csv_data,pie_state){
    // console.log(csv_data)
    // console.log(pie_state, csv_data[row_number]["Students "+pie_state+" Enrollment"])
    return {id:pie_state,
    label:magicText[pie_state].text,
    pop:csv_data[row_number]["Students "+pie_state+" Enrollment"],
    susp:(csv_data[row_number]["Suspended Students "+pie_state]/csv_data[row_number]["Students "+pie_state+" Enrollment"]),
    color:color[pie_state],
    selected:false}
}


/** Build the layered pie. **/
function layeredPie(csv_data){

    var outer_radius = 500
    var inner_radius = 100


    // dimensions of the svg
    var bbox = d3.select("#pie").node().getBoundingClientRect()
    var height = bbox.height;
    var width = bbox.width;

    var pie_center = {
        x:width * (1/2),
        y:height * (1/2)
    } 


    // stick an SVG to the body of index.html
    var svg = d3.select("#pie").append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("fill","#323232")
        .style("overflow","visible");


    var back_rad = 6;
    var back_size = inner_radius / 3;
    var back_button = svg.append("g")
        .style("visibility", "hidden");
    back_button.append("polygon")
        .attr("transform", "translate(" + pie_center.x + "," + (pie_center.y - inner_radius) + ")")
        .style("fill", "black")
        .attr("points", 0 + "," + 0 + " " + (back_size * Math.sqrt(3) / 2) + "," + (back_size) + " " + (-back_size * Math.sqrt(3) / 2) + "," + (back_size));
    back_button.append("foreignObject")
        .attr("transform", "translate(" + (pie_center.x - back_rad) + "," + (pie_center.y - inner_radius + 3 / 2 * back_rad)+ ")")
        .attr("left", "-2em")
        .attr("top", "-2em")
        .style("text-align", "center")
        .append("xhtml:div")
            .style("margin", 0)
            .html("<i class=\"fa fa-undo\"></i>")
            .style("font-size", back_rad * 2)
            .style("color", "#C8C8C8");

    var infog = svg.append("g")
        .attr("transform", "translate(" + pie_center.x + "," + pie_center.y + ")")
        .style("text-anchor", "middle")
        .style("font-family","sans-serif");
    var info_text = {
            line1:infog.append("text")
                .attr("dy","-20")
                .style("font-size",20)
                .style("font-weight","bold"),
            line2:infog.append("text").attr("dy","0")
                .style("font-size",14),
            line3:infog.append("text").attr("dy","20")
                .style("font-size",14),
        }
      

    var pieG = svg.append("g")
        .attr("transform", "translate(" + pie_center.x + "," + pie_center.y + ")");

    // initialize pie chart
    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) { return d.pop; });

    // initialize the outer slice
    var arc = d3.svg.arc()
        .outerRadius(outer_radius)
        .innerRadius(inner_radius);

    var max_susp_r = 0;
    var absolute_max = 280;

    var suspArcSize = function(d){
            // console.log(d.data.susp);
            var r = Math.sqrt(d.data.susp*(Math.pow(outer_radius,2) - Math.pow(inner_radius,2)) + Math.pow(inner_radius,2));
            if(r > max_susp_r){
                max_susp_r = r;
            }
            if(max_susp_r > absolute_max){
                max_susp_r = absolute_max;
            }

            return r != NaN ? r : inner_radius;
    }
    // initialize the inner slice
    var susp_arc = d3.svg.arc()
        .outerRadius(suspArcSize)
        .innerRadius(inner_radius)

    /** On element click, update the dataset. **/
    function update(csv_data, non_interactive){
        updateTitle(pie_state);

        var dataset = buildDataset(csv_data, row_number, pie_state);
        pieG.selectAll("g").remove();
        pieG.selectAll(".arc-label").remove();
        svg.selectAll("image").remove();
        var g = pieG.selectAll(".arc")
            .data(pie(dataset))
            .enter()
            .append("g")
            .attr("class", "arc")
            .on("click", non_interactive ? null : selectArc)
            .on("mouseover", non_interactive ? null : setInfog)
            .on("mouseout", non_interactive ? null : hideInfog);

        // g.append("path")
        //     .attr("d", arc)
        //     .attr("class","whole_arc")
        //     .attr("fill-opacity",.5)
        //     .style("fill", function(d,i) { return d.data.color; })
        //     .each(function(d) { this._current = d });

        
        max_susp_r = 0;
        g.append("path")
            .attr("d", susp_arc)
            .attr("class","susp_arc")
            .style("fill", function(d,i) { return d3.rgb(d.data.color).darker(1); }) // LIANI control the inner color
            .each(function(d) { this._current = d });

        //Select state if state was selected on previous data
        if(selection_state != ""){
            if(pie_state != "default" && (selection_state == "WD" || selection_state == "WOD")){
                updateDetailText({data:disabilityArcInfo(csv_data,pie_state)});
            }else{
                pieG.selectAll(".arc").each(function(d){
                    if(d.data.id == selection_state){
                        selectArc(d);
                        if(non_interactive){
                            setInfog.call(this,d);
                        }
                    }

                });
            }
        }else{
            updateDetailText(null);
        }

        if (pie_state != "default") {
            REGIONS.update("All Students Rates");
            var pieSwoosh = d3.layout.pie()
                .sort(null)
                .value(function(d) {
                    // console.log(d.label, pie_state);
                    // console.log(d.label.indexOf(pie_state));
                    return d.id == (pie_state == "WD"?"WOD":"WD") ? 0 : d.pop;

                });
            g = g.data(pieSwoosh(dataset));
            g.selectAll(".whole_arc").transition().duration(750).attrTween("d", arcTween);
            g.selectAll(".susp_arc").transition().duration(750).attrTween("d", arcTween);
            back_button.style("visibility", non_interactive ? "hidden" : "visible");

            back_button.on("click", function() {
                selection_state = "";
                updateDetailText(null);

                back_button.style("visibility", "hidden");

                pieG.selectAll(".arc-label").transition().duration(750).style("fill-opacity",0);
                g = g.data(pie(dataset));
                g.selectAll(".whole_arc").transition().duration(750).attrTween("d", arcTween);
                g.selectAll(".susp_arc").transition().duration(750).attrTween("d", arcTween);
                pie_state = "default";
                setTimeout(function() { 
                    update(csv_data);
                    REGIONS.update("All Students Rates");
                }, 750);
                // update(csv_data);
            });

        }

        var labels = []
        g.each(function(d,i){
            var label = {};
            label.desc =  d.data.label;// + " " + ((d.endAngle - d.startAngle)*100/(2*Math.PI)).toFixed(2) + "%";
            var ang = (d.startAngle + d.endAngle)/2;
            label.x = Math.sin(ang) * (max_susp_r  + 20);
            label.y = Math.cos(ang) * -(max_susp_r + 20);
            if (d.value > 0){
                var labelG = d3.select(this)
                    .append("g")
                    .attr("class", "arc-label")
                    .attr("transform", "translate("+label.x+" "+label.y+")")
                    .style("fill-opacity",0);
                var labelText = labelG.append("text")
                    .attr("text-anchor", label.x >= 0 ? "start" : "end")
                    .text(d.value > 0 ? label.desc: "");
                var bbox = labelText.node().getBoundingClientRect();
                var vpadding = 2;
                var hpadding = 5;
                var labelBox = labelG.append("rect")
                    .attr("transform", "translate("+ (label.x >= 0 ? -hpadding : -bbox.width - hpadding)+" "+(vpadding - bbox.height)+")")
                    .attr("width", bbox.width + (hpadding*2))
                    .attr("height", bbox.height + (vpadding*2))
                    .attr("rx", 5)
                    .attr("ry", 5)
                    .style("fill", "#C8C8C8");
                labelText[0][0].parentNode.appendChild(labelText[0][0])
            }
                
        });
        arrangeLabels();
        if (pie_state != "default"){
            pieG.selectAll(".arc-label").transition().delay(700).duration(500).style("fill-opacity",1);
        } else {
            pieG.selectAll(".arc-label").style("fill-opacity",1);
        }

        //Add the diagram last so its always on top
        var scale = .3;
        svg.append("svg:image")
            .attr("transform","translate(" + width * (7/10) +" "+ -50 +")")
            .attr('width', scale*888)
            .attr('height', scale*501)
            .attr("xlink:href","images/diagram.png")
    }

    function selectArc(d){
        if (d.data.id == "O"){
            return;
        }
        d.data.selected = !d.data.selected;
        var arcs = pieG.selectAll(".arc");
        arcs.each(function(e,j) {
            d3.select(this).select(".susp_arc").style("fill-opacity", d.data.selected && d!==e ? .2 : 1);  // LIANI change the first # in ratio to change opacity of selected
            e.data.selected = d===e && e.data.selected;
        });
        if (d.data.selected) {
            updateDetailText(d);
            selection_state = d.data.id;
            REGIONS.update(pie_state == "default" ? "All Students " + d.data.id +" Rates" : raceStringBuilder(d.data.id).suspRate(pie_state));
        } else {
            if (pie_state != "default"){
                selection_state = pie_state;
                updateDetailText({data:disabilityArcInfo(csv_data,pie_state)});
                REGIONS.update("All Students " +pie_state+" Rates");
            }else{
                //swoosh
                pie_state = d.data.id;
                update(csv_data);
                REGIONS.update("All Students "+ pie_state +" Rates")

                //unselect
                /*selection_state = "";
                REGIONS.update("All Students Rates");*/
            }
        };
    }
    function updateDetailText(d){
        if (!d){
            d3.select("#detail-text").html("Select sections to compare suspension risk across districts, double-click to break down sections by race.");
            d3.select("#districts-sub-title").html("for all students");
        }else{
            var detail_string = (csv_data[row_number]["District Name"] == "Total" ? "Nationally,<br>" : ("In " + csv_data[row_number]["District Name"] + ",<br/>"));
            detail_string += (d.data.id == "WD" || d.data.id == "WOD" ? d.data.label + " students are <br>": d.data.label + " " + magicText[pie_state].text + " students <br/> are ")
            var risk_factor = ((d.data.susp*100)/REGIONS.natAvg).toFixed(1); 
            detail_string += "<span style='font-size:25px'><strong>" + risk_factor + "X</strong></span>"
            detail_string += (risk_factor > 1 ? " times more likely " : " times as likely ");
            detail_string += "to be suspended than the average student."
            d3.select("#detail-text").html(detail_string)


            var districts_title_strings = "for "+(d.data.id == "WD" || d.data.id == "WOD" ? d.data.label + " students": d.data.label + " " + magicText[pie_state].text + " students")
            d3.select("#districts-sub-title").html(districts_title_strings);
        }
    }
    function updateTitle(pie_state){
        // var titleString = ""
        // titleString += csv_data[row_number]["District Name"] == "Total" ? " in the United States" : " in " + csv_data[row_number]["District Name"];
        // if(pie_state == "default"){
        //     titleString += ", by disability status";
        // }else{
        //     titleString += " for "+(pie_state == "WD" ? "disabled" : "non-disabled")+" students, by race";
        // }
        // d3.select("#pie-subtitle").html(titleString);

        var place = csv_data[row_number]["District Name"] == "Total" ? "The United States" : "" + csv_data[row_number]["District Name"];
        if(pie_state == "default"){
            var type = ", by disability status";
        }else{
            var type = "for "+(pie_state == "WD" ? "disabled" : "non-disabled")+" students, by race";
        }
        d3.select("#pie-subtitle-place").html(place);
        d3.select("#pie-subtitle-type").html(type);
    }

    function arcTween(d, i, a) {
        var i = d3.interpolate(this._current, d3.select(this.parentNode).datum());
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
        this.parentNode.appendChild(this);
        d3.select(this).select(".susp_arc").style('stroke', 'white')
        .style('stroke-width', 3)
        .style('stroke-alignment', 'inner');

        infog.style("visibility", "visible");
        info_text.line1.text(((d.data.susp*100)/REGIONS.natAvg).toFixed(1) + "X");
        if(d.data.id == "WD" || d.data.id == "WOD"){
            info_text.line2.text("for " + d.data.label);
            info_text.line3.text("students");
        }else{
            info_text.line2.text("for " + magicText[d.data.id].display + " " + magicText[pie_state].text);
            info_text.line3.text("students");
        }
        
        
    }

    function hideInfog() {
        infog.style("visibility", "hidden");
        d3.select(this).select(".susp_arc").style('stroke-width', 0);
    }
    function arrangeLabels() {
      var move = 1;
      while(move > 0) {
        move = 0;
        pieG.selectAll(".arc-label")
           .each(function() {
            var that = this;
            var a = this.getBoundingClientRect();
             pieG.selectAll(".arc-label")
                .each(function() {
                  if(this != that) {
                    var b = this.getBoundingClientRect();
                    if((Math.abs(a.left - b.left) * 2 < (a.width + b.width + 10)) &&
                       (Math.abs(a.top - b.top) * 2 < (a.height + b.height + 10))) {
                      // overlap, move labels
                      var dy = (Math.max(0, a.bottom - b.top) +
                               Math.min(0, a.top - b.bottom)) * 0.02,
                          tt = d3.transform(d3.select(this).attr("transform")),
                          to = d3.transform(d3.select(that).attr("transform"));
                      move += Math.abs(dy);

                      to.translate = [ to.translate[0], to.translate[1] + dy ];
                      tt.translate = [ tt.translate[0], tt.translate[1] - dy ];
                      d3.select(this).attr("transform", "translate(" + tt.translate + ")");
                      d3.select(that).attr("transform", "translate(" + to.translate + ")");
                      a = this.getBoundingClientRect();
                    }
                  }
                });
           });
        }
    }
 
    LAYEREDPIE.update = function(region_number){
        row_number = region_number;
        update(csv_data);
    };
    LAYEREDPIE.forceState = function(row, selection, pie){
        row_number = row;
        selection_state = selection;
        pie_state = pie;
        infog.style("visibility", "hidden");
        update(csv_data, true);
    };
 }


var pie_state = "default"
var row_number = 49
var raceColumns = ["White", "Black", "Latino", "Asian American", "American Indian","Hawaiian/Pacific Islander"];
var WDcolor = "#FF8139"
var WODcolor = "#00DFDD"


/** Returns a list of elements, where each element represents an arc in the pie.
    Each arc contains a label, population, suspension rate, color, and selection Y/N. **/
function buildDataset(csv_data, row_number, pie_state){
    var dataset = []
    if (pie_state == "default" || pie_state == "WODRace"){
        dataset.push(
            {label:"WD",
            pop:csv_data[row_number]['Students WD Enrollment'],
            susp:(csv_data[row_number]['Suspended Students WD']/csv_data[row_number]['Students WD Enrollment']),
            color:WDcolor,
            selected:false});
    }
    if (pie_state == "WDRace"){
        for (var i = 0; i < raceColumns.length; i++){
            dataset.push(
                {label:raceColumns[i] + "s WD",
                pop:csv_data[row_number][raceColumns[i] + 's WD Enrollment'],
                susp:(csv_data[row_number]['Suspended '+ raceColumns[i] + 's WD']/csv_data[row_number][raceColumns[i]+'s WD Enrollment']),
                color:d3.rgb(WDcolor).darker(i*.25),
                selected:false});
        }
    }
    if (pie_state == "default" || pie_state == "WDRace"){
        dataset.push(
            {label:"WOD",
            pop:csv_data[row_number]['Students WOD Enrollment'],
            susp:(csv_data[row_number]['Suspended Students WOD']/csv_data[row_number]['Students WOD Enrollment']),
            color:WODcolor,
            selected:false});
    }
    if (pie_state == "WODRace"){
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
    var label_radius = 320
    

    // dimensions of the svg
    width = 1000
    height = 1000

    // stick an SVG to the body of index.html
    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    var state_label = svg.append("text")
        .attr("transform", "translate(" + width / 20 + "," + height / 15 + ")")
        .style("font-family","sans-serif")
        .style("font-size","20px");
        

    var infog = svg.append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
        .style('opacity',0)
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
        .innerRadius(inner_radius);

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
        pieg.selectAll(".arc-label").remove();
        var g = pieg.selectAll(".arc")
            .data(pie(dataset))
            .enter()
            .append("g")
            .attr("class", "arc")
            .on("click", function(d,i) {

                if(d.data.label == "WD" || d.data.label == "WOD"){
                    pie_state = d.data.label+"Race";
                    update(csv_data);
                }else{
                    d.data.selected = !d.data.selected
                    d3.select(this).selectAll(".whole_arc").style("stroke", d.data.selected ? d3.rgb(d.data.color).darker(1) : d.data.color);
                    d3.select(this).selectAll(".susp_arc").style("stroke", d.data.selected ? d.data.color : d3.rgb(d.data.color).brighter(1));
                }
            })
            .on("mouseover",function(d){
                infog.style("opacity",1);
                info_text.line1.text((d.data.susp*100).toFixed(2) + "% of");
                info_text.line2.text(d.data.label);
                info_text.line3.text("Suspended");
            })
            .on("mouseout",function(d){
                infog.style("opacity",0);
            });

        g.append("path")
            .attr("d", arc)
            .attr("class","whole_arc")
            .style("fill", function(d,i) { return d.data.color; });


        g.append("path")
            .attr("d", susp_arc)
            .attr("class","susp_arc")
            .style("fill", function(d,i) { return d3.rgb(d.data.color).brighter(1); });

        var labels = []
        g.each(function(d,i){
            var label = {}
            label.desc =  d.data.label + " " + ((d.endAngle - d.startAngle)*100/(2*Math.PI)).toFixed(2) + "%";
            var ang = (d.startAngle + d.endAngle)/2
            label.x = Math.sin(ang) * label_radius
            label.y = Math.cos(ang) * -label_radius
            d3.select(this)
            .append('text')
            .attr('class', 'arc-label')
            .attr('x', label.x)
            .attr('y', label.y)
            .attr('text-anchor', label.x >= 0 ? "start" : "end")
            .text(label.desc);
        });
        
        // var arcLabels = pieg.selectAll('.arc-label')
        //     .data(labels)
        //     .enter()
            
            
        arrangeLabels();
        pieg.selectAll('.arc-label').each(function(d, i){
            console.log(d3.select(this));
            //d3.select(d.arc).append("text");
        });
    }
    function arrangeLabels() {
      var move = 1;
      while(move > 0) {
        move = 0;
        pieg.selectAll(".arc-label")
           .each(function() {
             var that = this,
                 a = this.getBoundingClientRect();
             pieg.selectAll(".arc-label")
                .each(function() {
                  if(this != that) {
                    var b = this.getBoundingClientRect();
                    if((Math.abs(a.left - b.left) * 2 < (a.width + b.width)) &&
                       (Math.abs(a.top - b.top) * 2 < (a.height + b.height))) {
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
 
    update(csv_data);
 
}
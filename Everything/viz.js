var format = d3.format(",");

// Set tooltips
var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
              return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>" + "<strong>Gun Homicide : </strong><span class='details'>" + format(d.homicide) +"</span>";
            })

var margin = {top: 0, right: 0, bottom: 0, left: 0},
            width = 975 - margin.left - margin.right,
            height = 650 - margin.top - margin.bottom;

            var color = d3.scaleThreshold()
            .domain(d3.range(2, 10))
            .range(d3.schemeBlues[9]);

var path = d3.geoPath();

var svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append('g')
            .attr('class', 'map');

var projection = d3.geoMercator()
                   .scale(120)
                  .translate( [width / 2, height / 1.5]);

var path = d3.geoPath().projection(projection);

svg.call(tip);

d3.queue()
    .defer(d3.json, "world-countries.json")
    .defer(d3.tsv, "Guns.tsv")
    .await(ready);

function ready(error, data, homicide) {
  var homicideById = {};

  homicide.forEach(function(d) {
    // console.log(d.country);
  //  d.homicide = +d.homicide;
    homicideById[d.country] = +d.homicide;
   });
   console.log(homicideById)
  data.features.forEach(function(d) {
    // console.log(d.country);
     d.homicide = homicideById[d.properties.name];
   });

  svg.append("g")
      .attr("class", "countries")
    .selectAll("path")
      .data(data.features)
    .enter().append("path")
      .attr("d", path)
      .style("fill", function(d) { return color(homicideById[d.properties.name]); })
      .style('stroke', 'white')
      .style('stroke-width', 1.5)
      .style("opacity",0.8)
      // tooltips
        .style("stroke","white")
        .style('stroke-width', 0.3)
        .on('mouseover',function(d){
          tip.show(d);

          d3.select(this)
            .style("opacity", 1)
            .style("stroke","white")
            .style("stroke-width",3);
        })
        .on('mouseout', function(d){
          tip.hide(d);

          d3.select(this)
            .style("opacity", 0.8)
            .style("stroke","white")
            .style("stroke-width",0.3);
        });

  svg.append("path")
      .datum(topojson.mesh(data.features, function(a, b) { return a.properties.name !== b.properties.name; }))
       // .datum(topojson.mesh(data.features, function(a, b) { return a !== b; }))
      .attr("class", "names")
      .attr("d", path);
}

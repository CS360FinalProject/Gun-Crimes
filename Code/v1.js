
  var margin = {
    top: 30,
    right: 30,
    bottom: 60,
    left: 70,
  },
   width = 1000 - margin.left - margin.right;
   height = 500 - margin.top - margin.bottom;

  var x = d3.scaleLinear()
  .range([0,width]);

  var y = d3.scaleLinear()
  .range([height,0]);

  var div = d3.select("body").append("div")
  .attr("class","tooltip")
  .style("opacity", 0);

  var color = d3.scaleOrdinal(d3.schemeCategory10);

  var svg = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", width + margin.top + margin.bottom)
  .append("g")
  .attr("transform","translate (" + margin.left + "," + margin.top + ")");

  d3.csv("/Code/gdpcomparison.csv", function (error, data) {
    if(error) throw error;

    data.forEach(function (d) {
      d.homicides = +d.homicides;
      d.ownership = +d.ownership;
    });

    x.domain(d3.extent(data, function (d) {
      return d.ownership;
    })).nice();

    y.domain(d3.extent(data, function (d) {
      return d.homicides;
    })).nice();

    svg.selectAll(".dot")
    .data(data)
    .enter().append("circle")
    .attr("class","dot")
    .attr("r", function(d) {
      return Math.sqrt(parseInt(d.gdp)*0.00000000008);
    })
    .attr("cx", function (d) {
      return x(d.ownership);
    })
    .attr("cy", function (d) {
      return y(d.homicides);
    })
    .on("mouseover", function (d) {
      div.transition()
      .duration(200)
      .style("opacity",.9);
      div.html("Gun Homicides : " + d.homicides + "<br/> Country : " + d.country + "<br/> Guns Owned:"+ d.ownership + "<br/> GDP :" + d.GDP)
      .style("left", (d3.event.pageX) + "px")
      .style("top", (d3.event.pageY - 10) + "px");
    })
    .on("mouseout", function (d) {
      div.transition()
      .duration(500)
      .style("opacity", 0);
    })
    .style("fill", function (d) {
      return color(d.country);
    });

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
        svg.append("text")
        .attr("transform","translate(" + (width/2) + " ," +(height + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .text("Gun ownership");
    svg.append("g")
        .call(d3.axisLeft(y));
        svg.append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 0 - margin.left)
              .attr("x",0 - (height / 2))
              .attr("dy", "1em")
              .style("text-anchor", "middle")
              .text("Gun homicides");

    var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) {
        return "translate(0," + ((i * 25)+60) + ")"
      });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) {
        return d;
      });

  });

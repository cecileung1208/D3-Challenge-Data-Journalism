// @TODO: YOUR CODE HERE!


// Set up our chart area
//================================
var svgWidth = 900;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 60
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import data from csv
d3.csv("assets/data/data.csv").then(function(healthData){
  console.log(healthData)

  // Parse health and data numbers
  healthData.forEach(function(data){
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
  });

  // Create scale functions
  var xLinearScale = d3.scaleLinear()
  .domain([8, d3.max(healthData, d => d.poverty)])
  .range([0, width]);


  var yLinearScale = d3.scaleLinear()
  .domain([0, d3.max(healthData, d => d.healthcare)])
  .range([height, 0]);

  // Create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);


  // Append Axes to the chart

    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

  // Create Circles
      var circlesGroup = chartGroup.selectAll("circle")
      .data(healthData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", "12")
      .classed("stateCircle", true)

      

  //Add state abbr labels to the circles

  var circleLabels = chartGroup.selectAll(".stateText")
    .data(healthData)
    .enter()
    .append("text")
    .classed('stateText', true)
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    .text(d => d.abbr)

 

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left )
      .attr("x", 0- (height/1.5))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .style("font-weight", "bold")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .style("font-weight", "bold")
      .text("In Poverty (%)");
  }).catch(function(error) {
    console.log(error);
  });





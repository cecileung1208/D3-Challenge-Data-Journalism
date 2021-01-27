// @TODO: YOUR CODE HERE!


// Set up our chart area
//================================
var svgWidth = 900;
var svgHeight = 600;

var margin = {
  top: 20,
  right: 40,
  bottom: 100,
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


// Initial Params
var chosenXAxis = "poverty";

// function used for updating x-scale var upon click on axis label
function xScale(healthData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.8,
      d3.max(healthData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}
// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

function renderLabels(circleLabels, newXScale, chosenXAxis) {

  circleLabels.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]))
    .attr("text-anchor", "middle");

  return circleLabels
}


// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup, circleLabels) {


  if (chosenXAxis === "poverty") {
    var label = "Poverty (%):";
  }
  else if (chosenXAxis ==="age"){
    var label = "Age (Median):";
  }
  else {
    var label = "Household Income (Median):";
  }


  var toolTip = d3.tip()
    .attr("class", "tooltip d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${label} ${d[chosenXAxis]}`);
    });

  // Create Circles Tooltip in the Chart
  circlesGroup.call(toolTip);

  
  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data, this);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  // Create Text Labels for Tooltip 

  circleLabels.call(toolTip);

  // Create Event Listeners to Display and Hide the Text Tooltip
  circleLabels.on("mouseover", function(data) {
    toolTip.show(data, this);
  })
    // onmouseout Event
    .on("mouseout", function(data) {
      toolTip.hide(data);
    });

  return circlesGroup;
}


// Import data from csv
d3.csv("assets/data/data.csv").then(function(healthData){
 
  console.log(healthData)

  // Parse health and data numbers
  healthData.forEach(function(data){
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    data.age = +data.age;
    data.income = +data.income;
    data.smokes = +data.smokes;
    data.obesity = +data.obesity
  });

  // Create scale functions

  // x-Linear Scale function from csv import
  var xLinearScale = xScale(healthData, chosenXAxis)

  // Create y scale function
  var yLinearScale = d3.scaleLinear()
  .domain([0, d3.max(healthData, d => d.healthcare)])
  .range([height, 0]);

  // Create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);


  // Append Axes to the chart

   var xAxis =  chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

  // Create Circles
      var circlesGroup = chartGroup.selectAll("circle")
      .data(healthData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", "12")
      .attr("opacity", ".75")
      .classed("stateCircle", true)

      

  //Add state abbr labels to the circles

  var circleLabels = chartGroup.selectAll(".stateText")
    .data(healthData)
    .enter()
    .append("text")
    .attr("class", "stateText")
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d.healthcare))
    .text(d => d.abbr)

 

    // Create axes labels

    // Create group for two x-axis labels
  var labelsGroup = chartGroup.append("g")
  .attr("transform", `translate(${width / 2}, ${height + 20})`);

    //append y-axis
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left )
      .attr("x", 0- (height/1.5))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .style("font-weight", "bold")
      .text("Lacks Healthcare (%)");
      
    // append x-axis
    var povertyLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty") // value to grab for event listener
      .classed("active", true)
      .style("font-weight", "bold")
      .text("In Poverty(%)");
  
    var ageLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "age") // value to grab for event listener
      .classed("inactive", true)
      .style("font-weight", "bold")
      .text("Age (Median)");

    var incomeLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 60)
      .attr("value", "income") // value to grab for event listener
      .classed("inactive", true)
      .style("font-weight", "bold")
      .text("Income (Median)");

 // updateToolTip function above csv import
 var circlesGroup = updateToolTip(chosenXAxis, circlesGroup, circleLabels);

 // x axis labels event listener
 labelsGroup.selectAll("text")
   .on("click", function() {
     // get value of selection
     var value = d3.select(this).attr("value");
     if (value !== chosenXAxis) {

       // replaces chosenXAxis with value
       chosenXAxis = value;

       // console.log(chosenXAxis)

       // functions here found above csv import
       // updates x scale for new data
       xLinearScale = xScale(healthData, chosenXAxis);

       // updates x axis with transition
       xAxis = renderAxes(xLinearScale, xAxis);

       // updates circles with new x values
       circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates text new values 
       circleLabels = renderLabels(circleLabels, xLinearScale, chosenXAxis);

       // updates tooltips with new info
       circlesGroup = updateToolTip(chosenXAxis, circlesGroup, circleLabels);

       // changes classes to change bold text
       if (chosenXAxis === "poverty") {
         povertyLabel
           .classed("active", true)
           .classed("inactive", false);
         ageLabel
           .classed("active", false)
           .classed("inactive", true);
         incomeLabel
           .classed("active", false)
           .classed("inactive", true);
       }

       else if (chosenXAxis ==="age"){
        povertyLabel
        .classed("active", false)
        .classed("inactive", true);
        ageLabel
        .classed("active", true)
        .classed("inactive", false);
        incomeLabel
        .classed("active", false)
        .classed("inactive", true);
       }
       else {
        povertyLabel
        .classed("active", false)
        .classed("inactive", true);
        ageLabel
        .classed("active", false)
        .classed("inactive", true);
        incomeLabel
        .classed("active", true)
        .classed("inactive", false);
        
       }
     }
   });

  }).catch(function(error) {
    console.log(error);
  });





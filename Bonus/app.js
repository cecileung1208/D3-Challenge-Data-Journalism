// @TODO: YOUR CODE HERE!


// Set up our chart area
//================================
var svgWidth = 900;
var svgHeight = 600;

var margin = {
  top: 20,
  right: 40,
  bottom: 100,
  left: 100
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
var chosenYAxis = "healthcare";

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

// Function used for updating y-scale var upon click on axis label
function yScale(healthData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d[chosenYAxis]) * 0.8,
      d3.max(healthData, d => d[chosenYAxis]) * 1.2
    ])
    .range([height, 0]);

  return yLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating yAxis var upon click on axis label

function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}
// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

// function used for updating circles state abbr labels  with a transition to
// new circles
function renderLabels(circleLabels, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  circleLabels.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]))
    .attr("y", d => newYScale(d[chosenYAxis]))
    .attr("text-anchor", "middle");

  return circleLabels
}


// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, circleLabels) {

// Set conditions for choosing x-axis labels
  if (chosenXAxis === "poverty") {
    var xlabel = "Poverty (%):";
  }
  else if (chosenXAxis ==="age"){
    var xlabel = "Age (Median):";
  }
  else {
    var xlabel = "Household Income (Median):";
  }

// Set conditions for choosing y-axis labels
  if (chosenYAxis === "healthcare") {
    var ylabel = "Healthcare (%):";
  }
  else if (chosenYAxis ==="smokes"){
    var ylabel = "Smokes (%):";
  }
  else {
    var ylabel = "Obesity (%):";
}


  var toolTip = d3.tip()
    .attr("class", "tooltip d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${xlabel} ${d[chosenXAxis]}<br>${ylabel} ${d[chosenYAxis]}`);
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

  // Parse numbers for relevant datasets
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
  var yLinearScale = yScale(healthData, chosenYAxis)

  // Create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);


  // Append Axes to the chart

   var xAxis =  chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    var yAxis = chartGroup.append("g")
      .classed("y-axis", true)
      .call(leftAxis);

  // Create Circles
      var circlesGroup = chartGroup.selectAll("circle")
      .data(healthData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
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
    .attr("y", d => yLinearScale(d[chosenYAxis]))
    .text(d => d.abbr)

 

    // Create axes labels

    // Create group for two x-axis labels
    var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width /2}, ${height + 20})`);

    // append x-axis
    var povertyLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty(%)");

    var ageLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");

    var incomeLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Income (Median)");

    //append y-axis

    var ylabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(-35, ${height /2})`);

    var healthLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -20)
    .attr("x", 0)
    .attr("dy", "1em")
    .attr("value", "healthcare")// value to grab for event listener
    .attr("class", "axisText")
    .classed("active", true)
    .text("Lacks Healthcare (%)");
      
    var smokeLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -40)
    .attr("x", 0)
    .attr("dy", "1em")
    .attr("value", "smokes")// value to grab for event listener
    .classed("inactive", true)
    .text("Smokes (%)");
    
    var obeseLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -60)
    .attr("x", 0)
    .attr("dy", "1em")
    .attr("value", "obesity")// value to grab for event listener
    .classed("inactive", true)
    .text("Obese (%)");

 // updateToolTip function above csv import
 var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, circleLabels);

 // x axis labels event listener
 xlabelsGroup.selectAll("text")
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
       xAxis = renderXAxes(xLinearScale, xAxis);

       // updates circles with new x values
       circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        // updates text new values 
       circleLabels = renderLabels(circleLabels, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

       // updates tooltips with new info
       circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, circleLabels);

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


// y axis labels event listener
ylabelsGroup.selectAll("text")
.on("click", function() {
  // get value of selection
  var value = d3.select(this).attr("value");
  if (value !== chosenYAxis) {

    // replaces chosenXAxis with value
    chosenYAxis = value;

    // console.log(chosenXAxis)

    // functions here found above csv import
    // updates x scale for new data
    yLinearScale = yScale(healthData, chosenYAxis);

    // updates x axis with transition
    yAxis = renderYAxes(yLinearScale, yAxis);

    // updates circles with new x values
    circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

     // updates text new values 
    circleLabels = renderLabels(circleLabels, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

    // updates tooltips with new info
    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, circleLabels);

    // changes classes to change bold text
    if (chosenYAxis === "healthcare") {
      healthLabel
        .classed("active", true)
        .classed("inactive", false);
      smokeLabel
        .classed("active", false)
        .classed("inactive", true);
      obeseLabel
        .classed("active", false)
        .classed("inactive", true);
    }

    else if (chosenYAxis ==="smokes"){
     healthLabel
     .classed("active", false)
     .classed("inactive", true);
     smokeLabel
     .classed("active", true)
     .classed("inactive", false);
     obeseLabel
     .classed("active", false)
     .classed("inactive", true);
    }
    else {
     healthLabel
     .classed("active", false)
     .classed("inactive", true);
     smokeLabel
     .classed("active", false)
     .classed("inactive", true);
     obeseLabel
     .classed("active", true)
     .classed("inactive", false);
     
    }
  }
});
  }).catch(function(error) {
    console.log(error);
  });





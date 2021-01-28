// 1. CREATE CHART AREA
//---------------------------------------------------------------------------------------------

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

// 2. SVG WRAPPER
//---------------------------------------------------------------------------------------------
// Create an SVG wrapper
// Append an SVG group that will hold our chart
// Shift the latter by left and top margins.

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


// 3. SETTING FUNCTIONS FOR AXIS - SCALE, RENDERING
//----------------------------------------------------------------------------------------------

// Initial Params for default x and y-axis
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// A. SCALE AXIS FUNCTION

// Create x-axis scale function
function xScale(healthData, chosenXAxis) {
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.8,
      d3.max(healthData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);
  return xLinearScale;
}

// Create y-axis scale function
function yScale(healthData, chosenYAxis) {
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d[chosenYAxis]) * 0.8,
      d3.max(healthData, d => d[chosenYAxis]) * 1.2
    ])
    .range([height, 0]);
  return yLinearScale;
}

// B. RENDER AXIS FUNCTION - used for updating axis when clicking on a new axis label

//  Create x-axis rendering function
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

//  Create y-axis rendering function

function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

//4. SETTING FUNCTIONS FOR CIRCLES GROUP - used for updating circles values when choosing different axis

//  Setting circles rendering function
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

//5. SETTING FUNCTIONS FOR CIRCLES LABEL - used for updating state abbr on the new circle that have been 
//moved when choosing a different axis

//  Setting labels rendering function
function renderLabels(circleLabels, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  circleLabels.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]))
    .attr("y", d => newYScale(d[chosenYAxis]))
    .attr("class", "stateText");

  return circleLabels
}

//6. TOOLTIPS FUNCTION - used when hovering over the data points and displays information about the dataset


//Create Update Tooltip function where to update tooltip information based on the axis chosen

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
    var ylabel = "Healthcare (%): ";
  }
  else if (chosenYAxis ==="smokes"){
    var ylabel = "Smokes: (%)";
  }
  else {
    var ylabel = "Obesity: (%)";
}


// 7. SETTING TOOLTIPS ON CIRCLE GROUPS

// Create ToolTip Box to display information when datasets from x & y axis are selected
var toolTip = d3.tip()
.attr("class", "d3-tip")
.offset([80, -60])
.html(d => (`${d.state}<br>${xlabel} ${d[chosenXAxis]}<br>${ylabel} ${d[chosenYAxis]}`));

// Create Tooltip for Circle groups
circlesGroup.call(toolTip);

// Create Event Listeners to Display and Hide the Text Tooltip
circlesGroup.on("mouseover", function(data) {
  toolTip.show(data, this);
  })
    //onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

// 8. SETTING TOOLTIPS ON CIRCLE LABELS

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


// 9.  IMPORT CSV DATA TO CREATE GRAPHS
d3.csv("assets/data/data.csv").then(function(healthData){
  // Check if data is displayed correctly 
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

//10. INSERT xScale & yScale FUNCTIONS from CSV import
  var xLinearScale = xScale(healthData, chosenXAxis)
  var yLinearScale = yScale(healthData, chosenYAxis)

  // Position axes
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

  //11. CREATE CIRCLES GROUP FROM CSV IMPORTS
      var circlesGroup = chartGroup.selectAll("circle")
      .data(healthData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("r", "12")
      .attr("opacity", ".75")
      .classed("stateCircle", true)

      

  //12. CREATE CIRCLES LABELS (STATE ABBR) FROM CSV IMPORTS

  var circleLabels = chartGroup.selectAll(".stateText")
    .data(healthData)
    .enter()
    .append("text")
    .attr("class", "stateText")
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d[chosenYAxis]))
    .text(d => d.abbr)

 

//13. DISPLAY AXIS LABEL

    // Create group for three x-axis labels
    var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width /2}, ${height + 20})`);

    // Append x-axis - poverty, age & income
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

       
    // Create group for three y-axis labels
    var ylabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(-35, ${height /2})`);

    // Append y-axis - healthcare, smoke, and obseity
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

 //14.  UPDATETOOLTIP FUNCTION FOR CIRCLES FROM CSV IMPORT
 var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, circleLabels);

 //15. ADDING AXIS LABELS FOR EVENT LISTENER

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

    // replaces chosenyAxis with value
    chosenYAxis = value;

    // console.log(chosenYAxis)

    // functions here found above csv import
    // updates y scale for new data
    yLinearScale = yScale(healthData, chosenYAxis);

    // updates y axis with transition
    yAxis = renderYAxes(yLinearScale, yAxis);

    // updates circles with new y values
    circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

     // updates label values when circles move
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





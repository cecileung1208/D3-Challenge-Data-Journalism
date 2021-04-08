# D3-Challenge-Data-Journalism

![Image](https://github.com/cecileung1208/D3-Challenge-Data-Journalism/blob/main/Images/newspaper%20-%20Copy.jpg) - https://data.census.gov/cedsci/

## Background

The goal of this project is to use the US Census Bureau Health dataset provided to analyze the current trends shaping people's lives, as well as creating charts, graphs, and interactive elements to help readers understand your findings.  The current data set includes demographics factors such as age, income and poverty and health risks such as healthcare, obesity and smoking rates.

## Requirements

1.  Create a scatter plot between two of the data variables of `Healthcare vs. Poverty`.
2.  Create an interactive scatter plot with multiple for `Demographics (age, income, poverty) vs Health Risks (healthcare, obesity, smoking rates)`

## Datasets

[US Census Bureau Health dataset](https://github.com/cecileung1208/Journalism-Data-Analysis/tree/main/D3_data_journalism/assets/data)

## Method

## Scripts

## Results

Welcome to the newsroom! I have just accepted a data visualization position for a major metro paper. My taks is to  with analyze the current trends shaping people's lives, as well as creating charts, graphs, and interactive elements to help readers understand your findings.

The editor wants to run a series of feature stories about the health risks facing particular demographics. She's counting on me to sniff out the first story idea by sifting through information from the U.S. Census Bureau and the Behavioral Risk Factor Surveillance System.

The data set included with the assignment is based on 2014 ACS 1-year estimates from the [US Census Bureau](https://data.census.gov/cedsci/). The current data set includes data on rates of income, obesity, poverty, etc. by state. MOE stands for "margin of error."


### [Scatter Plot - Poverty vs Health Care](https://github.com/cecileung1208/D3-Challenge-Data-Journalism/tree/main/D3_data_journalism)


Created a scatter plot between two of the data variables of `Healthcare vs. Poverty`.

The scatter plot represents each state with circle elements. the code is in the [app.js](https://github.com/cecileung1208/D3-Challenge-Data-Journalism/blob/main/D3_data_journalism/app.js) extracted from the [data.csv](https://github.com/cecileung1208/D3-Challenge-Data-Journalism/tree/main/D3_data_journalism/assets/data) by using the `d3.csv` function. The scatter plot appear as per the below image with the followig requirements:

* Include state abbreviations in the circles.

* Create and situate your axes and labels to the left and bottom of the chart.

* Files and details are in the [D3 data journalism folder](https://github.com/cecileung1208/D3-Challenge-Data-Journalism/tree/main/D3_data_journalism)

![Images](https://github.com/cecileung1208/D3-Challenge-Data-Journalism/blob/main/Images/scatter.jpg)
- - -

### [Interactive Scatterplot - Multiple Axes](https://github.com/cecileung1208/D3-Challenge-Data-Journalism/tree/main/D3_data_journalism%20-%20MultiAxes)

Why make a static graphic when D3 lets you interact with your data?

![Image](https://github.com/cecileung1208/D3-Challenge-Data-Journalism/blob/main/Images/animated-scatter.gif)

#### 1. More Data, More Dynamics

This scatter plot includes more demographics and risk factors. 3 additional labels are placed on both the x-axis and y-axis. The user can decide whcih events to display by clicking on the various. Animate the transitions for your circles' locations as well as the range of your axes. 

#### 2. Incorporate d3-tip

While the ticks on the axes allow us to infer approximate values for each circle, it's impossible to determine the true value without adding another layer of data. Entering tooltips can help developers can implement these in their D3 graphics to reveal a specific element's data when the user hovers their cursor over the element. Add tooltips to the circles and display each tooltip with the data that the user has selected. 

The code is written in [app.js file]() and details are in the [D3 data journailism - Muliple Axes folder](https://github.com/cecileung1208/D3-Challenge-Data-Journalism/tree/main/D3_data_journalism%20-%20MultiAxes)

![Image](https://github.com/cecileung1208/D3-Challenge-Data-Journalism/blob/main/Images/tooltip.gif)


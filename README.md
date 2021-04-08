# D3-Challenge-Data-Journalism

![Image](https://github.com/cecileung1208/D3-Challenge-Data-Journalism/blob/main/Images/newspaper%20-%20Copy.jpg)

## Background

The goal of this project is to use the US Census Bureau Health dataset provided to analyze the current trends shaping people's lives, as well as creating charts, graphs, and interactive elements to help readers understand your findings.  The current data set includes demographics factors such as age, income and poverty and health risks such as healthcare, obesity and smoking rates.

## Requirements

Create a scatter plot graph with state abbreviation in the circles for the following:

1.  Health Care vs. Poverty
2.  Interactive Multiaxis Graph for Health Risk Factors (Health Care, Smoking, Obesity) vs. Demographic Factors (Poverty, Age, Household Income)

## Datasets

[US Census Bureau Health dataset](https://github.com/cecileung1208/Journalism-Data-Analysis/tree/main/D3_data_journalism/assets/data) - https://data.census.gov/cedsci/

## Method

* Import the data from the CSV file.
* Set the locations and ranges for the x and y axes.
* Plot the x and y axes.
* Set the coordinates and dimensions for the circles representing the data for each state.
* Plot the circles representing the data for each state.
* Add a text label of each state's abbreviation within the appropriate circle for identification purposes.
* Create html files and link the JavaScript files.

## Scripts

1. [Health Care vs. Poverty](https://github.com/cecileung1208/Journalism-Data-Analysis/blob/main/D3_data_journalism/assets/js/app.js)
2. [Multiaxis Plot](https://github.com/cecileung1208/Journalism-Data-Analysis/blob/main/D3_data_journalism%20-%20MultiAxes/assets/js/app.js)


## Results


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


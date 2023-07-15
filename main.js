// Scene 1: Introduction
let introDiv = d3.select("#intro");

// By adding transitions, you can improve the user experience with smoother visuals
// Also, setting the duration of transitions will make sure all transitions are uniform across all scenes
const transitionDuration = 500;

// Use the transition on entering elements
introDiv.transition()
    .duration(transitionDuration)
    .style("opacity", 1);

introDiv.append("h1")
    .text("Airbnb Listing Analysis and Trends");

introDiv.append("p")
    .text("Welcome to our Airbnb data analysis. In this interactive exploration, you'll learn about Airbnb listings in the United States and uncover interesting patterns and insights. Use the navigation buttons placed on top of the page to move between different scenes.");

// Add an annotation
introDiv.append("p")
    .style("font-weight", "bold")
    .text("Key Point: This project uses Airbnb data to provide insights into the Airbnb market in the United States.");

// Add a "Next" button
let nextButton = introDiv.append("button")
    .text("Next")
    .on("click", function() {
        // Transition out before hiding
        introDiv.transition()
            .duration(transitionDuration)
            .style("opacity", 0)
            .on("end", function() {
                // Hide the introduction scene
                introDiv.style("display", "none");
                // Show the next scene (you'll need to define the showScene function in your code)
                showScene('scene2');
            });
    });

// Adding keyboard accessibility for better user experience
d3.select(window).on('keydown', function() {
    // Listen for the "right arrow" key press (key code 39)
    if (d3.event.keyCode === 39) {
        nextButton.dispatch('click');
    }
});

// scene2
// Hide all scenes
d3.selectAll(".scene").style("display", "none");

// Show this scene
d3.select("#scene2").style("display", "block");

d3.csv('https://raw.githubusercontent.com/tamimuiuc/airbnb-narrative-vis-dataset/main/data/USA-Airbnb-dataset.csv')
    .then(function(data) {
        // Group the data by state and get the count of listings for each state
        var dataByStateArray = Array.from(d3.group(data, d => d.state), ([key, value]) => ({key, value: value.length}));
        var dataByState = Object.fromEntries(dataByStateArray.map(item => [item.key, item.value]));

        // Load the map of the United States
        d3.json('https://raw.githubusercontent.com/tamimuiuc/airbnb-narrative-vis-dataset/main/data/state.json').then(function(us) {
            // Define color scale for map coloring
            var color = d3.scaleLinear()
                .domain([0, d3.max(dataByStateArray, d => d.value)])
                .range(["#e0f7fa", "#0077c2"]);

            // Define a tooltip
            var tooltip = d3.select("#scene2")
                .append("div")
                .attr("id", "tooltip")
                .style("opacity", 0)
                .style("position", "absolute")
                .style("background-color", "white")
                .style("border", "1px solid #ccc")
                .style("padding", "10px")
                .style("font-size", "12px")
                .style("pointer-events", "none");

            // Draw the map
            var svg = d3.select("#scene2-graph") // Changed the target div from scene2 to scene2-graph
                .append("svg")
                .attr("width", 960)
                .attr("height", 600);

            // Add title to the map
            svg.append("text")
                .attr("x", (960 / 2))
                .attr("y", 30)
                .attr("text-anchor", "middle")
                .style('font-size', '22px')
                .style('font-weight', 'bold')
                .style("fill", "#444")
                .text("Geographic distribution of Listings");

            var projection = d3.geoAlbersUsa()
                .scale(1280)
                .translate([480, 300]);

            var path = d3.geoPath().projection(projection);

            svg.append("g")
                .selectAll("path")
                .data(us.features)
                .enter()
                .append("path")
                .attr("d", path)
                .style("fill", "#ccc")  // Initial color
                .style("stroke", "white")
                .on("mouseover", function(event, d) {  // Add interactivity
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", 0.9);
                    tooltip.html(d.properties.NAME + "<br>" + "Listings: " + (dataByState[d.properties.NAME] || "N/A"))
                        .style("left", (event.pageX) + "px")
                        .style("top", (event.pageY - 28) + "px");
                })
                .on("mouseout", function() {
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                })
                .transition()  // Transition effect
                .duration(1000)
                .style("fill", function(d) {
                    // Get the data value for each state
                    var value = dataByState[d.properties.NAME];
                    if (value) {
                        // If value exists…
                        return color(value);
                    } else {
                        // If value is undefined…
                        return "#ccc";
                    }
                });

            // Add a color legend
            var legend = svg.append("g")
                .attr("transform", "translate(20,20)");

            var legendScale = d3.scaleLinear()
                .domain(color.domain())
                .range([0, 200]);

            legend.append("rect")
                .attr("width", 200)
                .attr("height", 20)
                .style("fill", "url(#gradient)");

            var gradient = legend.append("defs")
                .append("linearGradient")
                .attr("id", "gradient")
                .attr("x1", "0%")
                .attr("y1", "0%")
                .attr("x2", "100%")
                .attr("y2", "0%")
                .attr("spreadMethod", "pad");

            gradient.append("stop")
                .attr("offset", "0%")
                .attr("stop-color", color.range()[0])
                .attr("stop-opacity", 1);

            gradient.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", color.range()[1])
                .attr("stop-opacity", 1);

            legend.call(d3.axisBottom(legendScale));
        });
    })
    .catch(function(error) {
        console.log("Error loading data: " + error);
    });

    // sence3 
//Hide all scenes
d3.selectAll(".scene").style("display", "none");

// Show this scene
d3.select("#scene3").style("display", "block");

var margin = { top: 70, right: 30, bottom: 60, left: 100 }, // Adjusted margin values
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

let svg = d3.select('#scene3-graph')
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

d3.csv('https://raw.githubusercontent.com/tamimuiuc/airbnb-narrative-vis-dataset/main/data/USA-Airbnb-dataset.csv')
    .then(function (data) {
        // Aggregate data by state and calculate average price
        var data = d3.rollup(data, v => d3.mean(v, d => d.price), d => d.state);
        data = Array.from(data, ([key, value]) => ({ key, value }));

        // Sort data in descending order by average price
        data.sort(function (a, b) { return d3.descending(a.value, b.value); });

        // Select top 10 states
        data = data.slice(0, 13);

        // Define a tooltip
        var tooltip = d3.select("#scene3")
            .append("div")
            .attr("id", "tooltip")
            .style("opacity", 0);

        // X axis
        var x = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.value)])
            .range([0, width]);
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x))

        svg.append("text")
            .attr("x", width / 2)
            .attr('y', height + margin.bottom / 1.5) // Adjusted Y position
            .style("text-anchor", "middle")
            .style('font-size', '16px')
            .text("Average Price");

        // Y axis
        var y = d3.scaleBand()
            .range([0, height])
            .domain(data.map(d => d.key))
            .padding(.1);
        svg.append("g")
            .call(d3.axisLeft(y));

        svg.append("text")
            .attr("x", -(height / 2))
            .attr("y", -margin.left / 1.5) // Adjusted Y position
            .attr("text-anchor", "middle")
            .style('font-size', '16px')
            .attr("transform", "rotate(-90)")
            .text("State");

        // Color scale
        var color = d3.scaleSequential()
            .interpolator(d3.interpolateBlues)
            .domain([0, d3.max(data, d => d.value)]);

        // Bars
        svg.selectAll("myRect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", x(0))
            .attr("y", d => y(d.key))
            .attr("width", 0)  // Initial width
            .attr("height", y.bandwidth())
            .attr("fill", d => color(d.value))
            .on("mouseover", function(event, d) {  // Add interactivity
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(d.key + "<br/>" + "Average price: " + d.value.toFixed(2))
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            })
            .transition()  // Transition effect
            .duration(1000)
            .attr("width", d => x(d.value));

        svg.append("text")
            .attr("x", (width / 2))             
            .attr("y", 0 + (margin.top / 40))  // Adjusted title Y position
            .attr("text-anchor", "middle")  
            .style("font-size", "20px")
            .style('font-weight', 'bold') 
            .style("fill", "#444")
            .text("State-wise Average Price of Listings");

    })
    .catch(function(error) {
        console.log("Error loading data: " + error);
    });

// scene4
// Hide all scenes
d3.selectAll('.scene').style('display', 'none');
// Show this scene
d3.select('#scene4').style('display', 'block');

d3.csv('https://raw.githubusercontent.com/tamimuiuc/airbnb-narrative-vis-dataset/main/data/USA-Airbnb-dataset.csv')
  .then(data => {
    // Parsing string values to numeric
    data.forEach(d => {
      d.price = +d.price;
      d.number_of_reviews = +d.number_of_reviews;
    });

    // Define dimensions of the SVG and chart
    const margin = { top: 60, right: 20, bottom: 50, left: 70 };  // Adjusted margin
    const svgWidth = 800,
      svgHeight = 600;
    const chartWidth = svgWidth - margin.left - margin.right;
    const chartHeight = svgHeight - margin.top - margin.bottom;

    // Create SVG
    let svg = d3
      .select('#scene4-graph')
      .append('svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight);

    // Create group for the chart
    let chart = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Create scales
    let xScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.price)])
      .range([0, chartWidth]);

    let yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.number_of_reviews)])
      .range([chartHeight, 0]);

    // Create color scale
    let colorScale = d3.scaleOrdinal()
      .domain(data.map(d => d.room_type))
      .range(d3.schemeCategory10);

    // Create axes
    let xAxis = d3.axisBottom(xScale);
    let yAxis = d3.axisLeft(yScale);

    // Append axes to the chart
    chart
      .append('g')
      .attr('transform', `translate(0, ${chartHeight})`)
      .call(xAxis);

    chart.append('g').call(yAxis);

    // Create points for the scatter plot
    chart
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.price))
      .attr('cy', d => yScale(d.number_of_reviews))
      .attr('r', 3)
      .style('fill', d => colorScale(d.room_type))  // Use color scale
      .on('mouseover', function (event, d) {
        // Show tooltip on mouseover
        d3.select(this).attr('r', 6).style('fill', 'red');
        const tooltip = d3.select('#tooltip');
        tooltip
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 10}px`)
          .style('opacity', 1)
          .html(`<strong>Price:</strong> $${d.price}<br><strong>Reviews:</strong> ${d.number_of_reviews}<br><strong>Room Type:</strong> ${d.room_type}`);
      })
      .on('mouseout', function (d) {
        // Hide tooltip on mouseout
        d3.select(this).attr('r', 3).style('fill', d => colorScale(d.room_type));  // Use color scale
        d3.select('#tooltip').style('opacity', 0);
      });

    // Add color legend
    const legend = svg.append('g')
      .attr('transform', `translate(${svgWidth - margin.right}, ${margin.top})`);

    colorScale.domain().forEach((room_type, i) => {
      const legendRow = legend.append('g').attr('transform', `translate(0, ${i * 20})`);

      legendRow.append('rect')
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', colorScale(room_type));

      legendRow.append('text')
        .attr('x', -10)
        .attr('y', 10)
        .attr('text-anchor', 'end')
        .style('text-transform', 'capitalize')
        .text(room_type);
    });

    // Add title
    svg
      .append('text')
      .attr('x', svgWidth / 2)
      .attr('y', margin.top / 2)  // Adjusted position
      .attr('text-anchor', 'middle')
      .style('font-size', '20px')
      .style('font-weight', 'bold')
      .style("fill", "#444")
      .text('Relationship between Price and Number of Reviews');

    // Add X axis label
    svg
      .append('text')
      .attr('x', svgWidth / 2)
      .attr('y', svgHeight - margin.bottom / 5)  // Adjusted position
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .text('Price');

    // Add Y axis label
    svg
      .append('text')
      .attr('x', -(svgHeight / 2))
      .attr('y', margin.left / 10)  // Adjusted position
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('font-size', '16px')
      .attr('transform', 'rotate(-90)')
      .text('Number of Reviews');
  })
  .catch(e => {
    console.log('Failed to load data: ' + e);
  });

// scene5
// Hide all scenes
d3.selectAll('.scene').style('display', 'none');

// Show this scene
d3.select('#scene5').style('display', 'block');

d3.csv('https://raw.githubusercontent.com/tamimuiuc/airbnb-narrative-vis-dataset/main/data/USA-Airbnb-dataset.csv')
    .then(data => {
        // Group data by room type and count the number of listings for each type
        const roomTypeCounts = Array.from(d3.group(data, d => d.room_type), ([key, value]) => ({
            key,
            value: value.length,
        }));

        // Define room type order
        const roomTypeOrder = ['Entire home/apt', 'Private room', 'Shared room', 'Hotel room'];

        // Sort the room types according to the specified order
        roomTypeCounts.sort((a, b) => roomTypeOrder.indexOf(a.key) - roomTypeOrder.indexOf(b.key));

        // Define dimensions of the SVG and chart
        const margin = { top: 60, right: 20, bottom: 50, left: 70 };
        const svgWidth = 800;
        const svgHeight = 600;
        const chartWidth = svgWidth - margin.left - margin.right;
        const chartHeight = svgHeight - margin.top - margin.bottom;

        // Create SVG
        let svg = d3.select('#scene5-graph')
            .append('svg')
            .attr('width', svgWidth)
            .attr('height', svgHeight);

        // Create group for the chart
        let chart = svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        // Create scales
        let xScale = d3.scaleBand()
            .domain(roomTypeCounts.map(d => d.key))
            .range([0, chartWidth])
            .padding(0.5);

        let yScale = d3.scaleLinear()
            .domain([0, d3.max(roomTypeCounts, d => d.value)])
            .range([chartHeight, 0]);

        // Create color scale
        let colorScale = d3.scaleOrdinal(d3.schemeCategory10)
            .domain(roomTypeOrder);

        // Create the legend
        let legend = svg.selectAll(".legend")
            .data(colorScale.domain())
            .enter()
            .append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) {
                return "translate(0," + i * 20 + ")";
            });

        // Draw legend colored rectangles
        legend.append("rect")
            .attr("x", chartWidth + margin.left)
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", colorScale);

        // Draw legend text
        legend.append("text")
            .attr("x", chartWidth + margin.left - 10)
            .attr("y", 5)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function (d) {
                return d;
            });

        // Create axes
        let xAxis = d3.axisBottom(xScale);
        let yAxis = d3.axisLeft(yScale);

        // Append axes to the chart
        chart.append('g')
            .attr('transform', `translate(0, ${chartHeight})`)
            .call(xAxis);

        chart.append('g')
            .call(yAxis);

        // Create bars for the chart
        let bars = chart.selectAll('rect')
            .data(roomTypeCounts)
            .enter()
            .append('rect')
            .attr('x', d => xScale(d.key))
            .attr('y', d => yScale(d.value))
            .attr('width', xScale.bandwidth())
            .attr('height', d => chartHeight - yScale(d.value))
            .style('fill', d => colorScale(d.key));

        // Add title
        svg.append('text')
            .attr('x', svgWidth / 2)
            .attr('y', margin.top / 2)
            .attr('text-anchor', 'middle')
            .style('font-size', '20px')
            .style('font-weight', 'bold')
            .style("fill", "#444")
            .text('Breakdown of Listings by Room Type');

        // Add X axis label
        svg.append('text')
            .attr('x', svgWidth / 2)
            .attr('y', svgHeight - margin.bottom / 5)
            .attr('text-anchor', 'middle')
            .style('font-size', '16px')
            .text('Room Type');

        // Add Y axis label
        svg.append('text')
            .attr('x', -(svgHeight / 2))
            .attr('y', margin.left / 10)
            .attr('dy', '1em')
            .style('text-anchor', 'middle')
            .style('font-size', '16px')
            .attr('transform', 'rotate(-90)')
            .text('Number of Listings');
    })
    .catch(e => {
        console.log('Failed to load data: ' + e);
    });

// scene6
// Hide all scenes
d3.selectAll('.scene').style('display', 'none');

// Show this scene
d3.select('#scene6').style('display', 'block');

d3.csv('https://raw.githubusercontent.com/tamimuiuc/airbnb-narrative-vis-dataset/main/data/USA-Airbnb-dataset.csv')
    .then(data => {
        // Parsing string values to numeric and dates
        data = data.filter(d => {
            d.price = +d.price;
            d.number_of_reviews = +d.number_of_reviews;
            d.last_review = new Date(d.last_review);
            // Validate data
            return (
                !isNaN(d.price) &&
                !isNaN(d.number_of_reviews) &&
                d.last_review instanceof Date &&
                !isNaN(d.last_review.getTime())
            );
        });

        // Group data by year and calculate total listings and hosts for each year
        const performanceByYear = d3.rollups(
            data,
            v => ({
                listings: v.length,
                hosts: d3.rollups(v, n => n.length, d => d.host_id).length,
            }),
            d => d.last_review.getFullYear()
        );

        // Sort the data by year
        performanceByYear.sort((a, b) => d3.ascending(a[0], b[0]));

        // Extract the listings and hosts values
        const years = performanceByYear.map(d => d[0]);
        const listingsData = performanceByYear.map(d => d[1].listings);
        const hostsData = performanceByYear.map(d => d[1].hosts);

        // Define dimensions of the SVG and chart
        const margin = { top: 50, right: 20, bottom: 60, left: 70 };
        const svgWidth = 800,
            svgHeight = 600;
        const chartWidth = svgWidth - margin.left - margin.right;
        const chartHeight = svgHeight - margin.top - margin.bottom;

        // Create SVG
        let svg = d3.select('#scene6-graph')
            .append('svg')
            .attr('width', svgWidth)
            .attr('height', svgHeight);

        // Create group for the chart
        let chart = svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        // Create scales
        let xScale = d3.scaleBand()
            .domain(years)
            .range([0, chartWidth])
            .padding(0.2);

        let yScale = d3.scaleLinear()
            .domain([0, d3.max([d3.max(listingsData), d3.max(hostsData)])])
            .range([chartHeight, 0]);

        // Create x-axis
        let xAxis = d3.axisBottom(xScale)
            .tickValues(years);

        // Create y-axis
        let yAxis = d3.axisLeft(yScale);

        // Append axes to the chart
        chart.append('g')
            .attr('transform', `translate(0, ${chartHeight})`)
            .call(xAxis)
            .append('text')
                .attr('x', chartWidth / 2)
                .attr('y', 40)
                .attr('fill', 'black')
                .style("text-anchor", "middle")
                .style('font-size', '16px')
                .text('Year');

        chart.append('g')
            .call(yAxis)
            .append('text')
                .attr('transform', 'rotate(-90)')
                .attr('y', -50)
                .attr('x', -(chartHeight / 2))
                .attr('fill', 'black')
                .style("text-anchor", "middle")
                .style('font-size', '16px')
                .text('Count');
        // Create bars for the chart with transition
        let barWidth = xScale.bandwidth() / 2;

        // Create a Tooltip
        const tooltip = d3.select('#scene6')
            .append('div')
            .style('position', 'absolute')
            .style('visibility', 'hidden')
            .style('background', 'white')
            .style('border', '1px solid #333')
            .style('border-radius', '5px')
            .style('padding', '10px')
            .text('Tooltip');

        // Listings bars
        chart.selectAll('.bar-listings')
            .data(years)
            .enter()
            .append('rect')
            .attr('class', 'bar-listings')
            .attr('x', (d) => xScale(d) + barWidth)
            .attr('y', (d) => yScale(listingsData[years.indexOf(d)]))
            .attr('width', barWidth)
            .attr('height', (d) => chartHeight - yScale(listingsData[years.indexOf(d)]))
            .style('fill', 'orange')
            .on('mouseover', function (event, d) {
                let i = years.indexOf(d);
                tooltip.style('visibility', 'visible')
                    .text(`Year: ${d} - Listings: ${listingsData[i]}`);
            })
            .on('mousemove', function (event) {
                tooltip.style('top', (event.pageY - 10) + 'px')
                    .style('left', (event.pageX + 10) + 'px');
            })
            .on('mouseout', function () {
                tooltip.style('visibility', 'hidden');
            });

        // Hosts bars
        chart.selectAll('.bar-hosts')
            .data(years)
            .enter()
            .append('rect')
            .attr('class', 'bar-hosts')
            .attr('x', (d) => xScale(d))
            .attr('y', (d) => yScale(hostsData[years.indexOf(d)]))
            .attr('width', barWidth)
            .attr('height', (d) => chartHeight - yScale(hostsData[years.indexOf(d)]))
            .style('fill', 'green')
            .on('mouseover', function (event, d) {
                let i = years.indexOf(d);
                tooltip.style('visibility', 'visible')
                    .text(`Year: ${d} - Hosts: ${hostsData[i]}`);
            })
            .on('mousemove', function (event) {
                tooltip.style('top', (event.pageY - 10) + 'px')
                    .style('left', (event.pageX + 10) + 'px');
            })
            .on('mouseout', function () {
                tooltip.style('visibility', 'hidden');
            });

        // Add legend
        const legend = chart.append('g')
            .attr('transform', `translate(${chartWidth - 120}, 0)`);

        // Listings legend
        legend.append('rect')
            .attr('x', 0)
            .attr('y', -8)
            .attr('width', 10)
            .attr('height', 10)
            .style('fill', 'orange');

        legend.append('text')
            .attr('x', 15)
            .attr('y', 0)
            .attr('alignment-baseline', 'middle')
            .text('Listings');

        // Hosts legend
        legend.append('rect')
            .attr('x', 0)
            .attr('y', 13)
            .attr('width', 10)
            .attr('height', 10)
            .style('fill', 'green');

        legend.append('text')
            .attr('x', 15)
            .attr('y', 20)
            .attr('alignment-baseline', 'middle')
            .text('Hosts');

        // Add title
        svg.append('text')
            .attr('x', svgWidth / 2)
            .attr('y', margin.top)
            .attr('text-anchor', 'middle')
            .attr('font-size', '20px')
            .attr('font-weight', 'bold')
            .style("fill", "#444")
            .text('Yearly Airbnb Listings and Hosts')
    }); 
    

// scene7
// Load data
d3.csv('https://raw.githubusercontent.com/tamimuiuc/airbnb-narrative-vis-dataset/main/data/USA-Airbnb-dataset.csv')
  .then((data) => {
    // Parse price as a number
    data.forEach(d => d.price = +d.price);

    // Get list of states
    let states = [...new Set(data.map(d => d.state))];

    // Start at the first state
    let currentStateIndex = 0;

    // Set the dimensions and margins of the graph
    var margin = {top: 50, right: 30, bottom: 60, left: 60},
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

    // Create a container for the title and the buttons
    var container = d3.select("#scene7-graph")
        .append("div")
        .style("display", "flex")
        .style("justify-content", "space-between")
        .style("align-items", "center")
        .style("margin-bottom", "20px"); // Add some margin to separate it from the chart

    // Create button container
    var buttonContainer = container.append("div");

    // Create buttons inside the button container
    buttonContainer.append('button')
        .attr("id", "previous")
        .text('Previous State')

    buttonContainer.append('button')
        .attr("id", "next")
        .text('Next State')

    // Create the title inside the container
    container.append('h2')
        .attr("id", "title")
        .style("text-align", "center")
        .style("flex-grow", "1")
        .style("margin-right", "200px"); // Push the title to the left

    // Append the svg object to the body of the page
    var svg = d3.select("#scene7-graph")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    // Create a tooltip
    var tooltip = d3.select("#scene7-graph")
        .append("div")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px");

    // X axis: scale and draw
    var x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.price)])
        .range([0, width]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickFormat(d => d > 0 ? d : ""));

    // X axis label
    svg.append("text")
      .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom / 1.5) + ")")
      .style("text-anchor", "middle")
      .text("Price");

    // Y axis: initialization
    var y = d3.scaleLinear()
      .range([height, 0]);
    var yAxis = svg.append("g")

    // Y axis label
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left / 1.1)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Count");

    function updateScene() {
      // Filter data for the current state
      let state = states[currentStateIndex];

      // Update buttons
      d3.select("#previous")
        .on('click', () => {
          currentStateIndex = Math.max(0, currentStateIndex - 1);
          updateScene();
        });

      d3.select("#next")
        .on('click', () => {
          currentStateIndex = Math.min(states.length - 1, currentStateIndex + 1);
          updateScene();
        });

      // Update the state name as a title
      d3.select("#title").text(`Price Distribution in ${state}`);

      // Update the histogram
      var histogram = d3.histogram()
          .value(d => d.price)
          .domain(x.domain())
          .thresholds(x.ticks(70));

      // And apply this function to data to get the bins
      var bins = histogram(data.filter(d => d.state === state));

      // Y axis: update now that we know the domain
      y.domain([0, d3.max(bins, d => d.length)]);
      yAxis
          .transition()
          .duration(1000)
          .call(d3.axisLeft(y));

      // Join the rect with the bins data
      var u = svg.selectAll("rect")
          .data(bins);

      // Manage the existing bars and eventually the new ones
      u
          .enter()
          .append("rect") // Add a new rect for each new elements
          .merge(u) // get the already existing elements as well
          .on("mouseover", function(event, d) { // Add interactivity
              tooltip.style("visibility", "visible");
              tooltip.html("Price range: $" + d.x0.toFixed(2) + " - $" + d.x1.toFixed(2) + "<br>" + "Count: " + d.length);
              tooltip.style("left", (event.pageX) + "px");
              tooltip.style("top", (event.pageY - 30) + "px");
          })
          .on("mouseout", function() {
              tooltip.style("visibility", "hidden");
          })
          .transition() // and apply changes to all of them
          .duration(1000)
            .attr("x", 1)
            .attr("transform", d => "translate(" + x(d.x0) + "," + y(d.length) + ")")
            .attr("width", d => x(d.x1) - x(d.x0))
            .attr("height", d => height - y(d.length))
            .style("fill", "#69b3a2");

      // If less bar in the new histogram, I delete the ones not in use anymore
      u
          .exit()
          .remove();
    }

    // Initialize the scene
    updateScene();
  })
  .catch((error) => console.error('Error:', error));

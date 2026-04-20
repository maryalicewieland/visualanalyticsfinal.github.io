// resourced used:
//      tabs: 
//      1) https://www.w3schools.com/howto/howto_js_tabs.asp
//      2) https://education.molssi.org/python-data-science-chemistry/data_processing_cleaning/pandas-datacleaning.html
//      3) https://d3-graph-gallery.com/graph/barplot_stacked_basicWide.html 
//      line graph: 
//      1) https://d3-graph-gallery.com/graph/line_basic.html
//      2) https://d3js.org/d3-shape/line
//      3) https://observablehq.com/@d3/bar-line-chart
//      tooltip:
//      1) https://d3-graph-gallery.com/graph/interactivity_tooltip.html

// make tabs
const tabs = document.querySelectorAll(".tab");
const contents = document.querySelectorAll(".content");

// tool tip 
const tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("background", "white")
    .style("padding", "6px 10px")
    .style("border", "1px solid #ccc")
    .style("border-radius", "4px")
    .style("opacity", 0);

// handle logic in selecting tabs by adding event listener so when tab is clicked on the css class active is added or deleted, 
// showing and hiding content as needed. This should scale up well if we decide to add another tab.
tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        const target = tab.dataset.tab;

        //Remove all active classes
        tabs.forEach(t => t.classList.remove("active"));
        contents.forEach(c => c.classList.remove("active"));

        //Activate content accordingly
        tab.classList.add("active");
        document.getElementById(target).classList.add("active");

        //Function to change charts
        drawTotalChart();
        drawTimeChart();
        updateChart(target)
    })
})

// draw total emissions bar graph
function drawTotalChart() {
    const svgID = "#total-chart"
    clearChart(svgID);

    const svg = d3.select(svgID);
    // pull height and width from svg in html
    const width = 600;
    const height = 400;
    // margin helps labels sit right
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };

    svg.attr("width", width).attr("height", height);

    d3.csv("data/total.csv").then(data => {
        data.forEach(d => {
        d["Scope 1"] = +d["Scope 1"];
        d["Scope 2"] = +d["Scope 2"];
        d["Scope 3"] = +d["Scope 3"];
    });

    const keys = ["Scope 1", "Scope 2", "Scope 3"];
    const stack = d3.stack().keys(keys);
    const stackedData = stack(data);

    const x = d3.scaleBand()
        .domain(data.map(d => d["Fiscal Year"]))
        .range([margin.left, width - margin.right])
        .padding(0.2);
    
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d =>
        d["Scope 1"] + d["Scope 2"] + d["Scope 3"]
        )])
        .nice()
        .range([height - margin.bottom, margin.top]);

    const color = d3.scaleOrdinal()
        .domain(keys)
        .range(["#9e9d9d", "#6d6d6d", "#f55353"]);
    
    svg.selectAll("g.layer")
        .data(stackedData)
        .join("g")
        .attr("fill", d => color(d.key))
        .selectAll("rect")
        .data(d => d)
        .join("rect")
        .attr("x", d => x(d.data["Fiscal Year"]))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width", x.bandwidth())
        .attr("class", "segment") 
        .on("mouseover", hoverOnBar)
        .on("mouseout", hoverOutBar);
        
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));
    
    });
}

// draw total emissions bar graph
function drawTotalChart() {
    const svgID = "#total-chart"
    clearChart(svgID);

    const svg = d3.select(svgID);
    // pull height and width from svg in html
    const width = 600;
    const height = 400;
    // margin helps labels sit right
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };

    svg.attr("width", width).attr("height", height);

    d3.csv("data/total.csv").then(data => {
        data.forEach(d => {
        d["Scope 1"] = +d["Scope 1"];
        d["Scope 2"] = +d["Scope 2"];
        d["Scope 3"] = +d["Scope 3"];
    });

    const keys = ["Scope 1", "Scope 2", "Scope 3"];
    const stack = d3.stack().keys(keys);
    const stackedData = stack(data);

    const x = d3.scaleBand()
        .domain(data.map(d => d["Fiscal Year"]))
        .range([margin.left, width - margin.right])
        .padding(0.2);
    
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d =>
        d["Scope 1"] + d["Scope 2"] + d["Scope 3"]
        )])
        .nice()
        .range([height - margin.bottom, margin.top]);

    const color = d3.scaleOrdinal()
        .domain(keys)
        .range(["#9e9d9d", "#6d6d6d", "#f55353"]);
    
    svg.selectAll("g.layer")
        .data(stackedData)
        .join("g")
        .attr("fill", d => color(d.key))
        .selectAll("rect")
        .data(d => d)
        .join("rect")
        .attr("x", d => x(d.data["Fiscal Year"]))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width", x.bandwidth())
        .attr("class", "segment") 
        .on("mouseover", hoverOnBar)
        .on("mouseout", hoverOutBar);

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));
    
    });
}

function drawTimeChart() {
    const svgID = "#time-chart"
    clearChart(svgID);
    const svg = d3.select(svgID);
    const width = 600; 
    const height = 400; 
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    svg.attr("width", width).attr("height", height);

    d3.csv("data/total.csv").then(function(data) {
        data.forEach(d => {
        d["Scope 1"] = +d["Scope 1"];
        d["Scope 2"] = +d["Scope 2"];
        d["Scope 3"] = +d["Scope 3"];

        d.total = d["Scope 1"] + d["Scope 2"] + d["Scope 3"]});

    const x = d3.scalePoint()
        .domain(data.map(d => d["Fiscal Year"]))
        .range([margin.left, width - margin.right])

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.total)])
        .nice()
        .range([height - margin.bottom, margin.top]);
    
    //hidden bar graph
    barWidth = 25
    svg.selectAll(".hiddenBars")
     .data(data)
     .enter()
     .append("rect")
     .attr("x", d => x(d["Fiscal Year"]) - barWidth / 2)
     .attr("y", d => y(d.total))
     .attr("height", d => y(0) - y(d.total))
     .attr("width", barWidth)
     .attr("fill","lightblue")
     .attr("class", "hiddenBars") 
    
    const totalLine = d3.line()
        .x(d => x(d["Fiscal Year"]))
        .y(d => y(d.total));
    
    const line1 = d3.line()
        .x(d => x(d["Fiscal Year"]))
        .y(d => y(d["Scope 1"]));

    const line2 = d3.line()
        .x(d => x(d["Fiscal Year"]))
        .y(d => y(d["Scope 2"]));

    const line3 = d3.line()
        .x(d => x(d["Fiscal Year"]))
        .y(d => y(d["Scope 3"]));

    // Add the line
    svg.append("path")
        .datum(data)
        .attr("fill","none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", totalLine);

    // Add the line
    svg.append("path")
        .datum(data)
        .attr("fill","none")
        .attr("stroke", "lightgrey")
        .attr("stroke-width", 2)
        .attr("d", line1);
    
    // Add the line
    svg.append("path")
        .datum(data)
        .attr("fill","none")
        .attr("stroke", "grey")
        .attr("stroke-width", 2)
        .attr("d", line2);
    
    // Add the line
    svg.append("path")
        .datum(data)
        .attr("fill","none")
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .attr("d", line3);

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));});
}

// draw scope 3 chart
function drawScope3Chart() {
    const svgID = "#scope3-chart"
    clearChart(svgID);

    const svg = d3.select(svgID);
    // pull height and width from svg in html
    const width = 800;
    const height = 600;
    // margin helps labels sit right
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };

    svg.attr("width", width).attr("height", height);

    d3.csv("data/Scope3.csv").then(data => {
        data.forEach(d => {
        d["Faculty Total"] = +d["Faculty Total"];
        d["Staff Total"] = +d["Staff Total"];
        d["Air"] = +d["Air"];
    });

    const keys = ["Faculty Total", "Staff Total", "Air"];
    const stack = d3.stack().keys(keys);
    const stackedData = stack(data);

    const x = d3.scaleBand()
        .domain(data.map(d => d["Fiscal Year"]))
        .range([margin.left, width - margin.right])
        .padding(0.2);
    
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d =>
        d["Faculty Total"] + d["Staff Total"] + d["Air"]
        )])
        .nice()
        .range([height - margin.bottom, margin.top]);

    const color = d3.scaleOrdinal()
        .domain(keys)
        .range(["#6866e3", "#27be68", "#f55353"]);
    
    const legend = d3.select("#legend");

    const items = legend.selectAll(".legend-item")
        .data(keys)
        .join("div")
        .attr("class", "legend-item");

    items.append("span")
        .attr("class", "legend-dot")
        .style("background", d => color(d));

    items.append("span")
        .text(d => d);

    svg.selectAll("g.layer")
        .data(stackedData)
        .join("g")
        .attr("fill", d => color(d.key))
        .selectAll("rect")
        .data(d => d)
        .join("rect")
        .attr("x", d => x(d.data["Fiscal Year"]))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width", x.bandwidth())
        .on("click", (event, d) => {
            console.log(d.data);  //This is for testing and debugging 
            drawPieChart(d.data);
        });

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));
    
    });
}

function drawPieChart(yearData) {
    const svgID = "#pie-chart";
    d3.select(svgID).selectAll("*").remove();

    const width = 400;
    const height = 450;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(svgID)
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);
    
        svg.append("text")
        .attr("y", height / 2 - 15 )
        .attr("text-anchor", "middle")
        .text(`Emissions Breakdown (tons CO₂e) – Fiscal Year ${yearData["Fiscal Year"]}`);
    
    const keys = ["Faculty Total", "Staff Total", "Air"];

    const color = d3.scaleOrdinal()
        .domain(keys)
        .range(["#6866e3", "#27be68", "#f55353"]); // I used the same colors as bar chart
    const pie = d3.pie()
        .value(key => yearData[key]);
    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius - 10);
    const arcs = svg.selectAll("arc")
        .data(pie(keys))
        .join("g");

    arcs.append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data));
    
    arcs.append("text")
    .attr("transform", d => `translate(${arc.centroid(d)})`)
    .attr("text-anchor", "middle")
    .style("font-size", "13px")
    .style("fill", "black")
    .text(d => yearData[d.data]);
}

// function to render chart on tab switch accordingly
function updateChart(tab) {
    if (tab == "total") {
        drawTotalChart();
    }
    else if (tab == "scope3") {
        drawScope3Chart();
    }
}

// function to avoid charts stacking
function clearChart(svgId) {
  d3.select(svgId).selectAll("*").remove();
}

function hoverOnBar(event, d){
    const year = d.data["Fiscal Year"]
    const scope = d3.select(event.target.parentNode).datum().key;
    const value = d[1] - d[0]; // calculate value

    //highlight
    d3.selectAll(".segment")
        .filter(e => e.data["Fiscal Year"] === year)
        .attr("opacity", 0.5);

    //show hidden bar
    d3.selectAll(".hiddenBars")
        .filter(d => d["Fiscal Year"] === year) //not stacked
        .attr("opacity", 1);

    //tooltip
    tooltip
        .style("opacity", 1)
        .html(`
            <strong>Year:</strong> ${year}<br/>
            <strong>Scope:</strong> ${scope}<br/>
            <strong>Value:</strong> ${value} MT eCo2
        `)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY + 10) + "px");
}
    

function hoverOutBar(event, d){
    d3.selectAll(".segment")
    .attr("opacity", 1) //return to regular 
    d3.selectAll(".hiddenBars")
        .attr("opacity", 0); //hide
    tooltip.style("opacity",0); //hide
}

drawTimeChart();
drawTotalChart();

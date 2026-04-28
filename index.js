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
//      2) http://www.d3noob.org/2013/01/making-dashed-line-in-d3js.html
//      legends:
//      1) https://d3-graph-gallery.com/graph/custom_legend.html

const tabs = document.querySelectorAll(".tab");
const contents = document.querySelectorAll(".content");

const tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("background", "white")
    .style("padding", "6px 10px")
    .style("border", "1px solid #ccc")
    .style("border-radius", "4px")
    .style("opacity", 0);

function drawTotalChart() {
    const svgID = "#total-chart"
    clearChart(svgID);

    const svg = d3.select(svgID);
    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 40, left: 80 };

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

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height - margin.bottom + 40)
        .text("Fiscal Years");

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -(height / 2))
        .attr("y", margin.left - 60)
        .text("MTCO2e");

    const legend = svg.append("g")
        .attr("transform", `translate(${width - margin.right - 120}, ${margin.top})`);
        
        legend.selectAll("rect")
        .data(keys)
        .join("rect")
        .attr("x", 0)
        .attr("y", (d, i) => i * 20)
        .attr("width", 12)
        .attr("height", 12)
        .attr("fill", d => color(d));

        legend.selectAll("text")
        .data(keys)
        .join("text")
        .attr("x", 18)
        .attr("y", (d, i) => i * 20 + 10)
        .text(d => d)
        .attr("font-size", "12px")
        .attr("alignment-baseline", "middle");

    });
}

function drawTimeChart() {
    const svgID = "#time-chart"
    clearChart(svgID);
    const svg = d3.select(svgID);
    const width = 600; 
    const height = 400; 
    const margin = { top: 20, right: 30, bottom: 40, left: 80 };
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
    
        const xBar = d3.scaleBand()
        .domain(data.map(d => d["Fiscal Year"]))
        .range([margin.left, width - margin.right])
        .padding(0.4);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.total)])
        .nice()
        .range([height - margin.bottom, margin.top]);
    
    barWidth = 25
    svg.selectAll(".hiddenBars")
     .data(data)
     .enter()
     .append("rect")
     .attr("x", d => xBar(d["Fiscal Year"]))
     .attr("y", d => y(d.total))
     .attr("height", d => y(0) - y(d.total))
     .attr("width", barWidth)
     .attr("fill","lightblue")
     .attr("class", "hiddenBars") 
     .attr("opacity", 0)
    
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

    svg.append("path")
        .datum(data)
        .attr("fill","none")
        .attr("stroke", "steelblue")
        .style("stroke-dasharray", ("10, 10"))
        .attr("stroke-width", 2)
        .attr("d", totalLine);

    svg.append("path")
        .datum(data)
        .attr("fill","none")
        .attr("stroke", "lightgrey")
        .attr("stroke-width", 2)
        .attr("d", line1);
    
    svg.append("path")
        .datum(data)
        .attr("fill","none")
        .attr("stroke", "grey")
        .attr("stroke-width", 2)
        .attr("d", line2);
    
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
        .call(d3.axisLeft(y));
    
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height - margin.bottom + 40)
        .text("Fiscal Years");

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -(height / 2))
        .attr("y", margin.left - 60)
        .text("MTCO2e");
        
        const keys = ["Total", "Scope 1", "Scope 2", "Scope 3"];

        const color = d3.scaleOrdinal()
        .domain(keys)
        .range(["steelblue", "lightgrey", "grey", "red"]);

        const legend = svg.append("g")
        .attr("transform", `translate(${width - margin.right - 120}, ${margin.top})`);

        const legendItems = legend.selectAll("g")
        .data(keys)
        .join("g")
        .attr("transform", (d, i) => `translate(0, ${i * 20})`);

        legendItems.append("line")
            .attr("x1", 0)
            .attr("x2",20)
            .attr("y1", 6)
            .attr("y2", 6)
            .attr("stroke", d => color(d))
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", d => {
            if (d === "Total") {
              return "5,5";
           } else {
             return "0";
           }
        });

        legendItems.append("text")
            .attr("x", 25)
            .attr("y", 6)
            .attr("alignment-baseline", "middle")
            .attr("font-size", "12px")
            .text(d => d);
            });

}

function drawScope3Chart() {
    const svgID = "#scope3-chart"
    clearChart(svgID);

    const svg = d3.select(svgID);
    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 40, left: 80 };

    svg.attr("width", width).attr("height", height);

    d3.csv("data/Scope3.csv").then(data => {
        data.forEach(d => {
        d["Faculty Total"] = +d["Faculty Total"];
        d["Staff Total"] = +d["Staff Total"];
        d["Directly Funded Air Travel"] = +d["Directly Funded Air Travel"];
    });

    const keys = ["Faculty Total", "Staff Total", "Directly Funded Air Travel"];
    const stack = d3.stack().keys(keys);
    const stackedData = stack(data);

    const x = d3.scaleBand()
        .domain(data.map(d => d["Fiscal Year"]))
        .range([margin.left, width - margin.right])
        .padding(0.2);
    
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d =>
        d["Faculty Total"] + d["Staff Total"] + d["Directly Funded Air Travel"]
        )])
        .nice()
        .range([height - margin.bottom, margin.top]);

    const color = d3.scaleOrdinal()
        .domain(keys)
        .range(["#f55353", "steelblue", "#9e9d9d"]);
    
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
    
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height - margin.bottom + 40)
        .text("Fiscal Years");

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -(height / 2))
        .attr("y", margin.left - 60)
        .text("MTCO2e");
    });
}

function drawPieChart(yearData) {
    const svgID = "#pie-chart";
    d3.select(svgID).selectAll("*").remove();

    const width = 500;
    const height = 437;
    const radius = Math.min(width, height) / 3;

    const svg = d3.select(svgID)
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);
    
        svg.append("text")
        .attr("y", height / 2 - 15 )
        .attr("text-anchor", "middle")
        .text(`Emissions By Part (MTCO2e) – Fiscal Year ${yearData["Fiscal Year"]}`);
    
    const keys = ["Faculty Total", "Staff Total", "Directly Funded Air Travel"];

    const color = d3.scaleOrdinal()
        .domain(keys)
        .range(["#f55353", "steelblue", "#9e9d9d"]); // I used the same colors as bar chart
    const pie = d3.pie()
        .value(key => yearData[key]);
    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius - 10);
    const textArc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius + 60);
    const arcs = svg.selectAll("arc")
        .data(pie(keys))
        .join("g");

    arcs.append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data));
    
    arcs.append("text")
    .attr("transform", d => `translate(${textArc.centroid(d)})`)
    .attr("text-anchor", "middle")
    .style("font-size", "13px")
    .style("fill", "black")
    .text(d => yearData[d.data]);
    
}

function clearChart(svgId) {
  d3.select(svgId).selectAll("*").remove();
}

function hoverOnBar(event, d){
    const year = d.data["Fiscal Year"]
    const scope = d3.select(event.target.parentNode).datum().key;
    // const value = d[1] - d[0]; // calculate value
    const value = (d[1] - d[0]).toFixed(0);

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

drawTotalChart();
drawTimeChart();
drawScope3Chart();

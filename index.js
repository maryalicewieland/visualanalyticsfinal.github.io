// resourced used:
//      tabs: 
//      1) https://www.w3schools.com/howto/howto_js_tabs.asp
//      2) https://education.molssi.org/python-data-science-chemistry/data_processing_cleaning/pandas-datacleaning.html
//      3) https://d3-graph-gallery.com/graph/barplot_stacked_basicWide.html 

// make tabs
const tabs = document.querySelectorAll(".tab");
const contents = document.querySelectorAll(".content");

// handle logic in selecting tabs by adding event listener so when tab is clicked on the css class active is added or deleted, showing and hiding content as needed. This should scale up well if we decide to add another tab.
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
        .attr("width", x.bandwidth());

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));
    
    });
}

// draw scope 3 chart
function drawScope3Chart() {

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

drawTotalChart();
/// DATA MANIPULATION

const grouped = d3.group(dataResidenti, (d) => d.nome)

const newFormat = Array.from(
  d3.group(dataResidenti, (d) => d.nome),
  ([key, value]) => ({ key, value })
)
const comuni = newFormat.map((d) => d.key)

const width = 500
let height = 400
d3.select(".legend-container").style("display", "none")

const margins = {
  top: 30,
  right: 30,
  bottom: 50,
  left: 30,
}

window.innerWidth < 600 ? (height = height * 1.8) : null

window.addEventListener("resize", function () {
  windowWidth = windowHeight = window.innerHeight
  windowWidth < 600 ? height * 2 : null
})

/// SCALES

const xScale = d3
  .scaleLinear()
  .domain([2002, 2020])
  .range([margins.left + 20, width - margins.right])

const yScale = d3
  .scaleLinear()
  .domain([4000, 15000])
  .range([height - margins.bottom, margins.top])

const xAxisGenerator = d3
  .axisBottom()
  .scale(xScale)
  .ticks(6, "d")
  .tickSizeInner(0)

const yAxisGenerator = d3
  .axisLeft()
  .scale(yScale)
  .ticks(4, "~s")
  .tickSizeInner(-width + margins.right + margins.left)
  .tickSizeOuter(0)

const colorScale = d3
  .scaleOrdinal()
  .domain([
    "Borgoricco",
    "Campodarsego",
    "Camposampiero",
    "Loreggia",
    "Massanzago",
    "PiombinoDese",
    "SanGiorgiodellePertiche",
    "SantaGiustinainColle",
    "VilladelConte",
    "VillanovadiCamposampiero",
  ])
  .range([
    "#FAB232",
    "#009EE3",
    "#2D3B8A",
    "#73448F",
    "#00A19A",
    "#FFEE00",
    "#E94E1D",
    "#3AAA35",
    "#34A9E1",
    "#95C221",
  ])

// .range([
//   "#4D6BB8",
//   "#7798DE",
//   "#774E6C",
//   "#DC4E41",
//   "#D9833B",
//   "#A7551F",
//   "#9B9D52",
//   "#63A677",
//   "#2F653F",
//   "#8A8989",
// ])

//.range(d3.schemeSet3)

const svg = d3
  .select("#svg-container")
  .append("svg")
  .attr("class", "chart-svg")
  .attr("id", "svg-line-chart")
  .attr("viewBox", [0, 0, width, height])
  .attr("preserveAspectRatio", "none")
  .on("mousemove", function (d) {
    if (d.target.localName !== "path") {
      Tooltip.style("display", "none")
    }
  })
// .attr("display", "none")

// BUTTONS GROUPS

const divButtons = d3
  .select("#buttons-container")
  .append("div")
  .attr("class", "svg-buttons")
  .style("display", "flex")
  .style("flex-flow", "row wrap")

let stateButtons = []
const clickbuttons = function (d) {
  const citta = d.target.__data__.split(" ").join("")
  const classs = d.target.className

  if (stateButtons.length === 0) {
    stateButtons.push(citta)
    svg
      .selectAll("path:not(." + citta + ")")
      .transition()
      .style("opacity", 0)
      .style("pointer-events", "none")
    divButtons.select("#" + citta).style("border-color", "#00009c")
  } else if (
    stateButtons.length > 0 &&
    stateButtons.includes(citta) === false
  ) {
    stateButtons.push(citta)
    svg
      .select("." + citta)
      .transition()
      .style("opacity", 1)
      .style("stroke", colorScale(citta))
      .style("pointer-events", "auto")

    divButtons.select("#" + citta).style("border-color", "#00009c")
  } else if (stateButtons.length === 1 && stateButtons.includes(citta)) {
    stateButtons = stateButtons.filter((d) => d != citta)
    comuni.forEach((d) => {
      svg
        .select("." + d.split(" ").join(""))
        .transition()
        .style("opacity", 1)
        .style("stroke", colorScale(d.split(" ").join("")))
        .style("pointer-events", "auto")
      divButtons.select("#" + citta).style("border-color", "#E7E7E7")
    })
  } else if (stateButtons.includes(citta)) {
    stateButtons = stateButtons.filter((d) => d != citta)
    svg
      .select("." + citta)
      .transition()
      .style("opacity", 0)
    divButtons.select("#" + citta).style("border-color", "#E7E7E7")
  }
}

const buttonsGroups = divButtons
  .selectAll("g")
  .data(comuni)
  .enter()
  .append("g")
  .attr("class", "divbuttons")
  .attr("id", (d) => d.split(" ").join(""))
  .style("width", "auto")
  .on("click", clickbuttons)

buttonsGroups.append("svg").attr("width", 10).attr("height", 10)

buttonsGroups
  .select("svg")
  .append("circle")
  .attr("cx", 5)
  .attr("cy", 5)
  .attr("r", 5)
  .attr("transform", "translate(5px, 5px)")
  .style("fill", (d) => colorScale(d.split(" ").join("")))
  .style("display", "inline-block")

buttonsGroups
  .append("div")
  .attr("class", "linebuttons")
  .style("height", "20px")
  .style("margin", "0px 10px 0px 10px")
  .style("padding-top", "4px")
  .style("font-family", "Graphik")
  .style("color", "#00009c")
  .text((d) => d)

const lineGenerator = d3
  .line()
  .x((d) => xScale(d.anno))
  .y((d) => yScale(d.residenti))
  .curve(d3.curveCardinal.tension(0.5))

///// TOOLTIPS

const Tooltip = d3
  .select("#viz-container")
  .append("div")
  .attr("class", "tooltip")
  // .style("opacity", 0)
  .style("position", "absolute")
  .style("padding", "8px")
  .style("display", "hidden")

Tooltip.append("div").attr("class", "citta")
Tooltip.append("div").attr("class", "anno")
Tooltip.append("g")
  .attr("class", "residenti")
  .style("display", "flex")
  .style("justify-content", "space-between")

const divResidenti = Tooltip.select(".residenti").append("div")
const numResidenti = Tooltip.select(".residenti").append("div")

const mouseover = function (d) {
  Tooltip.style("opacity", 1)
  const bubble = d.target.__data__
  const mousePosition = d3.pointer(d)
  d3.select(this).transition().style("opacity", 0.4)

  const hoveredDate = Math.floor(xScale.invert(mousePosition[0]))
  const hoveredResidenti = Math.floor(yScale.invert(mousePosition[1]))

  const clientX = d.pageX
  const clientY = d.pageY

  Tooltip.transition(50)
    .style("top", clientY + 10 + "px")
    .style("min-width", "130px")
    .style("left", function (d) {
      if (clientX + 155 - window.innerWidth > 0) {
        return clientX - window.innerWidth + clientX + "px"
      } else {
        return clientX + 5 + "px"
      }
    })
    .transition()
    .style("display", "block")

  Tooltip.select(".citta")
    .text(bubble[0])
    .style("color", "#00009c")
    .style("font-size", "16px")
    .style("font-family", "AtlasMedium")

  Tooltip.select("div.anno")
    .text(hoveredDate)
    .style("padding", "4px 0 4px 0")
    .style("font-size", "14px")
    .style("font-weight", "400")
    .style("opacity", 0.6)

  divResidenti
    .text("Residenti:")
    .style("font-size", "14px")
    .style("font-weight", "400")

  numResidenti
    .text(hoveredResidenti)
    .style("font-size", "14px")
    .style("font-weight", "400")
}
const mouseleave = function (d) {
  d3.select(this).transition().style("opacity", 1)
  Tooltip.style("opacity", 0)
}

const bounds = svg.append("g")

const xAxis = bounds
  .append("g")
  .attr("class", "x-axis-linechart")
  .call(xAxisGenerator)
  .style("transform", `translateY(${height - margins.bottom + 16}px)`)
  .style("font-family", "Graphik")
  .style("font-size", window.innerWidth > 600 ? "8px" : "14px")
  .style("color", "#00009c")

const yAxis = bounds
  .append("g")
  .attr("class", "y-axis")
  .call(yAxisGenerator)
  .style("transform", `translate(${margins.left}px, ${0}px)`)
  .style("font-family", "Graphik")
  .style("font-size", window.innerWidth > 600 ? "8px" : "14px")
  .style("color", "#00009c")

//// SVG LINES

svg
  .selectAll()
  .data(grouped)
  .join("path")
  .attr("id", "linechart-path-initial")
  .attr("stroke", (d) => colorScale(d[0].split(" ").join("")))
  .attr("class", (d) => d[0].split(" ").join(""))
  .attr("stroke-width", 2.2)
  .attr("d", (d) => {
    return d3
      .line()
      .x((d) => xScale(d.anno) + 5)
      .y((d) => yScale(+d.residenti))(d[1])
  })
  .attr("fill", "none")
  .style("opacity", 1)
  .style("pointer-events", "stroke")
  //.style("stroke-linejoin", "round")
  .on("mouseenter", mouseover)
  .on("mouseout", mouseleave)

///////////////////////// LEGEND ///////////////

const legendHeightStacked = 360
const legendWidthStacked = 460

const svgLegendStacked = d3
  .select("#linechart-legend")
  .append("svg")
  .attr("id", "svg-legend-stacked")
  .attr("height", legendHeightStacked)
  .attr("width", legendWidthStacked)
  //.attr("transform", "translate(10,0)")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", [0, 0, legendWidthStacked, legendHeightStacked])
  .style("display", "block")

const marginsLegend = {
  right: 50,
  left: 20,
  bottom: 40,
}
let keys = []
dataResidentiWide.forEach((d) => keys.push(Object.keys(d)))
const comuniStacked = Array.from(
  new Set(keys.flat().filter((d) => d !== "anno"))
)

const stackGenerator = d3
  .stack()
  .keys(comuniStacked)
  .order(d3.stackOrderDescending)

const stackedValues = stackGenerator(dataResidentiWide)

const colorScaleLegend = d3
  .scaleOrdinal()
  .domain([
    "Borgoricco",
    "Campodarsego",
    "Camposampiero",
    "Loreggia",
    "Massanzago",
    "PiombinoDese",
    "SanGiorgiodellePertiche",
    "SantaGiustinainColle",
    "VilladelConte",
    "VillanovadiCamposampiero",
  ])
  .range([
    "#FAB232",
    "#009EE3",
    "#2D3B8A",
    "#73448F",
    "#00A19A",
    "#FFEE00",
    "#E94E1D",
    "#3AAA35",
    "#34A9E1",
    "#95C221",
  ])

const xScaleYear = d3
  .scaleLinear()
  .domain([2002, 2020])
  .range([marginsLegend.left + 25, legendWidthStacked - marginsLegend.right])
const yScaleTot = d3
  .scaleLinear()
  .domain([0, 100000])
  .range([legendHeightStacked - marginsLegend.bottom, 0])

const areaGenerator = d3
  .area()
  .curve(d3.curveCardinal.tension(0.5))
  .x((d, i) => xScaleYear(d.data.anno))
  .y0((d, i) => yScaleTot(d[0]))
  .y1((d) => yScaleTot(d[1]))

const xAxisGeneratorLegend = d3
  .axisBottom()
  .scale(xScaleYear)
  .ticks(8, "d")
  .tickSizeInner(0)
  .tickSizeOuter(0)

const yAxisGeneratorLegend = d3
  .axisLeft()
  .scale(yScaleTot)
  .ticks(4, "~s")
  .tickSizeInner(-width + marginsLegend.right)
  .tickSizeOuter(0)

const xAxisLegend = svgLegendStacked
  .append("g")
  .attr("class", "x-axis-linechart")
  .call(xAxisGeneratorLegend)
  .style("transform", `translateY(${height - margins.bottom - 10}px)`)
  .style("font-family", "Graphik")
  //.style("font-size", window.innerWidth > 600 ? "8px" : "16px")
  .style("color", "#00009c")

const yAxisLegend = svgLegendStacked
  .append("g")
  .attr("class", "y-axis")
  .call(yAxisGeneratorLegend)
  .style("transform", `translate(${marginsLegend.left}px, ${0}px)`)
  .style("font-family", "Graphik")
  .style("font-size", window.innerWidth > 600 ? "8px" : "16px")
  .style("color", "#00009c")

svgLegendStacked
  .selectAll(".areas")
  .data(stackedValues)
  .join("path")
  .attr("id", (d) => d.key)
  .attr("fill", (d, i) => colorScaleLegend(d.key.split(" ").join("")))
  .attr("d", areaGenerator)
  .attr("clip-path", "url(#clip)")
  .style("stroke", (d, i) => colorScaleLegend(d.key.split(" ").join("")))
  .style("stroke-width", 5)
  .style("opacity", 0.65)

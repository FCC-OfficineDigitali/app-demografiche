const svgStacked = d3
  .select("#svg-container")
  .append("svg")
  .attr("id", "svg-stacked-viz")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", [0, 0, width, height])
  .attr("display", "none")
  .on("mouseout", function (d) {
    TooltipStacked.style("display", "none")
  })

// CLIP PATH
const clip = svgStacked.append("clipPath").attr("id", "clip")
const clipRect = clip.append("rect").attr("width", 0).attr("height", height)

let keys = []
widerData.forEach((d) => keys.push(Object.keys(d)))
const paesiStacked = Array.from(
  new Set(keys.flat().filter((d) => d !== "Anno"))
)

const stackGenerator = d3
  .stack()
  .keys(paesiStacked)
  .order(d3.stackOrderDescending)

const stackedValues = stackGenerator(widerData)

const xScaleYear = d3
  .scaleLinear()
  .domain([0, 6])
  .range([margins.left, width - margins.right])
const yScaleTot = d3
  .scaleLinear()
  .domain([0, 15000])
  .range([height - margins.bottom, 0])

//COLOR SCALE
const scalaContinenti = d3
  .scaleOrdinal()
  .domain(["Africa", "Est Europa", "Asia", "Sudamerica", ""])
  .range(["#FB8171", "#78CDA4", "#6361E6", "#fb8072", "#D5D5D5"])

const areaGenerator = d3
  .area()
  .curve(d3.curveCardinal.tension(0.5))
  .x((d, i) => xScaleYear(i) + 6)
  .y0((d) => yScaleTot(d[0]))
  .y1((d) => yScaleTot(d[1]))

const stackedInfo = stackedValues.map((d, i) => {
  return { ...d, area: paesiArea[d.key] }
})

const TooltipStacked = d3
  .select("#viz-container")
  .append("div")
  .attr("class", "tooltip")
  .attr("id", "tooltip-stacked")
  .style("position", "absolute")
  .style("pointer-events", "none")

TooltipStacked.append("div").attr("class", "paese")
TooltipStacked.append("div").attr("class", "area")
TooltipStacked.append("div").attr("class", "anno")
TooltipStacked.append("div").attr("class", "num")
TooltipStacked.append("div").attr("class", "totale")
TooltipStacked.append("g")
  .attr("class", "residenti-stranieri")
  .style("display", "flex")
  .style("justify-content", "space-between")

const mouseOverArea = function (d) {
  TooltipStacked.style("opacity", 1)
  const clientX = d.pageX
  const clientY = d.pageY
  const mousePosition = d3.pointer(d)
  const hoveredYear = Math.floor(xScaleYearLabels.invert(mousePosition[0]))
  const hoveredCountry = d.srcElement.id
  const hoveredNumber =
    stackedDataArea.filter(
      (d) => d.Anno === hoveredYear && d.Paese === hoveredCountry
    )[0].tot_anno / 2
  const totaleStranieri = provenienzaAnno.filter(
    (d) => d.Anno === hoveredYear
  )[0].totale

  const hoveredArea = stackedInfo.filter((d) => d.key === hoveredCountry)[0]
    .area

  d3.select(this).style("stroke", "#00009c").style("stroke-width", 2)

  TooltipStacked.select("div.paese")
    .text(hoveredCountry != "svg-stacked-viz" ? hoveredCountry : null)
    .style("color", "#00009c")
    .style("font-size", "16px")
    .style("font-family", "AtlasMedium")
    .style("color", "#00009c")

  TooltipStacked.select("div.area")
    .text(hoveredCountry != "svg-stacked-viz" ? hoveredArea : null)
    .style("color", "#00009c")
    .style("font-size", "16px")
    .style("font-family", "AtlasMedium")
    .style("color", scalaContinenti(hoveredArea))

  TooltipStacked.select(".num")
    .text(hoveredCountry != "svg-stacked-viz" ? hoveredNumber : null)
    .style("font-size", "16px")
    .style("font-weight", "600")

  TooltipStacked.select("div.anno")
    .text(hoveredCountry != "svg-stacked-viz" ? hoveredYear : null)
    .style("padding", "4px 0 4px 0")
    .style("font-size", "14px")
    .style("font-weight", "400")
    .style("opacity", 0.6)

  TooltipStacked.select("div.totale")
    .text(
      hoveredCountry != "svg-stacked-viz"
        ? "Tot. Stranieri: " + totaleStranieri / 2
        : null
    )
    .style("padding", "4px 0 4px 0")
    .style("font-size", "14px")
    .style("font-weight", "400")
    .style("opacity", 0.8)

  TooltipStacked.transition()
    .duration(100)
    .style("top", clientY + 10 + "px")
    .style("left", function (d) {
      if (clientX + 250 - window.innerWidth > 0) {
        return clientX - window.innerWidth + clientX + "px"
      } else {
        return clientX + 5 + "px"
      }
    })
    .style("height", "auto")
    .style("min-width", "210px")
    .transition()
    .style("display", "block")
}

const mouseOutArea = function (d) {
  TooltipStacked.style("opacity", "0")
  d3.select(this).style("stroke", "none")
}
// AXIS
const xScaleYearLabels = d3
  .scaleLinear()
  .domain([2014, 2020])
  .range([margins.left, width - margins.right])
const xAxisGenerator = d3
  .axisBottom()
  .scale(xScaleYearLabels)
  .ticks(6, "d")
  .tickSizeInner(0)

const yAxisGenerator = d3
  .axisLeft()
  .scale(yScaleTot)
  .ticks(8, "~s")
  .tickSizeInner(-width + margins.right)
  .tickSizeOuter(0)

const xAxis = svgStacked
  .append("g")
  .attr("class", "x-axis-linechart")
  .call(xAxisGenerator)
  .style("transform", `translateY(${height - margins.bottom + 8}px)`)
  .style("font-family", "Graphik")
  .style("font-size", window.innerWidth > 600 ? "8px" : "16px")
  .style("color", "#00009c")

const yAxis = svgStacked
  .append("g")
  .attr("class", "y-axis")
  .call(yAxisGenerator)
  .style("transform", `translate(${margins.left - 30}px, ${0}px)`)
  .style("font-family", "Graphik")
  .style("font-size", window.innerWidth > 600 ? "8px" : "16px")
  .style("color", "#00009c")

svgStacked
  .selectAll(".areas")
  .data(stackedValues)
  .join("path")
  .attr("id", (d, i) => stackedInfo[i].key)
  .attr("fill", (d, i) => scalaContinenti(stackedInfo[i].area))
  .attr("d", areaGenerator)
  .attr("clip-path", "url(#clip)")
  .attr("pointer-events", "visibleFill")
  .style("opacity", 0.8)
  .on("mousemove", mouseOverArea)
  .on("mouseout", mouseOutArea)

// CHANGE VIEW BUTTON
let currentViz = "tree"
d3.select(".button-rects").on("click", function (d) {
  d3.select(this).text("Dettaglio Comune")
  d3.select("#tooltip-stacked").style("display", "none")

  d3.select(this).style("border", "solid #00009c")

  if (currentViz === "tree") {
    d3.select("#svg-stacked-viz").attr("display", "block")
    d3.select("#svg-viz").attr("display", "none")
    d3.select("#buttons-container").style("display", "none")
    d3.select("#select-anno").style("display", "none")
    clipRect
      .transition()
      .duration(2000)
      .ease(d3.easeQuadOut)
      .attr("width", width)

    currentViz = "stacked"
  } else if (currentViz === "stacked") {
    d3.select(this).text("Totale Stranieri")
    d3.select(this).style("border", "solid #e7e7e7")
    d3.select("#buttons-container").style("display", "block")
    d3.select("#select-anno").style("display", "block")
    d3.select("#svg-stacked-viz").attr("display", "none")
    d3.select("#svg-viz").attr("display", "block")

    currentViz = "tree"
  }
})

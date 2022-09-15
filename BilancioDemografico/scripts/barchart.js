const width = 800
const height = 600

const margins = {
  top: 40,
  right: 50,
  bottom: 50,
  left: 60,
}

const legenda = d3
  .select(".legenda")
  .append("svg")
  .attr("height", 30)
  .attr("width", 250)
  .attr("transform", "translate(0,0)")

legenda
  .append("circle")
  .attr("cx", 5)
  .attr("cy", 15)
  .attr("r", 5)
  .style("fill", "#ECEF6B")
legenda
  .append("text")
  .text("Nascite")
  .attr("x", 16)
  .attr("y", 20)
  .style("fill", "#00009c")

legenda
  .append("circle")
  .attr("cx", 90)
  .attr("cy", 15)
  .attr("r", 5)
  .style("fill", "#00009c")
legenda
  .append("text")
  .text("Decessi")
  .attr("x", 101)
  .attr("y", 20)
  .style("fill", "#00009c")

let smallMultipleWidth = 92
let smallMultipleHeight = 100

/// SCALES

const heightScale = d3
  .scaleLinear()
  .domain([0, 200])
  .range([0, smallMultipleHeight])
//for labels
const yScale = d3.scaleLinear().domain([0, 200]).range([smallMultipleHeight, 0])

const xScale = d3
  .scaleLinear()
  .domain([2014, 2020])
  .range([0, smallMultipleWidth])

const xAxisGenerator = d3.axisBottom().scale(xScale).ticks(1, "d").tickSize(0)
const yAxisGenerator = d3.axisLeft().scale(yScale).ticks(1, "~s").tickSize(0)

// const colorScale = d3.scaleOrdinal().domain(comuni).range(d3.schemeSet3)
const comuni = [
  "Borgoricco",
  "Campodarsego",
  "Camposampiero",
  "Loreggia",
  "Massanzago",
  "Piombino Dese",
  "San Giorgio delle Pertiche",
  "Santa Giustina in Colle",
  "Villa del Conte",
  "Villanova di Camposampiero",
]
const svg = d3
  .select("#svg-container")
  .append("svg")
  .attr("id", "svg-viz")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", [0, 0, width, height])

//////////// LEGEND ////////////// LEGEND ///////////////

const legendHeight = 280
const legendWidth = 330

const legendMargins = {
  top: 10,
  right: 10,
  bottom: 20,
  left: 50,
}

const heightScaleLegend = d3
  .scaleLinear()
  .domain([0, 1000])
  .range([legendMargins.top, legendHeight - legendMargins.bottom])
//for labels
const yScaleLegend = d3
  .scaleLinear()
  .domain([0, 1000])
  .range([legendHeight - legendMargins.bottom, legendMargins.top])

const xScaleLegend = d3
  .scaleBand()
  .domain([2014, 2015, 2016, 2017, 2018, 2019, 2020])
  .range([legendMargins.left, legendWidth - legendMargins.right])

const xAxisGeneratorLegend = d3
  .axisBottom()
  .scale(xScaleLegend)
  .ticks(8, "d")
  .tickPadding(8)
  .tickSize(0)

const yAxisGeneratorLegend = d3
  .axisLeft()
  .scale(yScaleLegend)
  .ticks(4)
  .tickPadding(8)
  .tickSize(0)

const mouseoverLegend = function (d) {
  d3.select(this).style("opacity", 0.5)
  const bar = d.target.__data__
  const clientX = d.pageX
  const clientY = d.pageY

  const dex = totalDataLegend.filter(
    (d) => d.stato === "Morti" && d.anno === bar.anno
  )

  const nDecessi = dex[0].tot
  const saldo = bar.tot - nDecessi

  Tooltip.select("div.citta")
    .text("Federazione Camposampierese")
    //  .style("color", colorScale(bubble.macro))
    .style("color", "#00009c")
    .style("font-size", "16px")
    .style("font-weight", "600")
    .style("font-family", "AtlasMedium")

  Tooltip.select("div.anno")
    .text(bar.anno)
    .style("padding", "4px 0 4px 0")
    .style("font-size", "14px")
    .style("font-weight", "400")
    .style("opacity", 0.6)

  nascite
    .text("Nascite: ")
    .style("font-size", "14px")
    .style("font-weight", "400")

  numNascite
    .text(bar.tot)
    .style("font-size", "14px")
    .style("font-weight", "400")

  morti.text("Decessi: ").style("font-size", "14px").style("font-weight", "400")
  numMorti
    .text(dex[0].tot)
    .style("font-size", "14px")
    .style("font-weight", "400")

  divSaldo
    .text("Saldo: ")
    .style("font-size", "14px")
    .style("font-weight", "400")
  numSaldo
    .text(saldo >= 0 ? "+" + saldo : saldo)
    .style("font-size", "14px")
    .style("font-weight", "400")
    .style("color", saldo >= 0 ? "green" : "red")

  Tooltip.transition()
    .duration(50)
    .style("top", clientY + 10 + "px")
    .style("left", function (d) {
      if (clientX + 180 - window.innerWidth > 0) {
        return clientX - window.innerWidth + clientX + "px"
      } else {
        return clientX + 5 + "px"
      }
    })
    .style("height", "auto")
    .style("min-width", "140px")
    .transition()
    .style("display", "block")
}

const mouseover = function (d) {
  d3.select(this).style("opacity", 0.5)
  const bar = d.target.__data__
  const clientX = d.pageX
  const clientY = d.pageY
  const decessi = bilancioDemograficoData
    .map((d) => d.data)
    .flat()
    .filter(
      (d) => d.anno === bar.anno && d.nome === bar.nome && d.stato === "Morti"
    )

  const nDecessi = decessi[0].n
  const saldo = bar.n - nDecessi

  Tooltip.select("div.citta")
    .text(bar.nome)
    //  .style("color", colorScale(bubble.macro))
    .style("color", "#00009c")
    .style("font-size", "16px")
    .style("font-weight", "600")
    .style("font-family", "AtlasMedium")

  Tooltip.select("div.anno")
    .text(bar.anno)
    .style("padding", "4px 0 4px 0")
    .style("font-size", "14px")
    .style("font-weight", "400")
    .style("opacity", 0.6)

  nascite
    .text("Nascite: ")
    .style("font-size", "14px")
    .style("font-weight", "400")

  numNascite.text(bar.n).style("font-size", "14px").style("font-weight", "400")

  morti.text("Decessi: ").style("font-size", "14px").style("font-weight", "400")
  numMorti.text(nDecessi).style("font-size", "14px").style("font-weight", "400")

  divSaldo
    .text("Saldo: ")
    .style("font-size", "14px")
    .style("font-weight", "400")
  numSaldo
    .text(saldo >= 0 ? "+" + saldo : saldo)
    .style("font-size", "14px")
    .style("font-weight", "400")
    .style("color", saldo >= 0 ? "green" : "red")

  Tooltip.transition()
    .duration(50)
    .style("top", clientY + 10 + "px")
    .style("left", function (d) {
      if (clientX + 240 - window.innerWidth > 0) {
        return clientX - window.innerWidth + clientX + "px"
      } else {
        return clientX + 5 + "px"
      }
    })
    .style("height", "auto")
    .style("min-width", "140px")
    .transition()
    .style("display", "block")
}

const mouseleave = function (d) {
  d3.select(this).style("opacity", 1)
  d3.select(".tooltip").transition().style("display", "none")
}

const svgLegend = d3
  .select("#div-legend")
  .append("svg")
  .attr("id", "svg-legend")
  .attr("height", legendHeight)
  .attr("width", legendWidth)
  .attr("transform", "translate(10,0)")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", [0, 0, 270, 300])

svgLegend
  .selectAll("rect")
  .data(totalDataLegend)
  .join("rect")
  .attr("class", "bar-svg")
  .attr("id", (d) => d.stato)
  .attr("x", (d) => xScaleLegend(d.anno))
  .attr(
    "y",
    (d) => legendHeight - legendMargins.bottom - heightScaleLegend(d.tot)
  )

  .attr("width", (d) => xScaleLegend.bandwidth())
  .attr("height", (d) => (d.stato === "Nati" ? heightScaleLegend(d.tot) : 2))
  .style("pointer-events", (d) => (d.stato === "Nati" ? "auto" : "none"))
  .style("fill", (d) => (d.stato === "Nati" ? "#ECEF6B" : "#555491"))
  .on("mouseover", mouseoverLegend)
  .on("mouseleave", mouseleave)

const xAxisLegend = svgLegend
  .append("g")
  .attr("class", "x-axis")
  .call(xAxisGeneratorLegend)
  .style(
    "transform",
    `translate(${0}px,${legendHeight - legendMargins.bottom}px)`
  )
  .style("font-family", "Graphik")
  .style("font-size", "12px")
  .style("color", "#00009c")

const yAxisLegend = svgLegend
  .append("g")
  //.attr("class", "y-axis")
  .call(yAxisGeneratorLegend)
  .style("font-family", "Graphik")
  .style("font-size", "12px")
  .style("transform", `translate(${legendMargins.left - 1}px,0px)`)
  .style("color", "#00009c")

///// TOOLTIPS

const Tooltip = d3
  .select("#viz-container")
  .append("div")
  .attr("class", "tooltip")
  .style("display", "hidden")
  .style("position", "absolute")
  .style("pointer-events", "none")

Tooltip.append("div").attr("class", "citta")
Tooltip.append("div").attr("class", "anno")
Tooltip.append("g")
  .attr("class", "nascite")
  .style("display", "flex")
  .style("justify-content", "space-between")

const nascite = Tooltip.select(".nascite").append("div")
const numNascite = Tooltip.select(".nascite").append("div")

Tooltip.append("g")
  .attr("class", "morti")
  .style("display", "flex")
  .style("justify-content", "space-between")

const morti = Tooltip.select(".morti").append("div")
const numMorti = Tooltip.select(".morti").append("div")

Tooltip.append("g")
  .attr("class", "saldo")
  .style("display", "flex")
  .style("justify-content", "space-between")

const divSaldo = Tooltip.select(".saldo").append("div")
const numSaldo = Tooltip.select(".saldo").append("div")

//// SVG

function drawData(firstRender) {
  svg.selectAll("*").remove()
  window.innerWidth < 800
    ? svg.attr("viewBox", [0, 0, width, height * 2])
    : svg.attr("viewBox", [0, 0, width, height])

  window.innerWidth > 800
    ? (smallMultipleHeight = 100)
    : (smallMultipleHeight = 140)

  window.innerWidth > 800
    ? (smallMultipleWidth = 100)
    : (smallMultipleWidth = 150)

  window.innerWidth > 800
  yScale.range([smallMultipleHeight, 0])

  window.innerWidth > 800
  xScale.range([0, smallMultipleWidth])

  const groupsWrapper = svg
    .selectAll()
    .data(bilancioDemograficoData)
    .enter()
    .append("g")
    .on("mouseover", function (d) {
      const hoveredComune = d.target.__data__.Nome

      const frame = "#frame" + comuni.indexOf(hoveredComune)
      //  d3.selectAll(".frame").style("stroke", "red")
      d3.select(frame).style("stroke", "#00009c").style("stroke-width", 2.5)
    })
    .on("mouseleave", function (d) {
      const hoveredComune = d.target.__data__.Nome

      const frame = "#frame" + comuni.indexOf(hoveredComune)
      d3.select(frame).style("stroke", "#C4C4C4").style("stroke-width", 1)
    })
    .on("click", function (d) {
      const clickedComune = d.target.__data__.Nome

      drawRectsViz(clickedComune)

      groupsRect
        .selectAll(".text-nati")
        .data((d) =>
          d.data.filter((e) => e.nome === clickedComune && e.stato === "Nati")
        )
        .join("text")
        .attr("class", "text-nati")
        .attr("id", (d) => "nati-" + d.anno)
        .attr("x", 55)
        .attr("y", -30)
        .text((d) => "+ " + d.n)
        .style("opacity", 0)

      groupsRect
        .selectAll(".text-morti")
        .data((d) =>
          d.data.filter((e) => e.nome === clickedComune && e.stato === "Morti")
        )
        .join("text")
        .attr("class", "text-morti")
        .attr("id", (d) => "morti-" + d.anno)
        .attr("x", 55)
        .attr("y", 0)
        .text((d) => "- " + d.n)
        .style("opacity", 0)
      if (currentViz === "barchart") {
        d3.select("#change-view").style("border", "solid #00009c")
        d3.select("#selectYear").style("visibility", "initial")
        d3.select("#svg-rect-viz").attr("display", "block")
        d3.select("#svg-viz").attr("display", "none")
        d3.select("#selectComune").style("visibility", "initial")
        d3.select("#svg-legend").style("display", "none")
        d3.select("#svg-legend-rects").style("display", "block")
        // d3.select(".legenda").style("display", "none")

        d3.selectAll("rect")
          .style("opacity", 0)
          .transition()
          .delay(100)
          .duration(450)
          .ease(d3.easeQuadOut)
          .style("opacity", 1)

        currentViz = "rects"
        document.getElementById("selectComune").value = clickedComune
      } else if (currentViz === "rects") {
        d3.select("#change-view").style("border", "solid #e7e7e7")

        d3.select("#selectYear").style("visibility", "hidden")
        d3.select("#svg-rect-viz").attr("display", "none")
        d3.select("#svg-viz").attr("display", "block")
        currentViz = "barchart"
      }
    })
    .attr("class", "barchartlabel")
    .attr(
      "transform",
      window.innerWidth > 800
        ? (d, i) => {
            return `translate(${(i % 4) * 180 + 85},${
              Math.floor(i / 4) * 180 + smallMultipleHeight + 28
            })`
          }
        : (d, i) => {
            return `translate(${(i % 2) * 340 + 140},${
              Math.floor(i / 2) * 220 + smallMultipleHeight + 68
            })`
          }
    )
    .append("text")
    .attr("x", xScale(2014))
    .attr("y", 40)
    .text(function (d, i) {
      if (d.Nome.split(" ").length === 1) {
        return d.Nome
      } else {
        const textArray = d.Nome.split(" ")
        return textArray[0] + " " + textArray[1]
      }
    })
    .style("fill", "#00009c")
    .style("font-family", "AtlasMedium")
    .style("font-size", window.innerWidth < 600 ? 20 : 16)
    .append("tspan")
    .attr("x", 0)
    .attr("dy", "1.1em")
    .text(function (d, i) {
      if (d.Nome.split(" ").length < 3) {
        return ""
      } else {
        const textArray = d.Nome.split(" ")
        let secondRow = ""
        textArray[3] != undefined
          ? (secondRow += textArray[2] + " " + textArray[3])
          : (secondRow += textArray[2])

        return secondRow
      }
    })
    .style("fill", "#00009c")
    .style("font-family", "AtlasMedium")
    .style("font-size", window.innerWidth < 600 ? 20 : 16)

  // groups for chart
  const groups = svg
    .selectAll()
    .data(bilancioDemograficoData)
    .enter()
    .append("g")
    .attr("class", "barchart")
    .attr(
      "transform",
      window.innerWidth > 800
        ? (d, i) => {
            return `translate(${(i % 4) * 180 + 85},${
              Math.floor(i / 4) * 180 + margins.top
            })`
          }
        : (d, i) => {
            return `translate(${(i % 2) * 340 + 140},${
              Math.floor(i / 2) * 220 + margins.top * 2
            })`
          }
    )

  groups
    .selectAll("rect")
    .data((d) => d.data)
    .join("rect")
    .attr("class", "bar-svg")
    .attr("id", (d) => d.stato)
    .attr("x", (d) => xScale(d.anno))
    .attr("y", (d) => smallMultipleHeight - heightScale(d.n))
    .attr("width", smallMultipleWidth / 7 + 2.4)
    .attr(
      "height",
      firstRender === true
        ? 0
        : (d) => (d.stato === "Nati" ? heightScale(d.n) : 2)
    )
    .style("fill", (d) => (d.stato === "Nati" ? "#ECEF6B" : "#555491"))
    .style("pointer-events", (d) => (d.stato === "Nati" ? "auto" : "none"))
    .on("mouseover", mouseover)
    .on("mouseout", mouseleave)

  firstRender === true
    ? groups
        .selectAll("rect")
        .transition()
        .duration(800)
        .delay((d, i) => i * 60)
        .attr("height", (d) => (d.stato === "Nati" ? heightScale(d.n) : 2))
    : null

  groups
    .append("rect")
    .attr("x", 0)
    .attr("y", smallMultipleHeight)
    .attr("width", smallMultipleWidth + smallMultipleWidth / 7 + 3.2)
    .attr("height", 2)
    .style("fill", "#00009c")
    .style("stroke", "#00009c")
    .style("pointer-events", "none")
  groups
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("id", (d, i) => "frame" + i)
    .attr("class", "frame")
    .attr("width", smallMultipleWidth + smallMultipleWidth / 7 + 3.2)
    .attr("height", smallMultipleHeight)
    .style("fill", "transparent")
    .style("stroke", "#C4C4C4")
    .style("pointer-events", "none")

  const yAxis = groups
    .append("g")
    .attr("class", "y-axis")
    .call(yAxisGenerator)
    .style("transform", `translateX(-6px)`)
    .style("font-family", "Graphik")
    .style("color", "#00009c")
}

drawData(true)

window.addEventListener("resize", function () {
  windowWidth = window.innerWidth
  windowHeight = window.innerHeight

  drawData()
})

// SELECTION DROPDOWN  options
d3.select("#selectComune")
  .selectAll()
  .data(
    new Set(
      bilancioDemograficoData
        .map((d) => d.data)
        .flat()
        .map((d) => d.nome)
    )
  )
  .enter()
  .append("option")
  .text(function (d) {
    return d
  })
  .attr("value", function (d) {
    return d
  })

let currentViz = "barchart"

//svg.selectAll("*").remove()

const sideScale = d3.scaleSqrt().domain([0, 180]).range([0, 100])

window.innerWidth < 600 ? sideScale.range([0, 160]) : null

const x = bilancioDemograficoData.map((d) => d.data).flat()
const y = d3.group(x, (d) => d.anno)
const z = Array.from(y, ([key, value]) => {
  return { anno: key, data: value }
})

const svgRects = d3
  .select("#svg-container")
  .append("svg")
  .attr("id", "svg-rect-viz")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", [0, 0, width, window.innerWidth < 600 ? height * 2 : height])

d3.select("#svg-viz").attr("display", "none")

// groups for chart
const groupsRect = svgRects
  .selectAll()
  .data(z)
  .enter()
  .append("g")
  .attr("class", "rectchart")
  .attr(
    "transform",
    window.innerWidth > 800
      ? (d, i) => {
          return `translate(${(i % 4) * 180 + 130},${
            Math.floor(i / 4) * 200 + 145
          })`
        }
      : (d, i) => {
          return `translate(${(i % 2) * 340 + 200},${
            Math.floor(i / 2) * 260 + 140 + margins.top * 2
          })`
        }
  )

const svgLegendRects = d3
  .select("#div-legend")
  .append("svg")
  .attr("id", "svg-legend-rects")
  .attr("height", legendHeight)
  .attr("width", legendWidth)
  //.attr("transform", "translate(10,0)")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", [0, 0, 330, 320])
  .style("display", "none")

const legendNati = bilancioDemograficoData
  .map((d) => d.data)
  .flat()
  .filter((d) => d.stato === "Nati")
  .reduce((accumulator, obj) => {
    return (n = accumulator + obj.n)
  }, 0)

const legendMorti = bilancioDemograficoData
  .map((d) => d.data)
  .flat()
  .filter((d) => d.stato === "Morti")
  .reduce((accumulator, obj) => {
    return (n = accumulator + obj.n)
  }, 0)

const dataLegendRects = [
  { stato: "Nati", n: legendNati },
  { stato: "Morti", n: legendMorti },
]
const legendSideScale = d3.scaleSqrt().domain([0, 6000]).range([0, 200])

svgLegendRects
  .selectAll("rect")
  .data(dataLegendRects)
  .join("rect")
  .attr("class", "rect-svg-legend")
  //.attr("id", (d) => d.stato)
  .attr("x", 100)
  .attr("y", 100)
  .attr("width", (d) => legendSideScale(d.n))
  .attr("height", (d) => legendSideScale(d.n))
  .attr("stroke", (d) => (d.stato === "Morti" ? "#00009c" : "#ECEF6B"))
  .attr("stroke-width", 3)
  .style("fill", (d) => (d.stato === "Nati" ? "#ECEF6B" : "none"))
  .style("opacity", (d) => (d.stato === "Morti" ? 1 : 1))
  .style("mix-blend-mode", (d) => (d.stato === "Morti" ? "normal" : "none"))
  .style("pointer-events", (d) => (d.stato === "Nati" ? "auto" : "none"))
  .style("transform", "translate(170px, 440px) rotate(-135deg)")
  //.style("transform", "rotate(-135deg)")
  .attr("stroke-opacity", 1)

// LEGEND TEXT, LABELS
svgLegendRects
  .append("text")
  .attr("class", "text-svg-legend")
  //.attr("id", (d) => d.stato)
  .attr("x", 260)
  .attr("y", 250)
  .style("fill", "#d9db65")
  .style("font-family", "Graphik")
  .attr("stroke-opacity", 1)
  .text("Nascite: +" + legendNati)

svgLegendRects
  .append("text")
  .attr("class", "text-svg-legend")
  //.attr("id", (d) => d.stato)
  .attr("x", 260)
  .attr("y", 280)
  .style("fill", "#00009c")
  .style("font-family", "Graphik")
  .attr("stroke-opacity", 1)
  .text("Decessi: -" + legendMorti)

function drawRectsViz(comune) {
  const data = d3.group(
    bilancioDemograficoData
      .map((d) => d.data)
      .flat()
      .filter((e) => e.nome === "Borgoricco"),
    (d) => d.anno
  )
  groupsRect
    .selectAll("rect")
    .data((d) => d.data.filter((e) => e.nome === comune))
    .join("rect")
    .attr("class", "rect-svg")
    .attr("id", (d) => d.stato)
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", (d) => sideScale(d.n))
    .attr("height", (d) => sideScale(d.n))
    .attr("stroke", (d) => (d.stato === "Morti" ? "#00009c" : "#ECEF6B"))
    .attr("stroke-width", 2)
    .style("fill", (d) => (d.stato === "Nati" ? "#ECEF6B" : "none"))
    .style("opacity", (d) => (d.stato === "Morti" ? 1 : 1))
    .style("mix-blend-mode", (d) => (d.stato === "Morti" ? "normal" : "none"))
    .style("pointer-events", (d) => (d.stato === "Nati" ? "auto" : "none"))
    .style("transform", "rotate(-135deg)")
    .attr("stroke-opacity", 1)
    .on("mouseover", function (d) {
      const anno = d.target.__data__.anno

      d3.select("#nati-" + anno)
        .transition()
        .duration(350)
        .ease(d3.easeQuadOut)
        .style("opacity", 1)
      d3.select("#morti-" + anno)
        .transition()
        .duration(350)
        .ease(d3.easeQuadOut)
        .style("opacity", 1)
    })
    .on("mouseout", function (d) {
      const anno = d.target.__data__.anno

      d3.select("#nati-" + anno)
        .transition()
        .duration(350)
        .ease(d3.easeQuadOut)
        .style("opacity", 0)
      d3.select("#morti-" + anno)
        .transition()
        .duration(350)
        .ease(d3.easeQuadOut)
        .style("opacity", 0)
    })

  groupsRect
    .selectAll()
    .data((d) => d.data.filter((e) => e.nome === comune && e.stato === "Nati"))
    .join("text")
    .attr("class", "text-nati")
    .attr("id", (d) => "nati-" + d.anno)
    .attr("x", 55)
    .attr("y", -30)
    .text((d) => "+ " + d.n)
    .style("opacity", 0)

  groupsRect
    .selectAll()
    .data((d) => d.data.filter((e) => e.nome === comune && e.stato === "Morti"))
    .join("text")
    .attr("class", "text-morti")
    .attr("id", (d) => "morti-" + d.anno)
    .attr("x", 55)
    .attr("y", 0)
    .text((d) => "- " + d.n)
    .style("opacity", 0)

  svgRects
    .selectAll("g")
    .attr("class", "rect-chart-label")
    .append("text")
    .attr("x", -18)
    .attr("y", 30)
    .text((d) => d.anno)
    .style("fill", "#00009c")
    .style("font-family", "AtlasMedium")
    .style("font-size", window.innerWidth < 600 ? 20 : 16)
    .style("fill", "#00009c")
    .style("transform", "translate(-100, 30)")
}
drawRectsViz("Borgoricco")

let selectedComune = "Borgoricco"
d3.select("#selectComune").on("change", function () {
  selectedComune = d3.select(this).property("value")
  groupsRect
    .selectAll("#Nati")
    .data((d) =>
      d.data.filter((e) => e.nome === selectedComune && e.stato === "Nati")
    )
    .join("rect")
    .attr("id", (d) => d.stato)
    .attr("x", 0)
    .attr("y", 0)
    .transition()
    .duration(350)
    .ease(d3.easeQuadOut)
    .attr("width", (d) => sideScale(d.n))
    .attr("height", (d) => sideScale(d.n))

  groupsRect
    .selectAll("#Morti")
    .data((d) =>
      d.data.filter((e) => e.nome === selectedComune && e.stato === "Morti")
    )
    .join("rect")
    .attr("id", (d) => d.stato)
    .attr("x", 0)
    .attr("y", 0)
    .transition()
    .duration(350)
    .ease(d3.easeCubicOut)
    .attr("height", (d) => sideScale(d.n))
    .attr("width", (d) => sideScale(d.n))

  groupsRect
    .selectAll(".text-nati")
    .data((d) =>
      d.data.filter((e) => e.nome === selectedComune && e.stato === "Nati")
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
      d.data.filter((e) => e.nome === selectedComune && e.stato === "Morti")
    )
    .join("text")
    .attr("class", "text-morti")
    .attr("id", (d) => "morti-" + d.anno)
    .attr("x", 55)
    .attr("y", 0)
    .text((d) => "- " + d.n)
    .style("opacity", 0)
})

d3.select("#svg-rect-viz").attr("display", "none")
d3.select("#svg-viz").attr("display", "block")

d3.select("#selectComune").style("visibility", "hidden")

d3.select("#change-view").on("click", function (d) {
  // const svg = d3.select(".chart-svg")

  d3.select(this).style("border", "solid #00009c")
  if (currentViz === "barchart") {
    d3.select(this).text("Dettaglio Federazione")
    d3.select("#selectComune").style("visibility", "initial")
    d3.select("#svg-rect-viz").attr("display", "block")
    d3.select("#svg-viz").attr("display", "none")
    d3.select("#svg-legend").style("display", "none")
    d3.select("#svg-legend-rects").style("display", "block")
    d3.selectAll("rect")
      .style("opacity", 0)
      .transition()
      .delay(130)
      .duration(600)
      .ease(d3.easeQuadOut)
      .style("opacity", 1)

    currentViz = "rects"
  } else if (currentViz === "rects") {
    d3.select(this).text("Dettaglio Comune")
    d3.select(this).style("border", "solid #e7e7e7")

    d3.select("#selectComune").style("visibility", "hidden")
    d3.select("#svg-rect-viz").attr("display", "none")
    d3.select("#svg-viz").attr("display", "block")
    d3.select("#svg-legend").style("display", "block")
    d3.select("#svg-legend-rects").style("display", "none")
    d3.select("#svg-legend")
      .style("opacity", 0)
      .transition()
      .delay(130)
      .duration(600)
      .ease(d3.easeQuadOut)
      .style("opacity", 1)

    d3.selectAll(".barchart")
      .style("opacity", 0)
      .transition()
      .delay(130)
      .duration(600)
      .ease(d3.easeQuadOut)
      .style("opacity", 1)

    currentViz = "barchart"
  }
})

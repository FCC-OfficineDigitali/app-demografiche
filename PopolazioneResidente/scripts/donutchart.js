const svgDonut = d3
  .select("#svg-container")
  .append("svg")
  .attr("id", "svg-donut-viz")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", [0, 0, width, height])
  .attr("display", "none")

const residenti0220 = [
  { nome: "Borgoricco", residenti2002: 7092, residenti2020: 8867 },
  { nome: "Campodarsego", residenti2002: 11606, residenti2020: 14885 },
  { nome: "Camposampiero", residenti2002: 10887, residenti2020: 11908 },
  { nome: "Loreggia", residenti2002: 5929, residenti2020: 7642 },
  { nome: "Massanzago", residenti2002: 4923, residenti2020: 6097 },
  { nome: "Piombino Dese", residenti2002: 8717, residenti2020: 9519 },
  {
    nome: "San Giorgio delle Pertiche",
    residenti2002: 8038,
    residenti2020: 10186,
  },
  { nome: "Santa Giustina in Colle", residenti2002: 6490, residenti2020: 7180 },
  { nome: "Villa del Conte", residenti2002: 5097, residenti2020: 5578 },
  {
    nome: "Villanova di Camposampiero",
    residenti2002: 4884,
    residenti2020: 6176,
  },
]

const percentageData = residenti0220.map((d) => {
  return {
    ...d,
    pctg: (
      ((d.residenti2020 - d.residenti2002) / d.residenti2020) *
      100
    ).toFixed(2),
  }
})

var widthDonut = window.innerWidth > 800 ? 60 : 80
var heightDonut = window.innerWidth > 800 ? 60 : 80
var radius = Math.min(widthDonut, heightDonut) / 2
var donutWidth = window.innerWidth > 800 ? 3 : 6

const angleScale = d3
  .scaleLinear()
  .domain([0, 30])
  .range([2 * Math.PI, 0])

var arc = d3
  .arc()
  .innerRadius(radius - donutWidth)
  .outerRadius(radius)
  .startAngle(2 * Math.PI)
  .endAngle((d) => angleScale(d.pctg))
//.endAngle(0)

var pie = d3.pie().value(function (d) {
  return d.pctg
})

//legend

const legendHeight = 360
const legendWidth = 350
var radiusLegend = Math.min(0.7 * legendWidth, 0.7 * legendHeight) / 2
var donutWidthLegend = 10

var arcLegend = d3
  .arc()
  .innerRadius(radiusLegend - donutWidthLegend)
  .outerRadius(radiusLegend)
  .startAngle(2 * Math.PI)
  .endAngle((d) => angleScale(d.pctg))

const svgLegendDonut = d3
  .select("#div-legend")
  .append("svg")
  .attr("id", "svg-legend-donut")
  .attr("height", legendHeight)
  .attr("width", legendWidth)
  //.attr("transform", "translate(10,0)")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", [0, 0, legendWidth, legendHeight])
  .style("display", "none")

svgLegendDonut
  .selectAll("path")
  .data([
    {
      nome: "Federazione",
      residenti2002: 7092,
      residenti2020: 8867,
      pctg: "16.01",
    },
  ])
  .join("path")
  .attr("class", "donut-path")
  .attr("id", (d) => d.nome)
  .attr("transform", `translate(${legendWidth / 2},${legendHeight / 2})`)
  // .style("fill", "transparent")
  .attr("fill", "#00009c")
  .attr("d", arcLegend)
  .style("stroke-linecap", "round")

//name label
svgLegendDonut
  .selectAll()
  .data([
    {
      nome: "Federazione Camposampierese",
      residenti2002: 7092,
      residenti2020: 8867,
      pctg: "16.01",
    },
  ])
  .join("text")
  .attr("class", "donut-text")
  .attr("id", (d) => d.nome + "-text")
  .attr("x", (d) =>
    window.innerWidth < 500 ? legendWidth / 2 - d.nome.length * 4 : 30
  )
  .attr("y", legendHeight - 2)
  .style("font-size", window.innerWidth < 800 ? 15 : 16)
  .text((d) => d.nome)

svgLegendDonut
  .selectAll()
  .data([
    {
      nome: "Federazione Camposampierese",
      residenti2002: 7092,
      residenti2020: 8867,
      pctg: "16.01",
    },
  ])
  .join("text")
  .attr("class", "donut-percentage")
  .attr("id", (d) => d.nome + "-text")
  .attr("x", legendWidth / 2 - 12)
  .attr("y", legendHeight / 2)
  // .attr(
  //   "transform",
  //   window.innerWidth > 800
  //     ? (d, i) => {
  //         return `translate(${(i % 4) * 120 + 60},${
  //           Math.floor(i / 4) * 130 + 62
  //         })`
  //       }
  //     : (d, i) => {
  //         return `translate(${(i % 2) * 235 + 100},${
  //           Math.floor(i / 2) * 140 + 60
  //         })`
  //       }
  // )
  .style("font-size", window.innerWidth < 800 ? 14 : 16)
  .text((d) => d.pctg + "%")

svgDonut
  .selectAll("path")
  .data(percentageData)
  .join("path")
  .attr("class", "donut-path")
  .attr("id", (d) => d.nome)
  .attr(
    "transform",
    window.innerWidth > 800
      ? (d, i) => {
          return `translate(${(i % 4) * 120 + 70},${
            Math.floor(i / 4) * 130 + 60
          })`
        }
      : (d, i) => {
          return `translate(${(i % 2) * 235 + 120},${
            Math.floor(i / 2) * 140 + margins.top * 2
          })`
        }
  )
  // .style("fill", "transparent")
  .attr("fill", (d) => colorScale(d.nome.split(" ").join("")))
  .attr("d", arc)
  .style("opacity", 0)
  .style("stroke-linecap", "round")

//name label
svgDonut
  .selectAll()
  .data(percentageData)
  .join("text")
  .attr("class", "donut-text")
  .attr("id", (d) => d.nome + "-text")
  .attr("x", 0)
  .attr("y", 0)
  .attr(
    "transform",
    window.innerWidth > 800
      ? (d, i) => {
          return `translate(${(i % 4) * 120 + 62 - d.nome.length * 1.6},${
            Math.floor(i / 4) * 130 + 110
          })`
        }
      : (d, i) => {
          return `translate(${(i % 2) * 235 + 100 - d.nome.length * 2.2},${
            Math.floor(i / 2) * 140 + 72 + margins.top * 2
          })`
        }
  )
  .style("font-size", window.innerWidth < 800 ? 15 : null)
  .text((d) => d.nome)

// percentage label
svgDonut
  .selectAll()
  .data(percentageData)
  .join("text")
  .attr("class", "donut-percentage")
  .attr("id", (d) => d.nome + "-text")
  .attr("x", 0)
  .attr("y", 0)
  .attr(
    "transform",
    window.innerWidth > 800
      ? (d, i) => {
          return `translate(${(i % 4) * 120 + 60},${
            Math.floor(i / 4) * 130 + 62
          })`
        }
      : (d, i) => {
          return `translate(${(i % 2) * 235 + 100},${
            Math.floor(i / 2) * 140 + 60
          })`
        }
  )
  .style("font-size", window.innerWidth < 800 ? 14 : null)
  .text((d) => d.pctg + "%")

// .style("stroke", "green")

// CHANGE VIEW BUTTON
let currentViz = "line"
d3.select("#change-view-linechart").on("click", function (d) {
  d3.select(this).style("border", "solid #00009c")
  d3.select(this).text("Andamento demografico")
  if (currentViz === "line") {
    d3.select(".tooltip").style("display", "none")
    d3.select("#stacked-container").style("display", "none")
    svg.selectAll("path").attr("id", "linechart-path")

    d3.select("#svg-donut-viz").attr("display", "block")
    d3.select("#svg-line-chart").attr("display", "none")
    d3.select("#buttons-container").style("display", "none")
    d3.select("#svg-legend-donut").style("display", "block")
    d3.select(".legend-container").style("display", "block")
    svgDonut.selectAll("path").transition().duration(800).style("opacity", 1)

    currentViz = "donut"
  } else if (currentViz === "donut") {
    d3.select(this).text("Aumento Percentuale")

    d3.select(this).style("border", "solid #e7e7e7")

    d3.select("#svg-donut-viz").attr("display", "none")
    d3.select("#svg-line-chart").attr("display", "block")
    if (window.innerWidth > 800) {
      d3.select("#stacked-container").style("display", "block")
    }

    d3.select("#buttons-container").style("display", "block")
    d3.select("#svg-legend-donut").style("display", "none")
    d3.select(".legend-container").style("display", "none")

    currentViz = "line"
  }
})

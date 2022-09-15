//array comuni tot
const comuni = new Set(dataStranieri.map((d) => d.Parent))
const paesi = new Set(dataStranieri.map((d) => d.Paese))
const anni = new Set(dataStranieri.map((d) => d.Anno))

const comuniStrip = [
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
]

const dropdown = d3.select("#select-anno")
let selectedYear = 2014

dropdown
  .selectAll("option")
  .data(anni)
  .enter()
  .append("option")
  .text((d) => d)
  .attr("value", function (d) {
    return d
  })

//paesi stranieri without comuni federazione
const paesiStranieri = new Set([...paesi].filter((x) => !comuni.has(x)))

const width = 800
const height = 600

const margins = {
  top: 50,
  right: 50,
  bottom: 50,
  left: 60,
}

const groupSizeScale = d3.scaleSqrt().domain([0, 1500]).range([20, 60])

const svg = d3
  .select("#svg-container")
  .append("svg")
  .attr("id", "svg-viz")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", [0, 0, width, height])

const divButtons = d3
  .select("#buttons-container")
  .append("div")
  .attr("class", "svg-buttons")
  .style("display", "flex")
  .style("flex-flow", "row wrap")

///// TOOLTIPS

const Tooltip = d3
  .select("#viz-container")
  .append("div")
  .attr("class", "tooltip")
  .style("position", "absolute")
  .style("pointer-events", "none")

Tooltip.append("div").attr("class", "anno")
Tooltip.append("div").attr("class", "paese")
Tooltip.append("div").attr("class", "num")
Tooltip.append("g")
  .attr("class", "residenti-stranieri")
  .style("display", "flex")
  .style("justify-content", "space-between")

const residentiStranieri = Tooltip.select(".residenti-stranieri").append("div")
const pctStranieri = Tooltip.select(".residenti-stranieri").append("div")

function mouseover(d) {
  d3.select(this).style("stroke-width", 3)

  const rect = d.target.__data__

  const clientX = d.pageX
  const clientY = d.pageY

  const comune = rect.data.Parent
  const paese = rect.id

  let totStranieri = dataStranieri.filter(
    (d) => d.Id === comune && d.Anno === selectedYear && d.Paese === "Totale"
  )[0].Numero

  Tooltip.select("div.paese")
    .text(paese)
    .style("font-size", "16px")
    .style("font-family", "AtlasMedium")
    .style("color", "#00009c")

  Tooltip.select("div.num")
    .text(rect.data.Numero)
    .style("font-size", "16px")
    .style("font-weight", "600")

  residentiStranieri.text("% su totale stranieri: ")
  pctStranieri.text(
    ((parseInt(rect.data.Numero) / totStranieri) * 100).toFixed(2) + "%"
  )

  Tooltip.transition()
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

const mouseleave = function (d) {
  d3.select(".tooltip").transition().duration(80).style("display", "none")
  d3.select(this).style("stroke-width", 1)
}

const colorScale = d3
  .scaleOrdinal()
  .domain(
    Array.from(paesiStranieri)
      .sort()
      .filter((d) => d != "Totale")
  )
  .range([
    "#8dd3c7",
    "#ffffb3",
    "#bebada",
    "#fb8072",
    "#80b1d3",
    "#fdb462",
    "#b3de69",
    "#fccde5",
    "#d9d9d9",
    "#bc80bd",
    "#ccebc5",
    "#ffed6f",
    "#E49245",
    "#9FDDF1",
    "#9FF1C9",
    "#F67B6D",
  ])
let windowWidth = window.innerWidth
let windowHeight = window.innerHeight

//// DRAWDATA FUNCTION
function drawData(firstRender) {
  svg.selectAll("*").remove()
  window.innerWidth < 800
    ? svg.attr("viewBox", [0, 0, width, height * 2])
    : svg.attr("viewBox", [0, 0, width, height])
  try {
    function treefyingData(comune, dataForeign, year) {
      const data = dataForeign.filter(
        (d) => d.Id === comune && d.Anno === year && d.Paese != "Totale"
      )
      const totale = dataForeign.filter(
        (d) => d.Id === comune && d.Anno === year && d.Paese === "Totale"
      )[0].Numero

      window.innerWidth < 800
        ? groupSizeScale.range([50, 90])
        : groupSizeScale.range([20, 60])
      const side = groupSizeScale(totale)
      const root = d3
        .stratify()
        .id(function (d) {
          return d.Paese
        })
        .parentId(function (d) {
          return d.Parent
        })(data)
      root.sum(function (d) {
        return d.Numero
      })

      treemap = d3.treemap().size([side, side]).padding(1)

      treemap(root)

      return root
    }
  } catch {}

  let i = 0
  try {
    comuni.forEach((comune) => {
      const dataComune = treefyingData(comune, dataStranieri, 2014)

      const groups = svg
        .append("g")
        .attr("class", comune.split(" ").join(""))
        .attr("id", "treemap")
        .attr(
          "transform",
          window.innerWidth > 800
            ? `translate(${(i % 4) * 180 + 120},${
                Math.floor(i / 4) * 180 + 110
              }) rotate(225) `
            : `translate(${(i % 2) * 320 + 220},${
                Math.floor(i / 2) * 220 + 160
              }) rotate(225) `
        )

      groups
        .selectAll("g")
        .data(dataComune)
        .enter()
        .append("rect")
        .attr("class", (d) => d.id.split(" ").join(""))
        .attr("x", function (d) {
          return d.x0
        })
        .attr("y", function (d) {
          return d.y0
        })
        .attr("width", function (d) {
          return d.x1 - d.x0
        })
        .attr("height", function (d) {
          return d.y1 - d.y0
        })
        .style("stroke", "#00009c")
        .style("fill", (d) =>
          comuniStrip.includes(d.id.split(" ").join(""))
            ? "transparent"
            : colorScale(d.id.split(" ").join(""))
        )
        .style("pointer-events", "none")
        .on("mouseover", mouseover)
        .on("click", clickbuttons)
        .on("mouseleave", mouseleave)

      groups.select("." + comune).attr("pointer-events", "none")

      /// LABELS NOME COMUNE
      svg
        .select("g." + comune.split(" ").join(""))
        .append("text")
        .attr("x", -28)
        .attr("y", 40)
        .attr("transform", `translate(-6,-26)rotate(135)`)
        .text(function (d) {
          if (comune.split(" ").length === 1) {
            return comune
          } else {
            const textArray = comune.split(" ")
            return textArray[0] + " " + textArray[1]
          }
        })
        .style("fill", "#00009c")
        .style("font-family", "AtlasMedium")
        .append("tspan")
        .attr("x", -28)
        .attr("dy", "1.2em")
        .attr("transform", `rotate(135)`)
        .text(function (d, i) {
          if (comune.split(" ").length < 3) {
            return ""
          } else {
            const textArray = comune.split(" ")
            let secondRow = ""
            textArray[3] != undefined
              ? (secondRow += textArray[2] + " " + textArray[3])
              : (secondRow += textArray[2])

            return secondRow
          }
        })

      svg
        .select("g." + comune.split(" ").join(""))
        .append("text")
        .attr("x", 0)
        .attr("y", 30)
        .attr("transform", `translate(20,-20)rotate(135)`)
        .text(
          "tot " +
            dataStranieri.filter(
              (d) =>
                d.Id === comune &&
                d.Anno === selectedYear &&
                d.Paese === "Totale"
            )[0].Numero
        )
        .style("fill", "#00009c")
        .style("font-family", "Graphik")

      svg
        .select("g." + comune.split(" ").join(""))
        .append("text")
        .attr("x", 4)
        .attr("y", 46)
        .attr("transform", `translate(20,-20)rotate(135)`)
        .text(
          "(" +
            Number(
              100 *
                (dataStranieri.filter(
                  (d) =>
                    d.Id === comune &&
                    d.Anno === selectedYear &&
                    d.Paese === "Totale"
                )[0].Numero /
                  dataResidenti.filter(
                    (d) => d.nome == comune && d.anno == selectedYear
                  )[0].residenti)
            ).toFixed(2) +
            "%" +
            ")"
        )
        .style("fill", "#00009c")
        .style("font-size", 11)
        .style("font-family", "Graphik")

      i++
    })
  } catch {}

  firstRender === true
    ? svg
        .selectAll("rect")
        .style("opacity", 0)
        .transition()
        .style("opacity", 1)
        .delay((d, i) => i * 20)
        .duration(300)
        .style("pointer-events", "auto")
    : null
}

// BUTTONS
let stateButtons = []
const clickbuttons = function (d) {
  let citta
  d.target.localName === "rect"
    ? (citta = d.target.__data__.id.split(" ").join(""))
    : (citta = d.target.__data__.split(" ").join(""))

  if (stateButtons.length === 0) {
    stateButtons.push(citta)
    svg
      .selectAll("rect:not(." + citta + ")")
      .transition()
      .style("fill", "white")
    divButtons.select("#" + citta).style("border-color", "#00009c")
  } else if (
    stateButtons.length > 0 &&
    stateButtons.includes(citta) === false
  ) {
    stateButtons.push(citta)
    svg
      .selectAll("." + citta)
      .transition()
      .style("fill", colorScale(citta))
    divButtons.select("#" + citta).style("border-color", "#00009c")
  } else if (stateButtons.length === 1 && stateButtons.includes(citta)) {
    // stateButtons = stateButtons.filter((d) => d != citta)
    stateButtons = []
    paesiStranieri.forEach((d) => {
      svg
        .selectAll("." + d.split(" ").join(""))
        .transition()
        .style("fill", colorScale(d.split(" ").join("")))
        .style("fill-opacity", 1)

      divButtons.select("#" + citta).style("border-color", "#E7E7E7")
    })
  } else if (stateButtons.includes(citta) && stateButtons.length > 1) {
    stateButtons = stateButtons.filter((d) => d != citta)
    svg
      .selectAll("." + citta)
      .transition()
      .style("fill-opacity", 0)

    divButtons.select("#" + citta).style("border-color", "#E7E7E7")
  }
}

/// buttons divs
const buttonsGroups = divButtons
  .selectAll("g")
  .data(
    Array.from(paesiStranieri)
      .sort()
      .filter((d) => d != "Totale")
  )
  .enter()
  .append("g")
  .attr("class", "divbuttons")
  .attr("id", (d) => d.split(" ").join(""))
  .style("width", "auto")
  .on("click", clickbuttons)

buttonsGroups.append("svg").attr("width", 10).attr("height", 10)

//circles on buttons
buttonsGroups
  .select("svg")
  .append("circle")
  .attr("cx", 5)
  .attr("cy", 5)
  .attr("r", 5)
  .attr("transform", `translate(5px, 5px)`)
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

drawData(true)

///////////////////// DROPDOWN MANAGEMENT //////////////
d3.select("#select-anno").on("change", function (d) {
  selectedYear = parseInt(d3.select("#select-anno").property("value"))
  d3.selectAll(".divbuttons").style("border-color", "#E7E7E7")

  stateButtons = []
  d3.selectAll("#treemap").remove()
  function treefyingData(comune, dataForeign, year) {
    const data = dataForeign.filter(
      (d) => d.Id === comune && d.Anno === year && d.Paese != "Totale"
    )
    const totale = dataForeign.filter(
      (d) => d.Id === comune && d.Anno === year && d.Paese === "Totale"
    )[0].Numero

    window.innerWidth < 800
      ? groupSizeScale.range([50, 90])
      : groupSizeScale.range([20, 60])
    const side = groupSizeScale(totale)
    const root = d3
      .stratify()
      .id(function (d) {
        return d.Paese
      })
      .parentId(function (d) {
        return d.Parent
      })(data)
    root.sum(function (d) {
      return d.Numero
    })

    treemap = d3.treemap().size([side, side]).padding(1)

    treemap(root)

    return root
  }

  let i = 0
  comuni.forEach((comune) => {
    const dataComune = treefyingData(comune, dataStranieri, selectedYear)

    const groups = svg
      .append("g")
      .attr("class", comune.split(" ").join(""))
      .attr("id", "treemap")
      .attr(
        "transform",
        window.innerWidth > 800
          ? `translate(${(i % 4) * 180 + 120},${
              Math.floor(i / 4) * 180 + 110
            }) rotate(225) `
          : `translate(${(i % 2) * 320 + 220},${
              Math.floor(i / 2) * 220 + 160
            }) rotate(225) `
      )
    groups
      .selectAll("g")
      .data(dataComune)
      .enter()
      .append("rect")
      .attr("class", (d) =>
        Array.from(comuni).includes(d.id) ? "PAESE" : d.id.split(" ").join("")
      )
      .attr("x", function (d) {
        return d.x0
      })

      .attr("y", function (d) {
        return d.y0
      })
      .attr("width", function (d) {
        return d.x1 - d.x0
      })
      //.transition()
      .attr("height", function (d) {
        return d.y1 - d.y0
      })
      .style("stroke", "#00009c")
      .style("fill", (d) =>
        comuniStrip.includes(d.id.split(" ").join(""))
          ? "transparent"
          : colorScale(d.id.split(" ").join(""))
      )
      .on("mouseover", mouseover)
      .on("click", clickbuttons)
      .on("mouseleave", mouseleave)

    svg
      .selectAll("g")
      .style("opacity", 0)
      .transition()
      .style("opacity", 1)
      .delay((d, i) => i * 20)
      .duration(300)
      .style("pointer-events", "auto")

    /// LABELS NOME COMUNE
    svg
      .select("g." + comune.split(" ").join(""))
      .append("text")
      .attr("x", -28)
      .attr("y", 40)
      .attr("transform", `translate(-6,-26)rotate(135)`)
      .text(function (d) {
        if (comune.split(" ").length === 1) {
          return comune
        } else {
          const textArray = comune.split(" ")
          return textArray[0] + " " + textArray[1]
        }
      })
      .style("fill", "#00009c")
      .style("font-family", "AtlasMedium")
      .append("tspan")
      .attr("x", -28)
      .attr("dy", "1.2em")
      .attr("transform", `rotate(135)`)
      .text(function (d, i) {
        if (comune.split(" ").length < 3) {
          return ""
        } else {
          const textArray = comune.split(" ")
          let secondRow = ""
          textArray[3] != undefined
            ? (secondRow += textArray[2] + " " + textArray[3])
            : (secondRow += textArray[2])

          return secondRow
        }
      })

    svg
      .select("g." + comune.split(" ").join(""))
      .append("text")
      .attr("x", 0)
      .attr("y", 30)
      .attr("transform", `translate(20,-20)rotate(135)`)
      .text(
        "tot " +
          dataStranieri.filter(
            (d) =>
              d.Id === comune && d.Anno === selectedYear && d.Paese === "Totale"
          )[0].Numero
      )
      .style("fill", "#00009c")
      .style("font-family", "Graphik")

    svg
      .select("g." + comune.split(" ").join(""))
      .append("text")
      .attr("x", 4)
      .attr("y", 46)
      .attr("transform", `translate(20,-20)rotate(135)`)
      .text(
        "(" +
          Number(
            100 *
              (dataStranieri.filter(
                (d) =>
                  d.Id === comune &&
                  d.Anno === selectedYear &&
                  d.Paese === "Totale"
              )[0].Numero /
                dataResidenti.filter(
                  (d) => d.nome == comune && d.anno == selectedYear
                )[0].residenti)
          ).toFixed(2) +
          "%" +
          ")"
      )
      .style("fill", "#00009c")
      .style("font-size", 11)
      .style("font-family", "Graphik")

    i++
  })
})

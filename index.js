//Define Margin
const margin = { left: 120, right: 120, top: 120, bottom: 120 },
  width = window.innerWidth - margin.left - margin.right,
  height = window.innerHeight - margin.top - margin.bottom;

//Define SVG
const svg = d3
  .select("body")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("class", "container")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const projection = d3
  .geoMercator()
  // .scale(500)
  .center([28, 54])
  .scale(3000)
  .translate([width / 2, height / 2]);

const path = d3.geoPath().projection(projection);

const colorScheme = d3
  .scaleThreshold()

var x = d3
  .scaleLinear()
  .rangeRound([440, 700]);

const draw = prop =>
  d3.json("Belarus.json", function(error, topodata) {
    if (prop == 'density') {
      colorScheme.domain([0, 20, 40, 60, 80, 100]).range(d3.schemeRdPu[6]);
      x.domain([0,100]);
    } else if (prop == 'gdp') {
      colorScheme.domain([5, 6, 7, 8, 9, 10]).range(d3.schemeYlGn[6]);
      x.domain([5,10]);
    }
    [
      topojson.feature(topodata, topodata.objects.subdivisions).features
    ][0].forEach(el => console.log(`Subdivision: ${el.properties.NAME_1}\n→ Density: ${el.properties.density}\n→ GDP: ${el.properties.gdp}\n`));
    svg.append("g")
      .selectAll("path")
      .data(topojson.feature(topodata, topodata.objects.subdivisions).features)
      .enter()
      .append("path")
      .attr("fill", function(d) {
        return colorScheme(d.properties[prop]);
      })
      .attr("d", path);

    svg.append("path")
      .datum(topojson.feature(topodata, topodata.objects.subdivisions))
      .attr("fill", "none")
      .attr("stroke", "#fff")
      .attr("stroke-opacity", 0.8)
      .attr("d", path);
      var g = svg.append("g").attr("transform", `translate(0,0)`);

      g.selectAll("rect")
        .data(
          colorScheme.range().map(function(d) {
            d = colorScheme.invertExtent(d);
            if (d[0] == null) d[0] = x.domain()[0];
            if (d[1] == null) d[1] = x.domain()[1];
            return d;
          })
        )
        .enter()
        .append("rect")
        .attr("height", 8)
        .attr("x", d => x(d[0]))
        .attr("width", d=> x(d[1]) - x(d[0]))
        .attr("fill", d => colorScheme(d[0]));
      
      g.append("text")
        .attr("class", "caption")
        .attr("x", x.range()[0])
        .attr("y", -6)
        .attr("fill", "#000")
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text(prop == 'gdp' ? "GDP (In billions of $)" : "Population per square kilometre");
      
      g
        .call(
          d3.axisBottom(x)
            .tickSize(13)
            .tickValues(colorScheme.domain())
        )
        .select(".domain")
        .remove();
  });

  draw("density");

  let button = d3.select("button")

let toggle = false;
button.on("click", () => {
  d3.select(".container").html("")
  // svg.append("g")
  //     .attr("class", "container")
  //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  toggle ? draw("density") : draw("gdp");
  toggle = !toggle;
})

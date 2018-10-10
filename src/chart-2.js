import * as d3 from 'd3'

let margin = { top: 20, bottom: 20, left: 80, right: 80 }
let height = 300 - margin.top - margin.bottom
let width = 700 - margin.left - margin.right

let svg = d3
  .select('#chart-2')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`)

let xPositionScale = d3.scalePoint().range([0, width])

let pie = d3.pie().value(d => d.minutes)

let radius = 70

let arc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(radius)

let colorScale = d3.scaleOrdinal().range(['#fc8d59', '#ffffbf', '#91bfdb'])

d3.csv(require('./data/time-breakdown-all.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  let projects = datapoints.map(d => d.project)
  xPositionScale.domain(projects)

  let nested = d3
    .nest()
    .key(d => d.project)
    .entries(datapoints)

  svg
    .selectAll('.pie')
    .data(nested)
    .enter()
    .append('g')
    .attr('class', 'pie')
    .attr('transform', d => `translate(${xPositionScale(d.key)},${height / 2})`)
    .each(function(d) {
      let g = d3.select(this)

      g.selectAll('path')
        .data(pie(d.values))
        .enter()
        .append('path')
        .attr('d', d => arc(d))
        .attr('fill', d => colorScale(d.data.task))

      g.append('text')
        .text(d.key)
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'top')
        .attr('dy', height / 2 - 10)
    })
}

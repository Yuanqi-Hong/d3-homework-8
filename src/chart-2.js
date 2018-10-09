import * as d3 from 'd3'

let margin = { top: 30, bottom: 30, left: 100, right: 100 }
let height = 400 - margin.top - margin.bottom
let width = 600 - margin.left - margin.right

let svg = d3
  .select('#chart-2')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`)

// let angleScale = d3.scaleBand().range([0, Math.PI * 2])

let pie = d3.pie().value(d => d.minutes)

let radius = 150

let arc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(radius)

let colorScale = d3.scaleOrdinal().range(['#fc8d59', '#ffffbf', '#91bfdb'])

d3.csv(require('./data/time-breakdown-all.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  let nested = d3.nest().key(d => d.project).entries(datapoints)

  svg
    .selectAll('path')
    .data(pie(nested))
    .enter()
    .append('path')
    .attr('d', d => arc(d))
    .attr('fill', d => colorScale(d.data.task))

}

import * as d3 from 'd3'

let margin = { top: 30, bottom: 30, left: 100, right: 100 }
let height = 400 - margin.top - margin.bottom
let width = 600 - margin.left - margin.right

let svg = d3
  .select('#chart-1')
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

let labelArc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(radius*2 + 20)

let colorScale = d3.scaleOrdinal().range(['#fc8d59', '#ffffbf', '#91bfdb'])

d3.csv(require('./data/time-breakdown.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  let container = svg
    .append('g')
    .attr('transform', `translate(${width / 2},${height / 2})`)

  container
    .selectAll('path')
    .data(pie(datapoints))
    .enter()
    .append('path')
    .attr('d', d => arc(d))
    .attr('fill', d => colorScale(d.data.task))

  container
    .selectAll('label')
    .data(pie(datapoints))
    .enter()
    .append('text')
    .text(d => d.data.task)
    .attr('transform', d => `translate(${labelArc.centroid(d)})`)
    .attr('text-anchor', d => {
      if (d.startAngle > Math.PI) {
        return 'end'
      } else {
        return 'start'
      }
    })
}

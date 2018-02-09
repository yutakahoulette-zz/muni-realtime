import React, { Component } from 'react';
import * as d3 from 'd3'

class App extends Component {
  state = {
    staticMapElements: ['neighborhoods', 'freeways', 'arteries', 'streets'],
    neighborhoods: [],
    streets: [],
    freeways: [],
    arteries: [],
    routes: {},
    chartWidth: 800,
    chartHeight: 790
  }
  componentWillMount() {
    this.state.staticMapElements.forEach(name => {
      d3.json(this.mapPath(name), (err, resp) => {
        if (err) throw err
        this.setState({[name]: resp.features})
      })
    })
    d3.json(this.mapPath('routes'), (err, resp) => {
      if (err) throw err
      this.setState({routes: resp})
    })
  }
  mapPath(name) {
    return `/maps/simplified/${name}.json`
  }
  componentDidUpdate() {
    this.state.staticMapElements.forEach(name => {
      const svg = d3.select(this.refs[name])
      const data = this.state[name]
      svg.selectAll('path')
        .data(data)
        .enter()
        .append('path')
        .attr('d', d3.geoPath(this.projection()))
    })
    Object.keys(this.state.routes).forEach(name => {
      const data = this.state.routes[name]
      const svg = d3.select(this.refs[name])
      svg.selectAll('path')
        .data(data.features)
        .enter()
        .append('path')
        .attr('d', d3.geoPath(this.projection()))
        .attr('stroke', `#${data.color}`)
    })
  }
  projection() {
    const sfCoords = {
      lat: 37.7749,
      long: 122.4194
    }
    return d3.geoAlbers()
      .translate([this.state.chartWidth / 2, this.state.chartHeight / 2])
      .scale(270000)
      .rotate([sfCoords.long, 0.004])
      .center([-0.015, sfCoords.lat])
  }
  render() {
    return (
      <svg width={ this.state.chartWidth } 
           height={ this.state.chartHeight } 
           viewBox={`0 0 ${this.state.chartWidth} ${this.state.chartHeight}`}>
        {
          this.state.staticMapElements.map((name, i) => (
            <g ref={name} className={name} key={ `group-${name}-${ i }` }/>
          ))
        }
        {
          Object.keys(this.state.routes).map((name, i) => (
            <g ref={name} className='route' key={ `group-${name}-${ i }` }/>
          ))
        }
      </svg>
    )
  }
}

export default App;

import React, { Component } from 'react';
import * as d3 from 'd3'

class App extends Component {
  state = {
    staticMapElements: ['freeways', 'arteries', 'streets', 'neighborhoods'],
    neighborhoods: [],
    streets: [],
    freeways: [],
    arteries: [],
    chartWidth: 800,
    chartHeight: 790
  }
  componentDidMount() {
    this.state.staticMapElements.forEach(name => {
      d3.json(`/maps/simplified/${name}.json`, (err, resp) => {
        if (err) throw err
        this.setState({[name]: resp.features})
      })
    })
  }
  projection(d) {
    const sfCoords = {
      lat: 37.7749,
      long: 122.4194
    }
    const projection = d3.geoAlbers()
      .translate([this.state.chartWidth / 2, this.state.chartHeight / 2])
      .scale(270000)
      .rotate([sfCoords.long, 0.004])
      .center([-0.015, sfCoords.lat])
    return d3.geoPath().projection(projection)(d)
  }
  render() {
    return (
      <svg width={ this.state.chartWidth } 
           height={ this.state.chartHeight } 
           viewBox={`0 0 ${this.state.chartWidth} ${this.state.chartHeight}`}>
        {
          this.state.staticMapElements.map((name, i) => (
            <g className={name} key={ `group-${name}-${ i }` }>
              {
                this.state.streets.map((d,ii) => (
                  <path
                    key={ `path-${name}-${ ii }` }
                    d={ this.projection(d) }
                  />
                ))
              }
            </g>
          ))
        }
      </svg>
    )
  }
}

export default App;

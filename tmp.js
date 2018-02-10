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
    const getLocation = () => {
      const url = () => `http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=sf-muni&t=${(new Date()).getTime() - 15000}`
      d3.json(url(), (resp) => {
        if (!resp.vehicle) return
        resp.vehicle.forEach(v => {
          const vehicle = [v.lon, v.lat]
          const routes = {...this.state.routes}
          routes[v.routeTag].vehicle = vehicle
          this.setState({routes})
        })
      })
    }

    const tick = () => {
      window.setTimeout(() => {
        getLocation()
        tick()
      }, 15000)
    }

    this.state.staticMapElements.forEach(name => {
      d3.json(this.mapPath(name), (err, resp) => {
        if (err) throw err
        this.setState({[name]: resp.features})
      })
    })

    d3.json(this.mapPath('routes'), (err, resp) => {
      if (err) throw err
      this.setState({routes: resp})
      getLocation()
    })
  }
  mapPath(name) {
    return `/maps/simplified/${name}.json`
  }
  componentDidUpdate() {
    window.s = this.state
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
      const route = d3.select(this.refs[name])
      route.selectAll('path')
        .data(data.features)
        .enter()
        .append('path')
        .attr('d', d3.geoPath(this.projection()))
        .attr('stroke', `#${data.color}`)

      const vehicle = d3.select(this.refs[`${name}-vehicle`])
      if(data.vehicle && data.vehicle.length) {
        vehicle.selectAll('circle')
          .data(data.vehicle)
          .enter()
          .append('circle')
          .attr('cx', (d) => Number(this.projection()(d)[0]))
          .attr('cy', (d) => Number(this.projection()(d)[1]))
          .attr('r', 10)
          .attr('fill', `#${data.color}`)
      }
    })
  }
  projection() {
    const sfCoords = {
      lat: 37.7749,
      lon: 122.4194
    }
    return d3.geoAlbers()
      .translate([this.state.chartWidth / 2, this.state.chartHeight / 2])
      .scale(270000)
      .rotate([sfCoords.lon, 0.004])
      .center([-0.015, sfCoords.lat])
  }
  render() {
    return (
      <svg width={ this.state.chartWidth } 
           height={ this.state.chartHeight } 
           viewBox={`0 0 ${this.state.chartWidth} ${this.state.chartHeight}`}>
        {
          this.state.staticMapElements.map((name, i) => (
            <g ref={name} className={name} key={ `${name}-${ i }` }/>
          ))
        }
        {
          Object.keys(this.state.routes).map((name, i) => (
            <g key={`${name}-${i}`}>
              <g ref={name} className='route'/>
              <g ref={`${name}-vehicle`} className='vehicle'/>
            </g>
          ))
        }
      </svg>
    )
  }
}

export default App;

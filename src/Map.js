import React, { Component } from 'react'
import * as d3 from 'd3'
import Neighborhoods from './Neighborhoods'
import Routes from './Routes' 
import Vehicles from './Vehicles'
import Buttons from './Buttons'

class Map extends Component {
  state = {
    neighborhoods: [],
    routes: {},
    routesHidden: {},
    vehicles: {},
    vehiclesLoaded: false,
    chartWidth: 800,
    chartHeight: 750
  }

  componentDidMount() {

    // function to get vehicle locations and update state every 15 seconds
    const getLocations = () => {
      const url = () => `http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=sf-muni&t=${(new Date()).getTime() - 15000}`
      d3.json(url(), (resp) => {
        const vehicles = {...this.state.vehicles}
        if (!resp.vehicle) return
        resp.vehicle.forEach(v => {
          const id = v.id
          const vehicle = [v.lon, v.lat].map(Number)
          if (!vehicles[v.routeTag]) {
            vehicles[v.routeTag] = {}
          }
          vehicles[v.routeTag][id] = vehicle
        })
        this.setState({
          vehicles,
          vehiclesLoaded: true,
        })
      })
      window.setTimeout(() => { getLocations() }, 15000)
    }

    const mapPath = (name) => `/maps/simplified/${name}.json`

    // getting geojson for neighborhoods 
    d3.json(mapPath('neighborhoods'), (err, resp) => {
      if (err) throw err
      this.setState({neighborhoods: resp.features})
    })

    // getting geojson for routes
    // this data was preformatted with node 
    // (see package.json > npm run setup-maps)
    d3.json(mapPath('routes'), (err, resp) => {
      if (err) throw err
      const routesHidden = Object.keys(resp).reduce((obj, key) => {
        obj[key] = false
        return obj
      }, {})
      this.setState({
        routes: resp,
        routesHidden
      })
      // get vehicle locations after routes
      getLocations()
    })

  }

  projection() {
    const sfCoords = {
      lat: 37.7749,
      lon: 122.4194
    }
    return d3.geoAlbers()
      .translate([this.state.chartWidth / 2, this.state.chartHeight / 2])
      .scale(280000)
      .rotate([sfCoords.lon, 0.003])
      .center([-0.02, sfCoords.lat])
  }

  toggleRoute(routeName) {
    const routesHidden = {...this.state.routesHidden}
    routesHidden[routeName] = !routesHidden[routeName]
    this.setState({routesHidden})
  }

  toggleAllRoutes() {
    const routesHidden = {...this.state.routesHidden}
    Object.keys(this.state.routesHidden).forEach((routeName) => {
      routesHidden[routeName] = !routesHidden[routeName]
    })
    this.setState({routesHidden})
  }

  render() {
    return (
      <div className='container'>
        <h1>Muni realtime</h1>
        <svg width={ this.state.chartWidth } 
            height={ this.state.chartHeight } >
          <Neighborhoods data={this.state.neighborhoods} 
            projection={ d3.geoPath(this.projection())} />
          <Routes routes={this.state.routes} 
            routesHidden={this.state.routesHidden}
            projection={ d3.geoPath(this.projection())} />
          <Vehicles routes={this.state.routes} 
            routesHidden={this.state.routesHidden}
            vehicles={this.state.vehicles}
            projection={ this.projection()} />
        </svg>
        <p>{this.state.vehiclesLoaded ? '' : 'Loading vehicles...'}</p>
        <Buttons routes={this.state.routes} 
          routesHidden={this.state.routesHidden}
          toggleRoute={this.toggleRoute.bind(this)}
          toggleAllRoutes={this.toggleAllRoutes.bind(this)} />
      </div>
    )
  }
}

export default Map

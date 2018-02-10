import React, { Component } from 'react'
import * as d3 from 'd3'

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
    const getLocation = () => {
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
      window.setTimeout(() => {
        getLocation()
      }, 15000)
    }
    d3.json(this.mapPath('neighborhoods'), (err, resp) => {
      if (err) throw err
      this.setState({neighborhoods: resp.features})
    })
    d3.json(this.mapPath('routes'), (err, resp) => {
      if (err) throw err
      const routesHidden = Object.keys(resp).reduce((obj, key) => {
        obj[key] = false
        return obj
      }, {})
      this.setState({
        routes: resp,
        routesHidden
      })
      getLocation()
    })
  }

  mapPath(name) {
    return `/maps/simplified/${name}.json`
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
          {
            <g className='neighborhoods'>
              {
                this.state.neighborhoods.map((d,ii) => (
                  <path
                    key={ `neighborhoods-path-${ ii }` }
                    d={ d3.geoPath(this.projection())(d) }
                  />
                ))
              }
            </g>
          }
          {
            Object.keys(this.state.routes).map((key, i) => {
              const data = this.state.routes[key]
              return !data.features
                ? <g key={ `${key}-route-${ i }` }/>
                : <g className={`route ${key}`}  key={ `${key}-route-${ i }` }>
                    {
                      data.features.map((f,ii) => (
                        <path
                          key={ `${key}-route-path-${ ii }` }
                          d={ d3.geoPath(this.projection())(f) }
                          stroke={this.state.routesHidden[key] ? 'white' :`#${data.color}`}
                          strokeOpacity={this.state.routesHidden[key] ? '0' : '0.5'}
                        />
                      ))
                    }
                  </g>
            })
          }
          {
            Object.keys(this.state.vehicles).map((key, i) => {
              const data = this.state.vehicles[key]
              const color = this.state.routes[key].color
              const hidden = this.state.routesHidden[key]
              return !data 
                ? <g key={ `${key}-vehicles-${ i }` }/>
                : <g className='vehicles' key={ `${key}-vehicles-${ i }` }>
                    {
                      Object.keys(data).map((id,ii) => {
                        const coords = this.projection()(data[id])
                        return (
                            <circle
                            key={ `${id}-vehicles-path-${ ii }` }
                            r='4'
                            fill={`#${color}`}
                            cx={coords[0]}
                            cy={coords[1]}
                            fillOpacity={hidden ? '0' : '1'}
                          />
                        )
                      })
                    }
                  </g>
            })
          }
        </svg>
        <p>{this.state.vehiclesLoaded ? '' : 'Loading vehicles...'}</p>
        <div className='buttons'>
          <div className='buttonWrapper'>
            <button onClick={() => this.toggleAllRoutes()}>
              Toggle all routes
            </button>
          </div>
          {
            Object.keys(this.state.routes).map((key, i) => {
              const data = this.state.routes[key]
              return (
                <div className='buttonWrapper' key={`button-${i}`}>
                  <button style={{
                      borderColor: `#${data.color}`,
                      opacity: this.state.routesHidden[key] ? '0.2' : '1'
                    }}
                    onClick={() => this.toggleRoute(key)}>
                    {key}
                  </button>
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}

export default Map;

import React, { Component } from 'react'
import * as d3 from 'd3'

class Map extends Component {
  state = {
    neighborhoods: [],
    routes: {},
    chartWidth: 800,
    chartHeight: 750
  }

  componentDidMount() {
    const getLocation = () => {
      const url = () => `http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=sf-muni&t=${(new Date()).getTime() - 15000}`
      d3.json(url(), (resp) => {
        if (!resp.vehicle) return
        resp.vehicle.forEach(v => {
          const vehicle = [v.lon, v.lat].map(Number)
          const routes = {...this.state.routes}
          const vehicles = routes[v.routeTag].vehicles
          routes[v.routeTag].vehicles = (vehicles && vehicles.length)
            ? vehicles.concat([vehicle]) 
            : [vehicle]
          this.setState({routes})
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
      this.setState({routes: resp})
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
    const routes = {...this.state.routes}
    const route = routes[routeName]
    route.hidden = !route.hidden
    routes[routeName] = route
    this.setState({routes})
  }

  toggleAllRoutes() {
    Object.keys(this.state.routes).forEach((routeName) => this.toggleRoute(routeName))
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
              return !data.features || data.hidden
                ? <g key={ `${key}-route-${ i }` }/>
                : <g className='route' key={ `${key}-route-${ i }` }>
                    {
                      data.features.map((f,ii) => (
                        <path
                          key={ `${key}-route-path-${ ii }` }
                          d={ d3.geoPath(this.projection())(f) }
                          stroke={`#${data.color}`}
                        />
                      ))
                    }
                  </g>
            })
          }
          {
            Object.keys(this.state.routes).map((key, i) => {
              const data = this.state.routes[key]
              return !data.vehicles || data.hidden
                ? <g key={ `${key}-vehicles-${ i }` }/>
                : <g className='vehicles' key={ `${key}-vehicles-${ i }` }>
                    {
                      data.vehicles.map((v,ii) => {
                        return (
                            <circle
                            key={ `${key}-vehicles-path-${ ii }` }
                            r='4'
                            fill={`#${data.color}`}
                            cx={this.projection()(v)[0]}
                            cy={this.projection()(v)[1]}
                          />
                        )
                      })
                    }
                  </g>
            })
          }
        </svg>
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
                      opacity: data.hidden ? '0.2' : '1'
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

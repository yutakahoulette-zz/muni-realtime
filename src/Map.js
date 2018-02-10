import React, { PureComponent } from 'react';
import * as d3 from 'd3'

class Map extends PureComponent {
  state = {
    staticMapElements: ['neighborhoods'],
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
      const time = (new Date()).getTime() - 15000
      const url = (time) => `http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=sf-muni&t=${time}`
      d3.json(url(time), (resp) => {
        if (!resp.vehicle) return
        resp.vehicle.forEach(v => {
          const vehicle = [v.lon, v.lat].map(Number)
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
      tick()
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
      .scale(270000)
      .rotate([sfCoords.lon, 0.004])
      .center([-0.015, sfCoords.lat])
  }

  render() {
    return (
      <svg width={ this.state.chartWidth } 
           height={ this.state.chartHeight } >
        {
          this.state.staticMapElements.map((name, i) => (
            <g className={name} key={ `${name}-${ i }` }>
              {
                this.state[name].map((d,ii) => (
                  <path
                    key={ `${name}-path-${ ii }` }
                    d={ d3.geoPath(this.projection())(d) }
                  />
                ))
              }
            </g>
          ))
        }
        {
          Object.keys(this.state.routes).map((key, i) => {
            const data = this.state.routes[key]
            return !data.features || data.hide
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
            return !data.vehicle || data.hide
              ? <g key={ `${key}-vehicle-${ i }` }/>
              : <g className='vehicles' key={ `${key}-vehicles-${ i }` }>
                  {
                    data.vehicle.map((v,ii) => (
                      <circle
                        key={ `${key}-vehicle-path-${ ii }` }
                        d={ d3.geoPath(this.projection())(v) }
                        r='4'
                        fill={`#${data.color}`}
                        cx={this.projection()(data.vehicle)[0]}
                        cy={this.projection()(data.vehicle)[1]}
                      />
                    ))
                  }
                </g>
          })
        }
      </svg>
    )
  }
}

export default Map;

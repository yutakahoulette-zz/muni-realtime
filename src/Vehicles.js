import React from 'react'
import PropTypes from 'prop-types'

const Vehicles = ({routes, routesHidden, vehicles, projection}) =>
  Object.keys(vehicles).map((key, i) => {
    const data = vehicles[key]
    const color = routes[key].color
    const hidden = routesHidden[key]
    return !data
      ? <g key={`${key}-vehicles-${i}`} />
      : <g className='vehicles' key={`${key}-vehicles-${i}`}>
        {
            Object.keys(data).map((id, ii) => {
              const coords = projection(data[id])
              return (
                <circle
                  key={`${id}-vehicles-path-${ii}`}
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

Vehicles.propTypes = {
  routes: PropTypes.object.isRequired,
  routesHidden: PropTypes.object.isRequired,
  vehicles: PropTypes.object.isRequired,
  projection: PropTypes.func.isRequired
}

export default Vehicles

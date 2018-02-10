import React from 'react'
import PropTypes from 'prop-types'

const Routes = ({routes, routesHidden, projection}) =>
  Object.keys(routes).map((key, i) => {
    const data = routes[key]
    return !data.features
      ? <g key={`${key}-route-${i}`} />
      : <g className={`route ${key}`} key={`${key}-route-${i}`}>
        {
            data.features.map((f, ii) => (
              <path
                key={`${key}-route-path-${ii}`}
                d={projection(f)}
                stroke={routesHidden[key] ? 'white' : `#${data.color}`}
                strokeOpacity={routesHidden[key] ? '0' : '0.5'}
              />
            ))
          }
      </g>
  })

Routes.propTypes = {
  routes: PropTypes.object.isRequired,
  routesHidden: PropTypes.object.isRequired,
  projection: PropTypes.func.isRequired
}

export default Routes

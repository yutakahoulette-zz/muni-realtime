import React from 'react'
import PropTypes from 'prop-types'

const Buttons = ({toggleAllRoutes, toggleRoute, routes, routesHidden}) =>
  <div className='buttons'>
    <div className='buttonWrapper'>
      <button onClick={() => toggleAllRoutes()}>
        Toggle all routes
      </button>
    </div>
    {
      Object.keys(routes).map((key, i) => {
        const data = routes[key]
        return (
          <div className='buttonWrapper' key={`button-${i}`}>
            <button style={{
              borderColor: `#${data.color}`,
              opacity: routesHidden[key] ? '0.2' : '1'
            }}
              onClick={() => toggleRoute(key)}>
              {key}
            </button>
          </div>
        )
      })
    }
  </div>

Buttons.propTypes = {
  routes: PropTypes.object.isRequired,
  routesHidden: PropTypes.object.isRequired,
  toggleRoute: PropTypes.func.isRequired,
  toggleAllRoutes: PropTypes.func.isRequired
}

export default Buttons

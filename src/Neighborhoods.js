import React from 'react'
import PropTypes from 'prop-types'

const Neighborhoods = ({data, projection}) => (
  <g className='neighborhoods'>
    {
      data.map((d,ii) => (
        <path
          key={ `neighborhoods-path-${ ii }` }
          d={ projection(d) }
        />
      ))
    }
  </g>
)


Neighborhoods.propTypes = {
  data: PropTypes.array.isRequired,
  projection: PropTypes.func.isRequired
}

export default Neighborhoods

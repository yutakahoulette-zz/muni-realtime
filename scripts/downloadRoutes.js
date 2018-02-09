const fs = require('fs')
const request = require('request')
const {path} = require('./helpers')

const url = 'http://webservices.nextbus.com/service/publicJSONFeed?command=routeConfig&a=sf-muni'

const format = (accum, route) => {
  const features = route.path.reduce((arr, obj) => {
    const feature = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: obj.point.map(d => [d.lon, d.lat])
      }
    }
    return arr.concat([feature])
  }, [])
  accum[route.tag] = {
    title: route.title,
    tag: route.tag,
    color: route.color,
    features
  }
  return accum
}

console.log('downloading routes')

request(url, (err, resp) => {
  if (err) throw err
  console.log('formatting routes')
  const formatted = JSON.parse(resp.body).route.reduce(format, {})
  const writePath = path('simplified', 'routes')
  fs.writeFile(writePath, JSON.stringify(formatted), (err) => {
    if (err) throw err
    console.log('finished writing routes')
  })
})

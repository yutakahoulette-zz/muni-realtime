const fs = require('fs')
const {path, log} = require('./helpers')

const write = (data, fileName) => {
  const writePath = path('simplified', fileName)
  fs.writeFile(writePath, JSON.stringify(data), (err) => {
    if (err) throw err
    log('finished writing', fileName)
  })
}

const simplify = (data, fileName) => {
  log('simplifying', fileName)
  const rawFeatures = JSON.parse(data)['features']
  const simplifiedFeature = rawFeatures.reduce((arr, obj) => {
    const feature = {
      type: 'Feature',
      geometry: obj.geometry
    }
    return arr.concat([feature])
  }, [])
  return {
    type: 'FeaturesCollection',
    features: simplifiedFeature
  }
}

const readSimplifyWrite = (fileName) => {
  log('reading', fileName)
  fs.readFile(path('raw', fileName), 'utf8', (err, data) => {
    if (err) throw err
    const minimizedData = simplify(data, fileName)
    write(minimizedData, fileName)
  })
}

['neighborhoods', 'streets', 'arteries', 'freeways']
  .map(readSimplifyWrite)

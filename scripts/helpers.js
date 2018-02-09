const path = (dir, fileName) => `maps/${dir}/${fileName}.json`
const log = (action, fileName) => console.log(`${action} ${fileName}`)
module.exports = {log, path}

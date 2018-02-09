const path = (dir, fileName) => `public/maps/${dir}/${fileName}.json`
const log = (action, fileName) => console.log(`${action} ${fileName}`)
module.exports = {log, path}

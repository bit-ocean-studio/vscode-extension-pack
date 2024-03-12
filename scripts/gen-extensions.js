const fs = require('node:fs')

const filePath = 'scripts/meta.jsonc'

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Read file error: ' + err)
    return
  }

  // Remove comments
  const lines = data.split('\n')
  const jsonArray = lines.reduce((acc, line) => {
    const trimmedLine = line.trim()
    if (trimmedLine && !trimmedLine.startsWith('//')) {
      const cleanedLine = trimmedLine.split('//')[0].trim()
      const cleanedString = cleanedLine.replace(/["',]/g, '')
      acc.push(cleanedString)
    }
    return acc
  }, [])

  jsonArray.shift()
  jsonArray.pop()

  console.log(jsonArray)

  // Write contents
  const targetFilePath = 'package.json'
  fs.readFile(targetFilePath, 'utf8', (err, packageData) => {
    if (err) {
      console.error('Read target file error: ', err)
      return
    }

    const packageJson = JSON.parse(packageData)
    packageJson.extensionPack = jsonArray

    fs.writeFile(targetFilePath, JSON.stringify(packageJson, null, 2), 'utf8', (err) => {
      if (err) {
        console.error('Write target file error: ', err)
        return
      }
      console.log('Write successfully!')
    })
  })
})

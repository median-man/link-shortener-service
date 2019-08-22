const buildCreateUrl = ({ saveUrl }) => {
  return async baseUrl => {
    throw new Error(`"${baseUrl}" is not a valid URL.`)
  }
}

module.exports = buildCreateUrl

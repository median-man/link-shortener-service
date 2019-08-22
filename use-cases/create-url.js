const buildCreateUrl = ({ saveUrl, isValidUrl, createUrlCode, baseUrl }) => {
  return async (longUrl, date) => {
    if (isValidUrl(longUrl)) {
      const urlCode = createUrlCode()
      const shortUrl = `${baseUrl}/${urlCode}`
      const document = await saveUrl({
        longUrl,
        date,
        urlCode,
        shortUrl
      })
      return {
        longUrl: document.longUrl,
        date: document.date,
        urlCode: document.urlCode,
        shortUrl: document.shortUrl
      }
    }
    throw new Error(`"${longUrl}" is not a valid URL.`)
  }
}

module.exports = buildCreateUrl

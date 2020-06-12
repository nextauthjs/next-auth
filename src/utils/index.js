// Adapted from https://github.com/felixfong227/simple-cookie-parser/blob/master/index.js
const parseCookies = (string) => {
  // console.log(string);
  if (!string) {
    return {}
  }
  try {
    const object = {}
    const a = string.split(';')
    for (let i = 0; i < a.length; i++) {
      const b = a[i].split('=')
      if (b[0].length > 1 && b[1]) {
        object[b[0].trim()] = decodeURIComponent(b[1])
      }
    }
    return object
  } catch (error) {
    logger.error('CLIENT_COOKIE_PARSE_ERROR', error)
    return {}
  }
}

export { parseCookies }

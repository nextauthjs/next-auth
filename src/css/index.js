// To support serverless targets (which don't work if you try to read in things
// like CSS files at run time) this file is replaced in production builds with
// a function that returns compiled CSS (embedded as a string in the function).
import fs from 'fs'
import path from 'path'

const pathToCss = path.join(__dirname, '/index.css')
const css = fs.readFileSync(pathToCss, 'utf8')

export default () => css
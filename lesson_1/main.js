import { logger2 } from './logger/index.js'
// import { TYPE_LOG, TYPE_WARN, TYPE_ERROR } from './constants.js'
import * as constants from './constants.js'

console.log(constants);

logger2('Hello World', constants.TYPE_LOG)
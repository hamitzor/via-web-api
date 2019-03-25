import fs from 'fs'
import path from 'path'
import moment from 'moment'



class Logger {

  constructor(directory = "/var/log") {
    this.directory = directory
  }

  date = () => moment().format('DD_MM_YYYY')
  time = () => moment().format('LTS')
  path = () => path.resolve(this.directory, `${this.date()}.log`)


  info = (message) => {
    this.log(message)
  }

  error = (errorObject) => {
    this.log(`${errorObject.message}\nstacktrace: ${errorObject.stack}`)
  }

  log = async (message) => {
    const time = this.time()
    const path = this.path()

    fs.appendFile(path, `${time} - ${message}\n`,
      err => {
        if (err) {
          console.log(`Cannot log message '${message}'
          \nmessage=${err.message}
          \nstack=${err.stack} 
          \nto file ${path} 
          \nat ${time}`)
        }
      })
  }
}


export default Logger
import fs from "fs"
import path from "path"
import moment from "moment"
import clc from "cli-color"



class Logger {

  constructor(directory = "/var/log", supress = false) {
    this.directory = directory
    this.supress = supress
  }

  date = () => moment().format("DD_MM_YYYY")
  time = () => moment().format("LTS")
  path = () => path.resolve(this.directory, `${this.date()}.log`)


  info = (message) => {
    !this.supress && this.log(message)
  }

  error = (errorObject) => {
    !this.supress && this.log(`ERROR - ${errorObject.message}\nstacktrace: ${errorObject.stack}`)
  }

  log = async (message) => {
    const time = this.time()
    const path = this.path()

    !this.supress && fs.appendFile(path, `${time} : ${message}\n`,
      err => {
        if (err) {
          console.log(clc.red(
            `${time} : ERROR - Cannot log message 
          \n"${message}"
          \nto file ${path}.
          \nError Message=${err.message}
          \nStack=${err.stack}\n`
          ))
        }
      })
  }
}


export default Logger
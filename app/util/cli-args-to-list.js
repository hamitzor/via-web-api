/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */


class CLIArgsToList {
  constructor(options) {
    if (options) {
      this._commonArgs = options.commonArgs ? options.commonArgs : {}
    }
    else {
      this._commonArgs = {}
    }
  }

  convert = (args = {}) => {
    args = { ...this._commonArgs, ...args }

    return Object.keys(args).reduce((acc, argName) => {
      const argValue = args[argName]
      if (typeof argValue === "boolean" && argValue) {
        acc.push(`--${argName}`)
      }
      else {
        if (argValue && argValue !== "NaN") {
          acc.push(`--${argName}`, `${argValue}`)
        }
      }
      return acc
    }, [])
  }

}

export default CLIArgsToList
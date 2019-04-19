/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */


class OptionToStringConverter {
  constructor(commonOptions) {
    this._commonOptions = commonOptions ? commonOptions : {}
  }

  _stringifyOptions = (options) => Object.keys(options).reduce((acc, optionName) => {
    const optionValue = options[optionName]
    if (typeof optionValue === "boolean" && optionValue) {
      acc.push(`--${optionName}`)
    }
    else {
      if (optionValue && optionValue !== "NaN") {
        acc.push(`--${optionName}`, `${optionValue}`)
      }
    }
    return acc
  }, [])

  convert = (options) => this._stringifyOptions({ ...this._commonOptions, ...options })




}

export default OptionToStringConverter
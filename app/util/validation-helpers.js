const isUndefined = (val) => {
  return val === undefined
}

const isString = (val) => {
  return typeof val === "string"
}


const isFloat = (val) => {
  return Number(val) === val && val % 1 !== 0
}


export { isUndefined, isString, isFloat }
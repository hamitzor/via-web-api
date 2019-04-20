const createSetStatementAndValueArray = (data) => {
  let setStatement = "SET "
  let setData = []

  Object.keys(data).forEach(field => {
    setStatement += `${field} = ?,`
    setData.push(data[field])
  })

  setStatement = setStatement.substring(0, setStatement.length - 1)

  return [setStatement, setData]
}

export { createSetStatementAndValueArray }
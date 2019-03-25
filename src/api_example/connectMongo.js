import mongodb from 'mongodb'

export default async () => {
  const MongoClient = mongodb.MongoClient

  const url = 'mongodb://localhost:27017'

  try {
    const client = await MongoClient.connect(url, { useNewUrlParser: true })
    return client
  } catch (err) {
    throw err
  }
}
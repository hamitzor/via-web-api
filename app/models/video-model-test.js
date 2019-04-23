import VideoModel from "./video-model"


const test = async () => {

  const saveInfo = (await VideoModel.save({
    title: "Test Video",
    length: 123,
    extension: ".mp4",
    name: "test.mp4",
    size: 12345,
    path: "/tmp/asdfasfd.mp4",
    fps: 12.5,
    frame_count: 234,
    width: 200,
    height: 150,
    eqf_status: 0
  }))[0]

  console.log(saveInfo)

  const insertedId = saveInfo.insertId

  console.log((await VideoModel.fetchById(insertedId))[0])

  const deleteInfo = (await VideoModel.deleteById(insertedId))[0]

  console.log(deleteInfo)

  console.log((await VideoModel.fetchAll())[0])

  process.exit()
}

test()


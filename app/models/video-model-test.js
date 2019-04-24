import videoModel from "./video-model"


const test = async () => {

  const saveInfo = (await videoModel.save({
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

  const insertId = saveInfo.insertId

  console.log((await videoModel.fetchById(insertId))[0])

  const updateInfo = (await videoModel.updateById(insertId, {
    title: "Updated Video",
    eqf_status: 1
  }))[0]

  console.log(updateInfo)

  console.log((await videoModel.fetchById(insertId))[0])


  process.exit()
}

test()


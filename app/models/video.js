/**
 * @author kgnugur@gmail.com (Kagan Ugur)
 */

import db from "../util/database"

export default class Video {
  constructor(
    VideoId,
    CreationDate,
    Title,
    Length,
    Format,
    Name,
    Size,
    Path,
    FPS,
    TotalFrame,
    Width,
    Height
  ) {
    this.VideoId = VideoId
    this.CreationDate = CreationDate
    this.Title = Title
    this.Length = Length
    this.Format = Format
    this.Name = Name
    this.Size = Size
    this.Path = Path
    this.FPS = FPS
    this.TotalFrame = TotalFrame
    this.Width = Width
    this.Height = Height
  }

  save() {
    return db.execute(
      "INSERT INTO Videos (VideoId, CreationDate, Title, Length, Format, Name, Size, Path, FPS, TotalFrame, Width, Height) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        this.VideoId,
        this.CreationDate,
        this.Title,
        this.Length,
        this.Format,
        this.Name,
        this.Size,
        this.Path,
        this.FPS,
        this.TotalFrame,
        this.Width,
        this.Height
      ]
    )
  }

  static fetchAll() {
    return db.execute("SELECT * FROM Videos")
  }

  static fetchById(videoId) {
    return db.execute("SELECT * FROM `Videos` WHERE VideoId = ?", [videoId])
  }

  static deleteById(videoId) {
    return db.execute("DELETE FROM `Videos` WHERE VideoId = ?", [videoId])
  }
}

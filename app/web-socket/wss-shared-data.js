import { EventEmitter } from "events"

class SharedData extends EventEmitter {
  constructor() {
    super()
    this._data = {}
  }

  get = (name) => this._data[name]

  set = (name, value) => {
    this._data[name] = value
    this.emit("upgrade", name, value)
    this.emit("update", name, value)
  }

  delete = (name) => {
    delete this._data[name]
    this.emit("reduce", name, this._data[name])
    this.emit("update", name, this._data[name])
  }

}

export default SharedData
export default class WebSocketCannotSendMessageError extends Error {
  constructor(message, ...args) {
    super(message, ...args)
  }
}
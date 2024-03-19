export type MessageObject = {
    message: string,
    ok: boolean
    code?: 200 | 400 | 401 | 500
}
export const INITIAL_MESSAGE_OBJECT: MessageObject = {
  message: '',
  ok: false
}

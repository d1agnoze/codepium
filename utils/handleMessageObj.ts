import { MessageObject } from "@/types/message.route";

export const stateHandler = (
  state: MessageObject,
  onSuccess: () => void,
  onError: () => void,
) => {
  if (state.message === "") {
    return;
  }
  if (state.ok) {
    onSuccess();
  }
  if (!state.ok) {
    onError();
  }
};

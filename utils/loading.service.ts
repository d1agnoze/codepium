import { BehaviorSubject } from "rxjs";
export const loadingService = new BehaviorSubject<boolean>(false)
export const showLoading = () => {
  loadingService.next(true)
}
export const hideLoading = () => {
  loadingService.next(false)
}

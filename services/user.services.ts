import { User } from "@supabase/supabase-js";
import { BehaviorSubject } from "rxjs";

class UserService{
  user: BehaviorSubject<User | null>
  constructor(){
    this.user = new BehaviorSubject<User |null>(null)
  }
  get(){ return this.user }
  logout(){ this.user.next(null) }
  setUser(user : User){ this.user.next(user) }
}
const userService = new UserService()
export default userService

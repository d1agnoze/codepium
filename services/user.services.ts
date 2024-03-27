import { User } from "@supabase/supabase-js";
import { BehaviorSubject } from "rxjs";

const userService = new BehaviorSubject<User | null>(null);
export default userService;

import { POINT_SYS, POINT_SYS_GUARD } from "@/defaults/points.system";
import { toast } from "react-toastify";

/**
 * @class ReputationNotifier
 * NOTE: this class can only be used on client component
 *
 * */
export class ReputationNotifierService {
  /**
   *@method {static} guard_notify give a warning to the user about required points
   **/
  public static adder_notify(action: keyof typeof POINT_SYS) {
    toast.success(POINT_SYS[action] + " points added to your account");
  }
  /**
   *@method {static} adder_notify give a toast congrate user for added points
   **/
  public static guard_notify(action: keyof typeof POINT_SYS_GUARD) {
    toast.warn(
      "This action require at least " +
        POINT_SYS_GUARD[action] +
        " reputation points",
    );
  }
}

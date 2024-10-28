import { Router } from "express";
import {
  get_all_users,
  login_user,
  logout_user,
  signup_user,
} from "../../controllers/auth/authController.js";
import { verifyAuthToken } from "../../middlewares/verifyAuth.js";
const router = Router();

router.post("/signup", signup_user);
router.post("/signin", login_user);
router.post("/logout", verifyAuthToken, logout_user);
router.get("/all-users", get_all_users);

export default router;

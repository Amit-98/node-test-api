import r from "express";
const router = r();
import _authValidator from "./authReqValidator.js";
import _authController from "./authController.js";

router.post("/signup",
    _authValidator.authSignup,
    _authController.authSignup
);

router.post("/login",
    // _authValidator.authLogin,
    _authController.authLogin
);

export default router;
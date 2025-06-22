import r from "express";
const router = r();
//import _validator from "./userValidator.js";
import _controller from "./userController.js";

router.post("/edit",
    // _validator.userEdit,
    _controller.userEdit
);

router.get("/getbyid",
    // _validator.userEdit,
    _controller.userGetById
);

export default router;
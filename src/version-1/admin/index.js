import r from "express";
const router = r();
//import _validator from "./userValidator.js";
import _controller from "./adminController.js";


// contact us form api (Sent Mail also Admin Inquiries and User response can get);
router.post("/contactus",
    // _validator.userEdit,
    _controller.contactUs
);

export default router;
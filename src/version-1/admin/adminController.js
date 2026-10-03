import _queryBuilder from "./adminQueryBuilder.js";
import _commonMethods from "../../common/commonMethods.js";
import _queryHelper from "../../db/db-runner.js";
import _template from "../../common/template.js";
const fileName = "adminController.js";

const contactUs = async (req, res, next) => {
    try {
        console.log("ContactUs API called with body:", req.body);
        
        // 1. Save data in MongoDB
        const result = await _queryBuilder.contactUs(req);
        console.log("MongoDB Save Result:", result);
        if (result && result.status) {
            // 2. Send Emails Asynchronously (Save response will NOT be blocked)
            (async () => {
                try {
                    // (A) Admin Notification Email
                    const adminMail = _template.adminContactNotification(req.body);
                    await _commonMethods.sendEmail(adminMail);
                    // (B) User Auto-Reply Email (if valid email provided)
                    if (req.body.email) {
                        const userMail = _template.userAutoReply(req.body);
                        await _commonMethods.sendEmail(userMail);
                    }
                } catch (emailErr) {
                    console.error("Email Error (Background):", emailErr.message);
                }
            })();
            res.s = 1;
            res.m = "Inquiry submitted successfully. Confirmation email sent!";
            res.r = result?.data;
            return res.sendResult();
        } else {
            res.s = 0;
            res.m = "Failed to save contact inquiry";
            res.r = {};
            return res.sendResult();
        }
    } catch (err) {
        console.error("Error in contactUs:", err);
        return next(new Error(err));
    }
};

export default {
    contactUs
};
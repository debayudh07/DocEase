import { Router } from "express";
import { getConversation, sendMessage } from "../controllers/message.controllers.js";
import upload from "../middlewares/multer.middlewares.js"

const router = Router();

router.route('/conversation/:receiverId')
    .get(getConversation);

router.route('/send/:id')
    .post(upload.single('image'), sendMessage);

// router.route("/").get((req, res) => {
//     res.send("Chat API is running");
// });
// router.route("/send").post(sendMessage);
// router.route("/get").get(getMessages);
// router.route("/delete/:id").delete(deleteMessage);
// router.route("/update/:id").put(updateMessage);


export default router;
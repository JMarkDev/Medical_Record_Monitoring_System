const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

router.post('/add', notificationController.addNotification);
router.put('/update/:id', notificationController.updateNotification);
router.get("/user_id/:user_id", notificationController.getNotificationById);

module.exports = router;

const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

router.post("/send", messageController.sendMessage);
router.post("/send-meal", messageController.sendMessageMeal);
router.post("/confirm-to-ga", messageController.sendToGA);
router.post("/confirm-to-kitchen", messageController.sendToKitchen);
router.get("/status", messageController.getStatus);
router.get("/wa-groups", messageController.getWaGroups);

module.exports = router;

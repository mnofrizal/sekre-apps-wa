const messageService = require("../services/messageService");
const { BACK_END_URL } = require("../config/constants");
let fetch;
import("node-fetch").then((module) => {
  fetch = module.default;
});

const sendMessage = async (req, res) => {
  try {
    const { phone, template, templateData, message: directMessage } = req.body;

    if (!phone || (!template && !directMessage)) {
      return res.status(400).json({
        status: false,
        message:
          "Phone number and either template or direct message are required",
      });
    }

    if (template) {
      await messageService.sendTemplatedMessage(phone, template, templateData);
    } else {
      await messageService.sendDirectMessage(phone, directMessage);
    }

    res.status(200).json({
      status: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({
      status: false,
      message: "Failed to send message",
      error: error.message,
    });
  }
};

const sendMessageMeal = async (req, res) => {
  try {
    const {
      judulPekerjaan,
      subBidang,
      dropPoint,
      totalEmployees,
      employeeOrders,
      pic,
      picPhone,
      approvalToken,
    } = req.body;

    if (
      !judulPekerjaan ||
      !subBidang ||
      !dropPoint ||
      !totalEmployees ||
      !employeeOrders ||
      !pic ||
      !picPhone ||
      !approvalToken
    ) {
      return res.status(400).json({
        status: false,
        message: "Missing required fields for meal order",
      });
    }

    // Ensure fetch is loaded
    if (!fetch) {
      throw new Error("Fetch module not loaded yet");
    }

    // Fetch request details from API
    const response = await fetch(
      `${BACK_END_URL}/requests/approval/verify/${approvalToken}`
    );
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch request details");
    }

    const { requiredDate, requestDate } = data.data.request;

    await messageService.sendMealOrder({
      ...req.body,
      requiredDate,
      requestDate,
    });

    res.status(200).json({
      status: true,
      message: "Meal order message sent successfully to ASMAN",
    });
  } catch (error) {
    console.error("Error sending meal order message:", error);
    res.status(500).json({
      status: false,
      message: "Failed to send meal order message",
      error: error.message,
    });
  }
};

const sendToGA = async (req, res) => {
  try {
    const { groupId, approvalToken, employeeOrders } = req.body;

    if (!groupId) {
      return res.status(400).json({
        status: false,
        message: "Group Id is required",
      });
    }

    if (!approvalToken || !employeeOrders) {
      return res.status(400).json({
        status: false,
        message: "Missing required fields for send to GA",
      });
    }

    // Ensure fetch is loaded
    if (!fetch) {
      throw new Error("Fetch module not loaded yet");
    }

    // Fetch request details from API
    const response = await fetch(
      `${BACK_END_URL}/requests/approval/verify/${approvalToken}`
    );
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch request details");
    }

    const { requiredDate, requestDate } = data.data.request;

    await messageService.sendToGA({
      ...req.body,
      requiredDate,
      requestDate,
    });

    res.status(200).json({
      status: true,
      message: "Message sent successfully to GA",
    });
  } catch (error) {
    console.error("Error sending message to GA:", error);
    res.status(500).json({
      status: false,
      message: "Failed to send message to GA",
      error: error.message,
    });
  }
};

const sendToKitchen = async (req, res) => {
  try {
    const { groupId, approvalToken, employeeOrders } = req.body;

    if (!groupId) {
      return res.status(400).json({
        status: false,
        message: "Group Id is required",
      });
    }

    if (!approvalToken || !employeeOrders) {
      return res.status(400).json({
        status: false,
        message: "Missing required fields for send to kitchen",
      });
    }

    // Ensure fetch is loaded
    if (!fetch) {
      throw new Error("Fetch module not loaded yet");
    }

    // Fetch request details from API
    const response = await fetch(
      `${BACK_END_URL}/requests/approval/verify/${approvalToken}`
    );
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch request details");
    }

    const { requiredDate, requestDate } = data.data.request;

    await messageService.sendToKitchen({
      ...req.body,
      requiredDate,
      requestDate,
    });

    res.status(200).json({
      status: true,
      message: "Message sent successfully to kitchen",
    });
  } catch (error) {
    console.error("Error sending message to kitchen:", error);
    res.status(500).json({
      status: false,
      message: "Failed to send message to kitchen",
      error: error.message,
    });
  }
};

const getStatus = (req, res) => {
  try {
    const status = messageService.getClientStatus();
    res.status(200).json({
      status: true,
      data: { status },
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error getting status",
      error: error.message,
    });
  }
};

const getWaGroups = async (req, res) => {
  try {
    const groups = await messageService.getWhatsAppGroups();
    res.status(200).json({
      status: true,
      data: groups,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error getting WhatsApp groups",
      error: error.message,
    });
  }
};

const sendNotifStart = async (req, res) => {
  try {
    const {
      groupId,
      // approvalToken
    } = req.body;

    if (!groupId) {
      return res.status(400).json({
        status: false,
        message: "Group Id is required",
      });
    }

    // if (!approvalToken) {
    //   return res.status(400).json({
    //     status: false,
    //     message: "Approval token is required",
    //   });
    // }

    await messageService.sendStartNotification(req.body);

    res.status(200).json({
      status: true,
      message: "Start notification sent successfully",
    });
  } catch (error) {
    console.error("Error sending start notification:", error);
    res.status(500).json({
      status: false,
      message: "Failed to send start notification",
      error: error.message,
    });
  }
};

const sendNotifFinish = async (req, res) => {
  try {
    const { groupId } = req.body;

    if (!groupId) {
      return res.status(400).json({
        status: false,
        message: "Group Id is required",
      });
    }

    await messageService.sendFinishNotification(req.body);

    res.status(200).json({
      status: true,
      message: "Finish notification sent successfully",
    });
  } catch (error) {
    console.error("Error sending finish notification:", error);
    res.status(500).json({
      status: false,
      message: "Failed to send finish notification",
      error: error.message,
    });
  }
};

const sendNotifReject = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        status: false,
        message: "Phone number is required",
      });
    }

    await messageService.sendRejectNotification(req.body);

    res.status(200).json({
      status: true,
      message: "Reject notification sent successfully",
    });
  } catch (error) {
    console.error("Error sending reject notification:", error);
    res.status(500).json({
      status: false,
      message: "Failed to send reject notification",
      error: error.message,
    });
  }
};

module.exports = {
  sendMessage,
  sendMessageMeal,
  getStatus,
  sendToGA,
  sendToKitchen,
  sendNotifStart,
  sendNotifFinish,
  sendNotifReject,
  getWaGroups,
};

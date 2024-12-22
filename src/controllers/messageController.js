const { FRONT_END_URL } = require("../config/constants");
const client = require("../config/whatsapp");
const { compileTemplate } = require("../utils/messageTemplates");

const sendMessage = async (req, res) => {
  try {
    const {
      id,
      phone,
      template,
      templateData,
      message: directMessage,
    } = req.body;

    if (!phone || (!template && !directMessage)) {
      return res.status(400).json({
        status: false,
        message:
          "Phone number and either template or direct message are required",
      });
    }

    // Format the phone number
    const formattedPhone = phone.replace(/\D/g, "");

    // Check if the client is ready
    if (!client.info) {
      return res.status(400).json({
        status: false,
        message: "WhatsApp client is not ready",
      });
    }

    // Prepare the message
    let messageToSend;
    if (template) {
      try {
        messageToSend = compileTemplate(template, templateData);
      } catch (error) {
        return res.status(400).json({
          status: false,
          message: error.message,
        });
      }
    } else {
      messageToSend = directMessage;
    }

    // Send the message
    const chatId = formattedPhone + "@c.us";
    await client.sendMessage(chatId, messageToSend);

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
      id,
      phone,
      judulPekerjaan,
      subBidang,
      requiredDate,
      requestDate,
      dropPoint,
      totalEmployees,
      approvalToken,
    } = req.body;

    if (!phone) {
      return res.status(400).json({
        status: false,
        message: "Phone number is required",
      });
    }
    // Validate required fields
    if (
      !judulPekerjaan ||
      !subBidang ||
      !requiredDate ||
      !requestDate ||
      !dropPoint ||
      !totalEmployees ||
      !approvalToken
    ) {
      return res.status(400).json({
        status: false,
        message: "Missing required fields for meal order",
      });
    }

    // Format the phone number
    const formattedPhone = phone.replace(/\D/g, "");

    // Check if the client is ready
    if (!client.info) {
      return res.status(400).json({
        status: false,
        message: "WhatsApp client is not ready",
      });
    }

    const newRequiredDate = new Date(requiredDate);
    let formattedRequiredDate;
    const hour = newRequiredDate.getHours();
    if (hour >= 4 && hour < 8) {
      formattedRequiredDate = "SARAPAN";
    } else if (hour >= 8 && hour < 12) {
      formattedRequiredDate = "MAKAN SIANG";
    } else if (hour >= 12 && hour < 17) {
      formattedRequiredDate = "MAKAN SORE";
    } else {
      formattedRequiredDate = "MAKAN MALAM";
    }

    const formatedLink = `${FRONT_END_URL}/approval/${approvalToken}`;
    const formatedRequestDate = new Date(requestDate)
      .toLocaleString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "Asia/Jakarta",
        hour12: false,
      })
      .replace(/\./g, ":");

    // Prepare the message using pemesananMakanan template
    const templateData = {
      id,
      judulPekerjaan,
      subBidang,
      requiredDate: formattedRequiredDate,
      requestDate: formatedRequestDate,
      dropPoint,
      totalEmployees,
      approvalLink: formatedLink, // Add confirmation link
    };

    let messageToSend;
    try {
      messageToSend = compileTemplate("pemesananMakanan", templateData);
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message,
      });
    }

    // Send the message
    const chatId = formattedPhone + "@c.us";
    await client.sendMessage(chatId, messageToSend);

    res.status(200).json({
      status: true,
      message: "Meal order message sent successfully",
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
    const {
      id,
      phone,
      judulPekerjaan,
      subBidang,
      requiredDate,
      requestDate,
      dropPoint,
      totalEmployees,
      approvalToken,
    } = req.body;

    if (!phone) {
      return res.status(400).json({
        status: false,
        message: "Phone number is required",
      });
    }
    // Validate required fields
    if (!approvalToken) {
      return res.status(400).json({
        status: false,
        message: "Missing required fields for meal order",
      });
    }

    // Format the phone number
    const formattedPhone = phone.replace(/\D/g, "");

    // Check if the client is ready
    if (!client.info) {
      return res.status(400).json({
        status: false,
        message: "WhatsApp client is not ready",
      });
    }

    const newRequiredDate = new Date(requiredDate);
    let formattedRequiredDate;
    const hour = newRequiredDate.getHours();
    if (hour >= 4 && hour < 8) {
      formattedRequiredDate = "SARAPAN";
    } else if (hour >= 8 && hour < 12) {
      formattedRequiredDate = "MAKAN SIANG";
    } else if (hour >= 12 && hour < 17) {
      formattedRequiredDate = "MAKAN SORE";
    } else {
      formattedRequiredDate = "MAKAN MALAM";
    }

    const formatedLink = `${FRONT_END_URL}/approval/${approvalToken}`;
    const formatedRequestDate = new Date(requestDate)
      .toLocaleString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "Asia/Jakarta",
        hour12: false,
      })
      .replace(/\./g, ":");

    const templateData = {
      id,
      judulPekerjaan,
      subBidang,
      requiredDate: formattedRequiredDate,
      requestDate: formatedRequestDate,
      dropPoint,
      totalEmployees,
      approvalLink: formatedLink, // Add confirmation link
    };

    let messageToSend;
    try {
      messageToSend = compileTemplate("notifToGa", templateData);
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message,
      });
    }

    // Send the message
    const chatId = formattedPhone + "@c.us";
    await client.sendMessage(chatId, messageToSend);

    res.status(200).json({
      status: true,
      message: "Meal order message sent successfully",
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

const getStatus = (req, res) => {
  try {
    const status = client.info ? "connected" : "disconnected";
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

module.exports = {
  sendMessage,
  sendMessageMeal,
  getStatus,
  sendToGA,
};

const { FRONT_END_URL } = require("../config/constants");
const client = require("../config/whatsapp");
const { compileTemplate } = require("../utils/messageTemplates");

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
      phone,
      // groupId,
      judulPekerjaan,
      subBidang,
      requiredDate,
      requestDate,
      dropPoint,
      totalEmployees,
      approvalToken,
    } = req.body;

    console.log(req.body);

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
    const formattedPhone = phone.replace(/\D/g, "");
    const formatedLink = `${FRONT_END_URL}/approval/${approvalToken}`;
    const formatedRequestDate = new Date(requestDate).toLocaleDateString(
      "id-ID",
      {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );

    // Prepare the message using pemesananMakanan template
    const templateData = {
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
    const {
      groupId,
      judulPekerjaan,
      subBidang,
      requiredDate,
      requestDate,
      dropPoint,
      totalEmployees,
      approvalToken,
    } = req.body;

    if (!groupId) {
      return res.status(400).json({
        status: false,
        message: "Group Id is required",
      });
    }
    // Validate required fields
    if (!approvalToken) {
      return res.status(400).json({
        status: false,
        message: "Missing required fields for meal order",
      });
    }

    // // Format the phone number
    // const formattedPhone = phone.replace(/\D/g, "");

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
    const formatedRequestDate = new Date(requestDate).toLocaleDateString(
      "id-ID",
      {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
    const formatedLink = `${FRONT_END_URL}/approval/${approvalToken}`;

    // Prepare the message using pemesananMakanan template
    const templateData = {
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
    await client.sendMessage(groupId, messageToSend);

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

const sendToKitchen = async (req, res) => {
  try {
    const {
      groupId,
      judulPekerjaan,
      subBidang,
      requiredDate,
      requestDate,
      dropPoint,
      totalEmployees,
      approvalToken,
    } = req.body;

    if (!groupId) {
      return res.status(400).json({
        status: false,
        message: "Group Id is required",
      });
    }
    // Validate required fields
    if (!approvalToken) {
      return res.status(400).json({
        status: false,
        message: "Missing required fields for meal order",
      });
    }

    // // Format the phone number
    // const formattedPhone = phone.replace(/\D/g, "");

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

    const formatedRequestDate = new Date(requestDate).toLocaleDateString(
      "id-ID",
      {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
    const formatedLink = `${FRONT_END_URL}/delivery/${approvalToken}`;

    // Prepare the message using pemesananMakanan template
    const templateData = {
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
      messageToSend = compileTemplate("notifToKitchen", templateData);
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message,
      });
    }

    // Send the message
    await client.sendMessage(groupId, messageToSend);

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

const getWaGroups = async (req, res) => {
  try {
    // Get all chats
    const chats = await client.getChats();
    console.log(`Found ${chats.length} total chats`);

    // Debug full chat object
    // console.log("\nDebug: Examining full chat object of first chat:");
    const firstChat = chats[0];
    // console.log(JSON.stringify(firstChat, null, 2));

    // Filter groups using new method
    const groups = chats.filter((chat) => {
      // Check if it's a group by looking at various properties
      return (
        chat.name &&
        (chat.groupMetadata || // New property for groups
          chat.isGroup || // Legacy property
          chat.id?.server === "g.us" || // Group server identifier
          chat.id?._serialized?.endsWith("@g.us")) // Group ID format
      );
    });
    console.log(`\nFound ${groups.length} groups`);

    const groupList = groups.map((group) => ({
      id: group.id._serialized,
      name: group.name,
    }));

    res.status(200).json({
      status: true,
      data: groupList,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error getting WhatsApp groups",
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
  getWaGroups,
};

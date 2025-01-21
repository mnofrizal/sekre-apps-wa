const { FRONT_END_URL } = require("../config/constants");
const { MessageMedia } = require("whatsapp-web.js");
const client = require("../config/whatsapp");
const { compileTemplate } = require("../utils/messageTemplates");

class MessageService {
  formatPhoneNumber(phone) {
    let formattedPhone = phone.replace(/\D/g, "");
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "62" + formattedPhone.slice(1);
    } else if (formattedPhone.startsWith("+62")) {
      formattedPhone = formattedPhone.slice(1);
    }
    return formattedPhone;
  }

  getFormattedMealTime(requiredDate) {
    const newRequiredDate = new Date(requiredDate);
    const hour = newRequiredDate.getHours();
    if (hour >= 4 && hour < 8) {
      return "SARAPAN";
    } else if (hour >= 8 && hour < 12) {
      return "MAKAN SIANG";
    } else if (hour >= 12 && hour < 17) {
      return "MAKAN SORE";
    } else {
      return "MAKAN MALAM";
    }
  }

  formatRequestDate(requestDate) {
    return new Date(requestDate)
      .toLocaleDateString("id-ID", {
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
  }

  calculatePortions(employeeOrders) {
    return {
      ipPortion: employeeOrders.filter((order) => order.entity === "PLNIP")
        .length,
      ipsPortion: employeeOrders.filter((order) => order.entity === "IPS")
        .length,
      kopPortion: employeeOrders.filter((order) => order.entity === "KOP")
        .length,
      rsuPortion: employeeOrders.filter((order) => order.entity === "RSU")
        .length,
      mitraPortion: employeeOrders.filter((order) => order.entity === "MITRA")
        .length,
    };
  }

  validateClient() {
    if (!client.info) {
      throw new Error("WhatsApp client is not ready");
    }
  }

  async sendDirectMessage(phone, message) {
    this.validateClient();
    const formattedPhone = this.formatPhoneNumber(phone);
    const chatId = formattedPhone + "@c.us";
    await client.sendMessage(chatId, message);
  }

  async sendTemplatedMessage(phone, template, templateData) {
    const messageToSend = compileTemplate(template, templateData);
    await this.sendDirectMessage(phone, messageToSend);
  }

  async sendGroupMessage(groupId, template, templateData) {
    this.validateClient();
    const messageToSend = compileTemplate(template, templateData);
    await client.sendMessage(groupId, messageToSend);
  }

  async sendMealOrder(orderData) {
    const {
      id,
      phone,
      judulPekerjaan,
      subBidang,
      requiredDate,
      requestDate,
      dropPoint,
      totalEmployees,
      employeeOrders,
      pic,
      picPhone,
      approvalToken,
    } = orderData;

    const portions = this.calculatePortions(employeeOrders);
    const formattedRequiredDate = this.getFormattedMealTime(requiredDate);
    const formatedRequestDate = this.formatRequestDate(requestDate);
    const formatedLink = `${FRONT_END_URL}/approval/${approvalToken}`;

    const templateData = {
      id,
      judulPekerjaan,
      subBidang,
      requiredDate: formattedRequiredDate,
      requestDate: formatedRequestDate,
      dropPoint,
      totalEmployees,
      ...portions,
      pic,
      picPhone,
      approvalLink: formatedLink,
    };

    await this.sendTemplatedMessage(phone, "pemesananMakanan", templateData);
  }

  async sendToGA(orderData) {
    const {
      id,
      groupId,
      judulPekerjaan,
      subBidang,
      requiredDate,
      requestDate,
      dropPoint,
      totalEmployees,
      employeeOrders,
      pic,
      picPhone,
      approvalToken,
    } = orderData;

    const portions = this.calculatePortions(employeeOrders);
    const formattedRequiredDate = this.getFormattedMealTime(requiredDate);
    const formatedRequestDate = this.formatRequestDate(requestDate);
    const formatedLink = `${FRONT_END_URL}/approval/${approvalToken}`;

    const templateData = {
      id,
      judulPekerjaan,
      subBidang,
      requiredDate: formattedRequiredDate,
      requestDate: formatedRequestDate,
      dropPoint,
      totalEmployees,
      ...portions,
      pic,
      picPhone,
      approvalLink: formatedLink,
    };

    await this.sendGroupMessage(groupId, "notifToGa", templateData);
  }

  async sendToKitchen(orderData) {
    const {
      id,
      groupId,
      judulPekerjaan,
      subBidang,
      requiredDate,
      requestDate,
      dropPoint,
      totalEmployees,
      employeeOrders,
      pic,
      picPhone,
      approvalToken,
    } = orderData;

    const portions = this.calculatePortions(employeeOrders);
    const formattedRequiredDate = this.getFormattedMealTime(requiredDate);
    const formatedRequestDate = this.formatRequestDate(requestDate);
    const formatedLink = `${FRONT_END_URL}/delivery/${approvalToken}`;

    const templateData = {
      id,
      judulPekerjaan,
      subBidang,
      requiredDate: formattedRequiredDate,
      requestDate: formatedRequestDate,
      dropPoint,
      totalEmployees,
      ...portions,
      pic,
      picPhone,
      approvalLink: formatedLink,
    };

    await this.sendGroupMessage(groupId, "notifToKitchen", templateData);
  }

  getClientStatus() {
    return client.info ? "connected" : "disconnected";
  }

  async getWhatsAppGroups() {
    const chats = await client.getChats();
    const groups = chats.filter((chat) => {
      return (
        chat.name &&
        (chat.groupMetadata ||
          chat.isGroup ||
          chat.id?.server === "g.us" ||
          chat.id?._serialized?.endsWith("@g.us"))
      );
    });

    return groups.map((group) => ({
      id: group.id._serialized,
      name: group.name,
    }));
  }

  async sendStartNotification(data) {
    const {
      id,
      groupId,
      judulPekerjaan,
      subBidang,
      totalEmployees,
      requiredDate,
      dropPoint,
      pic,
    } = data;

    const formattedRequiredDate = this.getFormattedMealTime(requiredDate);

    const templateData = {
      id,
      judulPekerjaan,
      subBidang,
      totalEmployees,
      requiredDate: formattedRequiredDate,
      dropPoint,
      pic,
    };

    await this.sendGroupMessage(groupId, "notifStart", templateData);
  }

  async sendFinishNotification(data) {
    const {
      id,
      groupId,
      judulPekerjaan,
      subBidang,
      totalEmployees,
      requiredDate,
      dropPoint,
      pic,
      image,
    } = data;

    this.validateClient();
    const formattedRequiredDate = this.getFormattedMealTime(requiredDate);

    const templateData = {
      id,
      judulPekerjaan,
      subBidang,
      totalEmployees,
      requiredDate: formattedRequiredDate,
      dropPoint,
      pic,
    };

    const messageText = compileTemplate("notifFinish", templateData);

    try {
      if (image) {
        const media = new MessageMedia(
          "image/jpeg",
          image,
          "delivery-image.jpg"
        );
        await client.sendMessage(groupId, media, { caption: messageText });
      } else {
        await client.sendMessage(groupId, messageText);
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      throw new Error("Failed to send finish notification");
    }
  }
}

module.exports = new MessageService();

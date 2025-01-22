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

  getMealCategory = (date) => {
    const hours = new Date(date).getHours();

    // Breakfast 6 AM WIB (23:00 UTC previous day)
    if (hours >= 23 || hours < 5) {
      return "Sarapan";
    }
    // Lunch 12 PM WIB (5:00 UTC)
    else if (hours >= 5 && hours < 9) {
      return "Makan Siang";
    }
    // Afternoon meal 4 PM WIB (9:00 UTC)
    else if (hours >= 9 && hours < 17) {
      return "Makan Sore";
    }
    // Dinner 11:59 PM WIB (16:59 UTC)
    else if (hours >= 17 && hours < 23) {
      return "Makan Malam";
    }
    return ""; // fallback
  };

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

  formatMenuPesanan(employeeOrders) {
    // Group and count menu items across all orders
    const menuItems = [];
    employeeOrders.forEach((order) => {
      order.orderItems.forEach((item) => {
        if (item.menuItem.name === "CUSTOM") {
          // Handle custom menu items with notes
          menuItems.push(`${item.notes}`);
        } else {
          // Regular menu items
          const existingItem = menuItems.find(
            (i) => i.name === item.menuItem.name && !i.isCustom
          );
          if (existingItem) {
            existingItem.quantity += item.quantity;
          } else {
            menuItems.push({
              name: item.menuItem.name,
              quantity: item.quantity,
              isCustom: false,
            });
          }
        }
      });
    });

    // Format into strings
    const formattedItems = menuItems.map((item) => {
      if (typeof item === "string") {
        // Custom item already formatted
        return item;
      }
      // Regular menu item
      return `${item.quantity}x ${item.name}`;
    });

    // Join with commas
    return formattedItems.join(", ");
  }

  calculatePortions(employeeOrders) {
    const portions = {
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

    // Don't add Porsi text for 0 values
    Object.keys(portions).forEach((key) => {
      portions[key] = portions[key] > 0 ? portions[key] : 0;
    });

    return portions;
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
    const formattedRequiredDate = this.getMealCategory(requiredDate);
    const formatedRequestDate = this.formatRequestDate(requestDate);
    const formatedLink = `${FRONT_END_URL}/approval/${approvalToken}`;

    const menuPesanan = this.formatMenuPesanan(employeeOrders);
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
      menuPesanan,
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
    const formattedRequiredDate = this.getMealCategory(requiredDate);
    const formatedRequestDate = this.formatRequestDate(requestDate);
    const formatedLink = `${FRONT_END_URL}/approval/${approvalToken}`;

    const menuPesanan = this.formatMenuPesanan(employeeOrders);
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
      menuPesanan,
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
    const formattedRequiredDate = this.getMealCategory(requiredDate);
    const formatedRequestDate = this.formatRequestDate(requestDate);
    const formatedLink = `${FRONT_END_URL}/delivery/${approvalToken}`;

    const menuPesanan = this.formatMenuPesanan(employeeOrders);
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
      menuPesanan,
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

    const formattedRequiredDate = this.getMealCategory(requiredDate);

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
    const formattedRequiredDate = this.getMealCategory(requiredDate);

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

  async sendRejectNotification(data) {
    const {
      id,
      phone,
      groupId,
      judulPekerjaan,
      subBidang,
      totalEmployees,
      requiredDate,
      dropPoint,
      pic,
    } = data;

    this.validateClient();
    const formattedRequiredDate = this.getMealCategory(requiredDate);

    const templateData = {
      id,
      judulPekerjaan,
      subBidang,
      totalEmployees,
      requiredDate: formattedRequiredDate,
      dropPoint,
      pic,
    };

    try {
      // Send direct message to supervisor/PIC
      await this.sendTemplatedMessage(phone, "notifReject", templateData);

      // If groupId exists, also send to group
      if (groupId) {
        await this.sendGroupMessage(groupId, "notifReject", templateData);
      }
    } catch (error) {
      console.error("Error sending reject notification:", error);
      throw new Error("Failed to send reject notification");
    }
  }
}

module.exports = new MessageService();

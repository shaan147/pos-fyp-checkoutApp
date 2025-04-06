// constants/ApiConstants.js
export const API_URL = "http://your-api-endpoint.com/api";
export const IMAGE_RECOGNITION_URL =
  "http://192.168.1.15:8000/api/recognition/recognize";
export const ROLES = {
  CUSTOMER: "customer",
  CASHIER: "cashier",
  MANAGER: "manager",
  ADMIN: "admin",
};

export const PAYMENT_METHODS = {
  CASH: "cash",
  CARD: "card",
  MOBILE_WALLET: "mobile_wallet",
  BANK_TRANSFER: "bank_transfer",
};

export const ORDER_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const PAYMENT_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
  REFUNDED: "refunded",
};

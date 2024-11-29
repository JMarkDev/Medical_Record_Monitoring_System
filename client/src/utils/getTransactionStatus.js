import transactionStatus from "../constants/transactionStatus";

export const getTransactionStatus = (status) => {
  let statusText = "";
  switch (status) {
    case transactionStatus.unpaid:
      statusText = "Unpaid";
      break;
    case transactionStatus.paid:
      statusText = "Paid";
      break;
    case transactionStatus.partial:
      statusText = "Partial";
      break;
    default:
      break;
  }
  return statusText;
};

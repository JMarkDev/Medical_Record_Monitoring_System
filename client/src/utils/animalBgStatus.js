import transactionStatus from "../constants/transactionStatus";

export const getBgColor = (status) => {
  let bgColor = "";
  switch (status) {
    case transactionStatus.paid:
      bgColor = "bg-green-500";
      break;
    case transactionStatus.unpaid:
      bgColor = "bg-red-500";
      break;
    case transactionStatus.partial:
      bgColor = "bg-blue-500";
      break;
    default:
      break;
  }
  return bgColor;
};

import statusList from "../constants/statusList";

export const getStatus = (status) => {
  let facultyStatus;
  switch (status) {
    case statusList.pending:
      facultyStatus = "pending";
      break;
    case statusList.verified:
      facultyStatus = "verified";
      break;
    case statusList.approved:
      facultyStatus = "approved";
      break;
    default:
      break;
  }
  return facultyStatus;
};

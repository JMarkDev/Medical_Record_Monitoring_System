import rolesList from "../constants/rolesList";

export const getUserRole = (role) => {
  let userRole;

  switch (role) {
    case rolesList.admin:
      userRole = "Admin";
      break;
    case rolesList.doctor:
      userRole = "Doctor";
      break;
    case rolesList.nurse:
      userRole = "Nurse";
      break;
    default:
      break;
  }
  return userRole;
};

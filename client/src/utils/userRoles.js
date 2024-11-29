import rolesList from "../constants/rolesList";

export const getUserRole = (role) => {
  let userRole;

  switch (role) {
    case rolesList.admin:
      userRole = "Admin";
      break;
    case rolesList.supervisor:
      userRole = "Supervisor";
      break;

    default:
      break;
  }
  return userRole;
};

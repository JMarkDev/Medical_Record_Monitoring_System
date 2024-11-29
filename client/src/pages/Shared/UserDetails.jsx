import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  clearUser,
  fetchUserById,
  getFetchedUserById,
} from "../../services/usersSlice";
import { useEffect, useState } from "react";
import axios from "../../api/axios";

const UserProfile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const user = useSelector(getFetchedUserById);
  const [profilePic, setProfilePic] = useState(
    "https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"
  );
  const [data, setData] = useState({
    image: "",
    firstName: "",
    middleInitial: "",
    lastName: "",
    email: "",
    role: "",
    contactNumber: "",
    address: "",
  });

  useEffect(() => {
    dispatch(fetchUserById(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (user) {
      setData(user);
      dispatch(clearUser());
    }
  }, [user, id, dispatch]);

  useEffect(() => {
    if (data.image) {
      setProfilePic(`${axios.defaults.baseURL}${data.image}`);
    }
  }, [data]);

  return (
    <>
      {/* <div className="flex items-center gap-5">
        <Back />
        <h1 className="font-bold md:text-2xl text-lg text-gray-900">
          {" "}
          User Details
        </h1>
      </div> */}

      <div className="flex text-sm flex-col lg:flex-row w-full gap-5">
        <div className="flex flex-col gap-3 justify-center items-center p-4 bg-white border border-gray-300 shadow-lg min-w-[250px] h-fit rounded-lg">
          <img className="w-32 h-32 rounded-full" src={profilePic} alt="" />
          <h1 className="font-bold text-lg text-gray-800 text-center">{`${data.firstName} ${data.middleInitial}. ${data.lastName}`}</h1>
          <span className="text-gray-700 md:text-md text-sm">
            {data?.email}
          </span>
        </div>
        <div className="flex flex-col flex-grow md:border md:border-gray-300 md:shadow-lg rounded-lg">
          <div className="py-6  md:px-4 text-gray-600">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-5">
                <label
                  htmlFor=""
                  className="text-md font-semibold text-gray-700 w-1/4"
                >
                  First name
                </label>
                <input
                  className="rounded-lg border-2 bg-gray-200 border-gray-200 flex-grow p-2 text-sm"
                  type="text"
                  disabled={true}
                  value={`${data?.firstName || ""}`}
                />
              </div>
              <div className="flex items-center gap-5">
                <label
                  htmlFor=""
                  className="text-md font-semibold text-gray-700 w-1/4"
                >
                  Last name
                </label>
                <input
                  className="rounded-lg border-2 bg-gray-200 border-gray-200 flex-grow p-2 text-sm"
                  type="text"
                  disabled={true}
                  value={`${data?.lastName || ""}`}
                />
              </div>
              <div className="flex items-center gap-5">
                <label
                  htmlFor=""
                  className="text-md font-semibold text-gray-700 w-1/4"
                >
                  Full name
                </label>
                <input
                  className="rounded-lg border-2 bg-gray-200 border-gray-200 flex-grow p-2 text-sm"
                  type="text"
                  disabled={true}
                  value={`${data?.middleInitial || ""}`}
                />
              </div>
              <div className="flex items-center gap-5">
                <label
                  htmlFor=""
                  className="text-md font-semibold text-gray-700 w-1/4"
                >
                  Contact number
                </label>
                <input
                  className="rounded-lg border-2 bg-gray-200 border-gray-200 flex-grow p-2 text-sm"
                  type="text"
                  disabled={true}
                  value={data?.contactNumber || ""}
                />
              </div>
              <div className="flex items-center gap-5">
                <label
                  htmlFor=""
                  className="text-md font-semibold text-gray-700 w-1/4"
                >
                  Email
                </label>
                <input
                  className="rounded-lg border-2 bg-gray-200 border-gray-200 flex-grow p-2 text-sm"
                  type="text"
                  disabled={true}
                  value={data?.email || ""}
                />
              </div>
              <div className="flex items-center gap-5">
                <label
                  htmlFor=""
                  className="text-md font-semibold text-gray-700 w-1/4"
                >
                  Address
                </label>
                <input
                  className="rounded-lg border-2 bg-gray-200 border-gray-200 flex-grow p-2 text-sm"
                  type="text"
                  disabled={true}
                  value={data?.address || ""}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;

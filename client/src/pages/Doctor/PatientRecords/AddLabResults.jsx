import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../../api/axios";
import PropTypes from "prop-types";
import { MdDeleteOutline } from "react-icons/md";
import { useToast } from "../../../hooks/useToast";
import Loader from "../../../components/loader/loginloader/LoginLoading";
import { getUserData } from "../../../services/authSlice";

const AddLabResults = ({ isOpen, onClose, id }) => {
  const toast = useToast();
  const user = useSelector(getUserData);
  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [testName, setTestName] = useState("");
  const [description, setDescription] = useState("");
  // const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setPatientId(id);
      setDoctorId(user.id);
      setDoctorName(
        `${user.firstName} ${user.middleInitial}. ${user.lastName}`
      );
    }
  }, [user, id]);

  const handleDeleteFile = (fileName) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileName)
    );
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const formData = new FormData();
    formData.append("patientId", patientId);
    formData.append("doctorId", doctorId);
    formData.append("doctorName", doctorName);
    formData.append("testName", testName);
    formData.append("description", description);
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("files", selectedFiles[i]);
    }

    try {
      const response = await api.post("/lab-results/add-lab-results", formData);
      if (response.data.status === "success") {
        toast.success(response.data.message);
        onClose();
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error adding lab result:", error);
    }
  };

  const closeModal = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex overflow-y-auto items-center justify-center z-50 bg-gray-800 bg-opacity-50">
      <div className="bg-white relative rounded-lg w-full  max-w-xl  overflow-hidden mx-5">
        {/* Loader */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center  bg-opacity-75 z-50">
            <Loader />
          </div>
        )}
        <div className="flex flex-col max-h-[600px] overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-semibold">Add Lab Results</h2>
          </div>

          {/* Body */}
          <div className="px-6 py-4 overflow-y-auto flex-grow">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Test Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Test Name
                </label>
                <input
                  type="text"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  required
                  placeholder="Enter test name, e.g., Blood Test"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  required
                  placeholder="Provide details, e.g., Test results show..."
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                />
              </div>

              {/* File Upload */}
              <div>
                <div className="mb-5">
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-6 h-6 text-gray-500 dark:text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PDF, PPT, DOC, DOCX, CSV, JPEG, PNG, GIF
                        </p>
                      </div>
                      <input
                        id="dropzone-file"
                        multiple
                        name="files"
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {selectedFiles?.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {selectedFiles?.map((file, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between text-gray-900 dark:text-white text-sm font-medium"
                        >
                          {file.name}
                          <button
                            type="button"
                            onClick={() => handleDeleteFile(file.name)}
                            className="text-red-500 font-bold text-lg"
                          >
                            <MdDeleteOutline />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

AddLabResults.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
};

export default AddLabResults;

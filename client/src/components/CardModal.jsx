import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useFormat } from "../hooks/useFormatDate";
import NoData from "./NoData";

const CardModal = ({ isOpen, closeModal, card }) => {
  const { dateFormat } = useFormat();
  const [documents, setDocuments] = useState([]);
  const [officeList, setOfficeList] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);

  useEffect(() => {
    if (
      card.title === "Total Documents" ||
      card.title === "Completed Documents" ||
      card.title === "Incoming Documents" ||
      card.title === "Delayed Documents" ||
      card.title === "Received Documents" ||
      card.title === "Uploaded Documents"
    ) {
      setDocuments(card.documents);
    } else if (card.title === "Total Offices") {
      setOfficeList(card.data);
    } else if (card.title === "Total Faculty") {
      setFacultyList(card.data);
    } else if (card.title === "Total Documents types") {
      setDocumentTypes(card.data);
    }
  }, [card]);

  if (!isOpen) return null;

  const handleDownload = () => {
    const headers = [
      "Tracking Number",
      "Document Name",
      "Document Type",
      "Uploaded By",
      "Contact Number",
      "ESU Campus",
      "Date Submitted And Time",
    ];

    const formatFieldCsv = (field) => {
      if (/[,]/.test(field)) {
        return `"${field}"`;
      }

      return field;
    };

    const dataRows = documents.map((response) => {
      return [
        formatFieldCsv(response.tracking_number),
        formatFieldCsv(response.document_name),
        formatFieldCsv(response.document_type),
        formatFieldCsv(response.uploaded_by),
        formatFieldCsv(response.contact_number),
        formatFieldCsv(
          response.esuCampus !== "null" ? response.esuCampus : "N/A"
        ),
        formatFieldCsv(dateFormat(response.createdAt)),
      ];
    });

    const csvContent = [headers, ...dataRows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "Documents_Reports.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadOffices = () => {
    const headers = ["Office Name", "Date"];

    const formatFieldCsv = (field) => {
      if (/[,]/.test(field)) {
        return `"${field}"`;
      }

      return field;
    };

    const dataRows = officeList.map((response) => {
      return [
        formatFieldCsv(response.officeName),
        formatFieldCsv(dateFormat(response.createdAt)),
      ];
    });

    const csvContent = [headers, ...dataRows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "Office_Reports.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadTypes = () => {
    const headers = ["Document Type", "Deadline", "Date"];

    const formatFieldCsv = (field) => {
      if (/[,]/.test(field)) {
        return `"${field}"`;
      }

      return field;
    };

    const dataRows = documentTypes.map((response) => {
      return [
        formatFieldCsv(response.document_type),
        formatFieldCsv(response.deadline || "N/A"),
        formatFieldCsv(dateFormat(response.createdAt)),
      ];
    });

    const csvContent = [headers, ...dataRows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "Document_Types_Reports.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadFaculty = () => {
    const headers = ["Full Name", "ESU Campus", "Designation", "Date"];

    const formatFieldCsv = (field) => {
      if (/[,]/.test(field)) {
        return `"${field}"`;
      }

      return field;
    };

    const dataRows = facultyList.map((response) => {
      return [
        formatFieldCsv(
          `${response.firstName} ${response.middleInitial} ${response.lastName}`
        ),
        formatFieldCsv(response.esuCampus),
        formatFieldCsv(response.designation),
        formatFieldCsv(dateFormat(response.createdAt)),
      ];
    });

    const csvContent = [headers, ...dataRows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "Faculty_Reports.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  const renderNoData = () => (
    <div className="p-6 space-y-4 text-sm text-[#221f1f]">
      <NoData />
    </div>
  );

  return (
    <div
      id="default-modal"
      tabIndex="-1"
      aria-hidden={!isOpen}
      className="fixed overflow-y-auto overflow-hidden  inset-0 z-50 px-5 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-40 font-normal"
    >
      <div className="relative w-full max-w-5xl max-h-full py-5 ">
        <div className="relative text-gray-800 bg-white rounded-xl shadow-lg">
          {/* <div className="flex items-center p-6"> */}
          <button
            type="button"
            className="absolute right-2 top-2 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-6 h-6 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            onClick={() => closeModal(false)}
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>
          {/* </div> */}

          {(card.title === "Total Documents" ||
            card.title === "Completed Documents" ||
            card.title === "Incoming Documents" ||
            card.title === "Delayed Documents" ||
            card.title === "Received Documents" ||
            (card.title === "Uploaded Documents" && documents.length === 0)) &&
          documents.length === 0 ? (
            renderNoData()
          ) : (
            <>
              {documents.length > 0 && (
                <div className="p-6  overflow-x-auto space-y-4 text-sm text-[#221f1f]">
                  <div className="space-y-6 ">
                    {documents &&
                      Array.isArray(card.documents) &&
                      documents.length > 0 && (
                        <div>
                          <h3 className="text-xl font-semibold text-gray-700 mb-4">
                            Document List
                          </h3>
                          <table className="w-full overflow-x-auto table-auto border-collapse">
                            <thead>
                              <tr>
                                <th className="py-2 px-4 border-b text-left text-nowrap text-gray-600">
                                  Tracking Number
                                </th>
                                <th className="py-2 px-4 border-b text-left text-nowrap text-gray-600">
                                  Document Name
                                </th>
                                <th className="py-2 px-4 border-b text-left text-nowrap text-gray-600">
                                  Document Type
                                </th>

                                <th className="py-2 px-4 border-b text-left text-nowrap text-gray-600">
                                  Uploaded By
                                </th>
                                <th className="py-2 px-4 border-b text-left  text-nowrap text-gray-600">
                                  Date
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {documents.map((doc) => (
                                <tr key={doc.id}>
                                  <td className="py-2 px-4 border-b text-nowrap text-gray-700">
                                    {doc.tracking_number}
                                  </td>
                                  <td className="py-2 px-4 border-b text-nowrap text-gray-700">
                                    {doc.document_name}
                                  </td>
                                  <td className="py-2 px-4 border-b text-nowrap text-gray-700">
                                    {doc.document_type}
                                  </td>
                                  <td className="py-2 px-4 border-b  text-nowrap text-gray-700">
                                    {doc.uploaded_by}
                                  </td>
                                  <td className="py-2 px-4 border-b text-nowrap text-gray-700">
                                    {dateFormat(doc.createdAt)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                  </div>
                  <div>
                    <div className="flex justify-end gap-3 border-t border-gray-200">
                      <button
                        className="text-sm rounded-lg  bg-gray-500 text-white py-2 px-6  hover:bg-gray-700"
                        onClick={closeModal}
                      >
                        Close
                      </button>
                      <button
                        onClick={() => handleDownload()}
                        className="text-sm text-white px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-700"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {card.title === "Total Offices" && officeList.length === 0 ? (
            renderNoData()
          ) : (
            <>
              {officeList.length > 0 && (
                <div className="p-6  overflow-x-auto space-y-4 text-sm text-[#221f1f]">
                  <div className="space-y-6 ">
                    {officeList &&
                      Array.isArray(officeList) &&
                      officeList.length > 0 && (
                        <div>
                          <h3 className="text-xl font-semibold text-gray-700 mb-4">
                            Office List
                          </h3>
                          <table className="w-full overflow-x-auto table-auto border-collapse">
                            <thead>
                              <tr>
                                <th className="py-2 px-4 border-b text-left text-nowrap text-gray-600">
                                  Office Name
                                </th>

                                <th className="py-2 px-4 border-b text-left  text-nowrap text-gray-600">
                                  Date
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {officeList.map((office) => (
                                <tr key={office.id}>
                                  <td className="py-2 px-4 border-b text-nowrap text-gray-700">
                                    {office.officeName}
                                  </td>
                                  <td className="py-2 px-4 border-b text-nowrap text-gray-700">
                                    {dateFormat(office.createdAt)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                  </div>
                  <div>
                    <div className="flex justify-end gap-3 border-t border-gray-200">
                      <button
                        className="text-sm rounded-lg  bg-gray-500 text-white py-2 px-6  hover:bg-gray-700"
                        onClick={closeModal}
                      >
                        Close
                      </button>
                      <button
                        onClick={() => downloadOffices()}
                        className="text-sm text-white px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-700"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {card.title === "Total Documents types" &&
          documentTypes.length === 0 ? (
            renderNoData()
          ) : (
            <>
              {documentTypes.length > 0 && (
                <div className="p-6  overflow-x-auto space-y-4 text-sm text-[#221f1f]">
                  <div className="space-y-6 ">
                    {documentTypes &&
                      Array.isArray(documentTypes) &&
                      documentTypes.length > 0 && (
                        <div>
                          <h3 className="text-xl font-semibold text-gray-700 mb-4">
                            Document Type List
                          </h3>
                          <table className="w-full overflow-x-auto table-auto border-collapse">
                            <thead>
                              <tr>
                                <th className="py-2 px-4 border-b text-left text-nowrap text-gray-600">
                                  Office Name
                                </th>
                                <th className="py-2 px-4 border-b text-left  text-nowrap text-gray-600">
                                  Deadline
                                </th>
                                <th className="py-2 px-4 border-b text-left  text-nowrap text-gray-600">
                                  Date
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {documentTypes.map((type) => (
                                <tr key={type.id}>
                                  <td className="py-2 px-4 border-b text-nowrap text-gray-700">
                                    {type.document_type}
                                  </td>
                                  <td className="py-2 px-4 border-b text-nowrap text-gray-700">
                                    {`${type.deadline || "N/A"}`}
                                  </td>
                                  <td className="py-2 px-4 border-b text-nowrap text-gray-700">
                                    {dateFormat(type.createdAt)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                  </div>
                  <div>
                    <div className="flex justify-end gap-3 border-t border-gray-200">
                      <button
                        className="text-sm rounded-lg  bg-gray-500 text-white py-2 px-6  hover:bg-gray-700"
                        onClick={closeModal}
                      >
                        Close
                      </button>
                      <button
                        onClick={() => handleDownloadTypes()}
                        className="text-sm text-white px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-700"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {card.title === "Total Faculty" && facultyList.length === 0 ? (
            renderNoData()
          ) : (
            <>
              {facultyList.length > 0 && (
                <div className="p-6  overflow-x-auto space-y-4 text-sm text-[#221f1f]">
                  <div className="space-y-6 ">
                    {facultyList &&
                      Array.isArray(facultyList) &&
                      facultyList.length > 0 && (
                        <div>
                          <h3 className="text-xl font-semibold text-gray-700 mb-4">
                            Faculty List
                          </h3>
                          <table className="w-full overflow-x-auto table-auto border-collapse">
                            <thead>
                              <tr>
                                <th className="py-2 px-4 border-b text-left text-nowrap text-gray-600">
                                  Full Name
                                </th>
                                <th className="py-2 px-4 border-b text-left  text-nowrap text-gray-600">
                                  ESU Campus
                                </th>
                                <th className="py-2 px-4 border-b text-left  text-nowrap text-gray-600">
                                  Designation
                                </th>

                                <th className="py-2 px-4 border-b text-left  text-nowrap text-gray-600">
                                  Date
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {facultyList.map((faculty) => (
                                <tr key={faculty.id}>
                                  <td className="py-2 px-4 border-b text-nowrap text-gray-700">
                                    {`${faculty.firstName} ${faculty.middleInitial} ${faculty.lastName}`}
                                  </td>
                                  <td className="py-2 px-4 border-b text-nowrap text-gray-700">
                                    {faculty.esuCampus}
                                  </td>
                                  <td className="py-2 px-4 border-b text-nowrap text-gray-700">
                                    {faculty.designation}
                                  </td>
                                  <td className="py-2 px-4 border-b text-nowrap text-gray-700">
                                    {dateFormat(faculty.createdAt)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                  </div>
                  <div>
                    <div className="flex justify-end gap-3 border-t border-gray-200">
                      <button
                        className="text-sm rounded-lg  bg-gray-500 text-white py-2 px-6  hover:bg-gray-700"
                        onClick={closeModal}
                      >
                        Close
                      </button>
                      <button
                        onClick={() => handleDownloadFaculty()}
                        className="text-sm text-white px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-700"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

CardModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  card: PropTypes.object.isRequired,
};

export default CardModal;

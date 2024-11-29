import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useFormat } from "../hooks/useFormatDate";
import StepperMobile from "../components/StepperMobile";
import Stepper from "../components/Stepper";
import { documentBackground } from "../utils/documentBackgroundColor";
import { getDocumentStatus } from "../utils/documentStatus";

const DocumentMedata = ({ modal, closeModal, document }) => {
  const [sortedHistories, setSortedHistories] = useState([]);
  const [data, setData] = useState([]);
  const [documentData, setDocumentData] = useState([]);
  const { fullDateFormat } = useFormat();

  useEffect(() => {
    if (document) {
      setDocumentData(document);
      setData(document.document_recipients);
    }
  }, [document]);

  useEffect(() => {
    if (documentData && documentData.document_histories) {
      const sortedData = [...documentData.document_histories].sort(
        (a, b) => b.id - a.id
      );
      setSortedHistories(sortedData);
    }
  }, [documentData]);
  return (
    <>
      <div
        id="default-modal"
        tabIndex="-1"
        aria-hidden={!modal}
        className="fixed inset-0 z-[40] px-5 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-40 font-normal"
      >
        {" "}
        <div className="relative w-full max-w-6xl mt-10  h-full overflow-y-auto rounded-xl">
          <div className="relative text-gray-800 bg-white rounded-xl shadow-lg ">
            <div className="flex items-center justify-center rounded-t">
              <h1 className="md:text-2xl font-bold text-lg p-4">
                Document Details
              </h1>
              <button
                type="button"
                className="absolute right-2 top-2 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-6 h-6 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => closeModal()}
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
            </div>
            <div>
              <div className="bg-white ">
                <div className="mt-8 flex flex-col gap-5 p-4">
                  <div className="hidden lg:block">
                    {" "}
                    <Stepper data={data} />
                  </div>

                  <div className="lg:hidden block">
                    {" "}
                    <StepperMobile data={data} />
                  </div>

                  <div className=" bg-gray-200 mt-10 md:p-4 rounded-lg flex flex-col lg:flex-row gap-5 justify-between text-gray-700">
                    <div className=" lg:sticky lg:top-20 flex flex-col gap-4 h-fit lg:w-1/2  p-4 bg-white text-sm   shadow-lg rounded-md">
                      <div className=" flex items-center gap-5 border-b pb-2 fix">
                        <h1 className="font-bold text-gray-800">
                          Tracking Number:
                        </h1>
                        <p className="text-gray-700">
                          {documentData.tracking_number}
                        </p>
                      </div>
                      <div className="flex items-center gap-5 border-b pb-2">
                        <h1 className="font-bold text-gray-800">
                          Document Name:
                        </h1>
                        <p className="text-gray-700">
                          {documentData.document_name}
                        </p>
                      </div>
                      <div className="flex items-center gap-5 border-b pb-2">
                        <h1 className="font-bold  text-gray-800">
                          Document Type:
                        </h1>
                        <p className="text-gray-700">
                          {documentData.document_type}
                        </p>
                      </div>
                      <div className="flex items-center gap-5 border-b pb-2">
                        <h1 className="font-bold  text-gray-800">File Type:</h1>
                        <p className="text-gray-700">
                          {documentData.file_type}
                        </p>
                      </div>
                      <div className="flex items-center gap-5 border-b pb-2">
                        <h1 className="font-bold  text-gray-800">
                          Uploaded By:
                        </h1>
                        <p className="text-gray-700">
                          {documentData.uploaded_by}
                        </p>
                      </div>
                      <div className="flex items-center gap-5 border-b pb-2">
                        <h1 className="font-bold  text-gray-800">Date:</h1>
                        <p className="text-gray-700">
                          {fullDateFormat(documentData.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-5">
                        <h1 className="font-bold  text-gray-800">Status:</h1>
                        <p
                          className={`${documentBackground(
                            documentData.status
                          )} text-gray-700  p-2 rounded-lg`}
                        >
                          {getDocumentStatus(documentData.status)}
                        </p>
                      </div>
                    </div>

                    {/* <div className="lg:w-1/2 w-full p-4 text-gray-600 bg-white text-sm md:text-[16px] shadow-lg rounded-md">
                      <h1 className="text-main lg:text-xl font-bold text-lg mb-4">
                        Tracking History
                      </h1>
                      <ul className="space-y-4 leading-6">
                        {sortedHistories.map(
                          ({
                            id,
                            action,
                            recipient_office,
                            recipient_user,
                            createdAt,
                          }) => (
                            <li key={id} className="border-b pb-2">
                              <p className="font-semibold text-gray-800">
                                {action !== "forwarded"
                                  ? recipient_office
                                  : null}
                              </p>
                              <span>
                                Document {action} by: {recipient_user}
                              </span>
                              <p className="text-gray-600">
                                Date: {fullDateFormat(createdAt)}
                              </p>
                            </li>
                          )
                        )}
                      </ul>
                    </div> */}
                    <div className="lg:w-1/2 w-full p-4 bg-white shadow-md rounded-md">
                      <h1 className="font-bold text-md text-main mb-3">
                        Tracking History
                      </h1>
                      <ul className="space-y-4">
                        {sortedHistories.map(
                          ({
                            id,
                            action,
                            recipient_office,
                            recipient_user,
                            createdAt,
                          }) => (
                            <li
                              key={id}
                              className="pb-3 border-b last:border-none"
                            >
                              <div className="flex justify-between items-start">
                                <span className="font-semibold text-gray-700 text-sm">
                                  {recipient_office}
                                </span>
                                <span className="text-xs text-gray-500 text-nowrap">
                                  {fullDateFormat(createdAt)}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mt-1">
                                Document {action} by: {recipient_user}
                              </p>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* {forgotPassword && <ForgotPassword />} */}
    </>
  );
};

DocumentMedata.propTypes = {
  modal: PropTypes.bool,
  closeModal: PropTypes.func,
  document: PropTypes.object,
};

export default DocumentMedata;

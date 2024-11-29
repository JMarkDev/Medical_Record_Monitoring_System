import noDataImage from "../assets/images/undraw_no_data_re_kwbl.svg";

const NoData = () => {
  return (
    <div className="flex flex-col p-4 bg-gray-200 gap-5 justify-center items-center">
      <h2 className="md:text-3xl text-lg font-semibold text-gray-800 text-center">
        No data available
      </h2>
      <img src={noDataImage} alt="No data available" className="w-64 h-64" />
    </div>
  );
};

export default NoData;

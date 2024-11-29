import PropTypes from "prop-types";

const Pagination = ({ dataPerPage, totalData, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalData / dataPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav aria-label="Page navigation example">
      <ul className="inline-flex -space-x-px text-sm">
        <li>
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 h-10 leading-tight rounded-md shadow-md transition-colors duration-200 ${
              currentPage === 1
                ? "text-gray-300 cursor-not-allowed bg-gray-100"
                : "text-white bg-blue-500 hover:bg-blue-500"
            } border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
          >
            Previous
          </button>
        </li>
        {pageNumbers.map((number) => (
          <li key={number}>
            <button
              onClick={() => paginate(number)}
              className={`px-4 py-2 h-10 leading-tight rounded-md shadow-md transition-colors duration-200 ${
                currentPage === number
                  ? "text-white bg-blue-600 border-blue-600"
                  : "text-gray-600 bg-white hover:bg-blue-100 hover:text-blue-600"
              } border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
            >
              {number}
            </button>
          </li>
        ))}
        <li>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === pageNumbers.length}
            className={`px-4 py-2 h-10 leading-tight rounded-md shadow-md transition-colors duration-200 ${
              currentPage === pageNumbers.length
                ? "text-gray-300 cursor-not-allowed bg-gray-100"
                : "text-white bg-blue-600 hover:bg-blue-500"
            } border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

Pagination.propTypes = {
  dataPerPage: PropTypes.number,
  totalData: PropTypes.number,
  paginate: PropTypes.func,
  currentPage: PropTypes.number,
};

export default Pagination;

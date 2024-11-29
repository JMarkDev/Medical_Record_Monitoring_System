import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { useState } from "react";
import PropTypes from "prop-types";
// import { getBgColor } from "../../utils/animalBgStatus";
import transactionStatus from "../../constants/transactionStatus";
import { getTransactionStatus } from "../../utils/getTransactionStatus";

export default function Dropdown({ handleFilter }) {
  const [selectOption, setSelectOption] = useState("Filter by status");

  const handleOption = (option) => {
    if (option === "Default") {
      setSelectOption("Filter by status");
    } else {
      setSelectOption(getTransactionStatus(option));
    }
    handleFilter(option);
  };

  return (
    <div className="text-right ">
      <Menu>
        <MenuButton className="inline-flex whitespace-nowrap items-center gap-2 rounded-md bg-blue-600 hover:bg-blue-700 py-2 px-2 text-sm font-semibold text-white ">
          {selectOption}
          <ChevronDownIcon className="size-4 fill-white/60" />
        </MenuButton>
        <Transition
          enter="transition ease-out duration-75"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
          className="bg-gray"
        >
          <MenuItems
            anchor="bottom end"
            className="min-w-40 z-50 text-gray-700 origin-top-right bg-gray-200 shadow-lg  rounded-xl  p-1 text-sm"
          >
            <MenuItem>
              <button
                onClick={() => handleOption("Default")}
                className={` group  flex w-full hover:bg-gray-300 items-center justify-start gap-2 rounded-lg py-1.5 px-3 `}
              >
                Default
              </button>
            </MenuItem>
            <MenuItem>
              <button
                onClick={() => handleOption(transactionStatus.unpaid)}
                className={` group  flex w-full hover:bg-gray-300 items-center justify-start gap-2 rounded-lg py-1.5 px-3 `}
              >
                Unpaid
              </button>
            </MenuItem>
            <MenuItem>
              <button
                onClick={() => handleOption(transactionStatus.partial)}
                className="group flex w-full hover:bg-gray-300 items-center justify-start gap-2 rounded-lg py-1.5 px-3 "
              >
                Partial
              </button>
            </MenuItem>
            <MenuItem>
              <button
                onClick={() => handleOption(transactionStatus.paid)}
                className="group flex w-full hover:bg-gray-300 items-center justify-start gap-2 rounded-lg py-1.5 px-3 "
              >
                Paid
              </button>
            </MenuItem>
          </MenuItems>
        </Transition>
      </Menu>
    </div>
  );
}

Dropdown.propTypes = {
  handleFilter: PropTypes.func.isRequired,
};

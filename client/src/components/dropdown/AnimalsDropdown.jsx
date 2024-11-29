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

export default function AnimalDropdown({ handleFilter }) {
  const [selectOption, setSelectOption] = useState("Filter by animal type");

  const handleOption = (option) => {
    setSelectOption(option);
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
                onClick={() => handleOption("All")}
                className={` group  flex w-full hover:bg-gray-300 items-center justify-start gap-2 rounded-lg py-1.5 px-3 `}
              >
                All
              </button>
            </MenuItem>
            <MenuItem>
              <button
                onClick={() => handleOption("Cattle")}
                className={` group  flex w-full hover:bg-gray-300 items-center justify-start gap-2 rounded-lg py-1.5 px-3 `}
              >
                Cattle
              </button>
            </MenuItem>
            <MenuItem>
              <button
                onClick={() => handleOption("Pigs")}
                className="group flex w-full hover:bg-gray-300 items-center justify-start gap-2 rounded-lg py-1.5 px-3 "
              >
                Pigs
              </button>
            </MenuItem>
            <MenuItem>
              <button
                onClick={() => handleOption("Goats")}
                className="group flex w-full hover:bg-gray-300 items-center justify-start gap-2 rounded-lg py-1.5 px-3 "
              >
                Goats
              </button>
            </MenuItem>
          </MenuItems>
        </Transition>
      </Menu>
    </div>
  );
}

AnimalDropdown.propTypes = {
  handleFilter: PropTypes.func.isRequired,
};

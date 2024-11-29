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

export default function Dropdown({ handleFilter }) {
  const year = [2024, 2025, 2026, 2027];

  // Initial state is set to the first year
  const [selectOption, setSelectOption] = useState(year[0]);

  const handleOption = (selected) => {
    setSelectOption(selected); // Update the selected option state
    handleFilter(selected); // Call the handleFilter function passed as a prop
  };

  return (
    <div className="text-right">
      <Menu>
        <MenuButton className="inline-flex whitespace-nowrap items-center gap-2 rounded-md bg-blue-600 hover:bg-blue-700 py-1.5 px-2 text-sm font-semibold text-white">
          {selectOption} {/* Display the selected year */}
          <ChevronDownIcon className="size-4 fill-white/60" />
        </MenuButton>
        <Transition
          enter="transition ease-out duration-75"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
          className="bg-white"
        >
          <MenuItems
            anchor="bottom end"
            className="min-w-40 text-gray-700 origin-top-right bg-gray-700 rounded-xl p-1 text-sm"
          >
            {year.map((options) => (
              <MenuItem key={options}>
                <button
                  onClick={() => handleOption(options)} // Call handleOption with the selected year
                  className="group flex w-full hover:bg-gray-300 items-center justify-start gap-2 rounded-lg py-1.5 px-3"
                >
                  {options} {/* Display each year in the dropdown */}
                </button>
              </MenuItem>
            ))}
          </MenuItems>
        </Transition>
      </Menu>
    </div>
  );
}

Dropdown.propTypes = {
  handleFilter: PropTypes.func.isRequired,
};

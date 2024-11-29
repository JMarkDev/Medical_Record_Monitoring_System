import PropTypes from "prop-types";
const Cards = ({ data }) => {
  // const colors = [
  //   "#3ba840",
  //   "#09adad",
  //   "#69faeb",
  //   "#b48af2",
  //   "#1b60cf",
  //   "#e34439",
  //   "#f2b774",
  //   "#c7c238",
  // ];

  // const getNextColor = () => {
  //   const color = colors.shift();
  //   colors.push(color);
  //   return color;
  // };

  return (
    <div className="grid lg:grid-cols-4 grid-cols-2 w-full gap-5">
      {data.map((card, index) => (
        <div
          key={index}
          className=" rounded-lg bg-[#daeff5] flex flex-col py-4  items-center cursor-pointer shadow-xl transform hover:scale-[103%] transition duration-300 ease-out "
          // style={{ borderColor: getNextColor() }}
        >
          <h1 className="font-bold py-1 w-full text-center text-sm xl:text-lg   whitespace-nowrap text-main rounded-md">
            {card.title}
          </h1>
          <h1 className=" font-bold lg:text-2xl text-xl text-[#4e4e50]">
            {card.value}
          </h1>
        </div>
      ))}
    </div>
  );
};

Cards.propTypes = {
  data: PropTypes.array.isRequired,
};

export default Cards;

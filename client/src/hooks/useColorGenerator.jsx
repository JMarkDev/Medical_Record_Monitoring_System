import { useState } from "react";

const useColorGenerator = () => {
  const [usedColors, setUsedColors] = useState(new Set());

  const getRandomColor = () => {
    const randomColor = `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")}`;
    return randomColor;
  };

  const getContrastColor = (color) => {
    const brightness = getBrightness(color);
    const threshold = 128; // Adjust as needed

    if (brightness > threshold) {
      // If the color is too light, generate a new color with lower brightness
      return getContrastColor(getRandomColor());
    }

    return color;
  };

  const getBrightness = (color) => {
    const hexColor = color.slice(1);
    const r = parseInt(hexColor.slice(0, 2), 16);
    const g = parseInt(hexColor.slice(2, 4), 16);
    const b = parseInt(hexColor.slice(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000;
  };

  const getNextColors = () => {
    let newColor;
    do {
      newColor = getContrastColor(getRandomColor());
    } while (usedColors.has(newColor));

    setUsedColors((prevColors) => new Set([...prevColors, newColor]));
    return newColor;
  };

  return {
    getNextColors,
    usedColors: Array.from(usedColors),
  };
};

export default useColorGenerator;

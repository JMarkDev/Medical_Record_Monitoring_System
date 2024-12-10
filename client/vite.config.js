// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import path from "path";

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     historyApiFallback: true,
//   },
//   resolve: {
//     alias: {
//       // eslint-disable-next-line no-undef
//       "@/components": path.resolve(__dirname, "./src/components"),
//     },
//   },
// });
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    //  https: true, // Enable HTTPS
    host: "0.0.0.0", // This allows access from any network interface
    port: 3000, // Optional: Specify the port you want to use
  },
});

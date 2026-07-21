import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
    resolve: {
        alias: {
            "@": path.resolve(__dirname,"./src"),
        },
        extensions: [".js"],
    },

    server: {
        host: true, // escucha en 0.0.0.0, acepta conexiones externas
        port: 5173, // opcional, pon el puerto que uses
    },
});
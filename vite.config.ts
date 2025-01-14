import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { viteSingleFile } from "vite-plugin-singlefile"
export default defineConfig({
  build: {
    minify: true,
    cssMinify: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        assetFileNames: "[name].[ext]",
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js"
      }
    }
  },
  plugins: [
    tsconfigPaths(),
    // viteSingleFile()
  ],
  assetsInclude:[
    "static/*.jpg"
  ],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      }
    }
  }
});

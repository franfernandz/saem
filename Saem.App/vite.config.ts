import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/ServiciosSAEM/api/Anexo1": {

        target: "http://172.5.20.5:5007",
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\web_Api_Rest_Molinete/api, '')
        
      },
      
      "/ServiciosSAEM/api/Anexo2": {
        target: "http://172.5.20.5:5007",
        changeOrigin: true,
      },
      
      "/ServiciosSAEM/api/Anexo3": {
        target: "http://172.5.20.5:5007",
        changeOrigin: true,
      },
      
      "/ServiciosSAEM/api/Anexo4": {
        target: "http://172.5.20.5:5007",
        changeOrigin: true,
      },
      
      "/ServiciosSAEM/api/Anexo5": {
        target: "http://172.5.20.5:5007",
        changeOrigin: true,
      },
      
      "/ServiciosSAEM/api/Anexo7": {
        target: "http://172.5.20.5:5007",
        changeOrigin: true,
      },
    },
    // '/api': {
    //   "/web_Api_Rest_Molinete/api/": {
    //     target: "http://servicios.inaes.gob.ar",
    //     changeOrigin: true,
    //     // rewrite: (path) => path.replace(/^\web_Api_Rest_Molinete/api, '')
    //   },
    // },
  }
})
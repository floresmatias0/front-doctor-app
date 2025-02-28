// vite.config.js
import { defineConfig } from "file:///C:/Users/Yo/Desktop/azulo/Nueva%20carpeta%20(2)/front-doctor-app/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Yo/Desktop/azulo/Nueva%20carpeta%20(2)/front-doctor-app/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { VitePWA } from "file:///C:/Users/Yo/Desktop/azulo/Nueva%20carpeta%20(2)/front-doctor-app/node_modules/vite-plugin-pwa/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    VitePWA({
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "maskable-icon.png"],
      manifest: {
        name: "Atencion M\xE9dica",
        short_name: "ZonaMed",
        description: "Accede a consultas m\xE9dicas especializadas, seguimiento de antecedentes m\xE9dicos, y recursos educativos para padres. Reg\xEDstrate y cuida de la salud de tus hijos desde cualquier lugar.",
        theme_color: "#ffffff",
        icons: [
          {
            src: "pwa-64x64.png",
            sizes: "64x64",
            type: "image/png"
          },
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      },
      registerType: "autoUpdate"
    })
  ],
  server: {
    host: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxZb1xcXFxEZXNrdG9wXFxcXGF6dWxvXFxcXE51ZXZhIGNhcnBldGEgKDIpXFxcXGZyb250LWRvY3Rvci1hcHBcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXFlvXFxcXERlc2t0b3BcXFxcYXp1bG9cXFxcTnVldmEgY2FycGV0YSAoMilcXFxcZnJvbnQtZG9jdG9yLWFwcFxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvWW8vRGVza3RvcC9henVsby9OdWV2YSUyMGNhcnBldGElMjAoMikvZnJvbnQtZG9jdG9yLWFwcC92aXRlLmNvbmZpZy5qc1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXHJcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcclxuaW1wb3J0IHsgVml0ZVBXQSB9IGZyb20gJ3ZpdGUtcGx1Z2luLXB3YSdcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcGx1Z2luczogW1xyXG4gICAgcmVhY3QoKSxcclxuICAgIFZpdGVQV0Eoe1xyXG4gICAgICBpbmNsdWRlQXNzZXRzOiBbJ2Zhdmljb24uaWNvJywgJ2FwcGxlLXRvdWNoLWljb24ucG5nJywgJ21hc2thYmxlLWljb24ucG5nJ10sXHJcbiAgICAgIG1hbmlmZXN0OiB7XHJcbiAgICAgICAgbmFtZTogJ0F0ZW5jaW9uIE1cdTAwRTlkaWNhJyxcclxuICAgICAgICBzaG9ydF9uYW1lOiAnWm9uYU1lZCcsXHJcbiAgICAgICAgZGVzY3JpcHRpb246ICdBY2NlZGUgYSBjb25zdWx0YXMgbVx1MDBFOWRpY2FzIGVzcGVjaWFsaXphZGFzLCBzZWd1aW1pZW50byBkZSBhbnRlY2VkZW50ZXMgbVx1MDBFOWRpY29zLCB5IHJlY3Vyc29zIGVkdWNhdGl2b3MgcGFyYSBwYWRyZXMuIFJlZ1x1MDBFRHN0cmF0ZSB5IGN1aWRhIGRlIGxhIHNhbHVkIGRlIHR1cyBoaWpvcyBkZXNkZSBjdWFscXVpZXIgbHVnYXIuJyxcclxuICAgICAgICB0aGVtZV9jb2xvcjogJyNmZmZmZmYnLFxyXG4gICAgICAgIGljb25zOiBbXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHNyYzogJ3B3YS02NHg2NC5wbmcnLFxyXG4gICAgICAgICAgICBzaXplczogJzY0eDY0JyxcclxuICAgICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZydcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHNyYzogJ3B3YS0xOTJ4MTkyLnBuZycsXHJcbiAgICAgICAgICAgIHNpemVzOiAnMTkyeDE5MicsXHJcbiAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9wbmcnXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBzcmM6ICdwd2EtNTEyeDUxMi5wbmcnLFxyXG4gICAgICAgICAgICBzaXplczogJzUxMng1MTInLFxyXG4gICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJ1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIF1cclxuICAgICAgfSxcclxuICAgICAgcmVnaXN0ZXJUeXBlOiAnYXV0b1VwZGF0ZSdcclxuICAgIH0pXHJcbiAgXSxcclxuICBzZXJ2ZXI6IHtcclxuICAgIGhvc3Q6IHRydWVcclxuICB9XHJcbn0pIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF3WCxTQUFTLG9CQUFvQjtBQUNyWixPQUFPLFdBQVc7QUFDbEIsU0FBUyxlQUFlO0FBR3hCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLFFBQVE7QUFBQSxNQUNOLGVBQWUsQ0FBQyxlQUFlLHdCQUF3QixtQkFBbUI7QUFBQSxNQUMxRSxVQUFVO0FBQUEsUUFDUixNQUFNO0FBQUEsUUFDTixZQUFZO0FBQUEsUUFDWixhQUFhO0FBQUEsUUFDYixhQUFhO0FBQUEsUUFDYixPQUFPO0FBQUEsVUFDTDtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFlBQ1AsTUFBTTtBQUFBLFVBQ1I7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsWUFDUCxNQUFNO0FBQUEsVUFDUjtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxZQUNQLE1BQU07QUFBQSxVQUNSO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxNQUNBLGNBQWM7QUFBQSxJQUNoQixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1I7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PerfilProvider } from "./context/PerfilContext";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Nao refaz a chamada so porque a janela voltou ao foco:
      // em desenvolvimento isso polui o terminal da API.
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <PerfilProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PerfilProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
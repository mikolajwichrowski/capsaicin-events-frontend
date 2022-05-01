import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import { GlobalContext, defaultState } from "./store"
import { QueryClient, QueryClientProvider } from "react-query"
import "./global.css"

const queryClient = new QueryClient()

ReactDOM.render(
    <QueryClientProvider client={queryClient}>
        <GlobalContext.Provider value={defaultState}>
            <BrowserRouter>
                <React.StrictMode>
                    <App />
                </React.StrictMode>
            </BrowserRouter>
        </GlobalContext.Provider>
    </QueryClientProvider>,
    document.getElementById("root")
)

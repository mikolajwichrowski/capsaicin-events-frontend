import React from "react"

export interface GlobalContextType {
    selectedEvent: any | null
    setSelectedEvent: (event: any) => void
}

export const defaultState: GlobalContextType = {
    selectedEvent: null,
    setSelectedEvent(event: any) {
        if (!event) {
            return
        }
        this.selectedEvent = event
    },
}

export const GlobalContext = React.createContext(defaultState)

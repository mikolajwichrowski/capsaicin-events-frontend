import React, { useEffect, useState } from "react"
import { Routes, Route, useNavigate } from "react-router-dom"
import Cookies from "js-cookie"
import Home from "./pages/Home"
import Event from "./pages/Event"
import Login from "./pages/Login"

function App() {
    const navigate = useNavigate()
    const [validated, setValidated] = useState(false)

    useEffect(() => {
        if (Cookies.get("logged_in") !== "yes") {
            navigate("/login")
        }

        setValidated(true)
    }, [])

    if (!validated) {
        return <></>
    }

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/event/:eventId" element={<Event />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    )
}

export default App

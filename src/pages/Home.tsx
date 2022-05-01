import React, { useContext } from "react"
import { useQuery } from "react-query"
import Cookies from "js-cookie"
import { useNavigate } from "react-router-dom"
import { Box, List, LinearProgress, Typography } from "@mui/material"
import { GlobalContext } from "../store"
import { EventItem, BlancItem } from "../components/EventItem"
import NavBar from "../components/NavBar"
import AddIcon from "@mui/icons-material/Add"

const Home = () => {
    const navigate = useNavigate()
    const globalContext = useContext(GlobalContext)
    const { isLoading, data } = useQuery(
        "events",
        () => fetch("/api/event").then((res) => res.json()),
        {
            cacheTime: 0,
            useErrorBoundary: true,
            retry: false,
            onError: () => {
                Cookies.set("logged_in", "no")
                navigate("/login")
            },
        }
    )

    const logOut = () => {
        Cookies.set("logged_in", "no")
        navigate("/login")
    }

    const openEvent = (event) => () => {
        globalContext.setSelectedEvent(event)
        navigate(`/event/${event.id}`)
    }

    const eventItems = data?.map((event) => (
        <EventItem key={event.id} event={event} onClick={openEvent(event)} />
    ))

    return (
        <>
            <NavBar onLogout={logOut} />
            <Box sx={{ height: "calc(100% - 60px)", marginTop: "60px" }}>
                {isLoading ? (
                    <LinearProgress />
                ) : (
                    <List>
                        <BlancItem
                            sx={{ justifyContent: "center" }}
                            onClick={() => navigate("/new")}
                        >
                            <Typography>Add new</Typography>
                            <AddIcon />
                        </BlancItem>
                        {eventItems}
                    </List>
                )}
            </Box>
        </>
    )
}

export default Home

import React from "react"
import { ListItem, ListItemText, ListItemAvatar, Avatar } from "@mui/material"
import { UserImageElement } from "./UserImage"

export const EventItem = (props) => {
    const { event, onClick } = props

    return (
        <ListItem
            onClick={onClick}
            sx={{
                "&:hover": {
                    cursor: "pointer",
                    backgroundColor: "rgba(0, 0, 0, 0.08)",
                },
            }}
        >
            <ListItemAvatar>
                <Avatar src={event.picture} />
            </ListItemAvatar>
            <ListItemText
                secondary={event.creator.username}
                primary={
                    event.description.length > 0
                        ? event.description
                        : "No description"
                }
            />
        </ListItem>
    )
}

export const BlancItem = (props) => {
    const { children, onClick, sx } = props

    return (
        <ListItem
            onClick={onClick}
            sx={{
                "&:hover": {
                    cursor: "pointer",
                    backgroundColor: "rgba(0, 0, 0, 0.08)",
                },
                ...sx,
            }}
        >
            {children}
        </ListItem>
    )
}

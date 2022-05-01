import React from "react"
import { ListItem, ListItemText, ListItemAvatar } from "@mui/material"
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
                <UserImageElement username={event.creator.username} />
            </ListItemAvatar>
            <ListItemText
                primary={event.creator.username}
                secondary={
                    event.description.length > 0
                        ? event.description
                        : "No description"
                }
            />
        </ListItem>
    )
}

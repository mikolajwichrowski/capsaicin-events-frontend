import React from "react"
import { makeHash } from "../hash"
import { Avatar, Chip } from "@mui/material"

export const UserImageElement = ({ username }) => {
    const usernameHash = makeHash(username).toString().replace("-", "")
    return <Avatar src={`https://i.pravatar.cc/200?u=${usernameHash}`} />
}

export const UserChipElement = ({ username }) => {
    const usernameHash = makeHash(username).toString().replace("-", "")
    return (
        <Chip
            avatar={
                <Avatar src={`https://i.pravatar.cc/200?u=${usernameHash}`} />
            }
            label={username}
        />
    )
}

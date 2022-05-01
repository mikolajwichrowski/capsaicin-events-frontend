import { Box, Chip } from "@mui/material"
import React, { useContext, useEffect } from "react"
import { useQuery } from "react-query"
import { UserChipElement, UserImageElement } from "../components/UserImage"
import { useNavigate } from "react-router-dom"
import { GlobalContext } from "../store"
import CloseIcon from "@mui/icons-material/Close"
import { Typography, Avatar, Divider } from "@mui/material"
import Timeline from "@mui/lab/Timeline"
import TimelineItem from "@mui/lab/TimelineItem"
import TimelineSeparator from "@mui/lab/TimelineSeparator"
import TimelineConnector from "@mui/lab/TimelineConnector"
import TimelineContent from "@mui/lab/TimelineContent"
import { count } from "../counter"

const Event = () => {
    const navigate = useNavigate()
    const globalContext = useContext(GlobalContext)

    const attendeesRequest = useQuery(
        "attendees",
        () =>
            fetch(
                `/api/event/${globalContext?.selectedEvent.id}/attendees`
            ).then((res) => res.json()),
        {
            enabled: !!globalContext?.selectedEvent?.id,
            retry: false,
        }
    )

    const reactionsRequest = useQuery(
        "reactions",
        () =>
            fetch(
                `/api/event/${globalContext?.selectedEvent.id}/reactions`
            ).then((res) => res.json()),
        {
            enabled: !!globalContext?.selectedEvent?.id,
            retry: false,
        }
    )

    const onClose = () => {
        navigate("/")
    }

    useEffect(() => {
        if (!globalContext.selectedEvent) {
            navigate("/")
        }
        window.scrollTo(0, 0)
    }, [])

    if (!globalContext.selectedEvent) {
        return <></>
    }

    const availibilities = reactionsRequest.data?.filter(
        (reaction) => reaction.type === "AVAILIBILITY"
    )

    const countedAvailibilityDates = count(availibilities, (reaction) => {
        return new Date(reaction.availibilityDate).toLocaleDateString()
    })

    const availibilitieElements = Object.keys(countedAvailibilityDates).map(
        (countedKey) => {
            const amountOfVotes = countedAvailibilityDates[countedKey]
            const date = countedKey
            return (
                <Chip
                    key={date}
                    label={date}
                    avatar={<Avatar>{amountOfVotes}</Avatar>}
                />
            )
        }
    )

    const comments = reactionsRequest.data?.filter(
        (reaction) => reaction.type === "COMMENT"
    )
    const reactionElements = comments?.map((reaction, index) => (
        <TimelineItem key={`[reaction][${index}]`}>
            <TimelineSeparator>
                <UserImageElement username={reaction.user.username} />
                {comments?.length > index + 1 ? <TimelineConnector /> : null}
            </TimelineSeparator>
            <TimelineContent>
                <Typography variant="body1" component="p">
                    {reaction.user.username}
                </Typography>
                <Typography variant="body2" component="p">
                    {reaction.message}
                </Typography>
                <Typography variant="body2" component="em">
                    {new Date(reaction.createdAt).toLocaleString()}
                </Typography>
            </TimelineContent>
        </TimelineItem>
    ))

    return (
        <Box>
            <Box sx={{ position: "fixed", top: "10px", right: "10px" }}>
                <CloseIcon onClick={onClose}></CloseIcon>
            </Box>
            <Box
                sx={{
                    width: "500px",
                    height: "calc(100% - 80px)",
                    margin: "auto",
                    marginTop: "80px",
                    wordWrap: "wrap",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        textAlign: "center",
                    }}
                >
                    <Avatar
                        sx={{
                            height: "60px",
                            width: "60px",
                            margin: "auto",
                            border: "1px solid #ccc",
                            display: "inline-block",
                        }}
                        src={globalContext.selectedEvent.picture}
                    />
                    <Typography variant="h2" sx={{ display: "inline-block" }}>
                        {globalContext.selectedEvent.location}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        marginTop: "20px",
                        marginBottom: "20px",
                        textAlign: "center",
                    }}
                >
                    <UserChipElement
                        username={globalContext.selectedEvent.creator.username}
                    />
                </Box>

                <Box sx={{ marginBottom: "20px", marginTop: "20px" }}>
                    <Typography variant="caption">
                        {globalContext.selectedEvent.description}
                    </Typography>
                </Box>

                <Divider sx={{ marginBottom: "10px" }}></Divider>

                {!attendeesRequest.isLoading ? (
                    <Box sx={{ marginBottom: "20px" }}>
                        <Typography variant="subtitle1">Attendees</Typography>

                        {(attendeesRequest?.data as any)?.length === 0 ? (
                            <Typography variant="caption">
                                No attendees yet.
                            </Typography>
                        ) : (
                            ""
                        )}

                        {(attendeesRequest?.data as any)?.map(
                            (attendee, index) => (
                                <UserChipElement
                                    key={`[attendee][${index}]`}
                                    username={attendee.user.username}
                                />
                            )
                        )}
                    </Box>
                ) : null}

                <Box sx={{ marginBottom: "20px" }}>
                    <Typography variant="subtitle1">Availibilities</Typography>
                    {availibilitieElements.length === 0 ?? (
                        <Typography variant="caption">
                            No availibilities yet.
                        </Typography>
                    )}
                    <Box sx={{ display: "flex", gap: "10px" }}>
                        {availibilitieElements}
                    </Box>
                </Box>

                <Divider sx={{ marginBottom: "10px" }}></Divider>

                <Box sx={{ marginBottom: "50px" }}>
                    <Typography variant="subtitle1">Comments</Typography>
                    {reactionElements.length === 0 ?? (
                        <Typography variant="caption">
                            No reactions yet.
                        </Typography>
                    )}
                    <Timeline position="alternate">{reactionElements}</Timeline>
                </Box>
            </Box>
        </Box>
    )
}

export default Event

import React from 'react'
import { ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material'

export const EventItem = (props) => {
	const { event, onClick } = props

	return (
		<ListItem
			onClick={onClick}
			sx={{
				'&:hover': {
					cursor: 'pointer',
					backgroundColor: 'rgba(0, 0, 0, 0.08)',
				},
			}}
		>
			<ListItemAvatar>
				<Avatar src={event.picture} />
			</ListItemAvatar>
			<ListItemText
				secondary={`Organised by ${event.creator.username}`}
				primary={
					event.description.length > 0
						? event.location
						: 'No location'
				}
			/>
		</ListItem>
	)
}

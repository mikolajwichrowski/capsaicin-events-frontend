import React from 'react'
import { Box, Button, MenuItem, Select } from '@mui/material'
import { GlobalContextType } from '../store'
import { Typography } from '@mui/material'
import { GroupAdd } from '@mui/icons-material'
import { UserChipElement } from './UserImage'
import { ReactionType } from '../pages/Event'

export function AttendeesSection(
	userId: number,
	globalContext: GlobalContextType,
	formikAttendee,
	usersRequest,
	attendeesRequest
): React.ReactNode {
	if (attendeesRequest.isLoading) {
		return <></>
	}
	return (
		<Box sx={{ marginBottom: '20px' }}>
			<Typography variant="subtitle1">Attendees</Typography>
			<br />
			{userId === globalContext.selectedEvent.creator.id ? (
				<form onSubmit={formikAttendee.handleSubmit}>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							width: '100%',
						}}
					>
						<Select
							sx={{
								width: 'calc(100% - 75px)',
							}}
							name="user"
							value={formikAttendee.values.user ?? 0}
							onChange={formikAttendee.handleChange}
							placeholder="Select a user"
						>
							<MenuItem disabled value={0}>
								<em>Select a user</em>
							</MenuItem>
							{usersRequest.data?.map((user, index) => (
								<MenuItem
									key={`[user][${index}]`}
									value={user.id}
								>
									{user.username}
								</MenuItem>
							))}
						</Select>
						<Button
							sx={{ width: '55px', height: '55px' }}
							type="submit"
						>
							<GroupAdd />
						</Button>
					</Box>
				</form>
			) : (attendeesRequest?.data as ReactionType[])?.length === 0 ? (
				<Typography variant="caption">No attendees yet.</Typography>
			) : (
				''
			)}
			<Box sx={{ marginTop: '20px' }}>
				<Box
					sx={{
						display: 'flex',
						gap: '10px',
						flexFlow: 'wrap row',
						marginBottom: '10px',
						justifyContent: 'center',
					}}
				>
					{(attendeesRequest?.data as ReactionType[])?.map(
						(attendee, index) => (
							<UserChipElement
								key={`[attendee][${index}]`}
								username={attendee.user.username}
							/>
						)
					)}
				</Box>
			</Box>
		</Box>
	)
}

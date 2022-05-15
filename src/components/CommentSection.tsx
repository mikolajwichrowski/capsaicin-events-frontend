import { Box } from '@mui/material'
import React from 'react'
import { Typography, Button, TextField } from '@mui/material'
import Timeline from '@mui/lab/Timeline'
import { MessageRounded } from '@mui/icons-material'

export function CommentSection(formik, reactionElements: any) {
	return (
		<Box sx={{ marginBottom: '50px' }}>
			<form onSubmit={formik.handleSubmit}>
				<Typography variant="subtitle1">Comments</Typography>
				<br />
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						width: '100%',
					}}
				>
					<TextField
						sx={{
							width: 'calc(100% - 75px)',
						}}
						name="message"
						value={formik.values.message ?? ''}
						onChange={formik.handleChange}
						placeholder="Type a message"
					/>
					<Button
						sx={{ width: '55px', height: '55px' }}
						type="submit"
					>
						<MessageRounded />
					</Button>
				</Box>
			</form>
			<Box sx={{ marginTop: '20px' }}>
				{reactionElements?.length === 0 ?? (
					<Typography variant="caption">No reactions yet.</Typography>
				)}
				<Timeline position="alternate">{reactionElements}</Timeline>
			</Box>
		</Box>
	)
}

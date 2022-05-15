import { Box } from '@mui/material'
import React from 'react'
import { Typography, Button, TextField } from '@mui/material'
import BasicDatePicker from './BasicDatePicker'
import { MessageRounded } from '@mui/icons-material'

export function AvailibilitiesSection(
	formik,
	setField: (
		name: any,
		value: any
	) => (e: string | React.ChangeEvent<any>) => void,
	availibilitieElements: JSX.Element[]
) {
	return (
		<Box sx={{ marginBottom: '20px' }}>
			<Typography variant="subtitle1">Availibilities</Typography>
			<br />
			<form onSubmit={formik.handleSubmit}>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						width: '100%',
					}}
				>
					<BasicDatePicker
						value={formik.values.availibilityDate}
						renderInput={(params) => (
							<TextField
								sx={{
									width: 'calc(100% - 75px)',
								}}
								{...params}
							/>
						)}
						onChange={(value) =>
							setField('availibilityDate', value)
						}
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
				{availibilitieElements.length === 0 ?? (
					<Typography variant="caption">
						No availibilities yet.
					</Typography>
				)}
				<Box
					sx={{
						display: 'flex',
						gap: '10px',
						flexFlow: 'wrap row',
						marginBottom: '10px',
						justifyContent: 'center',
					}}
				>
					{availibilitieElements}
				</Box>
			</Box>
		</Box>
	)
}

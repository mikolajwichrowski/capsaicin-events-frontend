import { Box, Chip } from '@mui/material'
import React from 'react'
import { GlobalContextType } from '../store'
import { Typography } from '@mui/material'
import { Upload } from '@mui/icons-material'

export function FileSection(
	fileElements: any,
	userId: number,
	globalContext: GlobalContextType,
	inputFile: React.RefObject<HTMLInputElement>,
	filesRequest,
	formikFile
) {
	return (
		<>
			<Typography variant="subtitle1">Files</Typography>
			<br />
			<Box
				sx={{
					display: 'flex',
					gap: '10px',
					flexFlow: 'wrap row',
					marginBottom: '10px',
				}}
			>
				{fileElements}
				{userId === globalContext.selectedEvent.creator.id ? (
					<Chip
						label="Add file"
						avatar={<Upload />}
						onClick={() => inputFile?.current?.click()}
					/>
				) : (filesRequest?.data as unknown[])?.length === 0 ? (
					<Typography variant="caption">
						No files available.
					</Typography>
				) : (
					''
				)}
				<form onSubmit={formikFile.handleSubmit}>
					<input
						type="file"
						id="file"
						name="file"
						ref={inputFile}
						style={{ display: 'none' }}
						onChange={(event) => {
							formikFile.handleChange({
								target: {
									name: 'file',
									value: event?.target?.files?.[0],
								},
							})
							formikFile.submitForm()
						}}
					/>
				</form>
			</Box>
		</>
	)
}

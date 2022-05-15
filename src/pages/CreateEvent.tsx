import React, { useState } from 'react'
import { Fab, TextField, Box, Input, IconButton, Avatar } from '@mui/material'
import { useFormik } from 'formik'
import { useQuery } from 'react-query'
import * as yup from 'yup'
import { useNavigate } from 'react-router-dom'
import CloseIcon from '@mui/icons-material/Close'
import PhotoCamera from '@mui/icons-material/PhotoCamera'
import { SaveOutlined } from '@mui/icons-material'

const validationSchema = yup.object({
	description: yup.string().required('A description is required'),
	location: yup.string().required('A location is required'),
})

const CreateEvent = () => {
	const navigate = useNavigate()

	const [formData, setFormData] = useState<object | null>(null)
	const [isHttpError, setIsHttpError] = useState<boolean>(false)
	const [picture, setPicture] = useState('')

	const formik = useFormik({
		initialValues: {
			description: '',
			picture: '',
			location: '',
		},
		validationSchema: validationSchema,
		onSubmit: (values) => setFormData(values),
	})

	const { isError } = useQuery(
		'createEvent',
		() =>
			fetch(`/api/event`, {
				method: 'POST',
				body: JSON.stringify({ ...formData, picture }),
				headers: {
					'Content-Type': 'application/json',
				},
			}).then((res) => res.json()),
		{
			enabled: !!formData,
			retry: false,
			retryOnMount: true,
			onError: (err) => {
				console.error(err)
				setFormData(null)
			},
			onSuccess: (data) => {
				if (typeof data !== 'object') {
					setIsHttpError(true)
					setFormData(null)
					return
				}
				navigate('/')
			},
		}
	)

	const onClose = () => {
		navigate('/')
	}

	const readFile = (event) => {
		setPicture(event.target.result)
	}

	return (
		<Box>
			<Box sx={{ position: 'fixed', top: '10px', right: '10px' }}>
				<CloseIcon onClick={onClose}></CloseIcon>
			</Box>
			{isError ||
				(isHttpError && (
					<Box sx={{ color: 'red' }}>
						An error occurred while creating the event.
					</Box>
				))}
			<Box
				sx={{
					width: '500px',
					height: 'calc(100% - 80px)',
					margin: 'auto',
					marginTop: '80px',
					wordWrap: 'wrap',
				}}
			>
				<form onSubmit={formik.handleSubmit}>
					<Box
						sx={{
							marginBottom: '10px',
							marginTop: '10px',
							'> div': { marginBottom: '10px' },
						}}
					>
						<Box
							sx={{
								width: '100%',
								display: 'flex',
								justifyContent: 'center',
								height: '100px',
								flexDirection: 'row',
							}}
						>
							<label
								htmlFor="icon-button-file"
								style={{
									width: '100px',
									height: '100px',
								}}
							>
								<Input
									id="icon-button-file"
									type="file"
									sx={{ display: 'none' }}
									onChange={(e) => {
										// eslint-disable-next-line @typescript-eslint/no-explicit-any
										const file = (e.target as any).files[0]
										const reader = new FileReader()
										reader.addEventListener(
											'load',
											readFile
										)
										reader.readAsDataURL(file)
									}}
								/>
								<IconButton
									color="primary"
									aria-label="upload picture"
									component="span"
									sx={{
										position: 'absolute',
										marginTop: '-40px',
										color: 'lightgray',
										width: '100px',
										height: '100px',
									}}
								>
									<Avatar
										src={picture}
										sx={{
											width: '100px',
											height: '100px',
										}}
									>
										<PhotoCamera />
									</Avatar>
								</IconButton>
							</label>
						</Box>

						<TextField
							fullWidth
							id="location"
							name="location"
							label="Location"
							value={formik.values.location}
							onChange={formik.handleChange}
							error={
								formik.touched.location &&
								Boolean(formik.errors.location)
							}
							helperText={
								formik.touched.location &&
								formik.errors.location
							}
						/>

						<TextField
							multiline
							fullWidth
							maxRows={10}
							id="description"
							name="description"
							label="Description"
							value={formik.values.description.replace(
								/↵/g,
								'\n'
							)}
							onChange={formik.handleChange}
							error={
								formik.touched.description &&
								Boolean(formik.errors.description)
							}
							helperText={
								formik.touched.description &&
								formik.errors.description
							}
						/>
					</Box>
					<Fab
						color="primary"
						type="submit"
						sx={{
							position: 'fixed',
							bottom: '40px',
							right: '50vw',
							transform: 'translateX(50%)',
						}}
					>
						<SaveOutlined />
					</Fab>
				</form>
			</Box>
		</Box>
	)
}

export default CreateEvent

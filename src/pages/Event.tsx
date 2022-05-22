import React, { useContext, useEffect, FC, useRef } from 'react'
import { Box, Chip } from '@mui/material'
import { useQuery, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { GlobalContext } from '../store'
import CloseIcon from '@mui/icons-material/Close'
import { Typography, Avatar, Divider } from '@mui/material'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import { count } from '../counter'
import { useFormik } from 'formik'
import * as yup from 'yup'
import Cookies from 'js-cookie'
import { DeleteForeverOutlined } from '@mui/icons-material'
import { UserChipElement, UserImageElement } from '../components/UserImage'
import { FileSection } from '../components/FileSection'
import { CommentSection } from '../components/CommentSection'
import { AvailibilitiesSection } from '../components/AvailibilitiesSection'
import { AttendeesSection } from '../components/AttendeesSection'

export interface ReactionType {
	message: string
	availibilityDate: Date | null
	user: {
		username: string
	}
}

const validationSchema = yup.object({
	message: yup.string(),
	availibilityDate: yup.date().nullable(),
})

const Event: FC = () => {
	const queryClient = useQueryClient()
	const navigate = useNavigate()
	const globalContext = useContext(GlobalContext)
	const userId = parseInt(Cookies.get('user_id') ?? '0')
	const inputFile = useRef<HTMLInputElement>(null)

	const deleteEvent = () => {
		fetch(`/api/event/${globalContext?.selectedEvent.id}`, {
			method: 'DELETE',
		}).then(() => navigate('/'))
	}

	const formikAttendee = useFormik({
		initialValues: {
			user: null,
		},
		validationSchema: yup.object({
			user: yup.number().required('A user is required'),
		}),
		onSubmit: (values) => {
			fetch(`/api/event/${globalContext?.selectedEvent.id}/register`, {
				method: 'POST',
				body: JSON.stringify(values),
				headers: {
					'Content-Type': 'application/json',
				},
			}).then(() => {
				queryClient.invalidateQueries('attendees')
				formikAttendee.handleChange({
					target: {
						name: 'user',
						value: null,
					},
				})
			})
		},
	})

	const formikFile = useFormik({
		initialValues: {
			file: new Blob(),
		},
		onSubmit: (values) => {
			const data = new FormData()
			data.append('file', values.file)
			fetch(`/api/event/${globalContext?.selectedEvent.id}/upload`, {
				method: 'POST',
				body: data,
			}).then(() => {
				queryClient.invalidateQueries('files')
			})
		},
		validationSchema: yup.object({
			file: yup.mixed().nullable(),
		}),
	})

	const formik = useFormik({
		initialValues: {
			message: '',
			availibilityDate: null,
		},
		onSubmit: ({ message, availibilityDate }: Partial<ReactionType>) => {
			const isComment = !!message

			const payload = isComment
				? {
						message,
				  }
				: {
						availibilityDate: new Date(
							availibilityDate
								? availibilityDate.setDate(
										availibilityDate.getDate() + 1
								  )
								: new Date()
						),
				  }

			console.log({ isComment, payload })

			fetch(`/api/event/${globalContext?.selectedEvent.id}/react`, {
				method: 'POST',
				body: JSON.stringify({
					...payload,
					type: isComment ? 'COMMENT' : 'AVAILIBILITY',
				}),
				headers: {
					'Content-Type': 'application/json',
				},
			}).then(() => {
				setField(
					isComment ? 'message' : 'availibilityDate',
					isComment ? '' : null
				)

				queryClient.invalidateQueries('reactions')
			})
		},
		validationSchema,
	})

	const attendeesRequest = useQuery(
		'attendees',
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
		'reactions',
		() =>
			fetch(
				`/api/event/${globalContext?.selectedEvent.id}/reactions`
			).then((res) => res.json()),
		{
			enabled: !!globalContext?.selectedEvent?.id,
			retry: false,
		}
	)

	const filesRequest = useQuery(
		'files',
		() =>
			fetch(`/api/event/${globalContext?.selectedEvent.id}/files`).then(
				(res) => res.json()
			),
		{
			enabled: !!globalContext?.selectedEvent?.id,
			retry: false,
		}
	)

	const usersRequest = useQuery(
		'users',
		() => fetch('/api/user').then((res) => res.json()),
		{
			enabled: true,
			retry: false,
		}
	)

	const onClose = () => {
		navigate('/')
	}

	const setField = (name, value) =>
		formik.handleChange({
			target: {
				name,
				value,
			},
		})

	useEffect(() => {
		if (!globalContext.selectedEvent) {
			navigate('/')
		}
		window.scrollTo(0, 0)
	}, [])

	useEffect(() => {
		setField('message', '')
	}, [formik.values.availibilityDate])

	if (!globalContext.selectedEvent) {
		return <></>
	}

	const availibilities = reactionsRequest.data?.filter(
		(reaction) => reaction.type === 'AVAILIBILITY'
	)

	const countedAvailibilityDates = count(availibilities, (reaction) => {
		return new Date(reaction.availibilityDate).toLocaleDateString()
	})

	const availibilitieElements = Object.keys(countedAvailibilityDates)
		.sort((a, b) => {
			const amountOfVotesA: number = countedAvailibilityDates[a]
			const amountOfVotesB: number = countedAvailibilityDates[b]
			return amountOfVotesA - amountOfVotesB
		})
		.reverse()
		.map((countedKey, index) => {
			const amountOfVotes = countedAvailibilityDates[countedKey]
			const date = countedKey
			return (
				<Chip
					key={date}
					label={date}
					avatar={
						<Avatar
							sx={{
								color: 'white !important',
								backgroundColor: '#4caf50',
								filter: `saturate(${index === 0 ? 1 : 0})`,
							}}
						>
							{amountOfVotes}
						</Avatar>
					}
				/>
			)
		})

	const comments = reactionsRequest.data?.filter(
		(reaction) => reaction.type === 'COMMENT'
	)
	const reactionElements = comments?.reverse()?.map((reaction, index) => (
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

	const fileElements = filesRequest.data?.map((file, index) => (
		<Chip
			key={`[file][${index}]`}
			label={file.fileLocation.split('/').pop()}
			onClick={() => {
				window.open(`${file.fileLocation}`)
			}}
		/>
	))

	return (
		<Box>
			<Box sx={{ position: 'fixed', top: '10px', right: '10px' }}>
				<CloseIcon
					sx={{
						cursor: 'pointer',
					}}
					onClick={onClose}
				></CloseIcon>
			</Box>
			<Box
				sx={{
					width: '500px',
					height: 'calc(100% - 80px)',
					margin: 'auto',
					marginTop: '80px',
					wordWrap: 'wrap',
				}}
			>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						width: '100%',
						textAlign: 'center',
					}}
				>
					<Avatar
						sx={{
							height: '60px',
							width: '60px',
							margin: 'auto',
							border: '1px solid #ccc',
							display: 'inline-block',
						}}
						src={globalContext.selectedEvent.picture}
					/>
					<Typography variant="h2" sx={{ display: 'inline-block' }}>
						{globalContext.selectedEvent.location}
						{userId === globalContext.selectedEvent.creator.id ? (
							<DeleteForeverOutlined
								onClick={deleteEvent}
								sx={{
									fontSize: '20px',
									marginLeft: '10px',
									cursor: 'pointer',
									marginBottom: '35px',
									color: 'red',
									position: 'absolute',
								}}
							/>
						) : (
							''
						)}
					</Typography>
				</Box>
				<Box
					sx={{
						marginTop: '40px',
						marginBottom: '40px',
						textAlign: 'center',
					}}
				>
					<Typography variant="caption" sx={{ color: 'gray' }}>
						Organised by
					</Typography>
					<br />
					<UserChipElement
						username={globalContext.selectedEvent.creator.username}
					/>
				</Box>

				<Box sx={{ marginBottom: '20px', marginTop: '20px' }}>
					<Typography variant="subtitle1">Description</Typography>
					<Typography variant="caption">
						<pre style={{ fontFamily: 'inherit' }}>
							{globalContext.selectedEvent.description}
						</pre>
					</Typography>
				</Box>

				<Divider
					sx={{ marginBottom: '40px', marginTop: '50px' }}
				></Divider>

				{FileSection(
					fileElements,
					userId,
					globalContext,
					inputFile,
					filesRequest,
					formikFile
				)}

				<Divider
					sx={{ marginBottom: '40px', marginTop: '50px' }}
				></Divider>

				{AttendeesSection(
					userId,
					globalContext,
					formikAttendee,
					usersRequest,
					attendeesRequest
				)}

				<Divider
					sx={{ marginBottom: '40px', marginTop: '50px' }}
				></Divider>

				{AvailibilitiesSection(formik, setField, availibilitieElements)}

				<Divider
					sx={{ marginBottom: '40px', marginTop: '50px' }}
				></Divider>

				{CommentSection(formik, reactionElements)}
			</Box>
		</Box>
	)
}

export default Event

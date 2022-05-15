import React, { useContext } from 'react'
import { useQuery } from 'react-query'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import { Box, List, LinearProgress, Fab } from '@mui/material'
import { GlobalContext } from '../store'
import { EventItem } from '../components/EventItem'
import NavBar from '../components/NavBar'
import AddIcon from '@mui/icons-material/Add'

const Home = () => {
	const navigate = useNavigate()
	const globalContext = useContext(GlobalContext)
	const { isLoading, data } = useQuery(
		'events',
		() => fetch('/api/event').then((res) => res.json()),
		{
			cacheTime: 0,
			useErrorBoundary: true,
			retry: false,
			onError: () => {
				Cookies.set('logged_in', 'no')
				navigate('/login')
			},
		}
	)

	const logOut = () => {
		Cookies.set('logged_in', 'no')
		navigate('/login')
	}

	const openEvent = (event) => () => {
		globalContext.setSelectedEvent(event)
		navigate(`/event/${event.id}`)
	}

	const eventItems = data?.map((event) => (
		<EventItem key={event.id} event={event} onClick={openEvent(event)} />
	))

	return (
		<div>
			<NavBar onLogout={logOut} />
			<Box sx={{ height: 'calc(100% - 60px)', marginTop: '60px' }}>
				{isLoading ? <LinearProgress /> : <List>{eventItems}</List>}
			</Box>
			<Fab
				color="primary"
				aria-label="add"
				onClick={() => navigate('/new')}
				sx={{
					position: 'fixed',
					bottom: '20px',
					right: '20px',
				}}
			>
				<AddIcon />
			</Fab>
		</div>
	)
}

export default Home

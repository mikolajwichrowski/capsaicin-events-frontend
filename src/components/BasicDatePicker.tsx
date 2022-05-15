import React, { FC } from 'react'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { DatePickerProps } from '@mui/x-date-pickers/DatePicker'

const BasicDatePicker: FC<DatePickerProps<Date, Date>> = ({
	value,
	...props
}) => {
	const dateValue = value ?? null

	return (
		<LocalizationProvider dateAdapter={AdapterDateFns}>
			<DatePicker {...props} value={dateValue} />
		</LocalizationProvider>
	)
}

export default BasicDatePicker

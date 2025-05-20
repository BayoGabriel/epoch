"use client"

import { useState, useRef, useEffect } from "react"
import { FiCalendar, FiChevronDown } from "react-icons/fi"
import { format, addDays, subDays, subMonths, startOfMonth, endOfMonth, isAfter, isBefore, isEqual } from "date-fns"

export default function DateRangePicker({ startDate, endDate, onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredDate, setHoveredDate] = useState(null)
  const [selectedRange, setSelectedRange] = useState("custom")
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleDateClick = (date) => {
    if (!startDate || (startDate && endDate) || isAfter(date, startDate)) {
      onChange({ startDate: date, endDate: null })
      setHoveredDate(date)
    } else {
      onChange({ startDate, endDate: date })
    }
  }

  const handleDateHover = (date) => {
    if (startDate && !endDate) {
      setHoveredDate(date)
    }
  }

  const isInRange = (date) => {
    if (startDate && !endDate && hoveredDate) {
      return (
        (isAfter(date, startDate) && isBefore(date, hoveredDate)) ||
        (isAfter(date, hoveredDate) && isBefore(date, startDate))
      )
    }
    if (startDate && endDate) {
      return isAfter(date, startDate) && isBefore(date, endDate)
    }
    return false
  }

  const isStartOrEnd = (date) => {
    if (!startDate && !endDate) return false
    return (startDate && isEqual(date, startDate)) || (endDate && isEqual(date, endDate))
  }

  const generateDays = (year, month) => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()

    const days = []
    const startingDayOfWeek = firstDay.getDay()

    // Add days from previous month to fill the first row
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
      })
    }

    // Add days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      })
    }

    // Add days from next month to fill the last row
    const remainingDays = 7 - (days.length % 7)
    if (remainingDays < 7) {
      for (let i = 1; i <= remainingDays; i++) {
        days.push({
          date: new Date(year, month + 1, i),
          isCurrentMonth: false,
        })
      }
    }

    return days
  }

  const applyPresetRange = (range) => {
    const today = new Date()
    let newStartDate, newEndDate

    switch (range) {
      case "today":
        newStartDate = today
        newEndDate = today
        break
      case "yesterday":
        newStartDate = subDays(today, 1)
        newEndDate = subDays(today, 1)
        break
      case "last7days":
        newStartDate = subDays(today, 6)
        newEndDate = today
        break
      case "last30days":
        newStartDate = subDays(today, 29)
        newEndDate = today
        break
      case "thisMonth":
        newStartDate = startOfMonth(today)
        newEndDate = endOfMonth(today)
        break
      case "lastMonth":
        const lastMonth = subMonths(today, 1)
        newStartDate = startOfMonth(lastMonth)
        newEndDate = endOfMonth(lastMonth)
        break
      default:
        return
    }

    setSelectedRange(range)
    onChange({ startDate: newStartDate, endDate: newEndDate })
    setIsOpen(false)
  }

  // Generate calendar for current month and next month
  const today = new Date()
  const currentMonthDays = generateDays(today.getFullYear(), today.getMonth())
  const nextMonthDays = generateDays(today.getFullYear(), today.getMonth() + 1)

  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white border rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
      >
        <FiCalendar className="h-4 w-4" />
        <span>
          {startDate && endDate
            ? `${format(startDate, "MMM d, yyyy")} - ${format(endDate, "MMM d, yyyy")}`
            : "Select date range"}
        </span>
        <FiChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 bg-white border rounded-lg shadow-lg p-4 w-[640px] right-0">
          <div className="flex">
            {/* Preset ranges */}
            <div className="w-1/4 pr-4 border-r">
              <h3 className="font-medium text-sm text-gray-500 mb-2">Date Range</h3>
              <div className="space-y-1">
                <button
                  onClick={() => applyPresetRange("today")}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md ${selectedRange === "today" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"}`}
                >
                  Today
                </button>
                <button
                  onClick={() => applyPresetRange("yesterday")}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md ${selectedRange === "yesterday" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"}`}
                >
                  Yesterday
                </button>
                <button
                  onClick={() => applyPresetRange("last7days")}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md ${selectedRange === "last7days" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"}`}
                >
                  Last 7 days
                </button>
                <button
                  onClick={() => applyPresetRange("last30days")}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md ${selectedRange === "last30days" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"}`}
                >
                  Last 30 days
                </button>
                <button
                  onClick={() => applyPresetRange("thisMonth")}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md ${selectedRange === "thisMonth" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"}`}
                >
                  This month
                </button>
                <button
                  onClick={() => applyPresetRange("lastMonth")}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md ${selectedRange === "lastMonth" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"}`}
                >
                  Last month
                </button>
              </div>
            </div>

            {/* Calendars */}
            <div className="w-3/4 pl-4 flex">
              {/* Current month */}
              <div className="w-1/2 pr-2">
                <div className="text-center mb-2">
                  <h3 className="font-medium">{format(today, "MMMM yyyy")}</h3>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {weekDays.map((day) => (
                    <div
                      key={day}
                      className="text-center text-xs font-medium text-gray-500 h-8 flex items-center justify-center"
                    >
                      {day}
                    </div>
                  ))}
                  {currentMonthDays.map(({ date, isCurrentMonth }, index) => (
                    <button
                      key={index}
                      onClick={() => handleDateClick(date)}
                      onMouseEnter={() => handleDateHover(date)}
                      className={`h-8 w-8 flex items-center justify-center text-sm rounded-full
                        ${!isCurrentMonth ? "text-gray-400" : "text-gray-700"}
                        ${isStartOrEnd(date) ? "bg-blue-500 text-white hover:bg-blue-600" : ""}
                        ${isInRange(date) ? "bg-blue-100" : ""}
                        ${!isStartOrEnd(date) && isCurrentMonth ? "hover:bg-gray-100" : ""}
                      `}
                    >
                      {date.getDate()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Next month */}
              <div className="w-1/2 pl-2">
                <div className="text-center mb-2">
                  <h3 className="font-medium">{format(addDays(endOfMonth(today), 1), "MMMM yyyy")}</h3>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {weekDays.map((day) => (
                    <div
                      key={day}
                      className="text-center text-xs font-medium text-gray-500 h-8 flex items-center justify-center"
                    >
                      {day}
                    </div>
                  ))}
                  {nextMonthDays.map(({ date, isCurrentMonth }, index) => (
                    <button
                      key={index}
                      onClick={() => handleDateClick(date)}
                      onMouseEnter={() => handleDateHover(date)}
                      className={`h-8 w-8 flex items-center justify-center text-sm rounded-full
                        ${!isCurrentMonth ? "text-gray-400" : "text-gray-700"}
                        ${isStartOrEnd(date) ? "bg-blue-500 text-white hover:bg-blue-600" : ""}
                        ${isInRange(date) ? "bg-blue-100" : ""}
                        ${!isStartOrEnd(date) && isCurrentMonth ? "hover:bg-gray-100" : ""}
                      `}
                    >
                      {date.getDate()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer with selected range and buttons */}
          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <div className="text-sm">
              {startDate && endDate ? (
                <span>
                  {format(startDate, "MMM d, yyyy")} - {format(endDate, "MMM d, yyyy")}
                </span>
              ) : startDate ? (
                <span>{format(startDate, "MMM d, yyyy")} - Select end date</span>
              ) : (
                <span>Select start date</span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onChange({ startDate: null, endDate: null })
                  setSelectedRange("custom")
                }}
                className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
              >
                Clear
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
                disabled={!startDate || !endDate}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

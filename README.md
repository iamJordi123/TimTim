# TimTim - NS Train Driver Timer

A replica of the NS (Dutch Railways) TimTim timer interface used by train drivers in the Netherlands. This web-based timer features the authentic dark-themed design with a C-shaped progress ring and real-time countdown display.

## Features

- 🚂 **Authentic NS TimTim Design** - Dark blue-grey interface matching the original train driver interface
- ⭕ **C-Shaped Progress Ring** - Blue circular indicator that fills as departure time approaches
- 👁️ **Eye Icon** - Central visual element with "Tijd voor vertrek" (Time for departure) label
- ⏰ **Real-Time Countdown** - Large, bold countdown display showing time remaining until departure
- 🕐 **Current Time Display** - Live clock in the header showing current time
- 🎫 **Departure Time Indicator** - Shows target departure time with "V" badge
- 🔄 **Reset Functionality** - Reset button to start a new countdown
- 📱 **Responsive Design** - Works on desktop and mobile devices

## Usage

Simply open `index.html` in your web browser to start using the timer.

The timer automatically starts counting down to the departure time (default: 14:30:00). 

- The **C-shaped blue ring** fills from bottom-left, over the top, to bottom-right as time approaches departure
- The **countdown display** shows the remaining time in MM:SS format
- Click **Reset** to set a new 15-minute countdown from the current time

## Design Details

- **Background**: Dark blue-grey (#1a1f2e) matching the NS interface
- **Progress Ring**: Blue (#4A90E2) C-shaped arc open at the bottom
- **Typography**: Clean, modern sans-serif fonts with tabular numerals
- **Layout**: Centered timer with header showing sun icon and current time

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript
- SVG for graphics and animations

## Inspiration

This project recreates the TimTim interface used by NS train drivers in the Netherlands for tracking departure times and managing train schedules.

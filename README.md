# Panex

A small web based desktop environment that tries to recreate the feel of an old windows desktop in the browser.

<img width="1908" height="898" alt="image" src="https://github.com/user-attachments/assets/43489db9-e7d1-4bc0-8964-e58889c154bb" />

## Overview

Panex is a web0S that i made as part of my Stardance project.

I wanted to make something that actually feels like a desktop instead of just making a page that looks like one, so it has draggable windows, a taskbar, a start menu, desktop icons and a few small apps.

right now it has notepad, weather and my computer, along with some other little things like minimizing windows, taskbar buttons and a recycle bin.

## Features

Desktop style interface

Draggable windows

Open and close windows

Minimize windows

Taskbar app buttons

Start menu

Live clock

Notepad with localStorage saving

Weather using the browser's location and Open-Meteo

My computer window

Toggleable recycle bin

Old windows style icons and UI

## Apps

### Notepad

A basic notepad window where you can write whatever you want.

the text gets saved to localStorage so it stays there after refreshing the page.

<img width="1911" height="888" alt="image" src="https://github.com/user-attachments/assets/6b4537dd-d1fe-4bc8-aa94-8792203bd738" />


### Weather

Uses browser geolocation to get your location and then uses Open-Meteo to get the current temperature.

<img width="1906" height="896" alt="image" src="https://github.com/user-attachments/assets/5c4feb33-9750-436e-b244-3d3b3d79d646" />


### My Computer

Mostly just a fake file system style window for now.

### Recycle Bin

Clicking the recycle bin switches between the empty and full icons cuz I couldnt think of another use for them lol.

## Screenshots

### Desktop

The main desktop with the taskbar, icons and windows.

<img width="1910" height="893" alt="image" src="https://github.com/user-attachments/assets/69810e31-1346-46dc-a07b-08ca42e49603" />


## How It Works

Panex is just plain HTML, CSS and JavaScript.

The desktop and windows are built with normal HTML elements, CSS handles the old school windows styling and JavaScript handles things like dragging windows, opening apps, the taskbar, the start menu and saving notepad data.

The project is split into a few simple files instead of putting everything into one massive file.


| Files | Description |
| :--- | :--- |
| `index.html` | Main desktop and window structure |
| `style.css` | All the desktop and windows styling |
| `script.js` | Window behaviour, taskbar, clock, weather, and localStorage |
| `icons/` | Desktop and application icons |

## Running It

clone the repo:

    git clone https://github.com/Nithish1201-code/Panex.git
    cd Panex

then run it with any local web server.

for example:

    python3 -m http.server 1234

then open `http://localhost:1234` in your browser.

## Why I Built It

Mostly because I thought that i had an uncompleted mission on stardance and it wouldnt hurt to finish it.

I also wanted to make something that looked like an old desktop from the late 90s / early 2000s while still having a few modern browser features underneath it.

it started as a simple desktop mockup and then I kept adding little things until it started feeling more like an actual OS.

## Current Status

Panex has a working desktop, taskbar, start menu, draggable windows, minimizing and closing, a notepad app, weather, a fake my computer app and a recycle bin toggle.

there are still a bunch of things i'd like to add later, especially more apps, a proper wallpaper and a boot screen.

# Financial Dashboard

A full-stack financial dashboard application built with Next.js and Flask.

## Features

- Real-time financial data visualization
- API integration with financial data providers

## Tech Stack

- **Frontend**: Next.js, Typescript, TailwindCSS
- **Backend**: Flask (Python)

## Prerequisites

- Node.js 16.x or later
- Python 3.8 or later
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/AdvaitDhakad/FinDash.git
cd finacial_dashboard
```

2. Install frontend dependencies:
```bash
npm install
# or
yarn install
```

3. Set up Python virtual environment:
```bash
cd api
python -m venv venv
# On Windows
.\venv\Scripts\activate
# On Unix or MacOS
source venv/bin/activate
```

4. Install Python dependencies:
```bash
pip install -r requirements.txt
```

## Running the Application

1. Start the Next.js development server:
```bash
npm run dev


2. Start the Flask backend server:
```bash
cd api
python index.py
```

The frontend will be available at `http://localhost:3000`
The backend API will be available at `http://localhost:5000`

## Project Structure

```
finacial_dashboard/
├── api/                # Flask backend
│   ├── venv/          
│   ├── index.py       # Main Flask application
│   └── requirements.txt
├── components/        # React components
├── pages/            # Next.js pages
├── public/           # Static assets
└── styles/           # CSS styles
```


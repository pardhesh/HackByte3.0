# Job Search Application

A modern React-based web application that serves as a frontend to an n8n job search workflow.

## Features

- Clean, modern UI with a responsive design
- Text input for job search queries
- Voice input support using the Web Speech API
- Integration with n8n workflow through webhook
- Loading animations and error handling
- Display of job search results and confirmation of sent emails

## Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

## Installation

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

## Running the Application

Start the development server:

```bash
npm start
```

The application will open in your default browser at [http://localhost:3000](http://localhost:3000).

## Build for Production

Create a production-ready build:

```bash
npm run build
```

## Technologies Used

- React.js
- Axios for API requests
- Web Speech API for voice recognition
- CSS for styling
- n8n webhook integration 
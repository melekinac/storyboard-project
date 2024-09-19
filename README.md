# Storyboard Project

This is a Svelte project created using `create-svelte`. It includes Docker support for containerized development and local environments.

## Prerequisites

Before running the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/en/) (v20 or later)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- [npm](https://www.npmjs.com/)

## Setup

Follow these steps to get the project up and running.

### 1. Cloning the Repository

Clone this repository to your local machine:

```bash
git clone https://github.com/melekinac/storyboard-project.git
cd storyboard-project
```

### 2. Installing Dependencies

Install all project dependencies by running:

```bash
npm install
```

### 3. Running the Project with Docker

To run the project in a containerized environment with Docker:

```bash
docker-compose up --build
```

This will build the Docker containers and start the application.

To run the project in the background (detached mode), use:

```bash
docker-compose up -d
```

You can stop the containers with:

```bash
docker-compose down
```

### 4. Running Locally (Without Docker)

If you prefer to run the project locally without Docker, use the following commands:

```bash
npm run dev
```

### File Structure

Here is an overview of the key directories and files in the project:

#### /src: Contains all the source code.

#### /routes: The routes for the SvelteKit app.

#### /style/global.css: Global styles for the app.

#### /public: Static assets served by the app.

#### /docker-compose.yml: Docker configuration file for setting up services.

#### /Dockerfile: Dockerfile for building the app container.

#### init.sql: SQL script for initializing the database (if applicable).

### Technologies Used

#### SvelteKit: For building the app.

#### TailwindCSS: For styling.

#### Docker: For containerization.

#### PostgreSQL: As the database (optional, can be configured in the Docker setup).

# DocFlow

A web application for efficient document management.

## Overview

DocFlow is a feature-rich document management system built with React TypeScript and Flask, providing an intuitive interface for organizing and editing text documents.

## Tech Stack

- Frontend: React with TypeScript
- Backend: Flask (Python)
- Database: SQLite

## Key Features

### Advanced File Management

- Hierarchical file organization with folders and subfolders
- Drag-and-drop functionality for easy document reorganization
- Rename, move, and delete operations
- Intuitive navigation through document structures

### Document Editor

- Based on React Quill with custom enhancements
- Rich text formatting capabilities
- Clean and distraction-free interface

### Collaborative Features

- Document sharing via unique links
- Configurable access levels (Editor/Viewer modes)

## Docker

### Prerequisites

- Git
- Docker
- Docker Compose

### Building and Running the Application

1. Clone this repository:

   ```
    git clone https://github.com/SandroK0/DocFlow.git
    cd DocFlow 
   ```

2. Build the Docker containers:

   ```
   docker compose build
   ```

3. Start the application:

   ```
   docker compose up
   ```

4. Access the application in your web browser at `http://localhost:3000` (or the appropriate port if you've configured it differently).

To stop the application, press `Ctrl+C` in the terminal where it's running, or run:

```
docker compose down
```

---

## Screenshots

### File Manager

<img src="./screenshots/FileManager.png" alt="DocFlow File Manager showing hierarchical document organization with drag-and-drop interface" />

### Document Editor

<img src="./screenshots/Editor.png" alt="DocFlow Document Editor featuring rich text formatting tools and collaborative editing" />


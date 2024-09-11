Assignment 1 - Web Server - Response to Criteria
================================================

Overview
------------------------------------------------

- **Name:** Dennis Chen 
- **Student number:** n12150801
- **Application name:** Video Transcoding Web App
- **Two line description:** Web application that allows users to upload videos, transcode into different formats and download. The app utilizes Docker for containerized deployment and integrates with AWS ECR for image management, and EC2 instance.

Video Demonstration
------------------------------------------------
[View the video here](https://youtu.be/NhyooAm1Kts)



Core criteria
------------------------------------------------

### Docker image

- **ECR Repository name:** n12150801/video-transcoding
- **Video timestamp:** 1:15
- **Relevant files:**
  - /client/Dockerfile
  - /server/Dockerfile 

### Docker image running on EC2

- **EC2 instance ID:** i-0d7b6bd3b79c3ddc3
- **Video timestamp:** 1:48

### User login functionality

- **One line description:** Registration and Login done through the web app, using JSON web token and storing it in cookie
- **Video timestamp:** 1:55
- **Relevant files:**
  - /server/routes/userRoute.js 6, 9
  - /server/controllers/userController.js 9, 34  

### User dependent functionality

- **One line description:** Users can only view their own videos uploaded
- **Video timestamp:** 3:41
- **Relevant files:**
  - /server/routes/videoRoute.js 9
  - /server/controller/videoController.js 95
  - /server/models/video.js 15

### Web client

- **One line description:** React Web Application
- **Video timestamp:** 1:55
- **Relevant files:**
  - /client/src

### REST API

- **One line description:** Endpoints split into 2 categories, 1 for user related, 1 for video related
- **Video timestamp:** 0:52
- **Relevant files:**
  - /server/routes
  - /server/controllers
  - /server/models

### Two kinds of data

#### First kind

- **One line description:** Video Metadata
- **Type:** Structured, SQLite3, no ACID requirements
- **Rationale:** Need to be able to query for user and video data.  Low chance of multiple writes to single file or user data.
- **Video timestamp:** 0:26
- **Relevant files:**
  - /server/database.js
  - /server/models

#### Second kind

- **One line description:** Video File
- **Type:** Unstructured, Blob Storage
- **Rationale:** Videos are too large for database.  No need for additional functionality.
- **Video timestamp:** 0:26
- **Relevant files:**
  - /server/controllers/videoController.js 10
  - /server/uploads (Only initialised after launching the web application)

### CPU intensive task

- **One line description:** Video Transcoding Application with ffmpeg
- **Video timestamp:** 0:00
- **Relevant files:**
  - /server/ffmpeg.js
  - /server/routes/videoRoute.js 16
  - /server/controllers/videoController.js 188

### CPU load testing method

- **One line description:** Launching the client and server and manually uploading, reformating video
- **Video timestamp:** 3:04

Additional criteria
------------------------------------------------

### Extensive REST API features

- **One line description:** User - Registration / Logout, Video - Delete / Download 
- **Video timestamp:** 1:55
- **Relevant files:**
  - /server/routes
  - /server/controllers


### Use of external API(s)

- **One line description:** Not attempted
- **Video timestamp:**
- **Relevant files:**


### Extensive web client features

- **One line description:** File Dropzone / Navbar / Cards 
- **Video timestamp:** 2:28
- **Relevant files:**
  - /client/src/components/Dropzone/Dropzone.jsx
  - /client/src/components/Navbar/Navbar.jsx
  - /client/src/components/Navbar/Navbar.css
  - /client/src/components/VideoCard/VideoCard.jsx
  - /client/src/pages/Upload/Upload.jsx
  - /client/src/pages/Video/Video.jsx


### Sophisticated data visualisations

- **One line description:** Not attempted
- **Video timestamp:**
- **Relevant files:**


### Additional kinds of data

- **One line description:** Image File
- **Video timestamp:** 0:26
- **Relevant files:**
  - /server/ffmpeg.js 27
  - /server/thumbnails (Only initialised after launching the web application)


### Significant custom processing

- **One line description:** Capturing thumbnail from video file uploaded
- **Video timestamp:** 1:55
- **Relevant files:**
  - /server/controllers/videoController.js 10
  - /server/ffmpeg.js 27


### Live progress indication

- **One line description:** Not attempted
- **Video timestamp:** 
- **Relevant files:**


### Infrastructure as code

- **One line description:** Not attempted
- **Video timestamp:** 
- **Relevant files:**


### Other

- **One line description:** Not attempted
- **Video timestamp:**
- **Relevant files:**

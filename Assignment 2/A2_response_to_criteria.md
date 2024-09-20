Assignment 2 - Cloud Services - Response to Criteria
================================================

Instructions
------------------------------------------------
- Keep this file named A2_response_to_criteria.md, do not change the name
- Upload this file along with your code in the root directory of your project
- Upload this file in the current Markdown format (.md extension)
- Do not delete or rearrange sections.  If you did not attempt a criterion, leave it blank
- Text inside [ ] like [eg. S3 ] are examples and should be removed


Video Demonstration
------------------------------------------------
[View the video here](https://youtu.be/yEb-kf-tSBY)

Overview
------------------------------------------------

- **Name:** Dennis Chen 
- **Student number:** n12150801
- **Partner name (if applicable):**
- **Application name:** Video Transcoding Web App
- **Two line description:** Web application that allows users to upload videos, transcode into different formats and download. The app utilizes Docker for containerized deployment and integrates with AWS Services
- **EC2 instance name or ID:** i-0d7b6bd3b79c3ddc3

Core criteria
------------------------------------------------

### Core - First data persistence service

- **AWS service name:**  S3
- **What data is being stored?:** Video files and image (thumbnail) files.
- **Why is this service suited to this data?:** S3 is a highly scalable object storage service that is ideal for storing large binary objects such as videos and images. It allows for efficient retrieval and handling of large files, which would be limited or unsuitable in other database services.
- **Why is are the other services used not suitable for this data?:** DynamoDB and other structured databases are not optimized for storing large binary objects like video or image files due to size limitations and performance constraints.
- **Bucket/instance/table name:** n12150801-assessment
- **Video timestamp:** 4:05
- **Relevant files:**
    - /server/aws/s3.js
    - /server/controllers/thumbnailController.js 
    - /server/controllers/videoController.js

### Core - Second data persistence service

- **AWS service name:**  DynamoDB
- **What data is being stored?:** Video Metadata
- **Why is this service suited to this data?:** DynamoDB’s flexible schema allows for storing various metadata fields without predefined table structures, providing adaptability as video attributes evolve.
- **Why is are the other services used not suitable for this data?:** S3 is not designed for fast retrieval of structured metadata, and storing metadata in S3 objects would require additional parsing, which reduces performance.
- **Bucket/instance/table name:** n12150801-assignment-videometadata
- **Video timestamp:** 4:05
- **Relevant files:**
    - /server/aws/dynamodb.js
    - /server/controllrs/videoController.js 

### Third data service
Not Attempted
- **AWS service name:**  
- **What data is being stored?:** 
- **Why is this service suited to this data?:** 
- **Why is are the other services used not suitable for this data?:** 
- **Video timestamp:**
- **Relevant files:**

### S3 Pre-signed URLs

- **S3 Bucket names:** n12150801-assessment
- **Video timestamp:** 6:11
- **Relevant files:**
    - /server/aws/s3.js 63

### In-memory cache 
Not Attempted
- **ElastiCache instance name:**
- **What data is being cached?:** 
- **Why is this data likely to be accessed frequently?:** 
- **Video timestamp:**
- **Relevant files:**
    -

### Core - Statelessness

- **What data is stored within your application that is not stored in cloud data services?:** Intermediate video files, such as transcoded or reformatted video files, which are created during processing but not persisted to any cloud storage service unless specifically uploaded.
- **Why is this data not considered persistent state?:** These intermediate files are temporary and can be recreated from the source video files if lost. They are stored locally only during the processing phase and deleted immediately after the process finishes. Therefore, they are not meant to be long-term persistent data.
- **How does your application ensure data consistency if the app suddenly stops?:** The application tracks processing progress in a try-catch block that ensures video metadata is uploaded first, followed by the thumbnail and video file. If any step fails, the successfully uploaded parts (e.g., metadata, video, or thumbnail) are cleaned up, and an error response is returned. This approach maintains consistency, as all resources are deleted if an error occurs mid-operation, preventing partial uploads. Additionally, no database transaction occurs until the file processing is completed. This ensures that DynamoDB remains consistent and doesn’t store incomplete records.
- **Relevant files:**
    - /server/controllers/videoController.js 28 166

### Graceful handling of persistent connections
Not Attempted
- **Type of persistent connection and use:** 
- **Method for handling lost connections:** 
- **Relevant files:**


### Core - Authentication with Cognito

- **User pool name:** n12150801-cognito-assignment
- **How are authentication tokens handled by the client?:** After a successful login, the authentication token (IdToken) is returned by Cognito and set as a cookie on the client-side.
- **Video timestamp:** 1:13
- **Relevant files:**
    - /server/aws/congnito.js
    - /server/controllers/userController.js 

### Cognito multi-factor authentication
Not Attempted
- **What factors are used for authentication:** [eg. password, SMS code]
- **Video timestamp:**
- **Relevant files:**
    -

### Cognito federated identities
Not Attempted
- **Identity providers used:**
- **Video timestamp:**
- **Relevant files:**
    -

### Cognito groups
Not Attempted
- **How are groups used to set permissions?:** 
- **Video timestamp:**
- **Relevant files:**
    -

### Core - DNS with Route53

- **Subdomain**:  n12150801.cab432.com
- **Video timestamp:** 0:40


### Custom security groups
Not Attempted
- **Security group names:**
- **Services/instances using security groups:**
- **Video timestamp:**
- **Relevant files:**
    -

### Parameter store

- **Parameter names:** /n12150801/cognito/clientid, /n12150801/cognito/userpoolid
- **Video timestamp:** 2:56
- **Relevant files:**
    - /server/aws/ssm.js
    - /server/aws/cognito.js 7

### Secrets manager
Not Attempted
- **Secrets names:** 
- **Video timestamp:**
- **Relevant files:**
    -

### Infrastructure as code
Not Attempted
- **Technology used:**
- **Services deployed:**
- **Video timestamp:**
- **Relevant files:**
    -

### Other (with prior approval only)
Not Attempted
- **Description:**
- **Video timestamp:**
- **Relevant files:**
    -

### Other (with prior permission only)
Not Attempted
- **Description:**
- **Video timestamp:**
- **Relevant files:**
    -
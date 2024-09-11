# Queensland University of Technology
# CAB430 Cloud Computing 

## Overview

This unit involves three assessments that together form a single project implementing a web application on a cloud platform using cloud services and architecture. Each assessment represents a stage in the deployment of the application, incorporating increasingly sophisticated cloud services and architectures.

## Assignments

### Assignment 1: Monolithic Web Application Deployment

**Objective:**  
Implement and deploy a monolithic web application to a cloud virtual machine using a container.

**Core Criteria:**

- **CPU Intensive Process:** Your application must include at least one CPU-intensive process that can be triggered by web requests to load down the server (> 90% CPU usage).
- **Load Testing:** Demonstrate a method (script or manual) for generating enough web requests to maintain > 90% CPU load for an extended period (5 minutes) with headroom on your network connection to support an additional 3 servers.
- **Data Storage:** Store at least two different types of data (excluding user login data).
- **Docker Container:** Bundle your application into a Docker container and store it on the AWS ECR instance.
- **EC2 Deployment:** Deploy your application container to an EC2 instance.
- **REST API:** Implement a REST-based API as the primary interface for your application.
- **Web Client:** Develop a basic web client to demonstrate the functionality of the application.
- **User Login:** Implement basic user login with meaningful distinctions between different users.

### Assignment 2: Cloud Services and Statelessness

**Objective:**  
Utilize cloud services for persistence to make your application stateless, and integrate additional cloud services to enhance functionality.

**Core Criteria:**

- **Persistence Services:**
  - Use at least two distinct types of cloud persistence services.

- **Identity Services:**
  - Utilize AWS Cognito for user identity management and authentication, including:
    - Sign up page
    - Email confirmation
    - Login functionality

- **Statelessness:**
  - Ensure all persistent data is stored in cloud services.
  - Your application should handle the loss of persistent connections gracefully (e.g., websocket connections).
  - The application state should remain consistent if restarted with a fresh container/EC2 instance.
  - If state is used (e.g., for progress reporting), handle loss of state gracefully or provide a convincing argument for a stateful design (e.g., real-time requirements).

- **DNS:** 
  - Implement DNS as part of your cloud services setup.

### Assignment 3: Microservice Architecture

**Objective:**  
Adopt a microservice-based cloud architecture and utilize cloud communication services to enhance the modularity and scalability of your application.

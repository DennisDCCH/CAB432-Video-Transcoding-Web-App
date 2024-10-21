# Queensland University of Technology
## CAB432 Cloud Computing

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

### Assignment 3: Microservices and Cloud Applications

**Objective:**  
Adopt a microservice-based cloud architecture and utilize cloud communication services to enhance the modularity and scalability of your application.

**Core Criteria:**

- **Microservices:**
  - Your application must have at least two separate services running on separate compute instances:
    - The separation must be meaningful. For example, one service might provide the main REST API or serve the web client, while another service handles the CPU-intensive process, which you will horizontally scale.
    - These services must run on separate compute instances (e.g., separate EC2 instances, separate containers on ECS, or a combination of ECS and EC2).
    
- **Load Distribution Mechanism:**
  - Your application must implement an appropriate mechanism for distributing load to multiple instances of the CPU-intensive service:
    - An application load balancer may be suitable if a single instance of the service can handle multiple requests simultaneously.
    - A message queue (e.g., SQS) delivering each message to only one instance is more suitable for long-running or single-task processes.
  
- **Auto Scaling:**
  - The CPU-intensive service must automatically scale horizontally in response to load.
    - Clients should not experience interruptions during scaling, though response times may increase until new instances are available.
    - The service can run on ECS or EC2, but Lambda cannot be used for the CPU-intensive process.
    - Demonstrate autoscaling from 1 instance/container to 3 and back down to 1 in response to load.
    - The target mechanism for autoscaling should use average CPU utilization, with a target set to 70%. Do not reduce the target to compensate for an inability to achieve high CPU utilization.
    - For EC2, ensure that you are using single-CPU instance types (e.g., t2.micro) if you are using a single-threaded application, and set the credit specification to unlimited for t2 instance types.

- **HTTPS:**
  - Your application must be available over TLS:
    - Set up a subdomain of cab432.com in Route 53 with a CNAME record pointing to the appropriate endpoint for your application.
    - Obtain a certificate using AWS Certificate Manager (ACM).
    - Use an API Gateway or Application Load Balancer to route requests to your server instance(s), using the certificate for HTTPS.
    - It is acceptable to use an API Gateway or Load Balancer solely for this purpose, even if you are not leveraging other functionalities they provide.

Spring Boot Backend

1. Introduction:

- This backend includes API to perform CRUD to the database storing employee data

- This Spring Boot backend has 2 profiles: development, and production

- This backend is deployed to AWS EC2 in public subnet, and RDS MySQL single database instance in public subnet

2. Getting Started:

- I will explain what I did to deploy the Spring Boot backend to AWS EC2, and RDS database:

  - I create 2 profiles (each profile has its own application-{profile}.properties file):
    - development (to store LOCAL DATABASE credentials): for local development, run unit tests, build and package the application
    - production (to store RDS DATABASE credentials): for deployment to AWS EC2, and RDS database
  - To build, and package the Spring Boot app, use `mvn clean install -P development`, this will build, run tests (by accessing the LOCAL DATABASE), and package the Spring Boot app into a .jar file
  - To run the Spring Boot app, use `LOCAL_DB_NAME=YOUR_DB_NAME LOCAL_DB_PORT=YOUR_DB_PORT LOCAL_DB_USERNAME=YOUR_DB_USERNAME LOCAL_DB_PASSWORD=YOUR_DB_PASSWORD java -jar target/employeemanagmentbackend-0.0.1-SNAPSHOT.jar --spring.profiles.active=development`, this will run the Spring Boot app using the LOCAL DATABASE
  - I write a Dockerfile to create a Docker image for the Spring Boot app, and push the Docker image to Docker Hub (in the Dockerfile, I skip the test phase to avoid accessing the LOCAL DATABASE, because this will leak the LOCAL DATABASE credentials to the Docker image)
  - To build Docker Image, use `docker buildx build --platform linux/amd64 -t YOUR_DOCKER_HUB_USERNAME/employee_management_backend:latest .`, this will build the Docker image for the Spring Boot app, to run on Linux x86_64 platform. this is important because AWS EC2 is running on Linux x86_64 platform. so if you build the Docker image on Windows x86_64 platform, the Docker image will not run on AWS EC2, that is because the Docker image is built for Windows x86_64 platform, not for Linux x86_64 platform
  - To run Docker Container with RDS database (production profile), use `docker run -p 8084:8084 -e spring.profiles.active=production -e RDS_DB_HOST=YOUR_DB_HOST RDS_DB_NAME=YOUR_DB_NAME -e RDS_DB_PORT=YOUR_DB_PORT -e RDS_DB_USERNAME=YOUR_DB_USERNAME -e RDS_DB_PASSWORD=YOUR_DB_PASSWORD YOUR_DOCKER_HUB_USERNAME/employee_management_backend:latest`, this will run the Docker container for the Spring Boot app, using the RDS DATABASE
  - To run Docker Container with your local database (development profile), use `docker run -p 8084:8084 -e spring.profiles.active=development -e DATABASE_HOST=host.docker.internal LOCAL_DB_NAME=YOUR_DB_NAME -e LOCAL_DB_PORT=YOUR_DB_PORT -e LOCAL_DB_USERNAME=YOUR_DB_USERNAME -e LOCAL_DB_PASSWORD=YOUR_DB_PASSWORD YOUR_DOCKER_HUB_USERNAME/employee_management_backend:latest`, this will run the Docker container for the Spring Boot app, using the LOCAL DATABASE (notice that: we use `host.docker.internal` to access the host machine from the Docker container, this is because the Docker container is running on a different network than the host machine. So for the DATABASE_HOST, we use `host.docker.internal` to access the local db on your host machine. If we use "localhost" for DATABASE_HOST, this means the Docker container will try to access the database on the Docker container itself, not on the host machine)

- On AWS, I do the following:
  - I am using the default VPC, and subnets
  - Create security group for EC2 instance to allow inbound HTTP traffic on port 80 (or 8084 if we want to access the application in Docker Container by using the same port on host EC2 instance) from anywhere IPv4, and allow inbound SSH traffic from anywhere IPv4 to port 22. And allow outbound traffic to any destination IPv4 from any source port (to be able to pull Docker Image from Docker Hub), and allow outbound MySQL traffic from source port 3306 to the security group of the RDS database
  - Create security group for RDS database to allow inbound MySQL traffic to port 3306 from the security group of the EC2 instance, allow inbound MySQL traffic to port 3306 from MyIP (to be able to access the RDS database on my local machine)
  - Create Elastic IP, and associate it with the EC2 instance
  - Create a Subnet Group with at least 2 (public) subnets in different Availability Zones, for the RDS database
  - Create EC2 instance in public subnet
  - Create RDS MySQL single database instance in public subnet
  - After that, SSH into the EC2 instance in public subnet, then run:
    - `sudo yum update -y`
    - `sudo yum install docker -y`
    - `sudo service docker start`
    - `docker pull YOUR_DOCKER_HUB_USERNAME/employee_management_backend:latest`
    - `docker run -p 80:8084 -e spring.profiles.active=production -e RDS_DB_HOST=YOUR_DB_HOST RDS_DB_NAME=YOUR_DB_NAME -e RDS_DB_PORT=YOUR_DB_PORT -e RDS_DB_USERNAME=YOUR_DB_USERNAME -e RDS_DB_PASSWORD=YOUR_DB_PASSWORD YOUR_DOCKER_HUB_USERNAME/employee_management_backend:latest`
  - Then, to access the Spring Boot Backend, copy the public IPv4 address, or the public DNS name of the EC2 instance (in http, not https), and append the path "/employee" to access the employee data

3. Access backend API:

- To access backend API, use: `http://18.220.47.122/employee`, or `http://ec2-18-220-47-122.us-east-2.compute.amazonaws.com/employee`

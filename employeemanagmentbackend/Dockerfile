FROM maven:3.8.4-openjdk-17 as BUILD
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean install -DskipTests

FROM openjdk:17-alpine
WORKDIR /app
COPY --from=BUILD /app/target/employeemanagmentbackend-0.0.1-SNAPSHOT.jar ./employee-management-backend.jar
EXPOSE 8084
ENTRYPOINT ["java", "-jar", "employee-management-backend.jar"]
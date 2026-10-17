# Multi-stage Docker build for SkillSwap Spring Boot Backend
# Stage 1: Build the JAR
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy pom.xml first for layer caching
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build
COPY src ./src
RUN mvn package -DskipTests -B

# Stage 2: Run the JAR (slim image)
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Add a non-root user for security
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy the built JAR from stage 1
COPY --from=build /app/target/*.jar app.jar

# Expose the port (Railway sets PORT env var)
EXPOSE 8080

# JVM flags optimized for container environments
ENTRYPOINT ["java", \
  "-Xmx400m", \
  "-Xss512k", \
  "-XX:+UseContainerSupport", \
  "-XX:MaxRAMPercentage=70.0", \
  "-Djava.security.egd=file:/dev/./urandom", \
  "-jar", "app.jar"]

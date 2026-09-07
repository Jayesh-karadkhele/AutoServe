# AutoServe Backend Multi-Stage Production Dockerfile

# Stage 1: Build JAR using Maven & JDK 21
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

# Copy Maven wrapper & POM
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Download dependencies
RUN ./mvnw dependency:go-offline -B || true

# Copy source code
COPY src src

# Package production JAR without running tests during image build
RUN ./mvnw clean package -DskipTests

# Stage 2: Minimal Runtime JRE Image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create non-root system user
RUN addgroup -S autoserve && adduser -S autoserve -G autoserve

# Copy compiled JAR from builder
COPY --from=builder /app/target/*.jar app.jar

# Set ownership
RUN chown -R autoserve:autoserve /app
USER autoserve

# Expose HTTP port
EXPOSE 8080

# Environment defaults
ENV SPRING_PROFILES_ACTIVE=prod \
    JAVA_OPTS="-Xms256m -Xmx512m -XX:+UseG1GC"

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]

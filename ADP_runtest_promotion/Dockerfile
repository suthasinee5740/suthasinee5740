# Stage 1: Build xk6 with the required extension
FROM golang:1.18 AS builder

# Set Go environment
ENV GO111MODULE=on

# Install xk6
RUN go install go.k6.io/xk6/cmd/xk6@latest

# Build k6 with the InfluxDB extension
RUN xk6 build --with github.com/grafana/xk6-output-influxdb

# Stage 2: Create the final image
FROM alpine:3.14

# Copy the built k6 binary from the builder stage
COPY --from=builder /go/k6 /usr/bin/k6

# Set entrypoint
ENTRYPOINT ["k6"]

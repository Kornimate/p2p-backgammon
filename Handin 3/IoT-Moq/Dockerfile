FROM golang:1.23-alpine

WORKDIR /app

COPY go.mod go.sum /app/

COPY main.go /app/

COPY models.go /app/

COPY mqtt-service.go /app/

COPY config.yaml /app/

RUN go mod download

RUN go mod tidy

RUN go build -o mqtt-client .

CMD [ "./mqtt-client" ]
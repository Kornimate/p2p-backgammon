FROM golang:1.23-alpine

WORKDIR /app

ENV ENV=Test

ENV CGO_ENABLED=1

COPY go.mod go.sum ./

COPY main.go .

COPY config.yaml .

COPY docs/ /app/docs

COPY models/ /app/models

COPY services/ /app/services

RUN apk update && apk upgrade && apk add --no-cache build-base sqlite

RUN go mod download

RUN go mod tidy

RUN touch database.db

RUN go build -o api-app

EXPOSE 8080

CMD ["./api-app"]

FROM golang:1.23-alpine

WORKDIR /app

COPY go.mod go.sum ./

COPY main.go .

COPY docs/ /app/docs

COPY models/ /app/models

COPY services/ /app/services

RUN go mod download

RUN go mod tidy

RUN apk update && apk upgrade && apk add --no-cache sqlite

RUN touch database.db

RUN go build -o api-app

ENV ENV=Test

EXPOSE 8080

CMD ["./api-app"]

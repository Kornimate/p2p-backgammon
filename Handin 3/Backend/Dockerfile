FROM golang:1.23-alpine

WORKDIR /app

COPY go.mod go.sum ./

COPY main.go .

COPY docs/ /app/docs

COPY models/ /app/models

COPY services/ /app/services

RUN go install github.com/swaggo/swag/cmd/swag@latest

RUN go mod download

RUN go mod tidy

# RUN sudo apt-get install -y sqlite3

RUN touch database.db

RUN go build -o /server 

ENV ENV=Test

EXPOSE 8080

CMD ["/server"]

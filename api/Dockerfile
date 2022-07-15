FROM golang:alpine as BASE
RUN mkdir /go/src/app
WORKDIR /go/src/app
COPY go.mod go.sum ./
RUN go mod download
COPY . .

FROM golang:alpine as DEV
RUN apk --update add --no-cache git
WORKDIR /go/src/app
COPY --from=BASE /go/src/app/ .

FROM golang:alpine as PrePROD
WORKDIR /go/src/app
COPY --from=DEV /go/src/app/ .
RUN GOCS=linux GOACH=amd64 go build -o main-app

FROM golang:alpine as PROD
WORKDIR /root/
COPY --from=PrePROD /go/src/app/main-app .
CMD ["./main-app"]
package main

import (
	"os"
)

func main() {
	a := App{}
	a.Initialize(
		os.Getenv("DATABASE_HOST"),
		os.Getenv("DATABASE_USERNAME"),
		os.Getenv("DATABASE_PASSWORD"),
		os.Getenv("DATABASE_NAME"))

	a.Run(":8010")
}
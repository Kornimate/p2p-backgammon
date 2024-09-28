package main

import (
	"fmt"
	"math/rand"
	"time"
)

func main() {

	EstablishMQTTConnection()

	for {

		PublishToTopic(fmt.Sprintf("{\"co2_level\":%v, \"tvoc_level\":%v }", rand.Int()%500+100, rand.Int()%100+100))

		time.Sleep(5 * time.Second)
	}

	// client.Disconnect(250)
}

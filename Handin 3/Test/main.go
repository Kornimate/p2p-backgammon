package main

func main() {
	EstablishMQTTConnection()

	PublishToTopic("{'co2_level':200, 'tvoc_level':200 }")
}

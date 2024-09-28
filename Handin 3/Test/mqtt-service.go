package main

import (
	"crypto/tls"
	"fmt"
	"time"

	mqtt "github.com/eclipse/paho.mqtt.golang"
)

const TOPIC_POST string = "Alfa/api/POST"
const TOPIC_LED string = "Alfa/api/LED"

var client mqtt.Client

var messageHandler mqtt.MessageHandler = func(client mqtt.Client, msg mqtt.Message) {
	fmt.Printf("Received message: %s from topic: %s\n", msg.Payload(), msg.Topic())
}

var connectionHandler mqtt.OnConnectHandler = func(client mqtt.Client) {
	fmt.Println("Connected")
}

var connectionLostHandler mqtt.ConnectionLostHandler = func(client mqtt.Client, err error) {
	fmt.Printf("Connect lost: %v", err)
}

//private functions

func newTlsConfig() *tls.Config {
	return &tls.Config{
		InsecureSkipVerify: true,
		ClientAuth:         tls.NoClientCert,
		MinVersion:         tls.VersionTLS12,
	}
}

func subscribeToTopic(topic string) {

	if token := client.Subscribe(topic, 1, nil); token.Wait() && token.Error() != nil {
		panic(token.Error())
	}

	fmt.Printf("Subscribed to topic: %s", topic)
}

//public functions

func PublishToTopic(inputJson string) {
	if token := client.Publish(TOPIC_POST, 0, false, inputJson); token.Wait() && token.Error() != nil {
		fmt.Println("Error while publishing message")

		return
	}

	fmt.Println("Message successfully published!")
}

func EstablishMQTTConnection() {

	opts := mqtt.NewClientOptions()

	opts.AddBroker(fmt.Sprintf("ssl://%s:%d", "myggen.mooo.com", 8883))

	opts.SetClientID(fmt.Sprintf("user-%v", time.Now().Format(time.RFC3339)))
	opts.SetUsername("Alfa")
	opts.SetPassword("dqzbhNVwMAg172j9")
	opts.SetDefaultPublishHandler(messageHandler)

	tlsConfig := newTlsConfig()
	opts.SetTLSConfig(tlsConfig)

	opts.OnConnect = connectionHandler
	opts.OnConnectionLost = connectionLostHandler

	client = mqtt.NewClient(opts)

	if token := client.Connect(); token.Wait() && token.Error() != nil {
		panic(token.Error())
	}

	subscribeToTopic(TOPIC_POST)
}

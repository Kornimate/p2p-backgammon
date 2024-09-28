package main

import (
	"crypto/tls"
	"fmt"
	"os"

	mqtt "github.com/eclipse/paho.mqtt.golang"
	yaml "gopkg.in/yaml.v2"
)

const TOPIC_POST string = "Alfa/api/POST"
const TOPIC_LED string = "Alfa/api/LED"

var client mqtt.Client
var config Config

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

func importConfigs() {
	file, err := os.Open("config.yaml")

	if err != nil {
		panic("Unable to open config file")
	}

	defer file.Close()

	err = (yaml.NewDecoder(file)).Decode(&config)

	if err != nil {
		panic("Unable to parse config file")
	}
}

func EstablishMQTTConnection() mqtt.Client {

	importConfigs()

	opts := mqtt.NewClientOptions()

	opts.AddBroker(fmt.Sprintf("ssl://%s:%d", config.Mqtt.Broker, config.Mqtt.Port))

	opts.SetClientID("user-bvuwbvcuehbc")
	opts.SetUsername(config.Mqtt.Username)
	opts.SetPassword(config.Mqtt.Password)
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

	return client
}

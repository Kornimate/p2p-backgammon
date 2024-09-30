# Building the IoT
We use the M5StickC Plus and the Co2/TVOC sensor.
We use the uiflow2.0 for the assignemnt.
If you want to use the application you can start a local live server. 


## Clone Repository

```
cd Where_to_clone
git clone git@gitlab.au.dk:au702308/building-the-iot.git
```
## 3. Hand in Instructions

It is possible to run the code locally or view it in production

The production site is deployed to Azure and it an be reached via this link: <br />
[Link to Azure deployed application](https://iotapp-hrg5d4fadhaqdwcz.northeurope-01.azurewebsites.net)
The problem with azure is that if tha application is inactive, azure disables the resources behind it F1, free tier) So if you want to use it from the internet, please contact us to start the application (always on mode costs 13$ per month :(, you can contact me on email: kornimate@gmail.com, or write me on messenger: Kornidesz Máté)

Running the instance locally requires Docker to be installed on your device and create a config.yaml file (The name must be config.yaml) at the following location: Handin 3/Backend

The config file content is the following:

```
mqtt:
  broker: "myggen.mooo.com"
  port: 8883
  username: "<your username>"
  password: "<your password>"
```

Copy this content into the config.yaml and fill in the correct credentials and start the application with the following command from the "Handin 3" folder:

```
docker-compose up --build
```

If you do not have an IoT device there is a Moq instance you can run to try the application. To use it, you need to do the following:

1. Go to the Handin 3/IoT-Moq folder
2. Create the config file like it was written before but now in this folder (Handin 3/IoT-Moq)
3. Run the following commands:

```
docker build -t "iot-moq" .
docker run --name "IoT-Moq" -d -it "iot-moq"
```


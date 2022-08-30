# Pubsuby 

A simple self hosted Pub-Sub over REST using Redis as a broker written in typescript. 

## Usage

You can the try pubsuby live on pubsuby.xyz, just be careful because everyone can subscribe to
the service and listen to your messages.

### Listen for messages in topics
```javascript
let socket = new WebSocket("wss://pubsuby.xyz/api/subscribe?topic=test-topic");

socket.onmessage = function (e) {
    const {topic, payload} = JSON.parse(e.data)
    console.log("received:", topic, payload)
}
```

or

```bash
npm install -g wscat
wscat -c wss://pubsuby.xyz/api/subscribe?topic=test-topic
```


### Publish messages
```javascript
axios.post("https://pubsuby.xyz/api/publish",{
  headers:{
      "secret-api-key": "notsecretapikey"
  },
  data:{
    topic: "test-topic",
    payload: {
      "message": "Hello World"
    }
  }
})
```

or

```bash
curl -X POST https://pubsuby.xyz/api/publish \
	--header "secret-api-key: notsecretapikey" \
	--header "Content-Type: application/json" \
	-d '{"topic": "test-topic","payload": {"message": "Hello World"}}'
```

### Running locally

```bash
git clone git@github.com:stliakis/pubsuby.git;
cd pubsuby;
SECRET_API_KEY=my-secret-api-key docker-compose up;
```

The default listening port at development environment is 4545 and can be changed from
the `docker-compose.override.yml` file


### Deploying to production

There is already a Github workflow that deploys the service to a server running docker swarm. 
The easiest way to use it is to fork this repository, setup the Github action secrets required to connect to 
your server and run the workflow.

1. Fork this repository
2. Change the Github packages repositories in deploy-production.yml to point to your account
3. Get a new server & install docker on it https://docs.docker.com/engine/install/debian/
4. Initialize docker
```bash
docker swarm init
```
5. Generate a new ssh key that the Guithub action can use to connect to the server
```bash
ssh-keygen -C "pubsuby@acme.io" 
```
6. Append the newly generated public key to the server's authorized_keys file at ```/root/.ssh/authorized_keys``` (you can use a user other than root but make sure your perms are correct)
7. Add the following secrets to your fork's Github action secrets
```bash
PRODUCTION_SERVER_SSH_HOST=pubsuby.acme.io
PRODUCTION_SERVER_SSH_PORT=22
PRODUCTION_SERVER_SSH_USERNAME=root
PRODUCTION_PUBSUBY_SECRET_API_KEY=<your secret api key>
PRODUCTION_SERVER_SSH_SECRET=<the private key of the ssh key we generated above>
```
8. Run the workflow from the Github's actions tab
9. Test the service
```bash
curl -X POST https://pubsuby.acme.io/api/publish \
	--header "secret-api-key: <your secret api key>" \
	--header "Content-Type: application/json" \
	-d '{"topic": "test-topic","payload": {"message": "Hello World"}}' 
```


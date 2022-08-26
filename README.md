# Pubsuby 

A simple ready to deploy Pub-Sub over REST using Redis as a broker written in typescript. 

## Usage

You can the try pubsuby live on pubsuby.io, just be careful because everyone can subscribe to
the service and listen to your messages.

### Listen for messages in topics
```javascript
let socket = new WebSocket("wss://pubsuby.io/api/subscribe?topic=test-topic");

socket.onmessage = function (e) {
    const {topic, payload} = JSON.parse(e.data)
    console.log("received:", topic, payload)
}
```

### Publish events
```javascript
axios.post("https://pubsuby.io/api/publish",{
  headers:{
      "secret-api-key": "secret-api-key"
  },
  data:{
    topic: "test-topic",
    payload: {
      "message": "Hello World"
    }
  }
})
```

### Running

```bash
git clone git@github.com:stliakis/pubsuby.git;
cd pubsuby;
SECRET_API_KEY=my-secret-api-key docker-compose up;
```

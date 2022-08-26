import express from "express";
import {Pubsuby} from "./pubsuby";
import expressWs from 'express-ws'
import {listify} from "./utils";
import {requiredSecretApiKey} from "./middlewares";
import Config from "./config";
import {RedisBroker} from "./broker";

let wsInstance = expressWs(express());
let {app} = wsInstance;

app.use(express.json());

function getPubSub(channel: string="pubsub") {
  return new Pubsuby(new RedisBroker(Config.get("REDIS_BROKER"), channel))
}

app.post(
  "/api/publish",
  requiredSecretApiKey,
  function (req, res) {
    const {payload, topic} = req.body
    getPubSub().publishEvent(topic, payload)
    res.status(200).json({
      success: true
    })
  }
);

app.ws("/api/subscribe", function (ws, req) {
  const topic = req.query.topic
  const topics: string[] = listify(topic)

  const pubsub = getPubSub()

  ws.on("close", () => {
    console.log(`subscriber ${req.ip} disconnected`)
    pubsub.unsubscribe()
  })

  pubsub.subscribe(topics as string[], (topic: string, payload: object) => {
    ws.send(
      JSON.stringify({
        topic: topic,
        payload: payload,
      })
    );
  })

  console.log(`subscriber ${req.ip} subscribed on ${topics.length == 0 ? "all topics" : topics.join(", ")}`)
});

app.listen(3000, () =>
  console.log("Server listening at port 3000")
);
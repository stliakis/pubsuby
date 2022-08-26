import {Broker} from "./broker";


class Pubsuby {
  broker: Broker;
  config: PubsubyConfig

  constructor(broker: Broker, config: PubsubyConfig = new PubsubyConfig()) {
    this.broker = broker;
    this.config = config
  }

  publishEvent(topic: string | null, payload: object) {
    this.broker.publishMessage(topic, payload);
  }

  subscribe(topics: string[], callback: Function) {
    this.broker.onMessage((topic: string, payload: object) => {
      if (topics.length === 0 || topics.includes(topic)) {
        callback(topic, payload)
      }
    })
  }

  unsubscribe() {
    this.broker.quit()
  }
}

class PubsubyConfig {
  constructor() {

  }
}

export {
  Pubsuby,
  PubsubyConfig
}
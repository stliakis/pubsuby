import Redis from "ioredis";

abstract class Broker {
  abstract onMessage(callback: Function): void;

  abstract publishMessage(topic: string | null, message: any): void;

  abstract quit(): void
}

class RedisBroker extends Broker {
  redis: Redis
  channel: string
  hasSubscribed: boolean = false

  constructor(connectionString: string, channel: string) {
    super();
    this.channel = channel
    this.redis = new Redis({
      host: connectionString.split(":")[0],
      port: parseInt(connectionString.split(":")[1]),
    });
  }

  publishMessage(topic: string, message: object) {
    this.redis.publish(this.channel, JSON.stringify({
      topic,
      payload: message
    }));
  }

  onMessage(callback: Function) {
    if (!this.hasSubscribed) {
      this.redis.subscribe(this.channel);
    }
    this.redis.on("message", (channel, message) => {
        const parsedMessage = JSON.parse(message)
        const {topic, payload} = parsedMessage;
        callback(topic, payload);
      }
    );
  }

  quit() {
    this.redis.quit()
  }
}

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
  PubsubyConfig,
  RedisBroker
}
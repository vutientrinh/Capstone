import { Client } from "@stomp/stompjs";

interface TopicSubscription {
  topic: string;
  callback: (message: any) => void;
  forMessageTypes?: string[];
}

class SocketClient {
  private client: Client | null = null;
  private subscriptions: Map<string, any> = new Map();

  connect = (url: string, jwt: string, topics: TopicSubscription[] = []) => {
    if (this.client && this.client.connected) {
      topics.forEach(({ topic, callback, forMessageTypes }) => {
        this.unsubscribeTopic(topic);
        this.subscribe({ topic, callback, forMessageTypes });
      });
      return this.client;
    }

    this.client = new Client({
      brokerURL: url,
      connectHeaders: {
        Authorization: `Bearer ${jwt}`,
      },
      onConnect: async () => {
        console.log("Connected");
        await this.awaitConnect({});
        topics.forEach(({ topic, callback, forMessageTypes }) => {
          this.subscribe({ topic, callback, forMessageTypes });
        });
      },
    });

    this.client.activate();
    return this.client;
  };

  publish = ({ destination, body }: { destination: string; body: any }) => {
    this.client?.publish({
      destination: destination,
      body: JSON.stringify(body),
    });
  };

  deactivate = () => {
    this.client?.deactivate();
  };

  subscribe = ({
    topic,
    callback,
    forMessageTypes = [],
  }: {
    topic: string;
    callback: (message: any) => void;
    forMessageTypes?: string[];
  }) => {
    this.unsubscribeTopic(topic);
    const subscription = this.client?.subscribe(topic, (message) => {
      if (
        !forMessageTypes ||
        forMessageTypes.includes(JSON.parse(message.body).messageType)
      ) {
        callback(message);
      }
    });

    if (subscription) {
      this.subscriptions.set(topic, subscription);
      console.log(`Successfully subscribed to ${topic}`);
    }

    return subscription;
  };

  unsubscribeTopic = (topic: string) => {
    if (this.subscriptions.has(topic)) {
      const subscription = this.subscriptions.get(topic);
      subscription?.unsubscribe();
      this.subscriptions.delete(topic);
      console.log(`Unsubscribed from topic: ${topic}`);
      return true;
    }
    return false;
  };

  disconnect = () => {
    if (this.subscriptions.size > 0) {
      this.subscriptions.forEach((subscription) => {
        subscription?.unsubscribe();
      });
      this.subscriptions.clear();
    }

    if (this.client) {
      this.client.deactivate();
      this.client = null;
    }
  };

  awaitConnect = async (awaitConnectConfig: any) => {
    const {
      retries = 3,
      curr = 0,
      timeinterval = 100,
    } = awaitConnectConfig || {};
    return new Promise((resolve, reject) => {
      console.log(timeinterval);
      setTimeout(() => {
        if (this.connected) {
          resolve({});
        } else {
          console.log("failed to connect! retrying");
          if (curr >= retries) {
            console.log("failed to connect within the specified time interval");
            reject();
          }
          this.awaitConnect({ ...awaitConnectConfig, curr: curr + 1 });
        }
      }, timeinterval);
    });
  };

  get connected() {
    return this.client?.connected;
  }
}

const socketClient = new SocketClient();
export default socketClient;

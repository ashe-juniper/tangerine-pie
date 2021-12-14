# 🍊 Tangerine Pie 🍊

Tangerine Pie (`tangerine-pie`) is a high-level networking library powered by the Hypercore Protocol and Atek Cloud.
Tangerine Pie requires no port-forwarding or networking knowledge.

## Installation

To install Tangerine Pie into an existing Node.js package, run the following command from the package root directory:

```sh
npm i tangerine-pie
```

## How-Tos

### Hosting a LAN world in Minecraft and joining it from another computer

`server.js`
```js
const TangerinePie = require('tangerine-pie');

try {
    // Create a new virtual server for your Minecraft server
    const server = TangerinePie.Server.create({
        passphrase: "Your Minecraft server's passphrase",
        port: 25565
    });

    // Start the server
    server.start();
} catch {
    console.log('Try a different domain, this one is already in-use!');
}

// Whenever you're done with the server, you can close it with the code below.
// It is entirely optional, however, as Tangerine Pie will automatically close any remaining
// child processes it created when this Node.js process stops.
server.stop();
```

`client.js`
```js
const TangerinePie = require('tangerine-pie');

try {
    // Create a new Tangerine client
    const client = TangerinePie.Client.create();
    
    // Join the Minecraft server's virtual server
    client.connect({
        passphrase: "Your server's passphrase",
        port: 25565 // This doesn't have to match the port the server used;
                    // this is actually the port used by **your** computer,
                    // not the server's.
    });
    
    // There are a few QoL functions as well, such as:
    client.reconnect("Your server's passphrase"); // Reconnect to the server
    client.reconnect(25565); // Also works by port

    // When you're done, you can disconnect, although it's not strictly required.
    // If you don't disconnect, Tangerine Pie will automatically disconnect the client
    // for you when this Node.js process stops.
    // Calling `disconnect()` on the client is only required if you wish to control when
    // the client disconnects from the server.
    client.disconnect(25565); // You can reference the server by port
    client.disconnect("Your server's passphrase"); // or by passphrase
} catch {
    console.log('The server is not running right now.');

    return;
} 
```

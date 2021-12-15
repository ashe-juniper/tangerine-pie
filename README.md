# 🍊 Tangerine Pie 🍊

Tangerine Pie (`tangerine-pie`) is a high-level networking library powered by the Hypercore Protocol and Atek Cloud.
Tangerine Pie requires no port-forwarding or networking knowledge.

## Installation

To install Tangerine Pie into an existing Node.js package, run the following command from the package root directory:

```sh
npm i tangerine-pie
```

## How-Tos

### Hosting your current directory as a web server

`server.js`
```js
import * as TangerinePie from '../src/index.js';

console.log('Starting a web server in the current directory.');

(async () => {
    const publicKey = await TangerinePie.serve();

    console.log(`Public key: ${publicKey}`);
})();
```

### Hosting a LAN world in Minecraft and joining it from another computer

`server.js`
```js
import * as TangerinePie from '../src/index.js';

console.log('Hosting the minecraft server.');

(async () => {
    const publicKey = await TangerinePie.bind(25565);

    console.log('Public key:', publicKey);
})();
```

`client.js`
```js
// usage: node examples/minecraft-server-join.js
import * as TangerinePie from '../src/index.js';

console.log('Joining the minecraft server.');

(async () => {
    const publicKey = await TangerinePie.bind(25565, process.argv[2]);

    console.log('Public key:', publicKey);
})();
```

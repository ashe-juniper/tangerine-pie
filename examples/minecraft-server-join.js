// usage: node examples/minecraft-server-join.js
import * as TangerinePie from '../src/index.js';

console.log('Joining the minecraft server.');

(async () => {
    const publicKey = await TangerinePie.bind(25565, process.argv[2]);

    console.log('Public key:', publicKey);
})();

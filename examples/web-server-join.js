// usage: node examples/minecraft-server-join.js
import * as TangerinePie from '../src/index.js';

console.log('Joining the server.');

(async () => {
    const publicKey = await TangerinePie.bind(9090, process.argv[2]);

    console.log('Public key:', publicKey);
})();

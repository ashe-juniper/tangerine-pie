import * as TangerinePie from '../src/index.js';

console.log('Hosting the minecraft server.');

(async () => {
    const publicKey = await TangerinePie.bind(25565);

    console.log('Public key:', publicKey);
})();

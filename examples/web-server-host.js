import * as TangerinePie from '../src/index.js';

console.log('Starting a web server in the current directory.');

(async () => {
    const publicKey = await TangerinePie.serve();

    console.log(`Public key: ${publicKey}`);
})();

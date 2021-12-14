import { WebServer } from '../classes/WebServer.js';

export async function serve(path) {
    const server = new WebServer();

    const publicKey = await server.start();

    return publicKey;
}

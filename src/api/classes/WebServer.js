import http from 'http';
import path from 'path';
import net from 'net';
import pump from 'pump';
import ansi from 'ansi-escapes';
import serve from 'serve-handler';
import * as AtekNet from '@atek-cloud/network';
import { randomPortPromise, readKeyFile } from '../../lib/util.js';

const DEFAULT_PORT = 8080;
const DEFAULT_ROOT_DIRECTORY = '.';

export class WebServer {
    constructor(rootDirectory=null, port=DEFAULT_PORT) {
        this._isRunning = false;

        this._clientMap = {};

        this._path =
            typeof rootDirectory === 'string' ?
            rootDirectory :
            DEFAULT_ROOT_DIRECTORY;

        this._port =
            typeof port === 'number' ?
            port :
            DEFAULT_PORT;
    }

    isRunning() {
        return this._isRunning;
    }

    async start() {
        if (!this._path) {
            console.error('Defaulting to current path');
            this._path = DEFAULT_ROOT_DIRECTORY;
        }

        this._path = path.resolve(this._path)
        this._port = this._port ? Number(this._port) : await randomPortPromise()
        const keyPair = await readKeyFile();

        await AtekNet.setup()

        const node = new AtekNet.Node(keyPair)

        await node.listen()

        node.on('connection', sock => {
            this._clientMap[sock.remotePublicKeyB32] = true;
            sock.on('close', () => {
                delete this._clientMap[sock.remotePublicKeyB32];
            })
        });

        node.setProtocolHandler(
            (stream) => {
                const conn = net.connect({ host: '127.0.0.1', port: this._port });

                pump(stream, conn, stream);
            }
        );

        const server = http.createServer((req, res) => {
            serve(req, res, {
                public: this._path,
                unlisted: ['.git'],
                redirects: [
                {source: '.git/**', destination: '/', type: 302}
                ]
            })
        });

        server.listen(this._port);

        this._publicKey = node.publicKeyB32;
        
        this._isRunning = true;
    }
}

import net from 'net';
import * as AtekNet from '@atek-cloud/network';
import { fromBase32 } from '@atek-cloud/network/dist/util.js';
import pump from 'pump';
import { isBuffer, randomPortPromise, readKeyFile } from '../../lib/util.js';

export async function bind(port, publicKey=null, host='localhost', keyFile=null) {
    port = port ? Number(port) : await randomPortPromise();
    const remotePublicKeyB32 = publicKey;

    let remotePublicKey;

    if (remotePublicKeyB32) {
        try {
            remotePublicKey = fromBase32(remotePublicKeyB32);
        } catch (e) {
            throw `Invalid public key: ${publicKey}`;
        }
    }

    const keyPair = await readKeyFile(keyFile);

    await AtekNet.setup();

    const node = new AtekNet.Node(keyPair);

    if (isBuffer(remotePublicKey)) {
        net.createServer(async (socket) => {
            let conn = undefined;

            if (isBuffer(remotePublicKey)) {
                try {
                    conn = await node.connect(remotePublicKey);
                } catch (e) {
                    console.error('Failed to establish a connection over the p2p network');
                    console.error(e);
                    socket.destroy();

                    return;
                }
            }

            if (!conn) {
                return;
            }

            pump(socket, conn.stream, socket);
        }).listen(port);

        return remotePublicKeyB32;
    } else {
        await node.listen();

        node.on('connection', sock => {
            console.log('CONNECT pubkey:', sock.remotePublicKeyB32);

            sock.on('close', () => {
                console.log('CLOSE pubkey:', sock.remotePublicKeyB32);
            })
        });

        node.setProtocolHandler((stream) => {
            const conn = net.connect({host, port});

            pump(stream, conn, stream);
        });

        const link = `https://${node.publicKeyB32}.atek.app/`;

        return node.publicKeyB32;
    }
}

import { resolve } from 'path'
import { promises as fsp } from 'fs'
// @ts-ignore no d.ts, screw it
import randomPort from 'random-port'
import * as AtekNet from '@atek-cloud/network'
import { fromBase32, toBase32 } from '@atek-cloud/network/dist/util.js'

export function isBuffer (v) {
  return Buffer.isBuffer(v)
}

export function randomPortPromise () {
  return new Promise(resolve => {
    randomPort(resolve)
  })
}

export async function readKeyFile (keyfile) {
  let keyPair
  if (keyfile) {
    const keyfilePath = resolve(keyfile)
    try {
      const str = await fsp.readFile(keyfilePath, 'utf8')
      try {
        const obj = JSON.parse(str)
        try {
          keyPair = {
            publicKey: fromBase32(obj.publicKey),
            secretKey: fromBase32(obj.secretKey)
          }
        } catch (e) {
          console.error(e)
          process.exit(1)
        }
      } catch (e) {
        console.error(e)
        process.exit(1)
      }
    } catch (e) {
    }
    if (keyPair) {
    } else {
      keyPair = AtekNet.createKeypair()
      await fsp.writeFile(keyfilePath, JSON.stringify({
        publicKey: toBase32(keyPair.publicKey),
        secretKey: toBase32(keyPair.secretKey),
      }, null, 2), 'utf8')
    }
  } else {
    keyPair = AtekNet.createKeypair()
  }
  return keyPair
}

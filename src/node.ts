import WebSocket from 'ws'
import { BlockChain } from './block-chain'
import { getPeers, removePeer, addPeer } from './config/peers'
import chalk from 'chalk'

const log = console.log.bind(console, chalk.cyanBright('[Node]'))
const port = parseInt(process.argv[3])

export class Node {
  private sockets: WebSocket[] = [] as WebSocket[]
  private url = `http://localhost:${port}`

  constructor(private blockChain: BlockChain) {}

  start() {
    const server = new WebSocket.Server({
      port: port,
    })

    server.on('connection', (socket) => {
      log('New connection arrived')
      this.onSocketOpen(socket)
    })

    server.on('listening', () => {
      log(`listening on ${port}`)
      addPeer(this.url)
      this.connect()
    })
  }

  connect() {
    getPeers().then((peers) => {
      peers
        .filter((x) => x !== this.url)
        .forEach((p) => {
          log('Trying to connect to', p)
          const socket = new WebSocket(p)
          socket.on('open', () => this.onSocketOpen(socket))
          socket.on('error', () => {
            log('Error connect to', p)
          })
        })
    })
  }

  private onSocketOpen = (socket: WebSocket) => {
    this.sockets.push(socket)
    this.listen(socket)
    this.broadcastChain(socket)
  }

  private broadcastChain(socket: WebSocket) {
    socket.send(JSON.stringify(this.blockChain.chain))
  }

  private listen = (socket: WebSocket) => {
    socket.on('message', (message: string) => {
      log('New chain arrived')
      this.blockChain.replace(JSON.parse(message))
    })
  }

  destroy() {
    return removePeer(this.url).catch(() => {
      console.error('Cannot destroy peers')
    })
  }
}

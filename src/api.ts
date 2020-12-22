import express from 'express'
import { BlockChain } from './block-chain'
import { json } from 'body-parser'
import morgan from 'morgan'
import { Node } from './node'
const blockChain = new BlockChain()

const port = parseInt(process.argv[2])
const app = express()
const node = new Node(blockChain)

app.use(morgan('short'))
app.use(json())

app.get('/', (req, res) => {
  res.send('OK')
})

app.get('/blocks', (req, res) => {
  res.json(blockChain.chain)
})

app.post('/mine', (req, res) => {
  const start = Date.now()
  console.log('Start mining...')
  const data = req.body.data
  const block = blockChain.append(data)
  const elapsed = Date.now() - start
  console.log(`New block added after ${elapsed}ms \n ${block}`)
  res.set('x-elapsed-time', `ms: ${elapsed}`)
  res.json(block)
})

node.start()
app.listen(port, () => {
  console.log(`API listen on ${port}`)
})

process.on('beforeExit', () => {
  console.log('Removing peer list')
  
})

process.on('SIGINT', () => {
  console.log('Removing peer list')
  node.destroy().then(() => {
    console.log('Bye')
    process.exit(0)
  })
})
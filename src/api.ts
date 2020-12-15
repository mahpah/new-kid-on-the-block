import express from 'express'
import { BlockChain } from './block-chain'
import { json } from 'body-parser'
import morgan from 'morgan'
const blockChain = new BlockChain()

const app = express()
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

app.listen(3000, () => {
  console.log('API listen on 3000')
})

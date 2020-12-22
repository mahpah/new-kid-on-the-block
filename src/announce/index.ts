import express from 'express'
import morgan from 'morgan'

const app = express()

app.use(morgan('dev'))

const PeerDb = {
  peers: [] as string[]
}

app.get('/', (req, res) => {
  res.json(PeerDb)
})

app.delete('/', (req, res) => {
  const url = req.query['url']
  console.log('Removing', url)
  PeerDb.peers = PeerDb.peers.filter(x => x != url)
  res.json({})
})

app.post('/', (req, res) => {
  const url = req.query['url'] as string
  console.log('New peer', url)
  PeerDb.peers = PeerDb.peers.concat([url])
  res.json({})
})

app.listen(9000, () => {
  console.log('Announce server listen on 9000')
})
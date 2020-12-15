import {Block} from './block'
import { BlockChain } from './block-chain'

// console.log(block.toString())
const chain = new BlockChain()
chain.append('Duc send 5$ to Ha')
chain.append('Ha send 5$ to Hung')

console.log(chain.toString())
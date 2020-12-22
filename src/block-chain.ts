import chalk from 'chalk';
import { Block } from './block';

const log = console.log.bind(console, chalk.magentaBright('BlockChain'))

export class BlockChain {
  constructor(public chain: Block[] = [Block.genesis()]) {}

  append(data) {
    const lastBlock = this.chain[this.chain.length - 1];
    const block = Block.mine(lastBlock, data)
    this.chain.push(block);
    return block;
  }

  inspect() {}

  toString() {
    return `[Chain]
${this.chain.map((t) => t.toString()).join('\n\n')}
`;
  }

  toJSON() {
    return JSON.stringify(this.chain, null, 0)
  }

  isValid(blocks: Block[]) {
    if (JSON.stringify(blocks[0]) !== JSON.stringify(Block.genesis())) {
      log('Not genesis')
    // if (!blocks[0].equals(Block.genesis())) {
      return false
    }

    for (let index = 1; index < blocks.length; index++) {
      const element = blocks[index];
      if (blocks[index - 1].hash !== element.lastHash) {
        return false
      }
    }

    return true
  }

  replace(blocks: Block[]) {
    if (blocks.length <= this.chain.length) {
      log('Chain is older')
      return
    } 

    if (!this.isValid(blocks)) {
      log('Chain is invalid')
      return
    }

    this.chain = blocks
    log('Chain is updated')
  }
}

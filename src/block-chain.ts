import { Block } from './block';

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
}

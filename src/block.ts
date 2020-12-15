import chalk from 'chalk'
import sha256 from 'crypto-js/sha256'

export class Block {
  private static MinDifficulty = 2
  private static BlockTime = 5e3

  constructor(
    public timestamp: number,
    public lastHash: string,
    public data: any,
    public hash: string,
    private nonce: number,
    public difficulty: number
  ) {
  }

  toString() {
    return `=========================== ${chalk.cyan(
      '[Block]'
    )} =========================== 
* time: ${this.timestamp} 
* previous: ${chalk.yellow(this.lastHash)} 
* hash: ${chalk.red(this.hash)} 
* nonce: ${chalk.magenta(this.nonce)} 
* difficulty: ${chalk.magenta(this.difficulty)} 
* data: ${this.data}`
  }

  static genesis(): Block {
    return new Block(-1, '', '', '', 0, 2)
  }

  static mine(lastBlock: Block, data: any): Block {
    let nonce = 0
    let hash = ''
    let timestamp = Date.now()
    const lastHash = lastBlock.hash
    let difficulty = lastBlock.difficulty
    
    do {
      timestamp = Date.now()
      difficulty = Block.adjustDifficulty(lastBlock, timestamp)
      hash = sha256(
        `${timestamp}|${lastHash}|${JSON.stringify(data)}|${nonce}|${difficulty}`
      ).toString()
      nonce++
    } while (hash.substr(0, difficulty) !== '0'.repeat(difficulty))

    return new Block(timestamp, lastHash, data, hash, nonce, difficulty)
  }

  static adjustDifficulty(lastBlock: Block, timestamp: number): number {
    const dif = lastBlock.timestamp + Block.BlockTime > timestamp
      ? lastBlock.difficulty + 1
      : lastBlock.difficulty - 1
    return dif < Block.MinDifficulty ? Block.MinDifficulty : dif 
  }
}

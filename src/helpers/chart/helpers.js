// Generate a symbol ID from a pair of the coins
export function generateSymbol(exchange, fromSymbol, toSymbol) {
  const short = `${fromSymbol}/${toSymbol}`;
  return {
    short,
    full: `${exchange}:${short}`,
  };
}

export function parseFullSymbol(fullSymbol) {
  // console.log('parsedSymbol', fullSymbol)
  const match = fullSymbol.match(/^([\w\s]+):(\w+)\/(\w+):(0x\w{40})$/);
  // console.log('match', match)
  if (!match) { return null }
  return {
    exchange: match[1],
    fromSymbol: match[2],
    toSymbol: match[3],
    pairAddr: match[4],
  };
}

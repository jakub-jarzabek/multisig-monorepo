const fs = require('fs');
const path = require('path');
console.log(path.resolve('./target/types/multi_sig_wallet.ts'));
const content = fs.readFileSync(
  path.resolve('./packages/solana/target/types/multi_sig_wallet.ts'),
  'utf8'
);
console.log(typeof content);
fs.writeFileSync(
  path.resolve('./packages/frontend/solana-config/multi_sig_wallet.ts'),
  content
);

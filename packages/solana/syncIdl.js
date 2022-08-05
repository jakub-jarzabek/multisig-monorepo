const fs = require('fs');
const path = require('path');
const content = fs.readFileSync(
  path.resolve('./packages/solana/target/idl/multi_sig_wallet.json'),
  'utf8'
);
fs.writeFileSync(
  path.resolve('./packages/frontend/solana-config/multi_sig_wallet.json'),
  content
);

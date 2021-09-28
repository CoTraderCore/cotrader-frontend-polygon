### Start
```
Comment unnecessary and uncomment necessary network configs in file src/config.js

Create .env with keys
REACT_APP_API_TOKEN=
REACT_APP_BLOXY_KEY=
REACT_APP_INFURA=

yarn install
yarn start
```


### Update Merkle WhiteListed tokens

```
1) Create new root hash https://github.com/CoTraderCore/Merkle-Root-Tokens
2) Update ../src/storage/WhiteListedTokens.js with tokens from Merkle-Root-Tokens/file.json
```

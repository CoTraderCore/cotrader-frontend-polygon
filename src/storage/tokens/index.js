import { NeworkID } from '../../config.js'
import * as mainnetTokens from './mainnet'
import * as rosptenTokens from './ropsten'

let _tokens = []

if(NeworkID === 1)
{
_tokens = mainnetTokens
}
else
{
_tokens = rosptenTokens
}

export const tokens = _tokens

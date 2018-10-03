# Klay Boilerplate for REACT

## Klay DApp Boilerplate for REACT 설명
목차
1) Install
2) lint
3) atom package
4) npm package
5) React style convention
6) Directory Structure
7) 사용 - 프론트엔드 실행 (npm run dev 사용)
8) 사용 - UI 컴포넌트
9) 사용 - caver-js 컨트랙트 인스턴스 사용하기
10) 사용 - 컴파일 및 디플로이 (truffle 사용)

### 1)Install
```
yeoman scaffold generator를 이용하여 기본적인 폴더구조를 만든다.

klaytn-based dapp의 skeleton을 만드는 generator 이름은 generator-klay-dapp 이다.

이 또한 같이 설치해주어야 한다.

`npm install -g yo generator-klay-dapp`

`yo klay-dapp`
```
### 2) lint (.estlintrc)
>1.lint는 기본적으로 세 개의 lint rule을 “extends” 해서 사용한다.
i) eslint:recommended
ii) plugin:react/recommended
iii) airbnb
```
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "airbnb"
  ],
```
>2. custom rule을 별도로 정의한다. (“rules”)
```
  "rules": {
    "arrow-parens": ["error", "always"],
    "comma-dangle": ["error", "always-multiline"],
    "global-require": 0,
    "func-names": 0,
    "function-paren-newline": 0,
    "semi": 0,
    "prefer-arrow-callback": 0,
    "eqeqeq": 0,
    "wrap-iife": 0,
    "no-unused-expressions": 0,
    "no-console": 0,
    "no-bitwise": 0,
    "no-plusplus": 0,
    "no-multi-assign": 0,
    "jsx-a11y/anchor-is-valid": 0,
    "jsx-a11y/no-static-element-interactions": 0,
    "jsx-a11y/click-events-have-key-events": 0,
    "jsx-a11y/alt-text": 0,
    "import/no-unresolved": false,
    "import/prefer-default-export": false,
    "import/extensions": false,
    "import/no-extraneous-dependencies": 0,
    "react/jsx-filename-extension": false,
  }
 ```

### 3) 필수 atom package
>기본적으로 lint를 동작하게 할 아톰 패키지를 설치한다.
```
linter (기본 linter)
linter-eslint (자바스크립트 관련)
linter-solium (솔리디티 관련)
linter-flow (자바스크립트 타입관련)
```

### 4) npm package

i)dependencies

- 리액트 관련
```
react, react-router, redux, redux-thunk, react-redux
```
- transaction 관련
```
caver-js
```
- 기타
```
classnames(동적으로 HTML 클래스 정의)
```

ii)devDependencies
- babel 관련
```
babel-core, babel-eslint, babel-loader, babel-polyfill,
babel-preset-es2015, babel-preset-stage-0
```

- lint 관련
```
eslint, eslint-config-airbnb, eslint-plugin-import,
eslint-plugin-jsx-a11y, eslint-plugin-react
```

### 5) React style convention


### 6) Directory Structure
```
.babelrc - babel 룰
.eslintrc - eslint 룰
deployedAddress - truffle migrate 후 생성되는 새 컨트랙트 주소가 자동저장되는 파일.
truffle.js - truffle config 파일
server.dev.js - npm run dev 시 실행되는 서버 코드
webpack.config.js - webpack dev 서버 config
webpack.prod.config.js - webpack prod config

contracts // Solidity 컨트랙트
dist // npm run build를 통해 빌드된 파일
static // static 파일들이 있는 폴더. static 안에 존재하는 개별 폴더를 프론트엔드 코드에서 <img src="/images/xxx.png" /> 로 접근 가능
migrations // truffle migrate 시 실행되는 파일
public // index.html, favicon, manifest.json이 존재하는 폴더
src - actions // Redux action들이 정의되어 있는 폴더
src - components // React 컴포넌트들이 정의되어 있는 폴더 (컴포넌트에 해당하는 .scss 파일과 같이 저장)
src - klaytn // klaytn 관련 코드, caver-js 가 포함되어 있다.
src - reducers // Redux reducer들이 정의되어 있는 폴더
src - styles // 글로벌한 stylesheet 코드 파일. _mixins.scss
src - utils // utility 성 파일들 집합. (contract.js, misc.js, transaction.js, ui.js 더 추가 될 수 있음..)
src (root) // index.js, App.js, store.js(Redux store), reducer.js(Redux reducer) 파일 존재
```

### 7) 사용 - 프론트엔드 실행
```
(npm install 후)
npm run local
자동으로 browser 열림.
```

### 8) 사용 - 프론트엔드 빌드
>`npm run build` 명령어를 이용하여 webpack을 통한 프론트엔드 코드를 빌드하여 번들링할 수 있다.
> 각 환경에 맞게 추가적인 키워드를 줄 수 있는데,
> `npm run build:local` `npm run build:qa`, `npm run build:real` 과 같이 환경에 맞는 빌드설정이 가능하다.
> 해당 환경설정 파일은 config 폴더의 .env 파일 형태로 존재한다.
> 빌드 된 파일은 `npm run start:qa`나 `npm run start:real` 로 환경에 맞게 실행 가능 하다.

### 9) 사용 - caver-js 를 이용하여 contract instance 사용하기
> src/klaytn/caver 에 정의되어 있는 caver-js를 이용하여 contract instance를 사용할 수 있다.
> 코드의 상위에 정의된 rpcURL에는 klaytn 노드의 주소를 넣어준다. (자신이 띄운 풀노드의 주소)
> ex) http://localhost:8551

a. SEND TRANSACTION METHOD

사용 예 1) caver-js를 직접적으로 import하여 library를 사용하는 경우.
```
import Caver from 'caver-js'
const cav = new Caver('http://localhost:8551')

const ABIJSON = [...]
const contractAddress = '0x...'

const contractInstance = new cav.Contract(ABIJSON, contractAddress)

contractInstance.methods.plus().send({
  from: ...,
  gas: '30000',
})
```

사용 예 2) caver-js가 이미 들어있는 src/klaytn/caver 에 정의된 파일을 사용하는 경우.
```
import { cav } from 'klaytn/caver'

const contractInstance = new cav.Contract(ABIJSON, contractAddress)

contractInstance.method.minus().send({
  from: ...,
  gas: '30000'
})
  .on('receipt', (data) => {
    console.log(data)
  })
```

b. CALL METHOD
```
import { cav } from 'klaytn/caver'

const contractInstance = new cav.Contract(ABIJSON, contractAddress)

contractInstance.method.count().call()
  .then(data => {
    console.log(data)
  })
```

### 10) 사용 - 컴파일 및 디플로이 (truffle 사용)

>컴파일 및 디플로이

>>truffle.js에 네트워크 정의

>>FROM에 디플로이를 하는 지갑 address를 기입한다. 단, 여기서 지갑은 unlock 되어 있어야 함.

```
const Caver = require('caver-js')

/**
 * truffle network variables
 */
const HOST = 'localhost'
const PORT = '8551'
const NETWORK_ID = '1000'
const GASLIMIT = 20000000
const GASPRICE = null

const cav = new Caver(new Caver.providers.HttpProvider(`${HOST}:${PORT}`))

// Unlock account before deploying contract. (personal.unlockAccount(...))
const FROM = cav.klay.accounts[0]

/**
 * network description
 * @param {string} from - wallet address for deploying
 */
module.exports = {
  networks: {
    klaytn: {
      host: HOST,
      port: PORT,
      from: FROM,
      network_id: NETWORK_ID,
      gas: GASLIMIT,
      gasPrice: GASPRICE,
    },
  },
}
```


>truffle migrate (디플로이)

```
truffle migrate --reset --network klaytn // truffle.js에 정의한 klaytn 네트워크에 디플로이
```

>>truffle migrate를 하게 되면 기본적으로 /migrations 폴더에 있는 파일들을 순차적으로 실행하게 된다.

>>디플로이 될 때 마다 변경되는 컨트랙트 주소를 수동으로 기입하는게 불편하면,

>>migrations/1_initial_migration.js 에 이런 코드를 넣을 수 있다.

```
const Migrations = artifacts.require('./Migrations.sol')
const ExampleContract = artifacts.require('./ExampleContract.sol')
const fs = require('fs')

module.exports = function (deployer) {
  deployer.deploy(Migrations)
  deployer.deploy(ExampleContract).then(() => {
    // Record recently deployed contract address to 'deployedAddress' file.
    if (ExampleContract._json) {

      // Save abi file to deployedABI.
      fs.writeFile('deployedABI', JSON.stringify(ExampleContract._json.abi, 2), (err) => {
        if (err) throw err
        console.log(`The abi of ${ExampleContract._json.contractName} is recorded on deployedABI file`)
      })
    }

    fs.writeFile('deployedAddress', ExampleContract.address, function (err) {
      if (err) throw err
      console.log(`The address ${ExampleContract.address} is recorded on deployedAddress file`)
    })
  })
};
```

>>위에서 저장한 주소는 webpack.config.js 에서 webpack Define plugin을 이용해서 다음과 같이 정의되어 있다.

```
    new webpack.DefinePlugin({
      DEV: true,
      DEPLOYED_ADDRESS: JSON.stringify(fs.readFileSync('deployedAddress', 'utf8')),
    }),
```

>>이렇게 정의된 DEPLOYED_ADDRESS를 어떤 코드에서든 가져다 쓸 수 있다.

import config from "../config";
import async from 'async';
import * as moment from 'moment';
import {
  ERROR,
  CONFIGURE,
  CONFIGURE_RETURNED,
  GET_POOL_BALANCES,
  POOL_BALANCES_RETURNED,
  DEPOSIT_POOL,
  DEPOSIT_POOL_RETURNED,
  WITHDRAW_POOL,
  WITHDRAW_POOL_RETURNED,
  EXCHANGE_POOL,
  EXCHANGE_POOL_RETURNED,
  GET_EXCHANGE_PRICE,
  EXCHANGE_PRICE_RETURNED,
  GET_DEPOSIT_PRICE,
  DEPOSIT_PRICE_RETURNED,
  GET_WITHDRAW_PRICE,
  WITHDRAW_PRICE_RETURNED,
} from '../constants';
import Web3 from 'web3';

import {
  injected,
  walletconnect,
  walletlink,
  ledger,
  trezor,
  frame,
  fortmatic,
  portis,
  squarelink,
  torus,
  authereum
} from "./connectors";

const rp = require('request-promise');
const ethers = require('ethers');

const Dispatcher = require('flux').Dispatcher;
const Emitter = require('events').EventEmitter;

const dispatcher = new Dispatcher();
const emitter = new Emitter();

class Store {
  constructor() {

    this.store = {
      universalGasPrice: '70',
      account: {},
      web3: null,
      connectorsByName: {
        MetaMask: injected,
        TrustWallet: injected,
        WalletConnect: walletconnect,
        WalletLink: walletlink,
        Ledger: ledger,
        Trezor: trezor,
        Frame: frame,
        Fortmatic: fortmatic,
        Portis: portis,
        Squarelink: squarelink,
        Torus: torus,
        Authereum: authereum
      },
      web3context: null,
      languages: [
        {
          language: 'English',
          code: 'en'
        },
        {
          language: 'Japanese',
          code: 'ja'
        },
        {
          language: 'Chinese',
          code: 'zh'
        }
      ],
      assets: [
        {
          "address": "0xfC1E690f61EFd961294b3e1Ce3313fBD8aa4f85d",
          "id": "aDAI",
          "symbol": "aDAI",
          "decimals": "18",
          "name": "Aave Interest bearing DAI",
          "type": "aave"
        },
        {
          "address": "0x4DA9b813057D04BAef4e5800E36083717b4a0341",
          "id": "aTUSD",
          "symbol": "aTUSD",
          "decimals": "18",
          "name": "Aave Interest bearing TUSD",
          "type": "aave"
        },
        {
          "address": "0x9bA00D6856a4eDF4665BcA2C2309936572473B7E",
          "id": "aUSDC",
          "symbol": "aUSDC",
          "decimals": "6",
          "name": "Aave Interest bearing USDC",
          "type": "aave"
        },
        {
          "address": "0x71fc860F7D3A592A4a98740e39dB31d25db65ae8",
          "id": "aUSDT",
          "symbol": "aUSDT",
          "decimals": "6",
          "name": "Aave Interest bearing USDT",
          "type": "aave"
        },
        {
          "address": "0x625aE63000f46200499120B906716420bd059240",
          "id": "aSUSD",
          "symbol": "aSUSD",
          "decimals": "18",
          "name": "Aave Interest bearing SUSD",
          "type": "aave"
        },
        {
          "address": "0x7D2D3688Df45Ce7C552E19c27e007673da9204B8",
          "id": "aLEND",
          "symbol": "aLEND",
          "decimals": "18",
          "name": "Aave Interest bearing LEND",
          "type": "aave"
        },
        {
          "address": "0xE1BA0FB44CCb0D11b80F92f4f8Ed94CA3fF51D00",
          "id": "aBAT",
          "symbol": "aBAT",
          "decimals": "18",
          "name": "Aave Interest bearing BAT",
          "type": "aave"
        },
        {
          "address": "0x3a3A65aAb0dd2A17E3F1947bA16138cd37d08c04",
          "id": "aETH",
          "symbol": "aETH",
          "decimals": "18",
          "name": "Aave Interest bearing ETH",
          "type": "aave"
        },
        {
          "address": "0xA64BD6C70Cb9051F6A9ba1F163Fdc07E0DfB5F84",
          "id": "aLINK",
          "symbol": "aLINK",
          "decimals": "18",
          "name": "Aave Interest bearing LINK",
          "type": "aave"
        },
        {
          "address": "0x9D91BE44C06d373a8a226E1f3b146956083803eB",
          "id": "aKNC",
          "symbol": "aKNC",
          "decimals": "18",
          "name": "Aave Interest bearing KNC",
          "type": "aave"
        },
        {
          "address": "0x71010A9D003445aC60C4e6A7017c1E89A477B438",
          "id": "aREP",
          "symbol": "aREP",
          "decimals": "18",
          "name": "Aave Interest bearing REP",
          "type": "aave"
        },
        {
          "address": "0x7deB5e830be29F91E298ba5FF1356BB7f8146998",
          "id": "aMKR",
          "symbol": "aMKR",
          "decimals": "18",
          "name": "Aave Interest bearing MKR",
          "type": "aave"
        },
        {
          "address": "0x6FCE4A401B6B80ACe52baAefE4421Bd188e76F6f",
          "id": "aMANA",
          "symbol": "aMANA",
          "decimals": "18",
          "name": "Aave Interest bearing MANA",
          "type": "aave"
        },
        {
          "address": "0x6Fb0855c404E09c47C3fBCA25f08d4E41f9F062f",
          "id": "aZRX",
          "symbol": "aZRX",
          "decimals": "18",
          "name": "Aave Interest bearing ZRX",
          "type": "aave"
        },
        {
          "address": "0x328C4c80BC7aCa0834Db37e6600A6c49E12Da4DE",
          "id": "aSNX",
          "symbol": "aSNX",
          "decimals": "18",
          "name": "Aave Interest bearing SNX",
          "type": "aave"
        },
        {
          "address": "0xFC4B8ED459e00e5400be803A9BB3954234FD50e3",
          "id": "aWBTC",
          "symbol": "aWBTC",
          "decimals": "8",
          "name": "Aave Interest bearing WBTC",
          "type": "aave"
        },
        {
          "address": "0x6Ee0f7BB50a54AB5253dA0667B0Dc2ee526C30a8",
          "id": "aBUSD",
          "symbol": "aBUSD",
          "decimals": "18",
          "name": "Aave Interest bearing Binance USD",
          "type": "aave"
        },
        {
          "address": "0x4e15361fd6b4bb609fa63c81a2be19d873717870",
      		"id": "FTM",
      		"symbol": "FTM",
      		"decimals": "18",
      		"name": "Fantom",
          "uniSymbol": "FTMUNI",
          "type": "chainlink"
        },
        {
      		"address": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      		"id": "DAI",
      		"symbol": "DAI",
      		"decimals": "18",
      		"name": "DAI Stablecoin",
          "uniSymbol": "DAIUNI",
          "type": "chainlink"
      	},
      	{
      		"address": "0x0000000000085d4780B73119b644AE5ecd22b376",
      		"id": "TUSD",
      		"symbol": "TUSD",
      		"decimals": "18",
      		"name": "TrueUSD",
          "type": "chainlink"
      	},
      	{
      		"address": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      		"id": "USDC",
      		"symbol": "USDC",
      		"decimals": "6",
      		"name": "USD Coin",
          "type": "chainlink"
      	},
      	{
      		"address": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      		"id": "USDT",
      		"symbol": "USDT",
      		"decimals": "6",
      		"name": "Tether USD",
          "type": "chainlink"
      	},
      	{
      		"address": "0x57Ab1ec28D129707052df4dF418D58a2D46d5f51",
      		"id": "SUSD",
      		"symbol": "SUSD",
      		"decimals": "18",
      		"name": "Synth sUSD",
          "type": "chainlink"
      	},
      	{
      		"address": "0x80fB784B7eD66730e8b1DBd9820aFD29931aab03",
      		"id": "LEND",
      		"symbol": "LEND",
      		"decimals": "18",
      		"name": "EthLend",
          "type": "chainlink"
      	},
      	{
      		"address": "0x0D8775F648430679A709E98d2b0Cb6250d2887EF",
      		"id": "BAT",
      		"symbol": "BAT",
      		"decimals": "18",
      		"name": "BAT",
          "type": "chainlink"
      	},
      	{
      		"address": "0x514910771AF9Ca656af840dff83E8264EcF986CA",
      		"id": "LINK",
      		"symbol": "LINK",
      		"decimals": "18",
      		"name": "ChainLink Token",
          "type": "chainlink"
      	},
      	{
      		"address": "0xdd974D5C2e2928deA5F71b9825b8b646686BD200",
      		"id": "KNC",
      		"symbol": "KNC",
      		"decimals": "18",
      		"name": "KyberNetwork",
          "type": "chainlink"
      	},
      	{
      		"address": "0x1985365e9f78359a9B6AD760e32412f4a445E862",
      		"id": "REP",
      		"symbol": "REP",
      		"decimals": "18",
      		"name": "Reputation",
          "type": "chainlink"
      	},
      	{
      		"address": "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2",
      		"id": "MKR",
      		"symbol": "MKR",
      		"decimals": "18",
      		"name": "Maker",
          "type": "chainlink"
      	},
      	{
      		"address": "0x0F5D2fB29fb7d3CFeE444a200298f468908cC942",
      		"id": "MANA",
      		"symbol": "MANA",
      		"decimals": "18",
      		"name": "Decentraland",
          "type": "chainlink"
      	},
      	{
      		"address": "0xE41d2489571d322189246DaFA5ebDe1F4699F498",
      		"id": "ZRX",
      		"symbol": "ZRX",
      		"decimals": "18",
      		"name": "0x",
          "type": "chainlink"
      	},
      	{
      		"address": "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F",
      		"id": "SNX",
      		"symbol": "SNX",
      		"decimals": "18",
      		"name": "Synthetix Network Token",
          "type": "chainlink"
      	},
      	{
      		"address": "0x4Fabb145d64652a948d72533023f6E7A623C7C53",
      		"id": "BUSD",
      		"symbol": "BUSD",
      		"decimals": "18",
      		"name": "Binance USD",
          "type": "chainlink"
      	},
        {
          "address": "0xbbbbca6a901c926f240b89eacb641d8aec7aeafd",
          "id": "LRC",
      		"symbol": "LRC",
      		"decimals": "18",
      		"name": "LoopringCoin",
          "type": "chainlink"
        },
        {
          "address": "0x408e41876cccdc0f92210600ef50372656052a38",
          "id": "REN",
      		"symbol": "REN",
      		"decimals": "18",
      		"name": "Republic",
          "type": "chainlink"
        },
        {
          "address": "0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c",
          "id": "ENJ",
      		"symbol": "ENJ",
      		"decimals": "18",
      		"name": "EnjinCoin",
          "type": "chainlink"
        },
      ],
      aUSD: {
        "address": config.aUSDAddress,
        "id": "aUSD",
        "symbol": "aUSD",
        "decimals": "18",
        "name": "AMM USD"
      }
    }

    dispatcher.register(
      function (payload) {
        switch (payload.type) {
          case CONFIGURE:
            this.configure(payload);
            break;
          case GET_POOL_BALANCES:
            this.getPoolBalances(payload);
            break;
          case DEPOSIT_POOL:
            this.depositPool(payload)
            break;
          case WITHDRAW_POOL:
            this.withdrawPool(payload)
            break;
          case EXCHANGE_POOL:
            this.exchangePool(payload)
            break;
          case GET_EXCHANGE_PRICE:
            this.getExchangePrice(payload)
            break;
          default: {
          }
        }
      }.bind(this)
    );
  }

  getStore(index) {
    return(this.store[index]);
  };

  setStore(obj) {
    this.store = {...this.store, ...obj}
    // console.log(this.store)
    return emitter.emit('StoreUpdated');
  };


  //TODO: Probably hard code the assets objects from "feeds.chain.link" data. Tedious.

  configure = async () => {
    const account = store.getStore('account')
    const assets = store.getStore('assets')
    const aUSD = store.getStore('aUSD')

    const web3 = new Web3(store.getStore('web3context').library.provider);

    async.map(assets, (asset, callback) => {
      async.parallel([
        (callbackInner) => { this._getERC20Balance(web3, asset, account, callbackInner) },
        (callbackInner) => { this._getUniAddress(web3, asset, account, callbackInner) },
        // (callbackInner) => { this._getDecimals(web3, asset, account, callbackInner) },
      ], (err, data) => {
        if(err) {
          console.log(err)
        }
        asset.balance = data[0]
        asset.uniAddress = data[1]
        // if(data[2] != 18) {
        //   console.log(asset)
        //   console.log(data[2])
        // }
        // asset.decimals = data[2]

        this._getUniBalance(web3, asset, account, (err, uniBalance) => {
          asset.uniBalance = uniBalance

          callback(null, asset)
        })
      })
    }, (err, assetsData) => {
      if(err) {
        return emitter.emit(ERROR, err)
      }

      store.setStore({ assets: assetsData })
      emitter.emit(CONFIGURE_RETURNED)
      return emitter.emit(POOL_BALANCES_RETURNED)
    })
  }

  _checkApproval = async (asset, account, amount, contract, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    let erc20Contract = new web3.eth.Contract(config.erc20ABI, asset.address)
    try {
      const allowance = await erc20Contract.methods.allowance(account.address, contract).call({ from: account.address })

      const ethAllowance = web3.utils.fromWei(allowance, "ether")

      if(parseFloat(ethAllowance) < parseFloat(amount)) {
        await erc20Contract.methods.approve(contract, web3.utils.toWei("999999999999999", "ether")).send({ from: account.address, gasPrice: web3.utils.toWei(store.getStore('universalGasPrice'), 'gwei') })
        callback()
      } else {
        callback()
      }
    } catch(error) {
      if(error.message) {
        return callback(error.message)
      }
      callback(error)
    }
  }

  _checkApprovalWaitForConfirmation = async (asset, account, amount, contract, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    let erc20Contract = new web3.eth.Contract(config.erc20ABI, asset.address)
    const allowance = await erc20Contract.methods.allowance(account.address, contract).call({ from: account.address })

    const ethAllowance = web3.utils.fromWei(allowance, "ether")

    if(parseFloat(ethAllowance) < parseFloat(amount)) {
      erc20Contract.methods.approve(contract, web3.utils.toWei("999999999999999", "ether")).send({ from: account.address, gasPrice: web3.utils.toWei(store.getStore('universalGasPrice'), 'gwei') })
        .on('transactionHash', function(hash){
          callback()
        })
        .on('error', function(error) {
          if (!error.toString().includes("-32601")) {
            if(error.message) {
              return callback(error.message)
            }
            callback(error)
          }
        })
    } else {
      callback()
    }
  }

  _getERC20Balance = async (web3, asset, account, callback) => {
    let erc20Contract = new web3.eth.Contract(config.erc20ABI, asset.address)

    try {
      var balance = await erc20Contract.methods.balanceOf(account.address).call({ from: account.address });
      balance = parseFloat(balance)/10**asset.decimals
      callback(null, parseFloat(balance))
    } catch(ex) {
      return callback(ex)
    }
  }

  _getUniAddress = async (web3, asset, account, callback) => {
    let aUSDContract = new web3.eth.Contract(config.aUSDABI, config.aUSDAddress)

    try {
      var uniAddress = await aUSDContract.methods.getUNI(asset.address).call({ from: account.address });
      callback(null, uniAddress)
    } catch(ex) {
      return callback(ex)
    }
  }

  _getDecimals = async (web3, asset, account, callback) => {
    let erc20Contract = new web3.eth.Contract(config.erc20ABI, asset.address)

    try {
      var decimals = await erc20Contract.methods.decimals().call({ from: account.address });
      callback(null, decimals)
    } catch(ex) {
      return callback(ex)
    }
  }

  _getUniBalance = async (web3, asset, account, callback) => {
    if(!asset.uniAddress || asset.uniAddress === "0x0000000000000000000000000000000000000000") {
      return callback(null, 0)
    }

    let erc20Contract = new web3.eth.Contract(config.erc20ABI, asset.uniAddress)

    try {
      var balance = await erc20Contract.methods.balanceOf(account.address).call({ from: account.address });
      balance = parseFloat(balance)/10**asset.decimals
      callback(null, parseFloat(balance))
    } catch(ex) {
      return callback(ex)
    }
  }

  _getReserveERC20Balance = async (web3, asset, account, callback) => {
    if(asset.reserve_symbol === 'ETH') {
      try {
        const eth_balance = web3.utils.fromWei(await web3.eth.getBalance(account.address), "ether");
        callback(null, parseFloat(eth_balance))
      } catch(ex) {
        return callback(ex)
      }
    } else {
      let erc20Contract = new web3.eth.Contract(config.erc20ABI, asset.reserve)

      try {
        var balance = await erc20Contract.methods.balanceOf(account.address).call({ from: account.address });
        balance = parseFloat(balance)/10**asset.reserve_decimals
        callback(null, parseFloat(balance))
      } catch(ex) {
        return callback(ex)
      }
    }
  }

  getPoolBalances = async () => {
    const account = store.getStore('account')
    const assets = store.getStore('assets')
    const aUSD = store.getStore('aUSD')

    const web3 = new Web3(store.getStore('web3context').library.provider);

    this._getERC20Balance(web3, aUSD, account, (err, balance) => {
      aUSD.balance = balance
      store.setStore({ aUSD: aUSD })
    })

    async.map(assets, (asset, callback) => {
      async.parallel([
        (callbackInner) => { this._getERC20Balance(web3, asset, account, callbackInner) },
        (callbackInner) => { this._getUniBalance(web3, asset, account, callbackInner) },
      ], (err, data) => {
        asset.balance = data[0]
        asset.uniBalance = data[1]
        callback(null, asset)
      })
    }, (err, assets) => {
      if(err) {
        return emitter.emit(ERROR, err)
      }

      store.setStore({ assets: assets })
      return emitter.emit(POOL_BALANCES_RETURNED, assets)
    })
  }

  depositPool = (payload) => {
    const account = store.getStore('account')
    const { assets } = payload.content

    async.map(assets, (asset, callback) => {
      this._checkIfApprovalIsNeeded(asset, account, asset.amount, config.aUSDAddress, callback)
    }, (err, data) => {
      let approvalSubmit = data.filter((asset) => {
        return asset !== false
      })

      let lastId = 0
      if(approvalSubmit.length > 0) {
        lastId = approvalSubmit[approvalSubmit.length-1].id
      }

      async.mapLimit(approvalSubmit, 1, (asset, callback) => {
        let last = false
        if(asset.id === lastId) {
          last = true
        }
        this._callApproval(asset, account, asset.amount, config.aUSDAddress, last, callback)
      }, (err, result) => {
        async.map(assets, (asset, callbackInner) => {
          this._callDepositPool(account, asset, callbackInner)
        }, (err, data) => {
          if(err) {
            return emitter.emit(ERROR, err);
          }

          return emitter.emit(DEPOSIT_POOL_RETURNED, data)
        })
      })
    })
  }

  _checkIfApprovalIsNeeded = async (asset, account, amount, contract, callback, overwriteAddress) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    let erc20Contract = new web3.eth.Contract(config.erc20ABI, (overwriteAddress ? overwriteAddress : asset.address))
    const allowance = await erc20Contract.methods.allowance(account.address, contract).call({ from: account.address })

    const ethAllowance = web3.utils.fromWei(allowance, "ether")
    if(parseFloat(ethAllowance) < parseFloat(amount)) {
      asset.amount = amount
      callback(null, asset)
    } else {
      callback(null, false)
    }
  }

  _callApproval = async (asset, account, amount, contract, last, callback, overwriteAddress) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    let erc20Contract = new web3.eth.Contract(config.erc20ABI, (overwriteAddress ? overwriteAddress : asset.address))
    try {
      if(last) {
        await erc20Contract.methods.approve(contract, web3.utils.toWei("999999999999999", "ether")).send({ from: account.address, gasPrice: web3.utils.toWei(store.getStore('universalGasPrice'), 'gwei') })
        callback()
      } else {
        erc20Contract.methods.approve(contract, web3.utils.toWei("999999999999999", "ether")).send({ from: account.address, gasPrice: web3.utils.toWei(store.getStore('universalGasPrice'), 'gwei') })
          .on('transactionHash', function(hash){
            callback()
          })
          .on('error', function(error) {
            if (!error.toString().includes("-32601")) {
              if(error.message) {
                return callback(error.message)
              }
              callback(error)
            }
          })
      }
    } catch(error) {
      if(error.message) {
        return callback(error.message)
      }
      callback(error)
    }
  }

  _callDepositPool = async (account, asset, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const aUSDContract = new web3.eth.Contract(config.aUSDABI, config.aUSDAddress)

    const token = asset.address
    const amount = asset.amount

    var amountToSend = web3.utils.toWei(amount, "ether")
    if (asset.decimals != 18) {
      amountToSend = (amount*10**asset.decimals).toFixed(0);
    }

    let method = ''

    if(asset.type === 'chainlink') {
      method = 'deposit'
    } else if (asset.type === 'aave') {
      method = 'depositAave'
    } else {
      return
    }

    // console.log(method)
    // console.log(token)
    // console.log(amountToSend)

    aUSDContract.methods[method](token, amountToSend).send({ from: account.address, gasPrice: web3.utils.toWei(store.getStore('universalGasPrice'), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        if(confirmationNumber == 2) {
          dispatcher.dispatch({ type: GET_POOL_BALANCES, content: {} })
        }
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

  withdrawPool = (payload) => {
    const account = store.getStore('account')
    const { assets } = payload.content

    async.map(assets, (asset, callback) => {
      this._checkIfApprovalIsNeeded(asset, account, asset.amount, config.aUSDAddress, callback, asset.uniAddress)
    }, (err, data) => {
      let approvalSubmit = data.filter((asset) => {
        return asset !== false
      })

      let lastId = 0
      if(approvalSubmit.length > 0) {
        lastId = approvalSubmit[approvalSubmit.length-1].id
      }

      async.mapLimit(approvalSubmit, 1, (asset, callback) => {
        let last = false
        if(asset.id === lastId) {
          last = true
        }
        this._callApproval(asset, account, asset.amount, config.aUSDAddress, last, callback, asset.uniAddress)
      }, (err, result) => {
        async.map(assets, (asset, callbackInner) => {
          this._callWithdrawPool(account, asset, callbackInner)
        }, (err, data) => {
          if(err) {
            return emitter.emit(ERROR, err);
          }

          return emitter.emit(WITHDRAW_POOL_RETURNED, data)
        })
      })
    })
  }

  _callWithdrawPool = async (account, asset, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const aUSDContract = new web3.eth.Contract(config.aUSDABI, config.aUSDAddress)

    const token = asset.address
    const amount = asset.amount

    var amountToSend = web3.utils.toWei(amount, "ether")
    if (asset.decimals != 18) {
      amountToSend = (amount*10**asset.decimals).toFixed(0);
    }

    let method = ''

    if(asset.type === 'chainlink') {
      method = 'withdraw'
    } else if (asset.type === 'aave') {
      method = 'withdrawAave'
    } else {
      return
    }

    aUSDContract.methods[method](token, amountToSend).send({ from: account.address, gasPrice: web3.utils.toWei(store.getStore('universalGasPrice'), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        if(confirmationNumber == 2) {
          dispatcher.dispatch({ type: GET_POOL_BALANCES, content: {} })
        }
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

  getExchangePrice = async (payload) => {
    const account = store.getStore('account')
    const assets = store.getStore('assets')
    const { fromAsset, toAsset, amount } = payload.content

    const web3 = new Web3(store.getStore('web3context').library.provider);
    const exchangeContract = new web3.eth.Contract(config.uniswapContractABI, config.uniswapContractAddress)

    let asset = assets.filter((asset) => { return asset.address === fromAsset })[0]

    var amountToSend = web3.utils.toWei(amount, "ether")
    if (asset.decimals != 18) {
      amountToSend = (amount*10**asset.decimals).toFixed(0);
    }

    const path = [fromAsset, config.aUSDAddress, toAsset]

    // console.log(amountToSend)

    let price = await exchangeContract.methods.getAmountsOut(amountToSend, path).call({ from: account.address })

    // console.log(price)
    asset = assets.filter((asset) => { return asset.address === toAsset })[0]

    price = web3.utils.fromWei(price[2], "ether")
    if (asset.decimals != 18) {
      price = (price[2]/(10**asset.decimals)).toFixed(0);
    }

    return emitter.emit(EXCHANGE_PRICE_RETURNED, price)
  }

  exchangePool = (payload) => {
    const account = store.getStore('account')
    const assets = store.getStore('assets')
    const { fromAsset, toAsset, fromAmount, toAmount } = payload.content

    let asset = assets.filter((asset) => { return asset.address === fromAsset })[0]

    this._checkApproval(asset, account, fromAmount, config.uniswapContractAddress, (err) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      this._callExchangePool(fromAsset, toAsset, fromAmount, toAmount, account, (err, res) => {
        if(err) {
          return emitter.emit(ERROR, err);
        }

        return emitter.emit(EXCHANGE_POOL_RETURNED, res)
      })
    })
  }

  _callExchangePool = async (fromAsset, toAsset, fromAmount, toAmount, account, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    const assets = store.getStore('assets')

    const exchangeContract = new web3.eth.Contract(config.uniswapContractABI, config.uniswapContractAddress)

    let asset = assets.filter((asset) => { return asset.address === fromAsset })[0]

    var fromAmountToSend = web3.utils.toWei(fromAmount, "ether")
    if (asset.decimals != 18) {
      fromAmountToSend = (fromAmount*10**asset.decimals).toFixed(0);
    }

    asset = assets.filter((asset) => { return asset.address === toAsset })[0]

    let toAmountString = (toAmount*99/100).toFixed(8)
    var toAmountToSend = web3.utils.toWei(toAmountString, "ether")
    if (asset.decimals != 18) {
      toAmountToSend = (toAmountString*10**asset.decimals).toFixed(0);
    }

    let deadline = moment().unix()
    deadline = deadline + 1600

    const path = [fromAsset, config.aUSDAddress, toAsset]
    //
    // console.log(fromAmountToSend)
    // console.log(toAmountToSend)
    // console.log(path)
    // console.log(account.address)
    // console.log(deadline)

    exchangeContract.methods.swapExactTokensForTokens(fromAmountToSend, toAmountToSend, path, account.address, deadline).send({ from: account.address, gasPrice: web3.utils.toWei(store.getStore('universalGasPrice'), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        if(confirmationNumber == 2) {
          dispatcher.dispatch({ type: GET_POOL_BALANCES, content: {} })
        }
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
        callback(error)
      })
  }
}

var store = new Store();

export default {
  store: store,
  dispatcher: dispatcher,
  emitter: emitter
};

import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Card,
  Typography,
  Button,
  InputAdornment,
  TextField,
  MenuItem,
  CircularProgress
} from '@material-ui/core';

import Loader from '../../loader'
import Snackbar from '../../snackbar'

import { colors } from '../../../theme'
import {
  ERROR,
  GET_POOL_BALANCES,
  POOL_BALANCES_RETURNED,
  CONNECTION_CONNECTED,
  CONNECTION_DISCONNECTED,
  GET_EXCHANGE_PRICE,
  EXCHANGE_PRICE_RETURNED,
  EXCHANGE_POOL,
  EXCHANGE_POOL_RETURNED
} from '../../../constants'

import { withNamespaces } from 'react-i18next';
import Store from "../../../stores";
const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

const styles = theme => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '1200px',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  introText: {
    flex: 1
  },
  intro: {
    width: '100%',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  introCenter: {
    minWidth: '100%',
    textAlign: 'center',
    padding: '48px 0px'
  },
  investedContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px',
    minWidth: '100%',
    [theme.breakpoints.up('md')]: {
      minWidth: '800px',
    }
  },
  connectContainer: {
    padding: '12px',
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '450px',
    [theme.breakpoints.up('md')]: {
      width: '450',
    }
  },
  actionButton: {
    '&:hover': {
      backgroundColor: "#2F80ED",
    },
    padding: '12px',
    backgroundColor: "#2F80ED",
    borderRadius: '1rem',
    border: '1px solid #E1E1E1',
    fontWeight: 500,
    [theme.breakpoints.up('md')]: {
      padding: '15px',
    }
  },
  buttonText: {
    fontWeight: '700',
    color: 'white',
  },
  disaclaimer: {
    padding: '12px',
    border: '1px solid rgb(174, 174, 174)',
    borderRadius: '0.75rem',
    marginBottom: '24px',
  },
  aUSDCard: {
    display: 'flex',
    justifyContent: 'space-between',
    overflow: 'hidden',
    flex: 1,
    whiteSpace: 'nowrap',
    fontSize: '0.83rem',
    padding: '28px 30px',
    borderRadius: '50px',
    border: '1px solid '+colors.borderBlue,
    alignItems: 'center',
    maxWidth: '500px',
    marginTop: '40px',
    background: colors.white,
    [theme.breakpoints.up('md')]: {
      width: '100%'
    }
  },
  aUSDBalance: {
    display: 'flex',
    alignItems: 'center'
  },
  addressContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    overflow: 'hidden',
    flex: 1,
    whiteSpace: 'nowrap',
    fontSize: '0.83rem',
    textOverflow:'ellipsis',
    cursor: 'pointer',
    padding: '28px 30px',
    borderRadius: '50px',
    border: '1px solid '+colors.borderBlue,
    alignItems: 'center',
    maxWidth: '500px',
    [theme.breakpoints.up('md')]: {
      width: '100%'
    }
  },
  card: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    maxWidth: '800px',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
    display: 'flex',
    flexWrap: 'wrap',
    padding: '42px 30px',
    borderRadius: '50px',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: '40px 0px',
    border: '1px solid '+colors.borderBlue,
    minWidth: '500px',
  },
  actionInput: {
    padding: '0px 0px 12px 0px',
    fontSize: '0.5rem'
  },
  inputAdornment: {
    fontWeight: '600',
    fontSize: '1.5rem'
  },
  assetIcon: {
    display: 'inline-block',
    verticalAlign: 'middle',
    borderRadius: '25px',
    background: '#dedede',
    height: '30px',
    width: '30px',
    textAlign: 'center',
    marginRight: '16px'
  },
  balances: {
    width: '100%',
    textAlign: 'right',
    paddingRight: '20px',
    cursor: 'pointer'
  },
  title: {
    paddingRight: '24px'
  },
  value: {
    cursor: 'pointer'
  },
  valContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  },
  inputCardHeading: {
    width: '100%',
    color: colors.darkGray
  },
  inputCardHeading2: {
    width: '100%',
    color: colors.darkGray,
    marginTop: '20px'
  },
  placceholder: {
    marginBottom: '12px'
  },
  ratios: {
    marginBottom: '12px'
  },
  idealHolder: {
    display: 'flex'
  },
  disabledAdornment: {
    color: 'rgb(170, 170, 170)'
  },
  walletAddress: {
    padding: '0px 12px'
  },
  walletTitle: {
    flex: 1,
    color: colors.darkGray
  },
  assetSelectMenu: {
    padding: '15px 15px 15px 20px',
    minWidth: '200px',
    display: 'flex'
  },
  assetSelectIcon: {
    display: 'inline-block',
    verticalAlign: 'middle',
    borderRadius: '25px',
    background: '#dedede',
    height: '30px',
    width: '30px',
    textAlign: 'center',
    cursor: 'pointer'
  },
  assetSelectIconName: {
    paddingLeft: '10px',
    display: 'inline-block',
    verticalAlign: 'middle',
    flex: 1
  },
  assetSelectBalance: {

  },
  assetContainer: {
    minWidth: '120px'
  },
  priceContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    padding: '20px 20px 28px 0px'
  }
});

class Exchange extends Component {

  constructor() {
    super()

    const account = store.getStore('account')

    this.state = {
      priceLoading: false,
      account: account,
      assets: store.getStore('assets'),
      fromAsset: "",
      toAsset: "",
      fromAmount: "",
      toAmount: ""
    }

    if(account && account.address) {
      dispatcher.dispatch({ type: GET_POOL_BALANCES, content: {} })
    }
  }

  componentWillMount() {
    emitter.on(ERROR, this.errorReturned);
    emitter.on(POOL_BALANCES_RETURNED, this.balancesReturned);
    emitter.on(EXCHANGE_PRICE_RETURNED, this.exchangePriceReturned);
    emitter.on(EXCHANGE_POOL_RETURNED, this.exchangePoolReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.errorReturned);
    emitter.removeListener(POOL_BALANCES_RETURNED, this.balancesReturned);
    emitter.removeListener(EXCHANGE_PRICE_RETURNED, this.exchangePriceReturned);
    emitter.removeListener(EXCHANGE_POOL_RETURNED, this.exchangePoolReturned);
  };

  exchangePoolReturned  = (txHash) => {
    this.setState({ snackbarMessage: null, snackbarType: null, loading: false })
    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: txHash, snackbarType: 'Hash' }
      that.setState(snackbarObj)
    })
  };

  exchangePriceReturned = (price) => {
    const { fromAmount } = this.state

    let pricePerShare = price
    let toAmount = ''

    if(fromAmount && fromAmount != "" && !isNaN(fromAmount) && parseFloat(fromAmount) > 0) {
      pricePerShare = pricePerShare / fromAmount
      toAmount= price
    }

    this.setState({ priceConversion: pricePerShare ? parseFloat(pricePerShare).toFixed(4) : '0.0000', priceLoading: false, toAmount: toAmount })
  };

  balancesReturned = (balances) => {
    this.setState({ assets: store.getStore('assets') })
  };

  errorReturned = (error) => {
    const snackbarObj = { snackbarMessage: null, snackbarType: null }
    this.setState(snackbarObj)
    this.setState({ loading: false })
    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: error.toString(), snackbarType: 'Error' }
      that.setState(snackbarObj)
    })
  };

  render() {
    const { classes, t } = this.props;
    const {
      account,
      loading,
      snackbarMessage,
      priceConversion,
      fromAsset,
      toAsset,
      priceLoading
    } = this.state

    var address = null;
    if (account.address) {
      address = account.address.substring(0,6)+'...'+account.address.substring(account.address.length-4,account.address.length)
    }

    return (
      <div className={ classes.root }>
        <div className={ classes.card }>
          <Typography variant={'h5'} className={ classes.disaclaimer }>This project is in beta. Use at your own risk.</Typography>
          <div className={ classes.intro }>
            <Card className={ classes.addressContainer } onClick={this.overlayClicked}>
              <Typography variant={ 'h3'} className={ classes.walletTitle } noWrap>Wallet</Typography>
              <Typography variant={ 'h4'} className={ classes.walletAddress } noWrap>{ address }</Typography>
              <div style={{ background: '#DC6BE5', opacity: '1', borderRadius: '10px', width: '10px', height: '10px', marginRight: '3px', marginTop:'3px', marginLeft:'6px' }}></div>
            </Card>
          </div>
          <Card className={ classes.inputContainer }>
            <Typography variant='h3' className={ classes.inputCardHeading }>From</Typography>
            { this.renderAssetInput('from') }
            <Typography variant='h3' className={ classes.inputCardHeading2 }>To (Estimated)</Typography>
            { this.renderAssetInput('to') }
            <div className={ classes.priceContainer }>
              <Typography variant='h4' className={ classes.priceConversion }>Price </Typography>
              { priceLoading && <CircularProgress size={ 20 } /> }
              { !priceLoading && <Typography variant='h4' className={ classes.priceConversion }>{ priceConversion ? (priceConversion + ' ' + toAsset + ' per 1 ' + fromAsset) : '-' }</Typography>}
            </div>

            <Button
              className={ classes.actionButton }
              variant="outlined"
              color="primary"
              disabled={ loading }
              onClick={ this.onExchange }
              fullWidth
              >
              <Typography className={ classes.buttonText } variant={ 'h5'} color='secondary'>{ t('PoolExchange.Exchange') }</Typography>
            </Button>
          </Card>
        </div>
        { snackbarMessage && this.renderSnackbar() }
        { loading && <Loader /> }
      </div>
    )
  };

  onExchange = () => {
    const { fromAsset, toAsset, fromAmount, toAmount, assets } = this.state

    if(!fromAmount || isNaN(fromAmount) || fromAmount <= 0) {
      this.setState({ fromAmountError: true })
      return false
    }
    let from = null
    let to = null

    assets.map((asset) => {
      if(asset.id === fromAsset) {
        from = asset.address
      }
      if(asset.id === toAsset) {
        to = asset.address
      }
    })

    if(from && to) {
      this.setState({ loading: true })
      dispatcher.dispatch({ type: EXCHANGE_POOL, content: { fromAsset: from, toAsset: to, fromAmount, toAmount } })
    }
  }

  renderSnackbar = () => {
    var {
      snackbarType,
      snackbarMessage
    } = this.state
    return <Snackbar type={ snackbarType } message={ snackbarMessage } open={true}/>
  };

  setAmount = (id, type, balance) => {
    if(type === 'to') {
      return false
    }
    const bal = (Math.floor((balance === '' ? '0' : balance)*10000)/10000).toFixed(4)
    let val = []
    val[type+"Amount"] = bal
    this.setState(val)
  }

  renderAssetInput = (type) => {
    const {
      classes
    } = this.props

    const {
      loading,
      assets
    } = this.state

    const that = this

    let asset = assets.filter((asset) => { return asset.id === that.state[type+"Asset"] })
    if(asset.length > 0) {
      asset = asset[0]
    } else {
      asset = null
    }

    const amount = this.state[type+"Amount"]
    const amountError = this.state[type+'AmountError']

    return (
      <div className={ classes.valContainer }>
        <div className={ classes.balances }>
          { (asset ? (<Typography variant='h4' onClick={ () => { this.setAmount(asset.id, type, (asset ? asset.balance : 0)) } } className={ classes.value } noWrap>{ 'Balance: '+ ( asset && asset.balance ? (Math.floor(asset.balance*10000)/10000).toFixed(4) : '0.0000') } { asset ? asset.symbol : '' }</Typography>) : <Typography variant='h4' className={ classes.value } noWrap>Balance: -</Typography>) }
        </div>
        <div>
          <TextField
            fullWidth
            disabled={ loading || type === "to" }
            className={ classes.actionInput }
            id={ type+"Amount" }
            value={ amount }
            error={ amountError }
            onChange={ this.onChange }
            placeholder="0.00"
            variant="outlined"
            InputProps={{
              endAdornment: <div className={ classes.assetContainer }>{ this.renderAssetSelect(type+"Asset") }</div>,
            }}
          />
        </div>
      </div>
    )
  }

  renderAssetSelect = (id) => {
    const { loading, assets } = this.state
    const { classes } = this.props

    return (
      <TextField
        id={ id }
        name={ id }
        select
        value={ this.state[id] }
        onChange={ this.onSelectChange }
        SelectProps={{
          native: false,
        }}
        fullWidth
        disabled={ loading }
        placeholder={ 'Select' }
        className={ classes.assetSelectRoot }
      >
        { assets ? assets.map(this.renderAssetOption) : null }
      </TextField>
    )
  }

  renderAssetOption = (option) => {
    const { classes } = this.props

    return (
      <MenuItem key={option.id} value={option.symbol} className={ classes.assetSelectMenu }>
        <React.Fragment>
          <div className={ classes.assetSelectIcon }>
            <img
              alt=""
              src={ require('../../../assets/'+option.id+'-logo.png') }
              height="30px"
            />
          </div>
          <div className={ classes.assetSelectIconName }>
            <Typography variant='h4'>{ option.symbol }</Typography>
          </div>
        </React.Fragment>
      </MenuItem>
    )
  }

  onChange = (event) => {
    let val = []
    val[event.target.id] = event.target.value
    this.setState(val)

    let {
      fromAsset,
      toAsset,
      fromAmount,
      assets
    } = this.state

    if(fromAsset && fromAsset != "" && toAsset && toAsset != "") {

      fromAmount = event.target.id === 'fromAmount' ? event.target.value : fromAmount

      let from = ""
      let to = ""
      let amount = "1"

      assets.map((asset) => {
        if(asset.id === fromAsset) {
          from = asset.address
        }
        if(asset.id === toAsset) {
          to = asset.address
        }
      })

      if(fromAmount && fromAmount != "" && !isNaN(fromAmount) && parseFloat(fromAmount) > 0) {
        amount = fromAmount
      }

      this.setState({ priceLoading: true })

      dispatcher.dispatch({ type: GET_EXCHANGE_PRICE, content: { fromAsset: from, toAsset: to, amount: amount } })
    }
  }

  onSelectChange = (event) => {
    let val = []
    val[event.target.name] = event.target.value
    this.setState(val)

    let {
      fromAsset,
      toAsset,
      fromAmount,
      assets
    } = this.state

    fromAsset = event.target.name === 'fromAsset' ? event.target.value : fromAsset
    toAsset = event.target.name === 'toAsset' ? event.target.value : toAsset

    if(fromAsset && fromAsset != "" && toAsset && toAsset != "") {

      let from = ""
      let to = ""
      let amount = "1"

      assets.map((asset) => {
        if(asset.id === fromAsset) {
          from = asset.address
        }
        if(asset.id === toAsset) {
          to = asset.address
        }
      })

      if(fromAmount && fromAmount != "" && !isNaN(fromAmount) && parseFloat(fromAmount) > 0) {
        amount = fromAmount
      }

      this.setState({ priceLoading: true })

      dispatcher.dispatch({ type: GET_EXCHANGE_PRICE, content: { fromAsset: from, toAsset: to, amount: amount } })
    }
  }

}

export default withNamespaces()(withRouter(withStyles(styles)(Exchange)));

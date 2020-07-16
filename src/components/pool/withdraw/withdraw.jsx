import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Card,
  Typography,
  Button,
  InputAdornment,
  TextField
} from '@material-ui/core';

import Loader from '../../loader'
import UnlockModal from '../../unlock/unlockModal.jsx'
import Snackbar from '../../snackbar'
import { colors } from '../../../theme'

import {
  ERROR,
  GET_POOL_BALANCES,
  POOL_BALANCES_RETURNED,
  CONNECTION_CONNECTED,
  CONNECTION_DISCONNECTED,
  WITHDRAW_POOL,
  WITHDRAW_POOL_RETURNED,
  GET_WITHDRAW_PRICE,
  WITHDRAW_PRICE_RETURNED,
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
});

class Withdraw extends Component {

  constructor() {
    super()

    const account = store.getStore('account')
    const assets = store.getStore('assets')

    this.state = {
      loading: !assets,
      account: account,
      assets: assets.filter((asset) => { return asset.uniBalance > 0 })
    }
  }

  componentWillMount() {
    emitter.on(ERROR, this.errorReturned);
    emitter.on(POOL_BALANCES_RETURNED, this.balancesReturned);
    emitter.on(WITHDRAW_POOL_RETURNED, this.withdrawPoolReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.errorReturned);
    emitter.removeListener(POOL_BALANCES_RETURNED, this.balancesReturned);
    emitter.removeListener(WITHDRAW_POOL_RETURNED, this.withdrawPoolReturned);
  };

  withdrawPoolReturned  = (txHash) => {
    this.setState({ snackbarMessage: null, snackbarType: null, loading: false })
    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: txHash, snackbarType: 'Hash' }
      that.setState(snackbarObj)
    })
  };

  balancesReturned = (balances) => {
    this.setState({
      assets: store.getStore('assets').filter((asset) => { return asset.uniBalance > 0 }),
      loading: false
    })
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
      modalOpen,
      snackbarMessage,
      amount,
      assets,
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
          {/*<div className={ classes.aUSDCard }>
            <div className={ classes.assetIcon }>
              <img
                alt=""
                src={ require('../../../assets/fUSD-logo.png') }
                height="30px"
              />
            </div>
            <Typography variant={ 'h3'} className={ classes.walletTitle } noWrap>{ aUSD.name }</Typography>
            <div className={ classes.aUSDBalance }>
              <Typography variant={ 'h3'} noWrap>{ aUSD.balance }</Typography>
              <Typography variant={ 'h4'} className={ classes.walletAddress } noWrap>{ aUSD.symbol }</Typography>
            </div>
          </div>*/}
          <Card className={ classes.inputContainer }>
            { !assets &&
              <Typography variant='h3' className={ classes.inputCardHeading }>Loading assets ...</Typography>
            }
            { assets &&
              <React.Fragment>
                <Typography variant='h3' className={ classes.inputCardHeading }>{ t("PoolWithdraw.Withdraw") }</Typography>
                { this.renderWithdrawAssets() }
                <Button
                  className={ classes.actionButton }
                  variant="outlined"
                  color="primary"
                  disabled={ loading }
                  onClick={ this.onWithdraw }
                  fullWidth
                  >
                  <Typography className={ classes.buttonText } variant={ 'h5'} color='secondary'>{ t('PoolWithdraw.Withdraw') }</Typography>
                </Button>
              </React.Fragment>
            }
          </Card>
        </div>
        { modalOpen && this.renderModal() }
        { snackbarMessage && this.renderSnackbar() }
        { loading && <Loader /> }
      </div>
    )
  };

  onWithdraw = () => {
    this.setState({ amountError: false })
    let state = this.state

    const sendAssets = state.assets.map((asset) => {
      asset.amount = state[asset.id + '_withdraw']
      if(asset.amount == null || asset.amount === '') {
        asset.amount = 0
      }
      return asset
    }).filter((asset) => {
      return asset.amount > 0
    })

    if(sendAssets.length > 0) {
      this.setState({ loading: true })
      dispatcher.dispatch({ type: WITHDRAW_POOL, content: { assets: sendAssets } })
    }
  }

  renderModal = () => {
    return (
      <UnlockModal closeModal={ this.closeModal } modalOpen={ this.state.modalOpen } />
    )
  }

  renderSnackbar = () => {
    var {
      snackbarType,
      snackbarMessage
    } = this.state
    return <Snackbar type={ snackbarType } message={ snackbarMessage } open={true}/>
  };

  overlayClicked = () => {
    this.setState({ modalOpen: true })
  }

  closeModal = () => {
    this.setState({ modalOpen: false })
  }

  onChange = (event) => {
    let val = []
    val[event.target.id] = event.target.value
    this.setState(val)
  };

  renderWithdrawAssets = () => {
    const assets = this.state.assets

    return assets.map((asset) => {
      return this.renderAssetInput(asset, 'withdraw')
    })
  }

  renderAssetInput = (asset, type) => {
    const {
      classes
    } = this.props

    const {
      loading
    } = this.state

    const amount = this.state[asset.id + '_' + type]
    const amountError = this.state[asset.id + '_' + type + '_error']

    return (
      <div className={ classes.valContainer } key={asset.id + '_' + type}>
        <div className={ classes.balances }>
          <Typography variant='h4' onClick={ () => { this.setAmount(asset.id, type, (asset ? asset.uniBalance : 0)) } } className={ classes.value } noWrap>{ 'Balance: '+ ( asset && asset.uniBalance ? (Math.floor(asset.uniBalance*10000)/10000).toFixed(4) : '0.0000') } { asset ? (asset.symbol+'UNI') : '' }</Typography>
        </div>
        <div>
          <TextField
            fullWidth
            disabled={ loading }
            className={ classes.actionInput }
            id={ '' + asset.id + '_' + type }
            value={ amount }
            error={ amountError }
            onChange={ this.onChange }
            placeholder="0.00"
            variant="outlined"
            InputProps={{
              endAdornment: <InputAdornment position="end" className={ classes.inputAdornment }><Typography variant='h3' className={ '' }>{ (asset.symbol+'UNI') }</Typography></InputAdornment>,
              startAdornment: <InputAdornment position="end" className={ classes.inputAdornment }>
                <div className={ classes.assetIcon }>
                  <img
                    alt=""
                    src={ require('../../../assets/'+asset.id+'-logo.png') }
                    height="30px"
                  />
                </div>
              </InputAdornment>,
            }}
          />
        </div>
      </div>
    )
  }

  setAmount = (id, type, balance) => {
    const bal = (Math.floor((balance === '' ? '0' : balance)*10000)/10000).toFixed(4)
    let val = []
    val[id + '_' + type] = bal
    this.setState(val)
  }

}

export default withNamespaces()(withRouter(withStyles(styles)(Withdraw)));

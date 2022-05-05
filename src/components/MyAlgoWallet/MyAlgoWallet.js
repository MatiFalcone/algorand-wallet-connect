import React, { useState, useRef } from 'react'
import { loadStdlib } from '@reach-sh/stdlib'
import MyAlgoConnect from '@reach-sh/stdlib/ALGO_MyAlgoConnect';
import ConnectWalletButton from './ConnectButton/ConnectWalletBtn';
import TransferFund from './Transferfund';
import FundAccount from './FundWallet';
import myalgo from '../../assets/images/myaglo-logo.png'
import { MyAlgoWalletMain } from './MyAlgoWallet.styles';
import axios from 'axios';

const reach = loadStdlib("ALGO")

reach.setWalletFallback(reach.walletFallback({
  providerEnv: 'TestNet', MyAlgoConnect })); 

const MyAlgoWallet = () => {

    const account = useRef()
    const balance = useRef()


    const [accountBal, setAccountBal] = useState(0);
    const [accountAddress, setAccountAddress] = useState('');


    const connectWallet = async () =>{
        try{
            await getAccount()
            await getBalanceFromAPI(account.current.networkAccount.addr)
            //await getBalance()
                
        }catch(err){
            console.log(err)
        }
    }

    const getAccount = async () => {
        try{
           account.current = await reach.getDefaultAccount()
            setAccountAddress(account.current.networkAccount.addr)
            console.log("Account :" + account.current.networkAccount.addr)
        }catch(err){
            console.log(err)
        }
    }

    const getBalanceFromAPI = async (account) => {
        try{
              let rawBalance = await axios.get(`https://algoindexer.testnet.algoexplorerapi.io/v2/accounts/${account}`);
                balance.current = rawBalance.data.account.amount;
                setAccountBal(balance.current)
                console.log("Balance :" + balance.current)
        }catch(err){
            console.log(err)
        }
    }

    const getBalance = async () => {
        try{
              let rawBalance = await reach.balanceOf(account.current)
              console.log(rawBalance);
                balance.current = reach.formatCurrency(rawBalance, 4)
                setAccountBal(balance.current)
            console.log("Balance :" + balance.current)
        }catch(err){
            console.log(err)
        }
    }

    return(
        <MyAlgoWalletMain>
            <img src= {myalgo} alt="My Algo" height= "70px"/>
            <ConnectWalletButton accountAddress={accountAddress} connectWallet = {connectWallet} accountBal = {accountBal}/>
            <TransferFund account = {account} getBalance = {function(){ return getBalanceFromAPI(account.current.networkAccount.addr) }} />
            {/* <FundAccount account = {account} getBalance = {function(){ return getBalanceFromAPI(account.current.networkAccount.addr) }}/> */}
        </MyAlgoWalletMain>
    )
}

export default MyAlgoWallet
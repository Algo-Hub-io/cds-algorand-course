# Creating and interacting with assets

## Creating the assets
To start, let's create some assets. For the creator, we are using the first account that we previously saved as a variable `$ACCT1`.

```bash
goal asset create --creator $ACCT1 --name "AlgoHub Example Token"  --total 1000000000000000 --unitname AHT --decimals 6
goal asset create --creator $ACCT1 --name "Secondary Example Token" --total 10000000000000000 --unitname SET --decimals 0
```

In the image below, you can see an example of the output.

![Token creation transactions showing created asset ids](./created%20tokens.png)

To make our future transactions easier, we'll store the asset ids in environment variables. My asset id's were 1002 and 1003.

```bash
export AHT=1002
export SET=1003
```

## Transferring assets
Before transferring between accounts, we need to opt our accounts into the assets. To opt in to an asset, we send a 0 value transaction of the asset from an account to the same account. 

If you recall, our three accounts are stored in variables ACCT1, ACCT2 and ACCT3.

```bash
goal asset send --assetid $AHT -f $ACCT1 -t $ACCT1 --amount 0
goal asset send --assetid $AHT -f $ACCT2 -t $ACCT2 --amount 0
goal asset send --assetid $AHT -f $ACCT3 -t $ACCT3 --amount 0
goal asset send --assetid $SET -f $ACCT1 -t $ACCT1 --amount 0
goal asset send --assetid $SET -f $ACCT2 -t $ACCT2 --amount 0
goal asset send --assetid $SET -f $ACCT3 -t $ACCT3 --amount 0
```

Next, we'll transfer some of each token from account ACCT1 (the creator) to account ACCT2.

```bash
goal asset send --amount 70000000000 -f $ACCT1 -t $ACCT2 --assetid $AHT
goal asset send --amount 70000000000 -f $ACCT1 -t $ACCT2 --assetid $SET
```

## Viewing assets
Now that we have transferred the asset, let's view it in ACCT2's account
```bash
goal account info -a $ACCT2
```

![Wallet showing the two tokens](./wallet-contents.png)

That's weird! Even though we transferred the same amount of tokens, for AlgoHub Example Token (AHT) we have 70000.000000, and for Secondary Example Token (SET) we have 70000000000. 

That's because when we created the tokens, we specified 6 decimals for AHT and 0 for SET, and when we transfer tokens there is no concept of decimals.

Before we finish practicing transfers, we should transfer some Algo's.

To send Algo's, we use `goal clerk send` as shown below;
```bash
goal clerk send -a 1000000 -f $ACCT1 -t $ACCT2
```





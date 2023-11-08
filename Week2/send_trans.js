const algosdk = require("algosdk");

// now we connect to the local server
const token = 'a'.repeat(64);
const server = 'http://localhost';
const port = 4001;
const client = new algosdk.Algodv2(token, server, port);

// Check your balance
async function getBalance(acct) {
    const acctInfo = await client.accountInformation(acct.addr).do();
    console.log(`Account balance: ${acctInfo.amount} microAlgos`);
}

// Get passphrase from environment variables
const pass = process.env.PASSPHRASE;
if (pass == undefined) {
    console.log("PASSPHRASE environment variable not set");
    process.exit(1);
}


// Now we'll send some algo to $ACCT2 from on main account
// Get acct2 from environment variable
const acct2 = process.env.ACCT2;
if (acct2 == undefined) {
    console.log("ACCT2 environment variable not set");
    process.exit(1);
}

// build and send transactions
async function sendPayment(acct, address2, amount, note) {
    const suggestedParams = await client.getTransactionParams().do();
    const ptxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: acct.addr,
    suggestedParams,
    to: address2,
    amount: amount,
    note: new Uint8Array(Buffer.from(note)),
    });

    // sign the transaction
    const signedTxn = ptxn.signTxn(acct.sk);

    // submit the transaction
    const { txId } = await client.sendRawTransaction(signedTxn).do();
    const result = await algosdk.waitForConfirmation(client, txId, 4);
    console.log(result);
    console.log(`Decoded Note: ${Buffer.from(result.txn.txn.note).toString()}`);
}


// Create an asset and print it's details
async function createAsset(acct, assetName, unitName, assetUrl, totalIssuance, decimals) {
  // create asset
  const suggestedParams = await client.getTransactionParams().do();
  const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
    from: acct.addr,
    suggestedParams,
    defaultFrozen: false,
    unitName: unitName,
    assetName: assetName,
    manager: acct.addr,
    reserve: acct.addr,
    assetURL: assetUrl,
    total: totalIssuance,
    decimals: decimals,
  });

  const signedTxn = txn.signTxn(acct.sk);
  await client.sendRawTransaction(signedTxn).do();
  const result = await algosdk.waitForConfirmation(
    client,
    txn.txID().toString(),
    3
  );

  // get asset index from transaction results
  const assetIndex = result['asset-index'];
  console.log(`Asset ID created: ${assetIndex}`);
  

  // Print asset info for newly created asset
  const assetInfo = await client.getAssetByID(assetIndex).do();
  console.log(`Asset Name: ${assetInfo.params.name}`);
  console.log(`Asset Params: ${JSON.stringify(assetInfo.params)}`);


}

// send asset to another account
async function sendAsset(acct, address2, assetIndex, amount) {
  // create transaction to send asset
  const suggestedParams = await client.getTransactionParams().do();
  const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from: acct.addr,
    suggestedParams,
    to: address2,
    assetIndex: assetIndex,
    amount: amount,
  });

  const signedTxn = txn.signTxn(acct.sk);
  await client.sendRawTransaction(signedTxn).do();
  const result = await algosdk.waitForConfirmation(
    client,
    txn.txID().toString(),
    3
  );
  console.log('asset transfer successful for amount ', (result.txn.txn.aamt ? result.txn.txn.aamt : 0));

}
// call functions
// create account from passphrase
const acct = algosdk.mnemonicToSecretKey(pass);
getBalance(acct);

// send payment
sendPayment(acct, acct2, 1000000, "This is the first transaction");

// create asset
const assetName = "JS Example Asset";
const unitName = "JEA";
const assetUrl = "https://www.algo-hub.io";
const totalIssuance = 100000000000;
const decimals = 6;
createAsset(acct, assetName, unitName, assetUrl, totalIssuance, decimals);
console.log(acct)
// send asset - first we opt in to the asset
sendAsset(acct, acct.addr, 1013, 0);

// send asset to address2
sendAsset(acct, acct2, 1013, 1000);


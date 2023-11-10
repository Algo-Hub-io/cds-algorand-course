# Update and experiment with the React UI
## Note - this is currently still under construction and is not included in the tutorial for this week

Now that we have updated and deployed our smart contract (if you haven't done that yet, please complete [Update Counter](./updateCounter.md) first).

This tutorial isn't focused on learning react, so we will mainly focus on the changes that effect interacting with the smart contract.

First, open the counter app in your code editor (below is an example of how I would do it, but may not work for you)

![graphic showing command line with statements to open counter app in visual studio code](openCode.png)

We also need to make sure we are on the right branch for counter-app for this exercises (`feature/week4`).

Below are the commands I use on the command line (note that I also used `git pull` at the start to ensure I have the latest version of the repo).

```bash
git checkout feature/week4
```

Once we have checked out the branch, there are several things to do - add the app index variable and add the string variables for the buttons to increase and decrease the local counts.

Adding the string variables looks like this -

```javascript
<Button className="btn-add-local"
     onClick={
        // add the method for the local add
        () => callCounterApplication('teCWHQ==')
      }>
```

```javascript
<Button className="btn-dec-local"
     onClick={
      // add the local deduct method
      () => callCounterApplication('fE3fHw==')
      }>
```

```javascript
<Button className="btn-add-global"
     onClick={
      // add the global add function
        () => callCounterApplication('i03JgA==')
      }>
```

```javascript
<Button className="btn-dec-global"
     onClick={
      // add the deduct global function
      () => callCounterApplication('fE3fHw==')
      }>
```

Once that's all updated, we can run the app with `npm start`.

That should look something like this.

![Image of the modified AlgoHub Counter App example](counterApp.png)

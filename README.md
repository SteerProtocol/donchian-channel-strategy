# Steer Protocol Strategy Template - Assemblyscript
AssemblyScript based Strategy Template for the Steer Protocol.

Start building on [Steer Protocol](https://steer.finance) with our AssemblyScript template. Expand your smart contract capabilities with off-chain compute! More info can be found here: [Documentation](https://docs.steer.finance/steer-apps/writing-an-app)

## Tip!

[Use our one-click in-browser development environment](https://bit.ly/3BsQ3DT)

## Project Structure
Apps have three external functions that are used by the Steer system. Additional methods, classes, or varaibles can be used in conjunction with these required functions for any desired behavior. For more information please see the app interface. This design means, that as a developer, you only need to implement the methods which are required for the app to work.

Below are the significant files and folders which you will want to get familiar with:

```
├── assembly      // Source code for the app
├── build         // Output of the build process aka `yarn asbuild`
├── coverage      // Coverage report for testing
├── tests         // Test files with a built in test runner
├── asconfig.json // Assemblyscript config
├── index.js      // Javascript entrypoint for the app when running tests
├── package.json  // Dependencies for the app
```

## Project Setup
Once the template has been cloned, you will need to install the project dependencies. This can be done via the following command:

```yarn install```

INFO
You will notice that there is a post-install script which will compile the ./assembly source folder and populate the ./build folder. This is done to make it easier to run the tests. We will cover this later.

Once you have set up your project, you can begin defining your app.


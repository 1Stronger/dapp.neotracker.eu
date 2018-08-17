const Neo = require('@cityofzion/neo-js')
const moment = require('moment')
const math = require('mathjs')
const Wallet = require('./models/Wallet');
const Tx = require('./models/Tx');

// -- Implementation

module.exports = {

  start: function(telegramBot) {
	;(async () => {
	  console.log('== Syncing for Mainnet ==')

	  const NETWORK = 'mainnet'
	  const DB_CONNECTION_STRING = 'mongodb://localhost/mainnet'
	  const options = {
	    network: NETWORK,
	    storageOptions: {
	      model: 'mongoDB',
	      dataAccessOptions: {
		connectOnInit: true,
		connectionString: DB_CONNECTION_STRING,
		collectionNames: {
		  blocks: 'b_neo_m_blocks',
		  transactions: 'b_neo_m_transactions',
		  addresses: 'b_neo_m_addresses'
		}
	      }
	    }
	  }

	  // By initiating the Node class, the synchronization begins on its own.
	  const neo = new Neo(options)
	  console.log('neo.network:', neo.network)

	  // Check nodes rankings
	  setInterval(() => {
	    const fastestNode = neo.mesh.getFastestNode()
	    console.log(`Fastest node: [${fastestNode.domain}:${fastestNode.port}] @ ${fastestNode.latency}`)
	    const highestNode = neo.mesh.getHighestNode()
	    console.log(`Highest node: [${highestNode.domain}:${highestNode.port}] @ ${highestNode.blockHeight}`)
	  }, 30000)

	  // Live Report
	  const report = {
	    success: [],
	    failed: [],
	    max: undefined,
	    startDate: moment()
	  }
	  neo.on('storeBlock:complete', (payload) => {
	    report.max = payload.max // Keep updating property in case it changes
	    if (payload.isSuccess) {
	      report.success.push({
		index: payload.index,
		date: moment()
	      })
	    } else {
	      report.failed.push({
		index: payload.index,
		date: moment()
	      })
	    }
	  })
	  
	  setInterval(() => { // Generate report every 5 seconds
	    if (report.success.length > 0) {
	      const msElapsed = moment().diff(report.startDate)
	      const successBlockCount = report.success.length
	      const highestBlock = report.success[report.success.length - 1].index // This is an guesstimate
	      const completionPercentage = math.round((highestBlock / report.max * 100), 4)
	      const blockCountPerMinute = math.round((successBlockCount / msElapsed * 1000 * 60), 0)
	      console.log(`Blocks synced: ${successBlockCount} (${completionPercentage}% complete) - ${blockCountPerMinute} blocks/minute`)
	    } else {
	      //console.log('No sync progress yet...')
	    }
	  }, 5000)

	  setInterval(() => { 
		Wallet.find({})
		.exec()
		.then(function (wallets){
			wallets.forEach(wallet => {
				neo.storage.getTransactions(wallet.address).then( function (txs) { 
					txs.forEach(tx => {
						Tx.findOne({ 'tx_id' :  tx.txid })
						.exec()
						.then((foundTxNotification) => {
							if (!foundTxNotification) {
								telegramBot.sendPendingTransactionMessage(wallet, tx);
								const newTx = new Tx();
								newTx.wallet_address = wallet.address;
								newTx.tx_id = tx.txid;
								newTx.save().then().catch((err) => next(err));
							}
						})
					});
				})
			});
		}).catch((err) => next(err));
	  }, 60000)
	})()
  },
}

var mongoh;

var setClient = function(mongoCient){
	mongoh = mongoCient;
}

var updateSave = async function(res){
	res.map((coin_element) => {
		coin_element.SortOrder = parseInt(coin_element.SortOrder);
		return coin_element;
	})
	
	coinlist = res;
	coinlist.sort(function(a, b){
		return a.SortOrder - b.SortOrder;
	})
	
	mongoh.MongoInsert(res,'coins',function(insertResult){
		console.log(insertResult);
	})
}

var sortCoins = function(res){
	res.map((coin_element) => {
		coin_element.SortOrder = parseInt(coin_element.SortOrder);
		return coin_element;
	})
	
	res.sort(function(a, b){
		return a.SortOrder - b.SortOrder;
	})

	return res;
}
	
exports.sortCoins = sortCoins;
exports.setClient = setClient;
exports.updateSave = updateSave;


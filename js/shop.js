window.Shop = {  }
window.Shop.learnings = {
	'basicmath': {
		'name': 'Basic Math',
		'multiplierIncrement': .5,
		'cost': '00:30:00',
		'shortName': '+'
	},
	'appliedmathematics': {
		'name': 'Applied mathematics',
		'multiplierIncrement': .5,
		'cost': '00:45:00',
		'shortName': '∑'
	},
	'advancedmathematics': {
		'name': 'Advanced Mathematics',
		'multiplierIncrement': 1,
		'cost': '01:00:00',
		'shortName': '⨋'
	},
	'advancedmathematicsii': {
		'name': 'Advanced Mathematics II',
		'multiplierIncrement': 1,
		'cost': '01:30:00',
		'shortName': '∰'
	},
	'commutativealgebra': {
		'name': 'Commutative algebra',
		'multiplierIncrement': 1.3,
		'cost': '02:00:00',
		'shortName': '∈'
	},
	'calculusofvariations': {
		'name': 'Calculus of variations',
		'multiplierIncrement': 1.3,
		'cost': '02:00:00',
		'shortName': 'Φ'
	},
	'ergodictheory': {
		'name': 'Ergodic theory',
		'multiplierIncrement': 2,
		'cost': '02:30:00',
		'shortName': 'ψ'
	},
	'probabilitytheory': {
		'name': 'Probability theory',
		'multiplierIncrement': 2.3,
		'cost': '02:30:00',
		'shortName': 'Ω'
	},
	'statistics': {
		'name': 'Statistics',
		'multiplierIncrement': 1.6,
		'cost': '02:00:00',
		'shortName': 'σ'
	},
	'fluidmechanics': {
		'name': 'Fluid mechanics',
		'multiplierIncrement': 2,
		'cost': '03:00:00',
		'shortName': '∇'
	},
	'theoryofrelativity': {
		'name': 'Theory of relativity',
		'multiplierIncrement': 3,
		'cost': '03:45:00',
		'shortName': 'E = mc²'
	},
}

window.Shop.addButtonData = function(button, item){
	var cost = item.calcCost()
	button.setAttribute('id', item.id)
	button.className = 'btn btn-primary shop-learning'
	button.innerHTML = item.name + ' | ' + Core.formatLength(cost)
	button.setAttribute('data-cost', cost)
	button.title = 'Multiplier +' + item.multiplierIncrement + ' | Travel time cost: ' + item.cost
	button.onclick = function(e){
		e.preventDefault()
		if(Stats.totalLength < cost){
			return false
		}
		item.buy()
		e.target.parentNode.removeChild(e.target)
	}
	return button
}
window.Shop.unlock = function(){
	this.visible = true
	var button = document.createElement('button')
	button = Shop.addButtonData(button, this)
	Shop._learnings.appendChild(button)
	Shop.showing = { 'learning': this, 'element': button }
}
window.Shop.updateShowingItemCost = function(){
	if(!Shop.showing) return false
	var cost = Shop.showing.learning.calcCost()
	var button = Shop.showing.element
	var buttonCost = parseFloat(button.getAttribute('data-cost'))
	if(buttonCost > Stats.totalLength){
		button.setAttribute('disabled', true)
	}else {
		button.removeAttribute('disabled')
	}
	if(buttonCost !== cost){
		Shop.addButtonData(button, Shop.showing.learning)
	}
}
window.Shop.unlockNext = function(itemID){
	var found = false
	for(var id in Shop.learnings){
		if(!itemID) return Shop.learnings[id].unlock()
		if(found){
			return Shop.learnings[id].unlock()
		}
		if(id === itemID){
			found = true
		}
	}
}
window.Shop.buy = function(){
	var cost = this.calcCost()
	if(cost > Stats.totalLength) return false
	this.visible = false
	Stats.totalLength -= cost
	Stats.multiplier += this.multiplierIncrement || 0
	this.learn()
	this.show()
	Shop.unlockNext(this.id)
}
window.Shop.learn = function(){
	if(Stats.learnings.indexOf(this.id) === -1){
		Stats.learnings.push(this.id)
		this.owned = true
	}
}
window.Shop.calcTimeCost = function(){
	var cost = 0
	var time = this.cost.split(':')
	var seconds = (parseInt(time[0], 10) * 60 * 60) + (parseInt(time[1], 10) * 60) + parseInt(time[2], 10)
	cost = (Stats.increment * Stats.multiplier) * seconds
	return cost
}
window.Shop.show = function(){
	var span = document.createElement('button')
	span.setAttribute('disabled', true)
	span.className = 'btn btn-success learning-owned'
	span.title = this.name + ' | Multiplier +' + this.multiplierIncrement
	span.innerHTML = this.shortName
	Shop._learningsOwned.appendChild(span)
}
window.Shop.initShop = function(){
	for(var id in Shop.learnings){
		// Add methods and attributes
		Shop.learnings[id].unlock = Shop.unlock.bind(Shop.learnings[id])
		Shop.learnings[id].buy = Shop.buy.bind(Shop.learnings[id])
		Shop.learnings[id].show = Shop.show.bind(Shop.learnings[id])
		Shop.learnings[id].calcCost = Shop.calcTimeCost.bind(Shop.learnings[id])
		Shop.learnings[id].learn = Shop.learn.bind(Shop.learnings[id])
		Shop.learnings[id].owned = false
		Shop.learnings[id].visible = false
		Shop.learnings[id].id = id
	}
}

window.Shop._learnings = Core.get('#learnings')
window.Shop._learningsOwned = Core.get('#learnings-owned')

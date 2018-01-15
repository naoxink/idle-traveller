window.Shop = {  }

Shop.allLearningsBought = false

Shop.learnings = {
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

Shop.perks = {
	'aerodynamics': {
		'name': 'Aerodynamics',
		'description': 'Increases the current speed (35%) but deactivates the boost bar',
		'cost': '06:00:00',
		'activationCost': '00:30:00'
	},
	'autopilot': {
		'name': 'Autopilot',
		'description': 'Reduces current speed (50%) but you keep travelling (at 15% of the current speed) while the game is closed',
		'cost': '12:00:00',
		'activationCost': '00:30:00'
	},
	'autoturbo': {
		'name': 'Autoturbo',
		'description': 'Automatic boosts but boostbar is filled 10% slower',
		'cost': '03:30:00',
		'activationCost': '00:15:00'
	},
	'soundsystem': {
		'name': 'Sound system',
		'description': 'Boostbar sounds when full',
		'cost': '00:45:00',
		'activationCost': '00:05:00'
	}
}

Shop.addButtonData = function(button, item){
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
Shop.addPerkButtonData = function(button, item){
	var cost = item.calcCost()
	button.setAttribute('id', item.id)
	button.className = 'btn btn-primary shop-perk'
	button.innerHTML = item.name + ' | ' + Core.formatLength(cost)
	button.setAttribute('data-cost', cost)
	button.title = item.description + ' | Travel time cost: ' + item.cost
	button.onclick = function(e){
		e.preventDefault()
		if(Stats.totalLength < cost){
			return false
		}
		item.buy()
	}
	return button
}
Shop.unlockLearning = function(){
	this.visible = true
	var button = document.createElement('button')
	button = Shop.addButtonData(button, this)
	Shop._learnings.appendChild(button)
	Shop.showingLearning = { 'learning': this, 'element': button }
}
Shop.unlockPerk = function(){
	this.visible = true
	var button = document.createElement('button')
	button = Shop.addPerkButtonData(button, this)
	Shop._perks.appendChild(button)
	this.button = button
}
Shop.updateShowingItemCost = function(){
	if(!Shop.showingLearning) return false
	var cost = Shop.showingLearning.learning.calcCost()
	var button = Shop.showingLearning.element
	var buttonCost = parseFloat(button.getAttribute('data-cost'))
	if(buttonCost > Stats.totalLength){
		button.setAttribute('disabled', true)
	}else {
		button.removeAttribute('disabled')
	}
	if(buttonCost !== cost){
		Shop.addButtonData(button, Shop.showingLearning.learning)
	}
}
Shop.updateShowingPerksCost = function(){
	for(var id in Shop.perks){
		if(Shop.perks[id].visible){
			var cost = Shop.perks[id].calcCost()
			var button = Shop.perks[id].button
			var buttonCost = parseFloat(button.getAttribute('data-cost'))
			if(buttonCost > Stats.totalLength){
				button.setAttribute('disabled', true)
			}else {
				button.removeAttribute('disabled')
			}
			if(buttonCost !== cost){
				Shop.addPerkButtonData(button, Shop.perks[id])
			}
		}else if(Shop.perks[id].owned && id !== Stats.activePerk){
			var cost = Shop.perks[id].calcCost()
			var button = Shop.perks[id].button
			var buttonCost = parseFloat(button.getAttribute('data-cost'))
			if(buttonCost > Stats.totalLength){
				button.setAttribute('disabled', true)
			}else {
				button.removeAttribute('disabled')
			}
			if(buttonCost !== cost){
				Shop.perks[id].button.innerHTML = Shop.perks[id].name + ' | Activation cost: ' + Core.formatLength(cost)
			}
		}
	}
}
Shop.unlockNextLearning = function(itemID){
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
	if(found){
		Shop.allLearningsBought = true
	}
}
Shop.buy = function(){
	var cost = this.calcCost()
	if(cost > Stats.totalLength || Shop.hasLearning(this.id)) return false
	this.visible = false
	Stats.totalLength -= cost
	Stats.multiplier += this.multiplierIncrement || 0
	this.learn()
	this.show()
	Shop.unlockNextLearning(this.id)
}
Shop.buyPerk = function(){
	var cost = this.calcCost()
	if(cost > Stats.totalLength) return false
	Stats.totalLength -= cost
	this.getPerk()
}
Shop.hasLearning = function(id){
	return Stats.learnings.indexOf(id) !== -1
}
Shop.learn = function(){
	if(Stats.learnings.indexOf(this.id) === -1){
		Stats.learnings.push(this.id)
		this.owned = true
	}
}
Shop.getPerk = function(){
	if(Stats.perks.indexOf(this.id) === -1){
		Stats.perks.push(this.id)
	}
	this.visible = false
	this.owned = true
	this.button.parentNode.removeChild(this.button)
	this.button = null
	this.show()
}
Shop.calcTimeCost = function(){
	var cost = 0
	var time = this.cost.split(':')
	var seconds = (parseInt(time[0], 10) * 60 * 60) + (parseInt(time[1], 10) * 60) + parseInt(time[2], 10)
	cost = (Stats.increment * Stats.multiplier) * seconds
	return cost
}
Shop.show = function(){
	var span = document.createElement('button')
	span.setAttribute('disabled', true)
	span.className = 'btn btn-success learning-owned'
	span.title = this.name + ' | Multiplier +' + this.multiplierIncrement
	span.innerHTML = this.shortName + ' | ' + this.name + ' | Multiplier +' + this.multiplierIncrement
	Shop._learningsOwned.appendChild(span)
}
Shop.showPerk = function(){
	var perk = this
	var button = document.createElement('button')
	button.className = 'btn btn-default perk-owned'
	button.title = perk.description
	button.innerHTML = perk.name + ' | Activation cost: ' + Core.formatLength(perk.calcCost())
	Shop._perksOwned.appendChild(button)
	button.onclick = function(){
		if(Stats.activePerk !== perk.id){
			perk.activate()
		}else{
			perk.deactivate()
		}
	}
	perk.button = button
}
Shop.activate = function(){
	var perk = this
	if(Stats.activePerk !== perk.id){
		var cost = perk.calcCost()
		if(cost >= Stats.totalLength) return false
		notif_confirm({
			'textaccept': 'Yep',
			'textcancel': 'No, no',
			'fullscreen': true,
			'message': 'Activating "' + perk.name + '" costs ' + Core.formatLength(cost) + '<hr><strong>Effect:</strong> ' + perk.description + '<hr>Are you sure?',
			'callback': function(ok){
				if(ok){
					Stats.totalLength -= cost
					Stats.activePerk = perk.id
					$('.perk-owned').removeClass('btn-success').addClass('btn-default')
					$(perk.button).addClass('btn-success')
					perk.button.innerHTML = perk.name + ' (Active)'
				}
			}
		})
	}else{
		$('.perk-owned').removeClass('btn-success').addClass('btn-default')
		$(perk.button).addClass('btn-success')
		perk.button.innerHTML = perk.name + ' (Active)'
	}
}
Shop.deactivate = function(){
	var perk = this
	notif_confirm({
		'textaccept': 'Yep',
		'textcancel': 'No, no',
		'fullscreen': true,
		'message': 'You are going to deactivate "' + perk.name + '"<hr><strong>Effect:</strong> ' + perk.description + '<hr>Are you sure?',
		'callback': function(ok){
			if(ok){
				Stats.activePerk = ''
				$('.perk-owned').removeClass('btn-success').addClass('btn-default')
				perk.button.innerHTML = perk.name + ' | Activation cost: ' + Core.formatLength(perk.calcCost())
			}
		}
	})
}
Shop.initShop = function(){
	for(var id in Shop.learnings){
		// Add methods and attributes
		Shop.learnings[id].unlock = Shop.unlockLearning.bind(Shop.learnings[id])
		Shop.learnings[id].buy = Shop.buy.bind(Shop.learnings[id])
		Shop.learnings[id].show = Shop.show.bind(Shop.learnings[id])
		Shop.learnings[id].calcCost = Shop.calcTimeCost.bind(Shop.learnings[id])
		Shop.learnings[id].learn = Shop.learn.bind(Shop.learnings[id])
		Shop.learnings[id].owned = false
		Shop.learnings[id].visible = false
		Shop.learnings[id].id = id
	}
	for(var id in Shop.perks){
		// Add methods and attributes
		Shop.perks[id].unlock = Shop.unlockPerk.bind(Shop.perks[id])
		Shop.perks[id].buy = Shop.buyPerk.bind(Shop.perks[id])
		Shop.perks[id].show = Shop.showPerk.bind(Shop.perks[id])
		Shop.perks[id].calcCost = Shop.calcTimeCost.bind(Shop.perks[id])
		Shop.perks[id].getPerk = Shop.getPerk.bind(Shop.perks[id])
		Shop.perks[id].activate = Shop.activate.bind(Shop.perks[id])
		Shop.perks[id].deactivate = Shop.deactivate.bind(Shop.perks[id])
		Shop.perks[id].owned = false
		Shop.perks[id].visible = false
		Shop.perks[id].id = id
		Shop.perks[id].unlock()
	}
}

Shop._learnings = Core.get('#learnings')
Shop._learningsOwned = Core.get('#learnings-owned')
Shop._perks = Core.get('#perks')
Shop._perksOwned = Core.get('#perks-owned')

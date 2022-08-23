window.Shop = {  }

Shop.allLearningsBought = false

Shop.learnings = {
	'basicmath': {
		'name': 'Basic Math',
		'multiplierIncrement': .5,
		'cost': '00:07:00',
		'shortName': '+'
	},
	'appliedmathematics': {
		'name': 'Applied mathematics',
		'multiplierIncrement': .5,
		'cost': '01:00:00',
		'shortName': '∑'
	},
	'advancedmathematics': {
		'name': 'Advanced Mathematics',
		'multiplierIncrement': 1,
		'cost': '01:20:00',
		'shortName': '⨋'
	},
	'advancedmathematicsii': {
		'name': 'Advanced Mathematics II',
		'multiplierIncrement': 1,
		'cost': '03:30:00',
		'shortName': '∰'
	},
	'commutativealgebra': {
		'name': 'Commutative algebra',
		'multiplierIncrement': 1.3,
		'cost': '06:00:00',
		'shortName': '∈'
	},
	'calculusofvariations': {
		'name': 'Calculus of variations',
		'multiplierIncrement': 1.3,
		'cost': '14:30:00',
		'shortName': 'Φ'
	},
	'ergodictheory': {
		'name': 'Ergodic theory',
		'multiplierIncrement': 2,
		'cost': '26:15:00',
		'shortName': 'ψ'
	},
	'probabilitytheory': {
		'name': 'Probability theory',
		'multiplierIncrement': 2.3,
		'cost': '100:30:00',
		'shortName': 'Ω'
	},
	'statistics': {
		'name': 'Statistics',
		'multiplierIncrement': 1.6,
		'cost': '3200:00:00',
		'shortName': 'σ'
	},
	'fluidmechanics': {
		'name': 'Fluid mechanics',
		'multiplierIncrement': 2,
		'cost': '120000:30:00',
		'shortName': '∇'
	},
	'theoryofrelativity': {
		'name': 'Theory of relativity',
		'multiplierIncrement': 3,
		'cost': '940000:00:00',
		'shortName': 'E = mc²'
	},
}

Shop.perks = {
	'littleboosts': {
		'name': 'Little Boosts',
		'description': 'Smaller boosts but more of them',
		'cost': '00:45:00'
	},
	'aerodynamics': {
		'name': 'Aerodynamics',
		'description': 'Increases the current speed (100%) but deactivates the boost bar',
		'cost': '04:00:00'
	},
	'autopilot': {
		'name': 'Autopilot',
		'description': 'Reduces current speed (-30%) but you keep travelling (at 15% of the current speed) while the game is closed',
		'cost': '360:00:00'
	},
	'autopilotii': {
		'name': 'Autopilot II',
		'description': 'Reduces current speed (-10%) but you keep travelling (at 100% of the current speed) while the game is closed',
		'cost': '9603000:00:00'
	},
	'autoturbo': {
		'name': 'Autoturbo',
		'description': 'Automatic boosts but boostbar is filled 10% slower',
		'cost': '54:00:00'
	},
	'soundsystem': {
		'name': 'Sound system',
		'description': 'Boostbar sounds when full',
		'cost': '00:08:00'
	}
}

Shop.addButtonData = function(button, item){
	var cost = item.calcCost()
	button.setAttribute('id', item.id)
	button.className = 'btn btn-primary shop-learning'
	button.innerHTML = 'Learn'
	button.setAttribute('data-cost', cost)
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
	button.title = item.description
	button.innerHTML = 'Buy'
	button.setAttribute('data-cost', cost)
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
	Shop._nextLearningName.innerHTML = this.name
	Shop._nextLearningCost.innerHTML = Core.formatLength(this.calcCost())
	Shop._nextLearningIncrement.innerHTML = this.multiplierIncrement
	Shop._learnings.appendChild(button)
	Shop.showingLearning = { 'learning': this, 'element': button }
}
Shop.unlockPerk = function(){
	this.visible = true
	var perkRow = document.createElement('div')
	perkRow.className = 'row perk'
	var colInfo = document.createElement('div')
	colInfo.className = 'col-8'
	var colButton = document.createElement('div')
	colButton.className = 'col-4'
	var pName = document.createElement('p')
	var pDescription = document.createElement('p')
	var pCost = document.createElement('p')
	pName.innerHTML = 'Name: <span class="text-info">' + this.name + '</span>'
	pDescription.innerHTML = 'Description: <span class="text-info">' + this.description + '</span>'
	pCost.innerHTML = 'Cost: <span class="text-info">' + Core.formatLength(this.calcCost()) + '</span>'
	pName.className = 'low-margin'
	pDescription.className = 'low-margin'
	pCost.className = 'low-margin'
	var button = document.createElement('button')
	button = Shop.addPerkButtonData(button, this)
	colInfo.appendChild(pName)
	colInfo.appendChild(pDescription)
	colInfo.appendChild(pCost)
	colButton.appendChild(button)
	perkRow.appendChild(colInfo)
	perkRow.appendChild(colButton)
	Shop._perks.appendChild(perkRow)
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
	this.button.parentNode.parentNode.parentNode.removeChild(this.button.parentNode.parentNode)
	this.button = null
	this.show()
}
Shop.calcTimeCost = function(){
	if(this.lengthCost){
		return this.lengthCost
	}else{
		var cost = 0
		var time = this.cost.split(':')
		var seconds = (parseInt(time[0], 10) * 60 * 60) + (parseInt(time[1], 10) * 60) + parseInt(time[2], 10)
		cost = Permastats.incrementBase * seconds
		this.lengthCost = cost
		console.log(`${this.name}: ${Core.formatLength(cost)}`)
		return cost
	}
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
	button.innerHTML = perk.name
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
		notif_confirm({
			'textaccept': 'Yep',
			'textcancel': 'No, no',
			'fullscreen': true,
			'message': 'You are going to activate perk "' + perk.name + '"<hr><strong>Effect:</strong> ' + perk.description,
			'callback': function(ok){
				if(ok){
					Stats.activePerk = perk.id
					$('.perk-owned').removeClass('btn-success').addClass('btn-default')
					$(perk.button).addClass('btn-success')
					const buttons = Shop._perksOwned.querySelectorAll('button')
					buttons.forEach(function(button){
						button.innerHTML = button.innerHTML.replace('(Active)', '')
					})
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
				perk.button.innerHTML = perk.name
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
		Shop.learnings[id].lengthCost = Shop.learnings[id].calcCost()
		Shop.learnings[id].learn = Shop.learn.bind(Shop.learnings[id])
		Shop.learnings[id].owned = false
		Shop.learnings[id].visible = false
		Shop.learnings[id].id = id
	}
	console.log('---------')
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
Shop._nextLearningName = Core.get('#next-learning-name')
Shop._nextLearningCost = Core.get('#next-learning-cost')
Shop._nextLearningIncrement = Core.get('#next-learning-increment')

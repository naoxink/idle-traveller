window.Core = {  }

Core.fps = 30
Core.version = '1.0.46'
Core.timer = null

Core.allUpgradesBought = false

Core.init = function(){
	Core.get('#game-version').innerHTML = Core.version
	Core.loop()
	Core.initAchievements()
	Shop.initShop()
	Core.unlockUpgrade('walking-shoes')
	Stats.runStartDate = new Date()
	Stats.sessionStart = new Date()
	Core._runStart.innerHTML = Stats.runStartDate.toString()
	Core.unlockSections()
}

Core.loop = function(){
	Core.timer = setTimeout(function(){
		var delta = (Core.end || new Date()) - new Date()
			delta *= -1
		var inc = ((Stats.increment * Stats.multiplier) * Stats.megamultiplier) * (delta / 1000)

		Core.extraInc = 0
		// Boostbar
		if(Stats.activePerk !== 'aerodynamics'){ // No incrementamos el boostbar con este perk activo
			var bbinc = inc + Core.extraInc
			if(Stats.activePerk === 'autoturbo'){
				bbinc -= bbinc * 0.1
			}
			Stats.boostbarLength += bbinc
			Stats.boostbar = (Stats.boostbarLength * 100) / Stats.boostbarMax
			if(Stats.boostbar > 100) Stats.boostbar = 100
		}

		// Perk activo
		if(Stats.activePerk === 'autopilot'){
			Core.extraInc -= inc * 0.7
		}else if(Stats.activePerk === 'aerodynamics'){
			Core.extraInc += inc * 1 // +100%
		}

		Stats.totalLength += inc + Core.extraInc

		Core.updateHUD()
		Core.end = new Date()
		Core.loop()
	}, 1000 / Core.fps)
}

Core.stop = function(){
	clearTimeout(Core.timer)
	Core.timer = null
}

Core.updateHUD = function(){
	if(!Shop.showingLearning && !Shop.allLearningsBought){
		Shop.unlockNextLearning()
	}
	Shop.updateShowingItemCost()
	Shop.updateShowingPerksCost()
	Core._length.innerHTML = Core.formatLength(Stats.totalLength)
	let lengthDetailStr = ''
	if(Stats.multiplier > 1){
		 lengthDetailStr = ' (' + Core.formatLength(Stats.increment)
		 + '/s x' + parseFloat(Stats.multiplier).toFixed(1) + ')'
	}
	if(Stats.activePerk === 'aerodynamics'){
		const aerodynamicsInc = (Stats.increment * Stats.multiplier) * Stats.megamultiplier;
		lengthDetailStr += ' + Aerodynamics (' + Core.formatLength(aerodynamicsInc) + ')'
	}else if(Stats.activePerk === 'autopilot'){
		lengthDetailStr += ' - Autopilot (' + Core.formatLength(Core.extraInc * -1) + ')'
	}
	Core._lengthDetail.innerHTML = Core.formatLength((Stats.increment * Stats.multiplier) * Stats.megamultiplier) + ' ' + lengthDetailStr
	Core._megamultiplier.innerHTML = Stats.megamultiplier > 1 ? ` x${Stats.megamultiplier}`: ''
	Core.get('#info #session-time').innerHTML = Core.timeFormat(new Date() - Stats.sessionStart.getTime())
	// Mejoras visibles
	let visibleUpgrades = Core.get('#upgrades .upgrade')
	if(Core.isNode(visibleUpgrades)){
		visibleUpgrades = [ visibleUpgrades ]
	}
	for(let i = 0, len = visibleUpgrades.length; i < len; i++){
		// Eliminar las que ya tiene
		if(Core.hasUpgrade(visibleUpgrades[i].getAttribute('id'))){
			visibleUpgrades[i].parentNode.removeChild(visibleUpgrades[i])
		}
		// Controlar coste
		let hasRequiredLearning = !visibleUpgrades[i].getAttribute('data-required') || (visibleUpgrades[i].getAttribute('data-required') && Stats.learnings.indexOf(visibleUpgrades[i].getAttribute('data-required')) !== -1)
		if(parseInt(visibleUpgrades[i].getAttribute('data-cost'), 10) < Stats.totalLength && hasRequiredLearning){
			visibleUpgrades[i].removeAttribute('disabled')
		}else{
			visibleUpgrades[i].setAttribute('disabled', true)
		}
	}
	// Shop stuff
	$('.shop-stuff-item').each(function(){
		const id = $(this).data('id')
		if(Stats.stuff.includes(id)){
			$(this).find('button').remove()
		}
		if(!$('button', this).length) return
		const cost = parseInt($(this).data('cost'), 10)
		$(this).find('button').prop('disabled', Stats.totalLength < cost)
	})
	// Calcular % del boostbar
	if(Stats.boostbar >= 100){
		if(Stats.activePerk === 'autoturbo'){
			Core.boost()
		}else{
			if(Stats.activePerk === 'soundsystem'){
				Core.play('boostbar-filled')
			}
			$('#boostbar')
				.css('width', '100%')
				.removeClass('bg-warning')
				.addClass('bg-primary')
				.addClass('ready')
				.attr('data-length', 'BOOST ME!')
			document.title = 'BOOST READY'
		}
	}else{
		$('#boostbar')
			.css('width', Stats.boostbar + '%')
			.removeClass('bg-primary')
			.addClass('bg-warning')
			.removeClass('ready')
			.attr('data-length', parseFloat(Stats.boostbar).toFixed(2) + '%')
	}
	$('.progress').attr('data-max', Core.formatLength(Stats.boostbarMax))
	if(Stats.activePerk === 'aerodynamics'){
		$('.progress').addClass('disabled')
	}else{
		$('.progress').removeClass('disabled')
	}
	Core.checkAchievements()
	var m = Core.calcMultiplier()
	m = m - Stats.multiplier
	if(m > 0 && m.toFixed(1) !== '0.0'){
		Core._btnRest.innerHTML = 'Rest (multiplier +' + m.toFixed(1) + ')'
	}else{
    Core._btnRest.innerHTML = 'Rest'
  }
}

Core.get = function(selector){
	var elements = document.querySelectorAll(selector)
	return elements.length === 1 ? elements[0] : elements
}

Core.formatLength = function(number){
	var n = '0'
	if(number < 1000) n = parseFloat(number).toFixed(2) + ' m'
	else if(number >= 1000000000000000000000) n = parseFloat(number/1000000000000000000000).toFixed(2) + ' Ym'
	else if(number >= 1000000000000000000) n = parseFloat(number/1000000000000000000).toFixed(2) + ' Zm'
	else if(number >= 1000000000000000) n = parseFloat(number/1000000000000000).toFixed(2) + ' Em'
	else if(number >= 1000000000000) n = parseFloat(number/1000000000000).toFixed(2) + ' Pm'
	else if(number >= 1000000000) n = parseFloat(number/1000000000).toFixed(2) + ' Gm'
	else if(number >= 1000000) n = parseFloat(number/1000000).toFixed(2) + ' Mm'
	else if(number >= 1000) n = parseFloat(number/1000).toFixed(2) + ' km'
  var x = n.split('.')
  var x1 = x[0]
  var x2 = x.length > 1 ? '.' + x[1] : ''
  var rgx = /(\d+)(\d{3})/
  while(rgx.test(x1)){
    x1 = x1.replace(rgx, '$1' + '.' + '$2')
  }
  return x1 + x2
}

Core.save = function(){
	if(!window.localStorage){
		notif({
			'type': 'error',
			'msg': 'Your browser doesn\'t support this feature!',
			'position': 'center'
		})
		return false
	}
	window.localStorage.setItem('version', Core.version)
	window.localStorage.setItem('totalLength', Stats.totalLength)
	window.localStorage.setItem('increment', Stats.increment)
	window.localStorage.setItem('multiplier', Stats.multiplier)
	window.localStorage.setItem('megamultiplier', Stats.megamultiplier)
	window.localStorage.setItem('upgrades', JSON.stringify(Stats.upgrades))
	window.localStorage.setItem('learnings', JSON.stringify(Stats.learnings))
	window.localStorage.setItem('perks', JSON.stringify(Stats.perks))
	window.localStorage.setItem('stuff', JSON.stringify(Stats.stuff))
	window.localStorage.setItem('runStartDate', Stats.runStartDate)
	window.localStorage.setItem('nextUpgradeCost', Stats.nextUpgradeCost)
	window.localStorage.setItem('activePerk', Stats.activePerk)
	// Logros
	var achievementsStrBin = ''
	for(var id in Achievements){
		achievementsStrBin += Achievements[id].done ? '1' : '0'
	}
	window.localStorage.setItem('walker-achievements', achievementsStrBin)
	// Boostbar
	window.localStorage.setItem('boostbar', Stats.boostbar)
	window.localStorage.setItem('boostbarLength', Stats.boostbarLength)
	window.localStorage.setItem('boostbarMax', Stats.boostbarMax)
	window.localStorage.setItem('boostbarTimesFilled', Stats.boostbarTimesFilled)
	// Descansos
	window.localStorage.setItem('rests', Stats.rests)
	if(Stats.actualRestDate){
		window.localStorage.setItem('actualRestDate', Stats.actualRestDate)
	}
	// Extra
	window.localStorage.setItem('save-date', new Date())
	notif({ 'type': 'success', 'msg': 'Game saved!', 'position': 'center' })
	return true
}

Core.load = function(){
	if(!window.localStorage) return alert('Your browser doesn\'t support this feature!')
	if(window.localStorage.getItem('version') !== null){
		if(window.localStorage.getItem('version') !== Core.version){
			return notif({
				'type': 'error',
				'position': 'center',
				'msg': 'The savegame version (' + window.localStorage.getItem('version') + ') is different than the current (' + Core.version + ')'
			})
		}
		Stats.totalLength = parseFloat(window.localStorage.getItem('totalLength'))
		Stats.increment = parseFloat(window.localStorage.getItem('increment'))
		Stats.multiplier = parseFloat(window.localStorage.getItem('multiplier'))
		Stats.megamultiplier = parseFloat(window.localStorage.getItem('megamultiplier') || 1)
		Stats.runStartDate = new Date(window.localStorage.getItem('runStartDate'))
		Stats.upgrades = JSON.parse(window.localStorage.getItem('upgrades'))
		Stats.learnings = JSON.parse(window.localStorage.getItem('learnings'))
		Stats.perks = JSON.parse(window.localStorage.getItem('perks'))
		Stats.stuff = JSON.parse(window.localStorage.getItem('stuff')) || []
		Stats.activePerk = window.localStorage.getItem('activePerk')
		Stats.rests = parseInt(window.localStorage.getItem('rests'), 10)
		Stats.nextUpgradeCost = parseFloat(window.localStorage.getItem('nextUpgradeCost'))
		if(window.localStorage.getItem('actualRestDate')){
			Stats.actualRestDate = new Date(window.localStorage.getItem('actualRestDate'))
		}
		if(!Stats.upgrades) Stats.upgrades = [  ]
		for(var i = 0, len = Stats.upgrades.length; i < len; i++){
			if(Upgrades[Stats.upgrades[i]]){
				Upgrades[Stats.upgrades[i]].owned = true
				Upgrades[Stats.upgrades[i]].visible = false
				Core.addUpgrade(Upgrades[Stats.upgrades[i]])
			}
		}
		Core.unlockNextUpgrade(Stats.upgrades[Stats.upgrades.length - 1])
		// Learnings
		if(!Stats.learnings) Stats.learnings = [  ]
		for(var i = 0, len = Stats.learnings.length; i < len; i++){
			if(Shop.learnings.hasOwnProperty(Stats.learnings[i])){
				Shop.learnings[Stats.learnings[i]].show()
				Shop.learnings[Stats.learnings[i]].learn()
			}
		}
		Shop.unlockNextLearning(Stats.learnings[Stats.learnings.length - 1])
		// Logros
		var achievementsStrBin = window.localStorage.getItem('walker-achievements')
		if(achievementsStrBin){
			achievementsStrBin = achievementsStrBin.split('')
			var key = 0
			for(var id in Achievements){
				if(typeof achievementsStrBin[key] !== 'undefined'){
					Achievements[id].done = achievementsStrBin[key] === '1'
					if(Achievements[id].done){
						Core.unlockAchievement(Achievements[id], true)
					}
				}
				key++
			}
		}
		// Boostbar
		if(window.localStorage.getItem('boostbar')){
			Stats.boostbar = parseFloat(window.localStorage.getItem('boostbar'))
			Stats.boostbarLength = parseFloat(window.localStorage.getItem('boostbarLength'))
			Stats.boostbarMax = parseFloat(window.localStorage.getItem('boostbarMax'))
			Stats.boostbarTimesFilled = parseFloat(window.localStorage.getItem('boostbarTimesFilled'))
		}
		// Perks
		for(var i = 0, len = Stats.perks.length; i < len; i++){
			Shop.perks[Stats.perks[i]].getPerk()
			if(Stats.activePerk === Stats.perks[i]){
				Shop.perks[Stats.perks[i]].activate()
			}
		}
		var closeDate = window.localStorage.getItem('close-date')
		if(Stats.activePerk === 'autopilot' && closeDate){
			var delta = (new Date(closeDate)) - new Date()
				delta *= -1
			var inc = (Stats.increment * Stats.multiplier) * (delta / 1000)
			Stats.totalLength += inc * 0.15
		}
		Shop.initStuffItems()
		Core.updateHUD()
		Core.showLastRestDate()
		Core.unlockSections()
		Core.get('#run-start').innerHTML = Stats.runStartDate.toString()
		notif({ 'type': 'success', 'msg': 'Game loaded!', 'position': 'center' })
	}else{
		return notif({
			'type': 'error',
			'msg': 'Invalid savegame',
			'position': 'center'
		})
	}
}

Core.unlockSections = function(){
	// Primero queremos ocultarlas todas (o casi todas)
	for(let key in Core._sections){
		$(Core._sections[key]).hide()
	}

	if(Core.hasUpgrade('skateboard') || Stats.perks.length || Stats.learnings.length || Stats.rests){
		$(Core._sections.studies).show()
	}
	if(Stats.learnings.length){
		$(Core._sections.studiesDone).show()
	}
	if(Shop.hasLearning('basicmath') || Stats.perks.length){
		$(Core._sections.perks).show()
	}
	if(Stats.perks.length){
		$(Core._sections.perksOwned).show()
	}
	for(let id in Achievements){
		if(Achievements[id].done){
			$(Core._sections.achievements).show()
			break;
		}
	}
	if(Core.hasUpgrade('train') || Stats.stuff.length){
		$(Core._sections.stuff).show()
	}
}

Core.reset = function(){
	notif_confirm({
		'textaccept': 'Yes',
		'textcancel': 'No',
		'fullscreen': true,
		'message': 'ALL PROGRESS WILL BE LOST, are you sure?',
		'callback': function(ok){
			if(ok){
				if(window.localStorage){
					window.localStorage.clear()
				}
				window.location.reload()
			}
		}
	})
}

Core.hasUpgrade = function(upgradeID){
	return Stats.upgrades.indexOf(upgradeID) !== -1 && Upgrades[upgradeID].owned
}

Core.unlockUpgrade = function(upgradeID){
	var upgrade = Upgrades[upgradeID]
	if(!upgrade || upgrade.owned || upgrade.visible || Core.get('#upgrades #' + upgrade.id).length) return
	upgrade.visible = true
	Core._nextUpgradeName.innerHTML = upgrade.name
	Core._nextUpgradeCost.innerHTML = Core.formatLength(Stats.nextUpgradeCost)
	var button = document.createElement('button')
	button.setAttribute('id', upgrade.id)
	button.className = 'btn btn-primary upgrade'
	button.innerHTML = 'Buy'
	if(upgrade.required){
		Core._nextUpgradeRequired.innerHTML = Shop.learnings[upgrade.required].name
		Core._nextUpgradeRequired.parentNode.style.display = 'block'
		button.setAttribute('data-required', upgrade.required)
	}else{
		Core._nextUpgradeRequired.parentNode.style.display = 'none'
	}
	button.setAttribute('data-cost', Stats.nextUpgradeCost)
	button.onclick = function(e){
		e.preventDefault()
		if(Stats.totalLength < Stats.nextUpgradeCost){
			return false
		}
		Core.buyUpgrade(upgrade)
		e.target.parentNode.removeChild(e.target)
	}
	Core._upgrades.appendChild(button)
}

Core.unlockNextUpgrade = function(upgradeID){
	var found = false
	for(var id in Upgrades){
		if(found){
			return Core.unlockUpgrade(id)
		}
		if(id === upgradeID){
			found = true
		}
	}
	if(found){
		Core.allUpgradesBought = true
	}
}

Core.buyUpgrade = function(upgrade){
	Stats.totalLength -= parseInt(Stats.nextUpgradeCost, 10)
	if(upgrade.multiplier && upgrade.multiplier !== 1){
		Stats.multiplier += upgrade.multiplier
	}
	Stats.increment = upgrade.speed
	upgrade.effect()
	upgrade.visible = false
	upgrade.owned = true
	Stats.upgrades.push(upgrade.id)

	Core.calcNextUpgradeCost()

	Core.addUpgrade(upgrade)
	Core.unlockNextUpgrade(upgrade.id)
	Core.unlockSections()
}

Core.addUpgrade = function(upgrade){
	Core._currentUpgrade.textContent = upgrade.name
}

Core.calcNextUpgradeCost = function(){
	Stats.nextUpgradeCost *= 0.5 + ((Stats.upgrades.length / 100) + 1) + ((Stats.multiplier || 1) / 100)
}

Core.isArray = function(item){
	return item.constructor === [].constructor
}

Core.isNode = function(o){
  return (
    typeof Node === "object" ? o instanceof Node : 
    o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName === "string"
  )
}

Core.initAchievements = function(){
	for(id in Achievements){
		// Crear elemento DOM
		var tr = document.createElement('tr')
		var td = document.createElement('td')
		var small = document.createElement('small')
		small.className = 'achievement-description'
		td.innerHTML = '<strong>' + Achievements[id].name + '</strong>'
		var title = Achievements[id].description +
								(Achievements[id].multiplierIncrement ?
									' (multiplier +' + Achievements[id].multiplierIncrement + ')' : 
									'')
		td.setAttribute('title', title)
		small.textContent = title
		td.appendChild(small)
		tr.appendChild(td)
		tr.className = 'achievement ' + (Achievements[id].done ? 'unlocked' : 'locked')
		// Guardar referencia
		Achievements[id]._element = tr
		Core._achievements.appendChild(Achievements[id]._element)
	}
}

Core.checkAchievements = function(){
	for(id in Achievements){
		if(!Achievements[id].done){
			Achievements[id].done = Achievements[id].check()
			if(Achievements[id].done){
				Stats.multiplier += Achievements[id].multiplierIncrement || 0
				Core.unlockAchievement(Achievements[id])
			}
		}
	}
}

Core.unlockAchievement = function(achievement, silent){
	$(achievement._element)
		.removeClass('locked')
		.addClass('unlocked')
		.removeClass('text-muted')
	if(!$(Core._sections.achievements).is(':visible')){
		$(Core._sections.achievements).show()
	}
	// $(achievement._element).find('td').html(achievement.name + ' (multiplier +' + (achievement.multiplierIncrement || 0) + ')')
	if(!silent){
		notif({
			'type': 'info',
			'position': 'center',
			'msg': 'Achievement unlocked: ' + achievement.name
		})
	}
}

Core.timeFormat = function(s){
	function addZ(n) {
		return (n<10? '0':'') + n
	}

	var ms = s % 1000
	s = (s - ms) / 1000
	var secs = s % 60
	s = (s - secs) / 60
	var mins = s % 60
	var hrs = (s - mins) / 60

	var result = ''
	if(hrs)
		result += addZ(hrs) + 'h'
	if(hrs || mins)
		result += ' ' + addZ(mins) + 'm'
	if(mins || secs)
		result += ' ' + addZ(secs) + 's'
	return result
}

Core.boost = function(){
	var boost = Stats.boostbarMax
	Stats.totalLength += boost
	Stats.boostbar = 0
	if(Stats.activePerk === 'littleboosts'){
		Stats.boostbarMax += boost * 0.5
	}else{
		Stats.boostbarMax += boost
	}
	Stats.boostbarTimesFilled++
	Core.updateHUD()
	document.title = 'Idle Traveller'
	var sound = Core.get("#sound-system")
	if(sound.getAttribute('played')){
		sound.removeAttribute('played')
	}
}

Core.calcMultiplier = function(){
	var activeMultiplier = Stats.multiplier
	// (upgrade/learning = x1)
	var multiplier = Stats.upgrades.length + Stats.learnings.length
	// Sumar el tiempo de juego invertido (1h = x0,1)
	var now = new Date()
	var milis = now.getTime() - Stats.runStartDate.getTime()
	multiplier += (((milis / 1000) / 60) / 60) / 10
	// Sumar los logros desbloqueados hasta el momento
	for(var id in Achievements){
		if(Achievements[id].done){
			multiplier += parseFloat(Achievements[id].multiplierIncrement || 0)
		}
	}
	if(multiplier <= 0){
		multiplier = 1
	}
	if(multiplier < activeMultiplier){
		multiplier = activeMultiplier
	}
	return Math.abs(multiplier)
}

Core.rest = function(){
	Stats.multiplier = Core.calcMultiplier()
	Stats.totalLength = 0
	Stats.increment = Stats.stuff.includes('purplestone') ? Stats.increment : Permastats.incrementBase
	Stats.boostbar = 0
	Stats.boostbarMax = Permastats.boostbarBaseMax
	Stats.boostbarLength = 0
	Stats.rests++
	Stats.actualRestDate = new Date()
	Core.resetUpgrades()
	Core.resetLearnings()
	Core.showLastRestDate()
	Core.unlockSections()
}

Core.showLastRestDate = function(){
	if(!Stats.actualRestDate) return false
	if(Core.isNode(Core.get('#info #actual-rest-date'))){
		Core.get('#info #actual-rest-date').innerHTML = Stats.actualRestDate
	}else{
		var li = '<li><strong>Last rest: </strong><span id="actual-rest-date">' + Stats.actualRestDate + '</span></li>'
		Core._info.innerHTML += li
	}
	Core.get('#rest-count').innerHTML = Stats.rests
}

Core.resetUpgrades = function(){
	if(Stats.stuff.includes('purplestone')){
		// Ole
	}else{
		Stats.upgrades = [  ]
		var upgradeBtns = Core.get('#upgrades-owned .upgrade-owned, #upgrades .upgrade')
		if(Core.isNode(upgradeBtns)){
			upgradeBtns = [ upgradeBtns ]
		}
		for(var i = 0, len = upgradeBtns.length; i < len; i++){
			upgradeBtns[i].parentNode.removeChild(upgradeBtns[i])
		}
		for(var upgrade in Upgrades){
			Upgrades[upgrade].visible = false
			Upgrades[upgrade].owned = false
		}
		Stats.nextUpgradeCost = 10
		Core.unlockUpgrade('walking-shoes')
	}
}

Core.resetLearnings = function(){
	Stats.learnings = [  ]
	Core.get('#learnings-owned').innerHTML = ''
	Core.get('#learnings').innerHTML = ''
	Shop.unlockNextLearning()
}

Core.exportSave = function(){
	if(!window.btoa || typeof window.btoa !== 'function'){
		return notif({
			'type': 'error',
			'message': 'Your browser does not support this functionality'
		})
	}
	var achievementsStrBin = ''
	for(var id in Achievements){
		achievementsStrBin += Achievements[id].done ? '1' : '0'
	}
	var saveStr = ''
	saveStr += [
		Stats.actualRestDate,
		Stats.boostbar,
		Stats.boostbarLength,
		Stats.boostbarMax,
		Stats.boostbarTimesFilled,
		Stats.increment,
		Stats.multiplier,
		Stats.megamultiplier,
		Stats.rests,
		Stats.runStartDate,
		Stats.totalLength,
		Stats.upgrades.join('|'),
		Stats.learnings.join('|'),
		Stats.perks.join('|'),
		Stats.stuff.join('|'),
		achievementsStrBin,
		Stats.nextUpgradeCost,
		Stats.activePerk
	].join(';')
	saveStr = window.btoa(saveStr)
	$('#export-savegame-textarea').val(saveStr).focus().select()
	$('#export-modal').modal('show')
}

Core.importSave = function(){
	if(!window.atob || typeof window.atob !== 'function'){
		return notif({
			'type': 'error',
			'msg': 'Your browser does not support this functionality'
		})
	}
	var saveStr = Core.get('#import-savegame-textarea').value.replace(/^\s+|\s+$/g, '')
	saveStr = window.atob(saveStr)
	saveStr = saveStr.split(';')
	if(saveStr.length !== 16){
		return notif({
			'type': 'error',
			'msg': 'Invalid saved game'
		})
	}
	Stats.actualRestDate = new Date(saveStr[0])
	Stats.boostbar = parseFloat(saveStr[1])
	Stats.boostbarLength = parseFloat(saveStr[2])
	Stats.boostbarMax = parseFloat(saveStr[3])
	Stats.boostbarTimesFilled = parseFloat(saveStr[4])
	Stats.increment = parseFloat(saveStr[5])
	Stats.multiplier = parseFloat(saveStr[6])
	Stats.megamultiplier = parseFloat(saveStr[7])
	Stats.rests = parseFloat(saveStr[8])
	Stats.runStartDate = new Date(saveStr[9])
	Stats.totalLength = parseFloat(saveStr[10])
	Stats.upgrades = saveStr[11].split('|')
	Stats.learnings = saveStr[12].split('|')
	Stats.perks = saveStr[13].split('|')
	Stats.stuff = saveStr[14].split('|')
	var achievementsStrBin = saveStr[15].split('')
	var key = 0
	for(var id in Achievements){
		if(typeof achievementsStrBin[key] !== 'undefined'){
			Achievements[id].done = achievementsStrBin[key] === '1'
			if(Achievements[id].done){
				Core.unlockAchievement(Achievements[id], true)
			}
		}
		key++
	}
	Stats.nextUpgradeCost = saveStr[16]
	Stats.activePerk = saveStr[17]
	Core.save()
	window.location.reload()
}

Core.play = function(sound){
	switch(sound){
		case 'boostbar-filled':
			var sound = Core.get("#sound-system")
			if(sound && !sound.getAttribute('played')){
				sound.play()
				sound.setAttribute('played', true)
			}
			break
	}
}

Core._length = Core.get('#length')
Core._lengthDetail = Core.get('#length-detail')
Core._upgrades = Core.get('#upgrades')
Core._achievements = Core.get('#achievements > table')
Core._runStart = Core.get('#info #run-start')
Core._restCount = Core.get('#info #rest-count')
Core._info = Core.get('#info')
Core._btnRest = Core.get('#btn-rest')
Core._currentUpgrade = Core.get('#current-upgrade')
Core._nextUpgradeName = Core.get('#next-upgrade-name')
Core._nextUpgradeCost = Core.get('#next-upgrade-cost')
Core._nextUpgradeRequired = Core.get('#next-upgrade-required')
Core._megamultiplier = Core.get('#megamultiplier')
Core._sections = {
	studies: Core.get('#studies-section'),
	studiesDone: Core.get('#studies-done-section'),
	perks: Core.get('#perks-section'),
	perksOwned: Core.get('#perks-owned-section'),
	achievements: Core.get('#achievements-section'),
	stuff: Core.get('#stuff-section'),
}

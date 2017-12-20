Core.init()

Core.get('#btn-save').addEventListener('click', Core.save)
Core.get('#btn-load').addEventListener('click', Core.load)
Core.get('#btn-reset').addEventListener('click', Core.reset)
Core.get('#btn-export').addEventListener('click', Core.exportSave)
Core.get('#btn-import').addEventListener('click', function(){
	Core.get('#import-save').style.display = 'block'
})
Core.get('.cancel-import-save').addEventListener('click', function(){
	Core.get('#import-save').style.display = 'none'
})
Core.get('.close-import-save').addEventListener('click', Core.importSave)
Core.get('.close-export-save').addEventListener('click', function(){
	Core.get('#export-save').style.display = 'none'
	Core.get('#export-save > textarea').value = ''
})

Core.get('#btn-rest').addEventListener('click', function(){
	var mult = Core.calcMultiplier()
	if(mult <= 1){
		msg = 'You will get <strong class="text-danger">no multiplier</strong>.<br>You need to travel more for it.'
	}else{
		msg = 'Resting gives you a permanent multiplier each Pm you have travelled and <span class="text-danger">resets all upgrades and your total distance.</span><br>If you ascend now you will get <strong>x' + mult.toFixed(1) + ' multiplier</strong><hr>'
	}
	notif_confirm({
		'textaccept': 'Ok!',
		'textcancel': 'Nope',
		'fullscreen': true,
		'message': msg + '<hr>Do you wish to continue?',
		'callback': function(ok){
			if(ok) Core.rest()
		}
	})
})

if(window.localStorage.getItem('save-date') !== null){
	Core.load()
}

setInterval(function(){
	Core.save()
}, 60000)

$(document).on('click', '#boostbar.ready', Core.boost)

$(window).blur(function(){
  Core.fps = 5
});
$(window).focus(function(){
  Core.fps = 20
});
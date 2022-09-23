Core.init()

Core.get('#btn-save').addEventListener('click', Core.save)
Core.get('#btn-load').addEventListener('click', Core.load)
Core.get('#btn-reset').addEventListener('click', Core.reset)
Core.get('#btn-export').addEventListener('click', Core.exportSave)

$('#export-modal').on('shown.bs.modal', function(){
	$('#export-savegame-textarea').focus().select()
})
$('#import-modal').on('shown.bs.modal', function(){
	$('#import-savegame-textarea').val('').focus()
})

Core.get('#import-save-confirm').addEventListener('click', Core.importSave)

Core.get('#btn-rest').addEventListener('click', function(){
	var mult = Core.calcMultiplier()
	if(!mult || mult <= Stats.multiplier){
		msg = 'You will get <strong class="text-danger">no multiplier</strong>.<br>You need to travel more for it.'
	}else{
		msg = 'Gives you speed multiplier based on your actual progress and <span class="text-danger">resets all upgrades, learnings and your total distance.</span><br>If you ascend now you will get <strong>x' + mult.toFixed(1) + ' multiplier</strong>'
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

$('.section > p.title').click(function(e){
	e.preventDefault()
	if(!$(this).hasClass('closed')){
		$(this).addClass('closed')
		$(this).siblings('.content').slideUp()
	}else{
		$(this).removeClass('closed')
		$(this).siblings('.content').slideDown()
	}
})

// $(window).blur(function(){
//   Core.fps = 5
// });
// $(window).focus(function(){
//   Core.fps = 20
// });

window.onbeforeunload = function(e) {
  if(Stats.activePerk === 'autopilot'){
  	window.localStorage.setItem('close-date', new Date())
  }
};
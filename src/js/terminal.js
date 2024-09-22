
//adapted from a codepen - will include source

var $ = require( "jquery" );

const commands = {
	presentation: {
		cmd: 'intro',
		res: 'AJ<br>Web Developer - HTML - CSS - Python<br>AI Consultant<br><br>Founder of Goodgrow.io<br><br><b>Tapez \'help\' pour plus de détails sur les commandes</b>'},
	visitors: {
		cmd: 'visitors',
		res: '<span class="blue">2626</span> visites'
	},
	whoami: {
		cmd: 'whoami',
		res: 'utilisateur: anonyme<br>ip: 12.34.567.890<br>useragent: ' + navigator.userAgent
	},
	help: {
		cmd: 'help',
		res: ' Aide commandes disponibles<br><br> hello	- Dis bonjour<br> clear	- Efface le terminal<br> date	- Renvoie la date<br> help	- Liste des commandes disponibles<br> whoami	- Affiche les informations sur l\'utilisateur'
	},
	visitors : { cmd: 'visitors', res: '<span class="blue">2626</span> visites'},
	hello: { cmd: 'hello', res: 'Salut, mec !'},
	date: { cmd: 'date', res: 'ceci est la date'}
}

const prephrase = '<span class="green">website</span> <span class="yellow"> (therolf)</span> <span class="red">#</span> ';

var form = $('<div>' + prephrase + '<form id="form"><input type="text" class="nostyle" autofocus /></form>').appendTo('#content');

function launchCommand(command) {
	$('<div>' + prephrase + command.cmd + '<p>' + command.res + '</p></div>').insertBefore(form)
}

launchCommand(commands.presentation);
launchCommand(commands.visitors);

$('#content').niceScroll({
	cursorcolor: '#303030',
	cursorborder: '0px none',
	autohidemode: false,
	cursorwidth: "8px",
	cursorborderradius: "4px",
	railpadding: { top: 0, left: 0, right: 0, bottom: 10 }
});

$('form').on('submit', function(e) {
	e.preventDefault();
	try {
		if($('input').val().trim() !== '') {
			launchCommand(commands[$('input').val()]);
		}
	} catch(error) {
		launchCommand({
			cmd: $('input').val(),
			res: '<div><p>' + $('input').val() + ': command not found</p></div>'
		});
		if($('input').val() === 'clear') {
			$('#content > *').not(':last').remove();
		}
	}
	$('input').val('');$('#content').getNiceScroll(0).resize().doScrollTop($('#content')[0].scrollHeight, 0);
})
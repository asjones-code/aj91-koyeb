
//adapted from a codepen - will include source

var $ = require( "jquery" );

const commands = {
	presentation: {
		cmd: '',
		res: ''},
	visitors: {
		cmd: '',
		res: ''
	},
	whoami: {
		cmd: 'whoami',
		res: 'utilisateur: anonyme<br>ip: 12.34.567.890<br>useragent: ' + navigator.userAgent
	},
	help: {
		cmd: 'help',
		res: ' Aide commandes disponibles<br><br> hello	- Dis bonjour<br> clear	- Efface le terminal<br> date	- Renvoie la date<br> help	- Liste des commandes disponibles<br> whoami	- Affiche les informations sur l\'utilisateur'
	},
    askai: {
		cmd: 'askai',
		res: 'Calling ARLIAI API...'
	}
	
}


const prephrase = '<span class="text-green-500">aj91.online</span> <span class="yellow"> (home)</span> <span class="red">#</span> ';

var form = $('<div class = "flex flex-row">'+ prephrase  + 
    '<form id="form">' + 
    '<input type="text" class="nostyle text-white font-mono" autofocus style="background-color: transparent; border: none; outline: none;" />' + 
    '</form>' + 
    '</div>').appendTo('#content');


function launchCommand(command) {
    if (command.cmd.includes('askai ')) {
	console.log('yes')
    
    var userInput= ($('input').val().split('askai')[1]);
    fetch("https://api.arliai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": 'Bearer 616a6e78-2b4f-478d-bdbd-2d884bb6208b',
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "model": "Meta-Llama-3.1-8B-Instruct",
            "messages": [
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": userInput},
                {"role": "assistant", "content": "Hi!, how can I help you today?"}
            ],
            "repetition_penalty": 1.1,
            "temperature": 0.7,
            "top_p": 0.9,
            "top_k": 40,
            "max_tokens": 1024,
            "stream": false
        })
    })
    .then(response => response.json())
    .then(data => {
        const apiResponse = data.choices[0].message.content;  // Adjust this according to API response format
        // Insert the result without triggering another command
        $('<div>' + prephrase + 'askai<p>' + apiResponse + '</p></div>').insertBefore(form);
    })
    .catch(error => {
        $('<div>' + prephrase + 'askai<p>API call failed: ' + error.message + '</p></div>').insertBefore(form);
    });
  
}
else{
    $('<div>'  + command.cmd + '<p>' + command.res + '</p></div>').insertBefore(form)


}
}

//launchCommand(commands.presentation);
launchCommand(commands.visitors);


$('form').on('submit', function(e) {
	e.preventDefault();
	try {
		if($('input').val().trim() !== '') {
			launchCommand(commands[$('input').val()]);
		}
        
        
	} catch(error) {
		launchCommand({
			cmd: prephrase+ $('input').val(),
			res: '<div><p>' + $('input').val() + ': command not found</p></div>'
		});
		if($('input').val() === 'clear') {
			$('#content > *').not(':last').remove();
		}
       
	}
    $('input').val('');
	//$('input').val('');$('#content');
})
import Typed from 'typed.js';
var $ = require("jquery");
const ws = new WebSocket("wss://asjones-cod-aj91-deno-69.deno.dev/");


// Cache DOM elements
const $prompt = $('.prompt');
const prephrase = '<span class="text-green-500">aj91.online</span> <span class="yellow"> (home)</span> <span class="red">#</span> ';

const commands = {
    clear: {
        cmd: 'clear',
        res: ''
    },
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
        res: ' Aide commandes disponibles<br><br> hello - Dis bonjour<br> clear - Efface le terminal<br> date - Renvoie la date<br> help - Liste des commandes disponibles<br> whoami - Affiche les informations sur l\'utilisateur'
    },
    askai: {
        cmd: 'askai',
        res: ''
    },
    biscuit: {
        cmd: 'biscuit',
        res: 'Connecting to WebSocket server...'
    }
};

let welcomeMessageTyped; // Store the Typed.js instance for later clearing

// Initialize Typed.js with welcome message (only once)
function initializeWelcomeMessage() {
    welcomeMessageTyped = new Typed('.prompt', {
        strings: ['<i>Welcome</i> to aj91.online! Type "help" for commands. ^5000'],
        showCursor: false,
        typeSpeed: 50,
        onComplete: function () {
            appendInputField(); // Show the input field once the welcome message is completed
        }
    });
}




function connectWebSocket() {


    //console.log(ws)



}




// Function to append the input field and set focus
function appendInputField() {
    const inputHtml = `
        <form id="user-input-form" style="display: inline;">
            <input type="text" id="user-input" class="nostyle text-white font-mono" autofocus style="background-color: transparent; border: none; outline: none; display: inline; font-family: Menlo, Monaco, 'Consolas', 'Courier New', 'Courier';" />
        </form>
    `;
    $('.prompt').html(inputHtml); // Append the input field directly after the "$" prompt
    const $userInput = $('#user-input'); // Cache the input field
    $userInput.focus();

    // Add event listener to handle form submission
    $userInput.closest('form').on('submit', function (e) {
        e.preventDefault();
        handleUserInput($userInput.val());
    });
}

// Function to run commands with a typing effect
function executeCommand(script) {
    const prompt = $('.prompt');

    const history = $('.history').html() || ''; // Cache current history
    const updatedHistory = history ? [history] : [];

    // Add the executed command to history
    if (script.strings) {
        updatedHistory.push('$ ' + script.strings.join(' '));
    }

    // Add the command result/output if available
    if (script.output) {
        updatedHistory.push(script.output);
    }

    // Update the history HTML with the new content
    $('.history').html(updatedHistory.join('<br>'));

    // Scroll to the bottom of the screen
    $('section.terminal').scrollTop($('section.terminal').height());

    // Execute next command if needed
    if (script.next) {
        setTimeout(function () {
            executeCommand(script.next);
        }, script.postDelay || 1000);
    } else {
        appendInputField(); // Append input field again for the next command
    }
}

// Function to handle user input
function handleUserInput(inputValue) {
    const normalizedInput = inputValue.trim().toLowerCase();
    
    

    if (normalizedInput in commands) {
        const command = commands[normalizedInput];

        // Prepare the script to run based on the command
        const script = {
            strings: [command.cmd],
            output: command.res ? `<div>${prephrase}${command.res}</div>` : '',
            postDelay: 1000,
            clear: normalizedInput === 'clear' ? true : false,
        };

        if (normalizedInput === 'askai') {
            const userInput = ($('#user-input').val().split('askai')[1] || '').trim();
            //script.strings.push('Calling ARLIAI API...');
            //script.output += '<span class="gray">API call initiated...</span>';

            // API Call
            fetch("https://api.arliai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": 'Bearer 616a6e78-2b4f-478d-bdbd-2d884bb6208b',
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "model": "Meta-Llama-3.1-8B-Instruct",
                    "messages": [
                        { "role": "system", "content": "You are a helpful assistant." },
                        { "role": "user", "content": userInput },
                        { "role": "assistant", "content": "Hi!, how can I help you today?" }
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
                    const apiResponse = data.choices[0].message.content; // Adjust according to API response format
                    script.next = {
                        strings: [apiResponse],
                        output: '',
                    };
                    executeCommand(script);
                })
                .catch(error => {
                    script.next = {
                        strings: [`API call failed: ${error.message}`],
                        output: '',
                    };
                    executeCommand(script);
                });

        }
        if (normalizedInput === 'biscuit') {
            script.strings.push('Websocket!');
            script.output += '<span class="gray">Attempting to connect...</span>';
            console.log(ws.readyState);
            if (ws.readyState === 1) {
                console.log("connected");
                const inputField = $('#user-input').val();
                // Send the user's input to the WebSocket server
                ws.send(inputField);
                if (inputField === '~exit') {
                    ws.close(); // Close the WebSocket connection when user types ~exit
                    console.log("WebSocket connection closed by user.");
                    script.output += '<span class="gray">WebSocket connection closed.</span>';
                    executeCommand(script);
                } else {
                    // Send the user's input to the WebSocket server
                    //ws.send(inputField);
                    //console.log("Sent message to WebSocket server:", inputField);
                    ws.onmessage = (m) => {
                        console.log("Got message from server: ", m.data);
                        script.next = {
                            strings: [m.data],
                            output: '',
                        };
                        executeCommand(script);
        
                    };
                }
    
                // Clear the input field for new input
                $('#user-input').val('');

                //console.log("Sent message to WebSocket server:", inputField);

            }
            
        }
        else if (normalizedInput === 'clear') {
            $('.history').html(''); // Clear the terminal history
            $('.prompt').empty(); // Clear the command prompt
            appendInputField(); // Append the input field again
        } else {
            executeCommand(script);
        }
    } else {
        const unknownCommand = {
            strings: [normalizedInput + ': command not found'],
            output: '',
        };
        executeCommand(unknownCommand);
    }

    // Clear input field after submission
    $('#user-input').val('');
}

// Add event listener to focus input and clear welcome message on prompt click
$prompt.on('click', function () {
    if (welcomeMessageTyped) {
        welcomeMessageTyped.destroy(); // Stop and clear the Typed.js instance
        $('.prompt').html(''); // Clear any welcome message content
        appendInputField(); // Show the input field once the welcome message is completed

    }

});

// Initialize the welcome message and input area
initializeWelcomeMessage();
appendInputField(); // Show the input field once the welcome message is completed


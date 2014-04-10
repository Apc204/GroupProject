ws = require 'ws'
_ = require 'underscore'
spawn = require('child_process').spawn
fs = require('fs')
temp = require('temp')
readline = require('readline')
randomstring = require('randomstring')

server = new ws.Server({port: 8080})

console.log "Server running."

server.on 'connection', (ws) ->
    console.log "Connection received."
    ws.send "CONNECTED"

    maze_data = []
    maze_recv = false
    code_recv = false
    logic = undefined
    logic_out = undefined
    start = true
    reset = false
    prefix_string = randomstring.generate(20)
    prefix_regex = RegExp(prefix_string)

    ws.on 'error', (err) ->
        console.log err

    temp.mkdir 'connection', (err, dir_path) ->
        console.log "directory: #{dir_path}" 
        
        ws.on 'message', (message) ->
            console.log message
            
            if /^\[MAZE\].*/.test message
                console.log 'message'
                message = message[6..]
                fs.writeFile "#{dir_path}/maze.json", message, (err) ->
                    if err
                        console.log err
                    else
                        maze_recv = true
                    if code_recv && maze_recv
                        console.log "MAZE LOADED"
                        console.log "#{dir_path}/maze.json"
                        logic = spawn "python", ["../../backend/python/MazeLogic.py", "#{dir_path}/maze.json", "#{dir_path}/code.py", prefix_string]
                        logic.stdout.setEncoding('utf8')
                        logic.stderr.setEncoding('utf8')
                        logic_out = readline.createInterface({
                            input: logic.stdout,
                            terminal: false
                            })
                        logic_err = readline.createInterface({
                            input: logic.stderr,
                            terminal: false
                            })
                        logic_out.on 'line', (line) ->
                            if prefix_regex.test line
                                line = line[21..]
                                if reset
                                    ws.send line
                                    reset = false
                                else
                                    maze_data = maze_data.concat line
                            else
                                console.log line
                        logic_err.on 'line', (line) ->
                            console.log 'PYTHON ERROR'
                            console.log line
                        logic.on 'close', (code) ->
                            console.log 'PYTHON EXIT'
                            console.log code
                            logic = undefined
                            logic_err = undefined
                            logic_out = undefined 
                        logic.on 'err', (err) ->
                            console.log err
            else if /^\[CODE\].*/.test message
                console.log 'message'
                message = message[6..]
                fs.writeFile "#{dir_path}/code.py", message, (err) ->
                    if err
                        console.log err
                    else
                        code_recv = true
                    if code_recv && maze_recv
                        console.log "MAZE LOADED"
                        console.log "#{dir_path}/maze.json"
                        logic = spawn "python", ["../../backend/python/MazeLogic.py", "#{dir_path}/maze.json", "#{dir_path}/code.py", prefix_string]
                        logic.stdout.setEncoding('utf8')
                        logic.stderr.setEncoding('utf8')
                        logic_out = readline.createInterface({
                            input: logic.stdout,
                            terminal: false
                            })
                        logic_err = readline.createInterface({
                            input: logic.stderr,
                            terminal: false
                            })
                        logic_out.on 'line', (line) ->
                            if prefix_regex.test line
                                line = line[21..]
                                if reset
                                    ws.send line
                                    reset = false
                                else
                                    maze_data = maze_data.concat line
                            else
                                console.log line
                        logic_err.on 'line', (line) ->
                            console.log 'PYTHON ERROR'
                            console.log line
                        logic.on 'close', (code) ->
                            console.log 'PYTHON EXIT'
                            console.log code
                            logic = undefined
                            logic_err = undefined
                            logic_out = undefined 
                        logic.on 'err', (err) ->
                            console.log err
            else if message == "STEP"
                responding = true
                if maze_data.length > 0
                    start = false
                    if logic
                        logic.stdin.write "step\n"
                    ws.send maze_data[0]
                    maze_data = maze_data[1..]
                else
                    logic.stdin.write "step\n"
                    console.log "NO_DATA"
                    ws.send "NO_DATA"
            else if message == "RESET"
                console.log message
                maze_data = []
                reset = true
                if logic
                    logic.stdin.write "reset\n"

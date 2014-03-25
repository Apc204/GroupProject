ws = require 'ws'
_ = require 'underscore'
spawn = require('child_process').spawn
fs = require('fs')
temp = require('temp')

server = new ws.Server({port: 8080})

console.log "Server running."

server.on 'connection', (ws) ->
    console.log "Connection received."
    ws.send "CONNECTED"

    maze_data = []
    data_string = ""
    logic = undefined
    start = true
    responding = false


    ws.on 'error', (err) ->
        console.log err

    temp.mkdir 'connection', (err, dir_path) ->
        console.log "directory: #{dir_path}" 
        
        ws.on 'message', (message) ->
            if responding
                return
            else
                console.log message
                
                if /^\[MAZE\].*/.test message
                    console.log 'message'
                    message = message[6..]
                    fs.writeFile "#{dir_path}/maze.json", message, (err) ->
                        if err
                            console.log err
                        else
                            console.log "MAZE LOADED"
                            console.log "#{dir_path}/maze.json"
                            logic = spawn "python", ["../../backend/python/MazeLogic.py", "#{dir_path}/maze.json", "../../backend/python/RandomRobotController.py"]
                            logic.stdout.setEncoding('utf8')
                            logic.stderr.setEncoding('utf8')
                            logic.stdout.on 'data', (data) ->
                                data_string = "#{data_string}#{data}"
                            logic.stderr.on 'data', (data) ->
                                console.log 'PYTHON ERROR'
                                console.log data
                            logic.on 'close', (code) ->
                                console.log 'PYTHON EXIT'
                                console.log code
                                logic = undefined
                            logic.on 'err', (err) ->
                                console.log err
                else if message == "STEP"
                    responding = true
                    new_maze_data = data_string.split '\n'
                    if new_maze_data.length > 1
                        maze_data = maze_data.concat new_maze_data[..-2]
                    if new_maze_data[new_maze_data.length - 1] != undefined
                        data_string = new_maze_data[new_maze_data.length - 1]
                    else
                        data_string = ""
                    if maze_data.length > 0
                        if logic
                            logic.stdin.write "step\n"
                        ws.send maze_data[0]
                        console.log maze_data[0]
                        maze_data = maze_data[1..]
                    else
                        if start && logic
                            start = false
                            logic.stdin.write "step\n"
                        if logic && (maze_data.length == 0)
                            logic.stdin.write "step\n"
                        console.log "NO_DATA"
                        ws.send "NO_DATA"
                responding = false
        ws.send "READY"

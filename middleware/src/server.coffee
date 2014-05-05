#libraries
ws = require 'ws'
_ = require 'underscore'
spawn = require('child_process').spawn
fs = require('fs')
temp = require('temp')
readline = require('readline')
randomstring = require('randomstring')
exec = require('child_process').exec

server = new ws.Server({port: 8080})

console.log "Server running."

#language definitions
languages = {
    'python': (maze_file, code_file, prefix_string, dir_path, callback) ->
        logic = spawn "python", ["../../backend/python/MazeLogic.py", maze_file, code_file, prefix_string]
        callback(logic)
    ,
    'java': (maze_file, code_file, prefix_string, dir_path, callback) ->
        exec "javac -cp .:../../backend/java/bin:../../backend/java/src #{code_file}", (error, stdout, stderr) ->
            console.log stderr
            logic = spawn "java", ["-cp", ".:../../backend/java/bin/json-simple-1.1.1.jar", "../../backend/java/MazeLogic", maze_file, code_file[..-5], prefix_string]
            callback(logic)
}

#web socket server
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
    prefix_regex = RegExp("^\\[#{prefix_string}\\]")
    code_language = ""
    code_file = ""

    logic_setup = (process) ->
        logic = process
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
                line = line[22..]
                if !/^\[RANDOM\]/.test line
                    if reset 
                        if /^\[RESET\].*/.test line
                            line = line[7..]
                            ws.send line
                            reset = false
                    else
                        maze_data = maze_data.concat line
            else
                ws.send "[CONSOLE]#{line}"
        logic_err.on 'line', (line) ->
            ws.send "[CONSOLE]#{line}"
        logic.on 'close', (code) ->
            logic = undefined
            logic_err = undefined
            logic_out = undefined 
        logic.on 'err', (err) ->
            console.log err
        ws.send "READY"

    ws.on 'error', (err) ->
        console.log err

    #make temp directory
    temp.mkdir 'connection', (err, dir_path) ->
        console.log "directory: #{dir_path}" 
        
        #handle frontend messages
        ws.on 'message', (message) ->
            console.log message

            #accept maze
            if /^\[MAZE\].*/.test message
                console.log 'message'
                message = message[6..]
                fs.writeFile "#{dir_path}/maze.json", message, (err) ->
                    if err
                        console.log err
                    else
                        maze_recv = true
                    if code_recv and maze_recv
                        code_recv = false
                        maze_recv = false
                        #load logic
                        languages[code_language]("#{dir_path}/maze.json", "#{dir_path}/#{code_file}", prefix_string, dir_path, logic_setup)
            #accept code
            else if /^\[CODE\].*/.test message
                console.log 'message'
                message = message[6..]
                reg_ex = /(\[.*\])/
                match = reg_ex.exec message
                code_data = match[0]
                code_file = code_data.split('][')[1]
                code_language = code_data.split('][')[0]
                message = message[(code_data.length)..]
                code_language = code_language[1..]
                code_file = code_file[..-2]
                fs.writeFile "#{dir_path}/#{code_file}", message, (err) ->
                    if err
                        console.log err
                    else
                        code_recv = true
                    if code_recv and maze_recv
                        code_recv = false
                        maze_recv = false
                        #load logic
                        languages[code_language]("#{dir_path}/maze.json", "#{dir_path}/#{code_file}", prefix_string, dir_path,logic_setup)
            #handle steps
            else if message == "STEP"
                if maze_data.length > 0
                    start = false
                    if logic
                        logic.stdin.write "step\n"
                    ws.send maze_data[0]
                    maze_data = maze_data[1..]
                else
                    if logic
                        logic.stdin.write "step\n"
                    ws.send "NO_DATA"
            #handle reset
            else if message == "RESET"
                maze_data = []
                reset = true
                if logic
                    logic.stdin.write "reset\n"

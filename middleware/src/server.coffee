ws = require 'ws'
_ = require 'underscore'
fs = require('fs')
temp = require('temp')
readline = require('readline')
randomstring = require('randomstring')
child_process = require('child_process')
exec = child_process.exec
spawn = child_process.spawn

server = new ws.Server({port: 8080})

console.log "Server running."

languages = {
    'python': (maze_file, code_file, prefix_string) ->
        spawn "python", ["../../backend/python/MazeLogic.py", maze_file, code_file, prefix_string],
    'java': (maze_file, code_file, prefix_string) ->
        exec "javac #{code_file}", (error, stdout, stderr) ->

}

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
    code_language = undefined
    prefix_string = randomstring.generate(20)
    prefix_regex = RegExp("^\\[#{prefix_string}\\]")

    load_logic = () ->
        logic = languages['python']("#{dir_path}/maze.json", "#{dir_path}/code.py", prefix_string)
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
                    if code_recv and maze_recv
                        code_recv = false
                        maze_recv = false
                        load_logic()

            else if /^\[CODE\].*/.test message
                console.log 'message'
                message = message[6..]
                reg_ex = /\[?\]/
                match = reg_ex.exec message
                code_language = match[0]
                message = message[(code_language.length + 2)..]
                fs.writeFile "#{dir_path}/code.py", message, (err) ->
                    if err
                        console.log err
                    else
                        code_recv = true
                    if code_recv and maze_recv
                        code_recv = false
                        maze_recv = false
                        load_logic()

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

            else if message == "RESET"
                maze_data = []
                reset = true
                if logic
                    logic.stdin.write "reset\n"


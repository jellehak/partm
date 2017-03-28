function Commands() {
    var commands = []

    this.add = add
    this.run = run
    //-----------------------------------
    //TODO : New style command handler
    //Command helpers

    function add(command, fn) {
        commands.push({ command: command, fn: fn })
    }

    function run(argv) {
        var flag = false;

        for (k in commands) {
            cmd = commands[k]
            if(cmd.command == argv[0]) {
                cmd.fn(argv)
                flag = true;
            }
        }
        if(!flag) {
            console.warn("Command not found ",argv[0])
        }
    }

}


module.exports = new Commands
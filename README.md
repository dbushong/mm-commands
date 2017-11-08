# mm-commands

A simple node server that implements a set of Mattermost slash commands

## Setup

1. Create a `tokens.json` of the form `{ [commandName]: tokenFromMattermost }`
2. Optionally set server up to run in background; maybe a crontab line like:
    ```
    ## Run slash command server for Mattermost
    @reboot start-stop-daemon --start --chdir $HOME/src/mm-commands --quiet --make-pidfile --pidfile server.pid --background --startas /bin/bash -- -c "exec node server.js > server.log 2>&1"
    ```

## Supported commands

### `/food`

Group food ordering management helper

### `/quote`

Easier pasted-multiline-quoter

# mm-commands

A simple node server that implements a set of Mattermost slash commands

## Setup

Create a `tokens.json` of the form `{ [commandName]: tokenFromMattermost }`

## Development

```
$ npx nodemon server.js
```

## Production

Set server up to run in background; maybe a crontab line like:
```
## Run slash command server for Mattermost
@reboot start-stop-daemon --start --chdir $HOME/src/mm-commands --quiet --make-pidfile --pidfile server.pid --background --startas /bin/bash -- -c "NODE_ENV=production exec node server.js > server.log 2>&1"
```

## Supported commands

### `/food`

Group food ordering management helper

### `/quote`

Easier pasted-multiline-quoter

### `/tfc`

Give a They Fight Crime synopsis

### `/cow`

Cow say/think things

### `/figlet`

Figlet things

### `/flip`

Flip a table or words

### `/math`

Perform math & unit conversion

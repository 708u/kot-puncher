# kot-puncher

Punch in / out the king of time.

## Motivation

- Want to punch in / out without using api.
- If it has already been stamped, I want to prevent it from being stamped even if it is executed again.

## Requirements

please install `deno 1.37.1`

You should set environment variables as follows:

|  Value  |  Description |
| ---- | ---- |
|  KOT_URL  |   the url of king of time  |
|  KOT_USER_ID  |  user id for login  |
|  KOT_USER_PASSWORD  |  user password for login  |

If you want to send notification when punch in / out is succeed, please set optional environment variables as follows:
|  Value  | Default value | Description |
| ---- | ---- | ---- |
|  SLACK_WEBHOOK_URL  | `''` | The webhook url of the channel you want to send notifications to. |
|  SLACK_PUNCH_IN_MESSAGES | `hi` | message when punching in. you can specify comma-separated value, in which case one will be selected at random. |
|  SLACK_PUNCH_OUT_MESSAGES | `bye` | message when punching out. you can specify comma-separated value, in which case one will be selected at random. |

## Option

|  Value  | Default value |  Description |
| ---- | ---- | ---- |
|  `--mode` | `""` | Specify running mode in `punch-in` and `punch-out` |
|  `--dry-run` | `false` | Run kot-puncher with no crawling and no notification |
|  `-v, --verbose` | `false` | Show detailed log to stdin |
|  `-o` | `./out` | Path to directory to save artifact(like screenshot) |
|  `--send-notification` | `false` | Enable to sand notification |

## How to use

basic usage

```bash
deno run -A --importmap=import_map.json src/cmd/main.ts -v --mode punch-in -o out --send-notification
```

### Alias

punch in

```bash
make punch-in
```

punch out

```bash
make punch-out
```

## build

You can create a single binary and put it wherever you like.

```bash
make build
cp out/kot-puncher path/to/directory/you/want
```

## License

MIT

PHONY: build
build:
	rm -f out/kot-puncher && deno compile -A --importmap=import_map.json -o out/kot-puncher src/cmd/main.ts

PHONY: punch-in
punch-in:
	deno run -A --importmap=import_map.json src/cmd/main.ts -v --mode punch-in -o out/ --send-notification

PHONY: punch-out
punch-out:
	deno run -A --importmap=import_map.json src/cmd/main.ts -v --mode punch-out -o out/ --send-notification

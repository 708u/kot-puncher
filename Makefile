.PHONY: build
build:
	bun run build

.PHONY: punch-in
punch-in:
	bun run start -v --mode punch-in -o out/ --send-notification

.PHONY: punch-out
punch-out:
	bun run start -v --mode punch-out -o out/ --send-notification

.PHONY: rest-begin
rest-begin:
	bun run start -v --mode rest-begin -o out/ --send-notification

.PHONY: rest-end
rest-end:
	bun run start -v --mode rest-end -o out/ --send-notification

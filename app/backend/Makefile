include .env
export DATABASE_URL=postgresql://$(DB_USER):$(DB_PASS)@localhost:5432/$(DB_NAME)?sslmode=disable


migration-create:
	migrate create -dir db-migration -ext sql -tz "UTC" $(name)

migration-up:
	@if [ -z "$$DATABASE_URL" ]; then echo "DATABASE_URL is not set"; exit 1; fi; \
	migrate -path db-migration -database "$$DATABASE_URL" up

migration-down:
	@if [ -z "$$DATABASE_URL" ]; then echo "DATABASE_URL is not set"; exit 1; fi; \
	if [ -z "$(n)" ]; then \
		migrate -path db-migration -database "$$DATABASE_URL" down; \
	else \
		migrate -path db-migration -database "$$DATABASE_URL" down force $(n); \
	fi


.PHONY: migration-create migration-up migration-down
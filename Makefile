.PHONY: install-prod install-dev migrate run-e2e-tests run-unit-tests setup-dev setup-prod start-dev start-prod seed-db

# Start application with development environment
start-dev:
	yarn start:dev

# Start application with production environment
start-prod:
	yarn start

# Run e2e tests
run-e2e-tests:
	yarn test:e2e

# Run unit tests
run-unit-tests:
	yarn test

# Set dotenv files and install application dependencies
install-prod:
	cp .env.dist .env && \
	yarn install && \
	yarn build

# Install application dependencies for development environment
install-dev:
	yarn install

# First time setup application for production
setup-prod:
	export NODE_ENV=production && \
	make install && \
    make migrate && \
    make seed-db

# Setup application for development environment
setup-dev:
	export NODE_ENV=development && \
	make install-dev && \
	make migrate && \
	make seed-db

# Seed database with dummy&pre-defined data
seed-db:
	yarn mikro-orm seeder:run

# Migrate database to latest version
migrate:
	yarn mikro-orm migration:up
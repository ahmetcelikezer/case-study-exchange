# Exchange App
## Installation
First, we need to create `.env` file in the root directory of the project. Required variables are defined `.env.dist` file.
You can copy it to `.env` file and edit it.

> You can also use `Makefile` `make setup-dev` command for the development environment.

Then we need the install depended on packages with the following command:
```bash
> yarn install
```

Required database can be run via `docker-compose` if docker already installed inside your system.
```bash
> docker-compose up -d
```
This command will run both test and development database for your local environment.

> If you want to run this application on production environment, you should use your own database and define it's
> connection in `.env` file.

To migrate database to the latest version, run the following command:
```bash
> yarn mikro-orm migration:up
```

To fill database with some data, run the following command:
```bash
> yarn mikro-orm seeder:run
```

and to run the application, run the following command:
```bash
# for development environment (sql logging and more is enabled)
> yarn start:dev

# for production environment
> yarn start
```

## How TO Test
You can find Postman collection in root directory `exchange_app.postman_collection.json` file.

In Postman collection, case study task endpoints are under `Task Requests` folder.

> Login and Register endpoints returns token on success response, please add this token as a Bearer token.
If you request without token, you will get 401 error.

You can login with default credentials:
#### Default Credentials
| E-mail         |   Password   |
|----------------|:------------:|
| john@eva.guru  |    123456    |
| eva@eva.guru   |    123456    |
| joe@eva.guru   |    123456    |
| susan@eva.guru |    123456    |
| doe@eva.guru   |    123456    |

## Description
* In this project, you can; insert initial data into the database using ORM's out-of-box feature [seeder](#seed-database).
* To update (register) sock price hourly basis, [cron](#cron-job) job is always running with your application.

Users can buy and sell stocks for any amount they want.

When users want to sell stocks after they send a sell request to a specified endpoint with backend will create sell
transactions that are ready to buy for buyers. The stock price will be deposited after the buyer completes the open
transaction.

> Note: I don't use there `OPTIMISTIC_LOCK`, normally to make transactions safe, we need the lock data to prevent
> concurrent transaction problems.

When users want to buy some stocks, they will send requests with the target stock and the amount of the stocks they
want to buy. The system automatically sells the cheapest stocks to the user if money is enough.

### Features
#### Seed Database
You can seed database with fake & pre-defined data using `yarn mikro-orm seed:run` command.

---

#### Cron Job
In this project, the cron job was used to create stock prices. This CRON job executes the script every hour.
This script reads the latest transaction of each stock's transaction taken by the user and set its rate(price)
to the new Stock Price and inserts it.

That means each stock has an hourly price log, we only create hourly stock price value but we don't use this value anywhere yet in this project. But in the future, we can use these price logs to draw hourly price charts.
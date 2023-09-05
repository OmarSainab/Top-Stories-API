# Northcoders News API

The rendered API is available on: https://topstories.onrender.com/api

A developer must add .env.tets and .env.development files in order to successfully connect the the test and development databases locally. In each there is a PGDATABASE=databasename for that environment (the database names are also in /db/setup.sql). These .env files are .gitignored to secure the data.

To create the environment variables in order to clone this project and run it locally:

1. For development settings, create a file named .env.development.
2. For testing settings, create a file named .env.test.
3. In each file add the environment variable specifying the PostgreSQL database.
4. gitignore the .env .files by adding to .gitignore`node_modules
.env.*` .

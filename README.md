# Top Stories (Northcoders) API 

**This Git repository stores the back-end of a news website**

### The hosted API is available on: https://topstories.onrender.com/api

### Project summary

The RESTful API:

- Effectively handles queries from an SQL database.
- Implements a Test-Driven Development (TDD) approach and MVC architecture.
- Offers a number of endpoints for CRUD operations.

### Tech stack and versions

- Node.js: v20.2.0
- Express.js
- PostgreSQL (PSQL): v14.7
- node-postgres library to interface with PostgreSQL
- Git version control

### Instructions

1. **Fork and clone**
    - Click Fork in the top right of the this repo page.
    - Navigate to the folder you want this repo to be in locally, enter in the command line:
      ```
      git clone <name-of-repo>
      ```

2. **Install dependencies**
    -  To install the dependencies enter in the command line: 
        ```
        npm install
        ```

3. **Set-up local database**
     - Navigate to `package.json` for available scripts.
    - Create your own `.env.test` and `.env.developement` files using `env-example` as a template. 
   - Into each, add PGDATABASE=, with the correct database name for that environment (see /db/setup.sql for the database names).

4. **Seed the Databases** 

    - Enter the following in the command line:
    ```
    npm run setup-dbs
    ```
    ```
    npm run seed
    ```

5. **Run Tests**

    - To test the functionality of the endpoints enter in the command line:
    ```
    npm test
    ```



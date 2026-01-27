This is a base node js project template, which anyone can use as it has been prepared, by keeping some if the most important code principles and project management recommendations. Feel free to change anything.

`src` --> Inside the src folder all the actual source code regarding the project will reside, this will not include any kind of tests. (You might want to make seperate)

Let's take a look inside `src` folder
 - `config`  --> In this folder anything and everything regarding any configurations o:
 setup of a library or module will be done. For example: setting up `dotenv` so that we can use the environment variables anywhere in a cleaner fashion, this is done in the  `server-config.js`. One more example can be to setup your logging library that can help you prepare meaningful logs, so configuration for this library should also be done here.

  - `routes` --> In this routes folder, we register a route and the corresponding middleware and controllers to it.

  - `middlewares` --> They are just going to intercept incoming request where we can write validators and authenticators etc.

  - `controllers` --> They are kind of the last middleware as post then you call your buissness layer to execute your buissness logic. In controller we just recieve the incoming requests and data and then pass it to the buissness layer, and once buissness layer returns an output, we structure the API response in controllers and send the output.

  - `repositories` --> This folder contains all the logicusing which we interact tht DB by writing queries, all the raw queries or ORM queries go here. 

  - `services` --> Contains the buissness logic and interacts with repositories for data from the database.

  - `utils` --> Contains helper methods, error classes etc.

### Setup the project
  - Download this template from github and open it in your favourite text editor.
  - Go inside the folder and execute the following command
    ```
      npm install
    ```
  - In the root directory create a `.env` file and add the following env variables
    ```
      PORT=<port number of your choice>
    ```
    ex:
    ```
      PORT = 3000
    ```
 - Go inside the `src` folder and execute the following command:
    ```
      npx sequelize init
    ```
 - By executing above command you'll get migrations and seeders folder along with config.json inside the config folder. 
 - If you're setting up your development environment, then write username of your DB and password of your DB and in dialect mention whatever DB you're using for ex:
 mySQL, mariaDB, etc.

 - If you're seeting up test or prod environment, make sure you also replace the host with the hosted DB url. 

 - To run the server execute
  ```
    npm run dev
  ```
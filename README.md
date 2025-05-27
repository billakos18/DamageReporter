"# Damage Reporter" 

In order to use and explore our application, you can visit the site directly at https://damagereporter.onrender.com .

In case the server is down and the site is not deployed, you can download our source files and run the web app on your local host.
After the download has been completed, open the folder containing your newly downloaded files in Visual Studio Code, open a new command prompt and run the command "npm i" to fetch all node modules. 
Wait until all packages have been succesfully installed and then run the command "npm run start". You should be able to see the link for the web app on your terminal! 

Note: you will need Node.js installed on your pc. To do so visit Node's official website and follow their instructions 
(https://nodejs.org/en/download)

List of all dependencies (in case "npm i" doesn't fetch everything for you):
"argon2": "^0.43.0",
"better-sqlite3": "^11.10.0",
"dotenv": "^16.5.0",
"express": "^5.1.0",
"express-handlebars": "^8.0.3",
"express-session": "^1.18.1",
"multer": "^2.0.0",
"pg": "^8.16.0",
"nodemon": "^3.1.10" (Dev dependency)
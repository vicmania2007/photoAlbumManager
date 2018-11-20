# Photo Album Manager

Description: Photo Album Manager is a web application, wherein user can view their albums and photos.

Contributors:
1. Vignesh Kumar Subramanian
2. Ramya Raju

Techstack used:

Front end:
1. AngularJS
2. Bootstrap
3. HTML
4. CSS

Backend (Web services):
1. NodeJS
2. Express
3. MongoDB

Steps to run the application:

1. Clone the repository in your machine.
2. Install NodeJS depending upon your machine(PC, Mac).
3. Install MongoDb and mongoDB client https://robomongo.org/.
4. Create a database using the client and create two collections called "albums" & "photos".
5. Open app.js and in line #12 replace your database with the db listed there.
6. Open the photoAlbumManager directory and run "npm install".
4. After installing the modules, run "node app.js". Now you can see server getting started in port 3000.
5. Open browser and go to "http://localhost:3000"

REST API's:

Host: http://localhost:3000

Album API:
1. Get all albums for an user - '/user/:userId'
2. Fetch all the photos of specific album - '/:albumId'
3. Create new album - '/new' 
4. Edit an album - '/edit'
5. Remove an album - '/remove'

Photos API:
1. GEt photos specific to particular album - '/album/:albumId'
2. Add new photo to existing album - '/new'
3. Get single photo from an album - '/photo/:photoId/album/:albumId'
4. Edit a photo - '/edit'
5. Remove a photo - '/remove'

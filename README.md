Simple web application using React, Redux, and the TMDB API (https://developer.themoviedb.org/reference/intro/getting-started).

To use this project locally, follow these steps:

1.Clone the repository to your local project.
2.Run 'npm install' to install the required node_modules.
3.Create a TMDB account (https://www.themoviedb.org/signup) and generate an Access Token (https://developer.themoviedb.org/reference/intro/authentication).
4.In /src/assets/accessToken.js, replace the existing Access Token with your own.
5.Run 'npm run start' to start the application.
6.Once the page is opened, you will be redirected to TMDB to validate the request token. After validation, you can navigate the page.

If you encounter any issues, try deleting package-lock.json and running 'npm install' again.

Alternatively, if you do not want to generate an Access Token, you can access the project at this URL (https://movie-app-c369f.web.app). Note that you will be logged in on my behalf, and you still need to create a TMDB account.

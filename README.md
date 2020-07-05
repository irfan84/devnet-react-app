<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
  * [Demo](#demo)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Installation](#installation)
* [License](#license)



<!-- ABOUT THE PROJECT -->
## About The Project
DevNet is a social app for developers that allows them to add their profiles, collaborate with other developers and list their GitHub repos.

### Demo
[https://obscure-lake-31414.herokuapp.com](https://obscure-lake-31414.herokuapp.com)

### Built With
* React
* Redux
* Node
* Express
* MongoDB

<!-- GETTING STARTED -->
## Getting Started

### Installation
* Clone the repo

* Get GitHub token from [https://github.com](https://github.com), create MongoDB atlas account at [https://mongodb.com](https://mongodb.com) and then edit config.env file in config folder with the following.

```
MONGO_URI=<your_mongoDB_Atlas_uri_with_credentials>
JWT_SECRET=<secret>
GITHUB_TOKEN=<yoursecrectaccesstoken>
```

* Install server dependencies

```bash
npm install
```

* Install client dependencies

```bash
cd client
npm install
```

* Run both Express & React from root

```bash
npm run dev
```

* Build for production

```bash
cd client
npm run build
```

* Test production before deploy

After running a build in the client, cd into the root of the project.  
And run...

```bash
NODE_ENV=production node server.js
```

Check in browser on [http://localhost:5000/](http://localhost:5000/)



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.

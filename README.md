# Devnetwork Quick Start

### Edit config.env file in config folder with the following

```
MONGO_URI=<your_mongoDB_Atlas_uri_with_credentials>
JWT_SECRET=<secret>
GITHUB_TOKEN=<yoursecrectaccesstoken>

```

### Install server dependencies

```bash
npm install
```

### Install client dependencies

```bash
cd client
npm install
```

### Run both Express & React from root

```bash
npm run dev
```

### Build for production

```bash
cd client
npm run build
```

### Test production before deploy

After running a build in the client 👆, cd into the root of the project.  
And run...

```bash
NODE_ENV=production node server.js
```

Check in browser on [http://localhost:5000/](http://localhost:5000/)

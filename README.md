# smart-city-hub-server

The smart-city-hub-server API serves as the backend for a web application focused on promoting and engaging with sustainable practices in urban environments. 

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB installed and running

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Smart-City-Hub/smart-city-hub-server
   ```

2. Switch repositories:

   ```bash
   cd smart-city-hub-server
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

### Environment Variables

Create a .env file in the root directory with the following variables:

```bash
MODE=
SERVICE_NAME=
MONGO_URI=your_mongodb_connection_string
SECRET_KEY=your_secret_key
```

### Usage

Start the server:

```bash
npm start
```

it should show this if work correctly

```bash
Magical Port Running On:3000
connection success : success connect database
```

### API Endpoints

Post related Endpoint:
POST `{{base_url}}/api/post` : Create new post with tittle, content, and cover.

PUT `{{base_url}}/api/post` : Edit existing post

DEL `{{base_url}}/api/post/:id` : Delete existing post

GET `{{base_url}}/api/post/all` : Get all post

GET `{{base_url}}/api/post` : Get post by user

GET `{{base_url}}/api/post/search?key=motor` : Search post by username

GET `{{base_url}}/api/post/65155a52d1afed08ed45f9a0` : Get post by id post

POST `{{base_url}}/api/post/:id/like` : Toogle between like and unlike

GET `{{base_url}}/api/post/:id/like-count` : Get like count

POST `{{base_url}}/api/post/:id/comments` : Create new comment

GET `{{base_url}}/api/post/:id/comments` : Get existing comment

DEL `{{base_url}}/api/post/:id/comments` : Delete existing comment

User related Endpoint:
POST `{{base_url}}/api/users/register` : Register account

POST `{{base_url}}/api/users/login` : Login to existing user

POST `{{base_url}}/api/users/logout` : Logout

for completed documentation of endpoint:
https://documenter.getpostman.com/view/30013747/2s9Ye8gFHy

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

This project is licensed under the [MIT](https://choosealicense.com/licenses/mit/)

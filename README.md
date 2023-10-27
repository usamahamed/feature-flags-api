# Feature Flags API
This is an API designed to manage feature flags using Firebase's Firestore as the storage backend. Feature flags (or feature toggles) are a powerful tool for allowing developers and product managers to enable or disable features in a system without having to redeploy.

## Table of Contents
- Features
- Setup
- Usage
- Contributing
- License

### Features
1. Fetch all feature flags.
2. Create a new feature flag with an auto-generated extid.
3. Fetch a feature flag by its extid.
4. Update a feature flag.
5. Delete a feature flag by extid.

### Setup

1. Ensure you have Node.js installed.
2. Clone the repository

```
git clone https://github.com/usamahamed/feature-flags-api.git
cd feature-flags-api
```
3. Install the dependencies:

```
npm install
```
4. Set up your .env file with the necessary environment variables:

```
FIREBASE_SERVICE_ACCOUNT_KEY_PATH=path_to_your_firebase_service_account.json
```

5. Start the server:

```
npm start
```

### Usage

### Fetch All Feature Flags

##### GET /flags

Response:

```
{
    "flag1": { "data": "..." },
    "flag2": { "data": "..." },
    ...
}
```

#### Create a New Feature Flag

##### POST /flags

Request Body:

````
{
    "name": "newFlag",
    "data": "..."
}
````

#### Fetch a Feature Flag by extid

##### GET /flags/:extid

Response:

```
{
    "name": "flagName",
    "data": "..."
}
```

#### Update a Feature Flag

##### PUT /flags/:extid

Request Body:

```
{
    "data": "newData"
}
```

#### Delete a Feature Flag

##### DELETE /flags/:extid

Response:

```
{
    "status": "Feature flag deleted successfully"
}
```

### License

This project is licensed under the MIT License.
# Feature Flags API
This is an API designed to manage feature flags using Firebase's Firestore as the storage backend. Feature flags (or feature toggles) are a powerful tool for allowing developers and product managers to enable or disable features in a system without having to redeploy.

## Table of Contents
- Features
- Setup
- Data Model
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

### Data Model

Here's the structure for the data model of a feature flag:

- `childFlagName:` The child flag name. Type: `String`
- `creationDate:` The date the flag was created. Type: `Timestamp`
- `description:` A brief description of the flag. Type: `String`
- `environment:` The environment for which the flag is set (e.g., "production"). Type: `String`
- `extid:` A unique, auto-generated identifier for the flag. Type: `String`
- `flagGroups:` An array of groups the flag belongs to. Type: `Array<String>`
- `flagValue:` The value of the flag (e.g., "text"). Type: `String`
- `isGroupFlag:` Indicates if the flag is a group flag. Type: `Boolean`
- `modifiedDate:` The date the flag was last modified. Type: `Timestamp`
- `name:` The parent flag name. Type: `String`
- `restrictionLevel:` The restriction level of the flag. Type: `String`

### Usage

### Fetch All Feature Flags

GET /flags

Response:

```
{
    "id1": { "name": "..." },
    "id2": { "name": "..." },
    ...
}
```

#### Fetch a Feature Flag by extid

GET /flags/:extid

Response:

```
{
    "name": "flagName",
    ....
}
```

#### Create a New Feature Flag

POST /flags

Request Body:

````
{
    "name": "newFlag",
    ....
}
````



#### Update a Feature Flag

PUT /flags/:extid

Request Body:

```
{
    "name": "newFlag",
    ....
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
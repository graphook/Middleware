# Zenow middleware
The middleware for Graphook

## Install
```bash
npm install
```

## Development
```bash
npm run dev
```

## Deploy
```bash
npm run start
```

## Routes
```
GET /set/:id?itemCount=10&populate=true

POST /set/:id/search -> Provide a mongo query to search within this set

GET /set?count:10&populate=true&itemCount=10

POST /set
{
  type: ObjectID(some type)
  name:
  description:
  tags:
  permissions: {
    canRead: ....
    canUpdateReadPermission: .....
  }
  items: [
    'ItemID',
    {
      itemAttributes:
    }
  ]
}

PUT /set/:id -> with $set the name, description, tags only

PUT /set/:id/add
[
  'itemId',
  {
    itemAttributes:
  }
]

PUT /set/:id/remove
[
  'itemId',
  {
    itemAttributes:
  }
]
or a mongo query

delete /set:id
```

```


export const familyType = {
  "title": "Family",
  "description": "Describes a family unit. Usually one that lives in the same house.",
  "properties": {
    "type": "object",
    "fields": {
      "surname": {
        "type": "text",
        "description": ""
      },
      "isMetaphoricalFamily": {
        "type": "boolean",
        "default": false
      },
      "numberOfChildren": {
        "type": "integer"
      },
      "people": {
        "type": "array",
        "items": {
          "type": "object",
          "fields": {
            "firstName": {
              "type": "text",
              "description": ""
            },
            "age": {
              "type": "integer",
              "description": ""
            },
            "isParent": {
              "type": "boolean",
              "description": ""
            }
          },
          "requires": [],
          "description": "",
          "allowOtherFields": false
        },
        "description": ""
      },
      "lives": {
        "type": "array",
        "items": {
          "type": "text",
          "description": ""
        },
        "description": ""
      },
      "_sets": {
        "type": "array",
        "items": {
          "type": "keyword",
        },
        "default": [],
        "description": "Defines the Sets of which this object is a member."
      },
      "_type": {
        "type": "keyword",
        "constant": "familyType",
        "description": "Defines the object's Type as set_type."
      }
    },
    "requires": [],
    "description": "",
    "allowOtherFields": false
  }
}

export const familySet = {
  title: "Cartoon Families",
  description: "A collection of families from various cartoons.",
  tags: ['sample'],
  type: {
    _id: "familyType",
    title: "Family"
  },
  creator: {
    _id: 'zenow',
    username: 'zenow'
  },
  stars: 0,
  numberOfItems: 0,
  _permissions: {
    owner: 'zenow',
    read: ['all']
  },
  _sets: ['set_set']
}

export const families = [
  {
    "surname": "Simpson",
    "isMetaphoricalFamily": false,
    "numberOfChildren": 3,
    "people": [
      {
        "firstName": "Homer",
        "age": 39,
        "isParent": true
      },
      {
        "firstName": "Marge",
        "age": 36,
        "isParent": true
      },
      {
        "firstName": "Bart",
        "age": 10,
        "isParent": false
      },
      {
        "firstName": "Lisa",
        "age": 8,
        "isParent": false
      },
      {
        "firstName": "Maggie",
        "age": 1,
        "isParent": false
      }
    ],
    "lives": [
      "Springfield"
    ]
  },
  {
    "surname": "Smith",
    "isMetaphoricalFamily": false,
    "numberOfChildren": 2,
    "people": [
      {
        "firstName": "Rick",
        "age": 90,
        "isParent": false
      },
      {
        "firstName": "Beth",
        "age": 34,
        "isParent": true
      },
      {
        "firstName": "Jerry",
        "age": 34,
        "isParent": true
      },
      {
        "firstName": "Summer",
        "age": 17,
        "isParent": false
      },
      {
        "firstName": "Morty",
        "age": 14,
        "isParent": false
      }
    ],
    "lives": [
      "Earth",
      "Tiny Planet"
    ]
  },
  {
    "surname": "Belcher",
    "isMetaphoricalFamily": false,
    "numberOfChildren": 3,
    "people": [
      {
        "firstName": "Bob",
        "age": 45,
        "isParent": true
      },
      {
        "firstName": "Linda",
        "age": 44,
        "isParent": true
      },
      {
        "firstName": "Tina",
        "age": 13,
        "isParent": false
      },
      {
        "firstName": "Gene",
        "age": 11,
        "isParent": false
      },
      {
        "firstName": "Louise",
        "age": 9,
        "isParent": false
      }
    ],
    "lives": [
      "Ocean City"
    ]
  },
  {
    "surname": "Waterson",
    "isMetaphoricalFamily": false,
    "numberOfChildren": 3,
    "people": [
      {
        "firstName": "Gumball",
        "age": 12,
        "isParent": false
      },
      {
        "firstName": "Darwin",
        "age": 10,
        "isParent": false
      },
      {
        "firstName": "Anais",
        "age": 4,
        "isParent": false
      },
      {
        "firstName": "Nicole",
        "age": 38,
        "isParent": true
      },
      {
        "firstName": "Richard",
        "age": 38,
        "isParent": true
      }
    ],
    "lives": [
      "Elmore"
    ]
  },
  {
    "surname": "Neutron",
    "isMetaphoricalFamily": false,
    "numberOfChildren": 1,
    "people": [
      {
        "firstName": "Jimmy",
        "age": 12,
        "isParent": false
      },
      {
        "firstName": "Hugh",
        "age": 40,
        "isParent": true
      },
      {
        "firstName": "Judy",
        "age": 40,
        "isParent": true
      }
    ],
    "lives": [
      "Retroville"
    ]
  },
  {
    "surname": "Turner",
    "isMetaphoricalFamily": false,
    "numberOfChildren": 1,
    "people": [
      {
        "firstName": "Timmy",
        "age": 10,
        "isParent": false
      },
      {
        "firstName": "Dad",
        "age": 42,
        "isParent": true
      },
      {
        "firstName": "Mom",
        "age": 40,
        "isParent": true
      }
    ],
    "lives": [
      "Dimmsdale"
    ]
  },
  {
    "surname": "Gaang",
    "isMetaphoricalFamily": true,
    "numberOfChildren": 5,
    "people": [
      {
        "firstName": "Aang",
        "age": 12,
        "isParent": false
      },
      {
        "firstName": "Zuko",
        "age": 16,
        "isParent": false
      },
      {
        "firstName": "Katara",
        "age": 14,
        "isParent": false
      },
      {
        "firstName": "Sokka",
        "age": 15,
        "isParent": false
      },
      {
        "firstName": "Toph",
        "age": 12,
        "isParent": false
      }
    ],
    "lives": [
      "Water Tribes",
      "Earth Kingdom",
      "Fire Nation",
      "Air Temples"
    ]
  }
]

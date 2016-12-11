import itemValidator from './validators/item.validator.js'


const type = {
  title: 'Family',
  description: 'Describes a family unit. Usually one that lives in the same house.',
  type: 'object',
  properties: {
    surname: {
      type: 'string',
      required: true
    },
    people: {
      type: 'array',
      required: true,
      items: {
        type: 'object',
        properties: {
          firstName: {
            type: 'string',
            required: true
          },
          age: {
            type: 'number',
            required: true
          }
        }
      }
    },
    lives: {
      type: 'array',
      required: true,
      items: {
        type: 'string'
      }
    }
  }
}

const item = {
  surname: 'Waterson',
  people: [
    {
      firstName: 'Gumball',
      age: 12
    },
    {
      firstName: 'Darwin',
      age: 10
    },
    {
      firstName: 'Anais',
      age: 4
    },
    {
      firstName: 'Nicole',
      age: 38
    },
    {
      firstName: 'Richard',
      age: 38
    }
  ],
  lives: [
    'Elmore'
  ]
}

console.log(JSON.stringify(type, null, 2))
console.log(itemValidator(item, type))

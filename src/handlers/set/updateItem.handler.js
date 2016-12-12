import {db} from '../../mongo'

module.exports = function(req, res, next) {
  // if this is the user's item
    // update the item
  // if this is not the user's item
    // clone the item, replacing the _sets with only this set
      // replace the reference in the set with this item id
      // update this item

}

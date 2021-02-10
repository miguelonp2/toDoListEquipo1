const isString = input => typeof input === 'string'
const isNumber = input => typeof input === 'number'
const isDate = input => typeof input.getMonth === 'function'
const isBoolean = input => typeof input === 'boolean'

module.exports = {
    isString,
    isNumber,
    isDate,
    isBoolean
}
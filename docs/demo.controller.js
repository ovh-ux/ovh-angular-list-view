import data from './data.json'

export default class {
  constructor () {
    'ngInject'

    this.loadData()
  }

  $onInit () {
    this.height = 400
    this.sortProperty = 'firstName'
    this.sortReverse = false
  }

  getHeight () {
    return `${this.height}px`
  }

  getHeader (propertyName) {
    switch (propertyName) {
      case 'firstName': return 'First name'
      case 'lastName': return 'Last name'
      case 'email': return 'Email'
      case 'phone': return 'Phone number'
      case 'birthdate': return 'Birth'
      case 'description': return 'Description'
    }
  }

  loadData () {
    this.data = data.slice(0, 50)
  }

  onSortChange ({ sortProperty, sortReverse }) {
    this.sortProperty = sortProperty
    this.sortReverse = sortReverse
  }
}

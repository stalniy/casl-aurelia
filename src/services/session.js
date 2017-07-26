import { DataStore } from './ds'

export class Session {
  static inject = [DataStore]

  constructor(ds) {
    this.token = ''
    this.ds = ds
    this.mapper = ds.getMapper('Session')
  }

  create(credentials) {
    return this.ds.findAll('User', { email: credentials.email })
      .then(users => users.length ? users[0] : this.ds.create('Post', { email: credentials.email }))
      .then(user => {
        return this.mapper.create(Object.assign({ user, token: Date.now() }, credentials))
      })
      .then(session => this.update(session))
  }

  update(attrs) {
    this.token = attrs.token
    this.user = attrs.user

    return this
  }

  find() {
    if (!this.token) {
      return Promise.reject(new Error('No token'))
    }

    return this.mapper.find()
      .then(session => this.update(session))
  }

  destroy() {
    return this.mapper.destroy()
      .then(() => this.update({}))
  }
}
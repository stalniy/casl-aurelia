export function configureStore({ container }) {
  container.registerInstance('DS_INITIALIZER', function(ds) {
    ds.defineMapper('Post', {
      relations: {
        hasMany: {
          Comment: { localField: 'comments', foreignKey: 'postId' }
        }
      }
    })
    ds.defineMapper('Comment', {
      relations: {
        belongsTo: {
          Post: { localField: 'post', foreignKey: 'postId' }
        }
      }
    })
    ds.defineMapper('User')
    ds.defineMapper('Session')

    ds.on('afterCreate', (name, session) => {
      if (name === 'Session') {
        console.log('here?', session)
        ds.getMapper('Post').recordClass.prototype.authorId = session.user._id
      }
    })
  })
}
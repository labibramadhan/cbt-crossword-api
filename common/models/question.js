const loopbackContext = require('loopback-context');
const app = require('../../server/server');

module.exports = Question => {
  Question.getAllTags = (cb) => {
    const Person = app.models.Person;
    const ctx = loopbackContext.getCurrentContext();
    const accessToken = ctx.get('accessToken');
    Person.findById(accessToken.userId, (err, user) => {
      if (err) return cb(err);
      const ds = Question.dataSource;
      const sql = 'SELECT tag FROM question ' +
      "WHERE created_by = '" + user.id + "' " +
      'GROUP BY tag ORDER BY tag ASC ';

      ds.connector.query(sql, (err, soals) => {
        if (err) console.error(err);
        const tags = soals.map((item) => {
          return item.tag;
        });
        cb(err, tags);
      });
    });
  };

  Question.remoteMethod(
    'getAllTags',
    {
      http: {verb: 'get'},
      returns: {root: true, type: 'array'},
    }
  );
};

const loopbackContext = require('loopback-context');
const app = require('../../server/server');

module.exports = Answer => {
  Answer.getRank = (id, cb) => {
    Answer.findById(id, (err, answer) => {
      const ds = Answer.dataSource;
      const sql = 'SELECT r.* FROM (SELECT id, row_number() ' +
        'OVER (ORDER BY grade DESC, created_at ASC) AS rank ' +
        'FROM answer ' +
        "WHERE packageschedule_id = '" + answer.packageSchedule_id + "') r " +
        "WHERE r.id = '" + id + "'";

      ds.connector.query(sql, (err, answers) => {
        if (err) console.error(err);
        cb(err, answers[0]);
      });
    });
  };

  Answer.remoteMethod(
    'getRank', {
      http: {
        verb: 'get',
        path: '/:id/rank',
      },
      accepts: [{
        arg: 'id',
        type: 'string',
        required: true,
      }],
      returns: {
        root: true,
        type: 'object',
      },
    }
  );
};

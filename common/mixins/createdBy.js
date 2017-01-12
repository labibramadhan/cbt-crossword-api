const loopbackContext = require('loopback-context');
const app = require('../../server/server');

module.exports = Model => {
  const User = app.models.Person;
  const bootOptions = arguments.length <= 1 ||
    arguments[1] === undefined ? {} : arguments[1];

  const options = Object.assign({}, {
    column: 'created_by', // eslint-disable-line camelcase
    required: false,
  }, bootOptions);

  Model.belongsTo(User, {
    as: 'person',
    foreignKey: options.column,
  });

  Model.observe('before save', (ctx, next) => {
    const appCtx = loopbackContext.getCurrentContext();
    const accessToken = appCtx.get('accessToken');
    if (!accessToken) {
      next();
    }
    User.findById(accessToken.userId, (err, user) => {
      if (ctx.instance) {
        ctx.instance[options.column] = user.id;
      } else {
        ctx.data[options.column] = user.id;
      }
      return next();
    });
  });
};

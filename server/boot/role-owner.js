module.exports = app => {
  const Role = app.models.Role;

  Role.registerResolver('owner', (role, context, cb) => {
    const reject = () => {
      process.nextTick(() => {
        cb(null, false);
      });
    };

    const userId = context.accessToken.userId;
    if (!userId) {
      return reject();
    }

    context.model.findById(context.modelId, (err, record) => {
      if (err || !record)
        return reject();

      cb(null, record.created_by === userId);
    });
  });
};

const Chance = require('chance');
const chance = new Chance();
module.exports = PackageSchedule => {
  PackageSchedule.observe('before save', (ctx, next) => {
    if (ctx.options && ctx.options.skipPropertyFilter) return next();
    if (ctx.instance) {
      let code = null;
      while (code === null) {
        code = chance.hash({length: 8}).toUpperCase();
        PackageSchedule.find({filter: {where: {code: code}}}, (err, res) => {
          if (res.length) {
            code = null;
          }
        });
      }
      ctx.instance.code = code;
    }
    next();
  });
  PackageSchedule.currentTime = (cb) => {
    cb(null, {time: Date.now()});
  };
  PackageSchedule.remoteMethod(
    'currentTime',
    {
      http: {verb: 'GET'},
      returns: {root: true, type: 'number'},
    }
  );
};

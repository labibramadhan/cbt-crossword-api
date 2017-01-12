const Promise = require('bluebird');
const app = require('../../server/server');
const loopbackContext = require('loopback-context');
const merge = require('deepmerge');

module.exports = Person => {
  Person.whoAmI = async() => {
    const ctx = loopbackContext.getCurrentContext();
    const Role = app.models.Role;
    const RoleMapping = app.models.RoleMapping;
    const accessToken = ctx.get('accessToken');
    const user = await Person.findById(accessToken.userId);
    const roles = [];
    return await new Promise((resolve, reject) => {
      Role.getRoles({
        principalType: RoleMapping.USER,
        principalId: accessToken.userId,
      }, async(err, roles) => {
        if (err) return resolve(user);
        const mappedRoles = [];
        for (const role of roles) {
          if (/^\$/.test(role)) {
            mappedRoles.push(role);
          } else {
            const theRole = await Role.findById(role);
            mappedRoles.push(theRole.name);
          }
        }
        user.roles = mappedRoles;
        return resolve(user);
      });
    });
  };
  Person.remoteMethod(
    'whoAmI', {
      returns: {
        root: true,
        type: 'object',
      },
    }
  );

  Person.registerAdmin = async (user) => {
    const Role = app.models.Role;
    const RoleMapping = app.models.RoleMapping;
    const person = await Person.create(user);

    const role = await Role.findOne({
      where: {
        name: 'admin',
      },
    });
    role.principals.create({
      principalType: RoleMapping.USER,
      principalId: person.id,
    });

    person.roles = [role.name];
    return person;
  };
  Person.remoteMethod(
    'registerAdmin', {
      accepts: [{
        arg: 'user',
        type: 'person',
        required: true,
        http: {
          source: 'body',
        },
      }],
      http: {
        verb: 'POST',
      },
      returns: {
        root: true,
        type: 'person',
      },
    }
  );

  Person.registerGuru = async(user) => {
    const Role = app.models.Role;
    const RoleMapping = app.models.RoleMapping;
    const person = await Person.create(user);

    const role = await Role.findOne({
      where: {
        name: 'guru',
      },
    });
    role.principals.create({
      principalType: RoleMapping.USER,
      principalId: person.id,
    });

    person.roles = [role.name];
    return person;
  };
  Person.remoteMethod(
    'registerGuru', {
      accepts: [{
        arg: 'user',
        type: 'person',
        required: true,
        http: {
          source: 'body',
        },
      }],
      http: {
        verb: 'POST',
      },
      returns: {
        root: true,
        type: 'person',
      },
    }
  );

  Person.registerParticipant = async (user) => {
    const Role = app.models.Role;
    const RoleMapping = app.models.RoleMapping;
    const person = await Person.create(user);

    const role = await Role.findOne({
      where: {
        name: 'participant',
      },
    });
    role.principals.create({
      principalType: RoleMapping.USER,
      principalId: person.id,
    });

    person.roles = [role.name];
    return person;
  };
  Person.remoteMethod(
    'registerParticipant', {
      accepts: [{
        arg: 'user',
        type: 'person',
        required: true,
        http: {
          source: 'body',
        },
      }],
      http: {
        verb: 'POST',
      },
      returns: {
        root: true,
        type: 'person',
      },
    }
  );

  Person.checkPassword = (password, cb) => {
    const ctx = loopbackContext.getCurrentContext();
    const accessToken = ctx.get('accessToken');
    Person.findById(accessToken.userId, (err, user) => {
      user.hasPassword(password, (err, result) => {
        return cb(null, result);
      });
    });
  };
  Person.remoteMethod(
    'checkPassword', {
      accepts: [{
        arg: 'password',
        type: 'string',
        required: true,
      }],
      http: {
        verb: 'GET',
      },
      returns: {
        arg: 'result',
        type: 'boolean',
      },
    }
  );

  Person.findByRoles = async(roles, filter) => {
    if (typeof filter === 'undefined' || !filter) filter = {};
    roles = roles.split(',');
    const Role = app.models.Role;
    const userIds = [];
    const rolesResult = await Role.find({
      include: 'principals',
      where: {
        name: {
          inq: roles,
        },
      },
    });
    for (const r of rolesResult) {
      const principals = await r.principals();
      principals.forEach((principal, idxPrincipal) => {
        userIds.push(principal.principalId);
      });
    }
    if (userIds.length > 0) {
      const newFilter = merge({
        where: {
          and: [{
            id: {
              inq: userIds,
            },
          }],
        },
      }, filter);
      return await Person.find(newFilter);
    }
    return [];
  };
  Person.remoteMethod('findByRoles', {
    accepts: [{
      arg: 'roles',
      type: 'string',
      required: true,
    }, {
      arg: 'filter',
      type: 'object',
      required: false,
    }],
    returns: {
      type: ['person'],
      root: true,
    },
    http: {
      verb: 'get',
      path: '/findByRoles',
    },
  });

  Person.countByRoles = async(roles, where) => {
    if (typeof where === 'undefined' || !where) where = {};
    const userIds = [];
    roles = roles.split(',');

    const Role = app.models.Role;
    const rolesResult = await Role.find({
      include: 'principals',
      where: {
        name: {
          inq: roles,
        },
      },
    });

    for (const r of rolesResult) {
      const principals = await r.principals();
      principals.forEach((principal, idxPrincipal) => {
        userIds.push(principal.principalId);
      });
    }

    if (userIds.length > 0) {
      const newFilter = merge({
        and: [{
          id: {
            inq: userIds,
          },
        }],
      }, where);
      return await Person.count(newFilter);
    }
    return 0;
  };
  Person.remoteMethod('countByRoles', {
    accepts: [{
      arg: 'roles',
      type: 'string',
      required: true,
    }, {
      arg: 'where',
      type: 'object',
      required: false,
    }],
    returns: {
      arg: 'count',
      type: 'number',
    },
    http: {
      verb: 'get',
      path: '/countByRoles',
    },
  });

  Person.afterRemote('findByRoles', async(ctx, user) => {
    if (ctx.result) {
      if (Array.isArray(ctx.result)) {
        const Role = app.models.Role;
        const RoleMapping = app.models.RoleMapping;
        for (const result of ctx.result) {
          const roles = await new Promise((resolve, reject) => Role.getRoles({
            principalType: RoleMapping.USER,
            principalId: result.id,
          }, (err, roles) => err ? reject(err) : resolve(roles)));
          const theRole = await Role.findById(roles[2]);
          result.role = theRole.name;
        }
      }
    }
  });

  Person.afterRemote('findById', async(ctx, user) => {
    if (ctx.result) {
      const Role = app.models.Role;
      const RoleMapping = app.models.RoleMapping;
      const roles = await new Promise((resolve, reject) => Role.getRoles({
        principalType: RoleMapping.USER,
        principalId: ctx.result.id,
      }, (err, roles) => err ? reject(err) : resolve(roles)));
      const theRole = await Role.findById(roles[2]);
      ctx.result.role = theRole.name;
    }
  });
};

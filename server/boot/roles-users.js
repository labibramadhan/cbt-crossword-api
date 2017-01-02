module.exports = async(app) => {
  const Person = app.models.Person;
  const Role = app.models.Role;
  const RoleMapping = app.models.RoleMapping;

  const roles = [{
    name: 'admin',
  }, {
    name: 'guru',
  }, {
    name: 'participant',
  }];

  for (const role of roles) {
    const count = await Role.count(role);
    if (!count) {
      await Role.create(role);
    }
  }

  const adminRole = await Role.findOne({
    where: {
      name: 'admin',
    },
  });
  const guruRole = await Role.findOne({
    where: {
      name: 'guru',
    },
  });
  const participantRole = await Role.findOne({
    where: {
      name: 'participant',
    },
  });

  const user1Exist = await Person.count({
    email: 'admin@mailinator.com',
  });
  if (!user1Exist) {
    const user1 = await Person.create({
      name: 'Muhammad Labib Ramadhan',
      email: 'admin@mailinator.com',
      password: 'asdqwe123',
    });
    adminRole.principals.create({
      principalType: RoleMapping.USER,
      principalId: user1.id,
    });
  }

  const user2Exist = await Person.count({
    email: 'guru@mailinator.com',
  });
  if (!user2Exist) {
    const user2 = await Person.create({
      name: 'Muhammad Labib Ramadhan',
      email: 'guru@mailinator.com',
      password: 'asdqwe123',
    });
    guruRole.principals.create({
      principalType: RoleMapping.USER,
      principalId: user2.id,
    });
  }

  const user3Exist = await Person.count({
    email: 'participant@mailinator.com',
  });
  if (!user3Exist) {
    const user3 = await Person.create({
      name: 'Muhammad Labib Ramadhan',
      email: 'participant@mailinator.com',
      password: 'asdqwe123',
    });
    participantRole.principals.create({
      principalType: RoleMapping.USER,
      principalId: user3.id,
    });
  }
};

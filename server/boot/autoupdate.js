var fs = require('fs');
var _ = require('underscore');
module.exports = function(app) {
  var path = require('path');
  var models = require(path.resolve(__dirname, '../model-config.json'));
  var dataSources = require(path.resolve(__dirname, '../datasources.json'));

  function autoUpdateAll() {
    Object.keys(models).forEach(function(key) {
      if (typeof models[key].dataSource != 'undefined') {
        if (typeof dataSources[models[key].dataSource] != 'undefined') {
          app.dataSources[models[key].dataSource]
            .autoupdate(key, function(err) {
              if (err) throw err;

              console.log('Model ' + key + ' updated');

              /**
               * create or update starter data on each table
               */
              var fileName = key.replace(/([a-z])([A-Z])/g, '$1-$2')
                .toLowerCase();

              try {
                var jsonStarter =
                  path.resolve(__dirname, '../starter/' + fileName + '.json');

                if (fs.statSync(jsonStarter).isFile()) {
                  var starter = require(jsonStarter);
                  _.each(starter.data, function(record) {
                    app.models[key].upsert(record).then(function(res) {

                    }).catch(function(err) {
                      console.log(err);
                    });
                  });
                }
              } catch (err) {

              }
            });
        }
      }
    });
  }

  autoUpdateAll();
};

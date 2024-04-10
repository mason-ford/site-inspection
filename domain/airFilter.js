var pool = require('../database/mysql');

class AirFilter {

  constructor(id, siteId, type, size, quantity, information) {
    this.id = id;
    this.siteId = siteId;
    this.type = type;
    this.size = size;
    this.quantity = quantity;
    this.information = information;
  }

  // Method to get air filter
  static getAirFilter(airFilterId) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          connection.release(); // Ensure connection is released
          return reject(err);
        }

        const sql = 'SELECT * FROM site_airfilter WHERE id = ?';

        connection.query(sql, [airFilterId], (err, results) => {
          connection.release(); // Release connection after query execution

          if (err) {
            return reject(err);
          }

          // If air filter with given ID exists, resolve with the air filter object
          if (results.length > 0) {
            const airFilterData = results[0];
            const airFilter = new AirFilter(airFilterData.id, airFilterData.site_id, airFilterData.type, airFilterData.size, airFilterData.quantity, airFilterData.information);
            resolve(airFilter);
          } else {
            resolve(null);
          }
        });
      });
    });
  }

  // Method to get all air filters for a site
  static getAllAirFiltersForSite(siteId) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          connection.release(); // Ensure connection is released
          return reject(err);
        }

        const sql = 'SELECT * FROM site_airfilter WHERE site_id = ?';

        connection.query(sql, [siteId], (err, results) => {
          connection.release(); // Release connection after query execution

          if (err) {
            return reject(err);
          }

          const airFilters = results.map(filterData => new AirFilter(filterData.id, filterData.site_id, filterData.type, filterData.size, filterData.quantity, filterData.information));
          resolve(airFilters);
        });
      });
    });
  }

  // Method to add an air filter for a site
  static addAirFilter(siteId, type, size, quantity, information) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          connection.release(); // Ensure connection is released
          return reject(err);
        }

        const sql = 'INSERT INTO site_airfilter (site_id, type, size, quantity, information) VALUES (?, ?, ?, ?, ?)';
        const values = [siteId, type, size, quantity, information];

        connection.query(sql, values, (err, result) => {
          connection.release(); // Release connection after query execution

          if (err) {
            return reject(err);
          }

          const newFilterId = result.insertId;
          console.log('Air filter added successfully with ID:', newFilterId);
          resolve(newFilterId);
        });
      });
    });
  }

  // Method to update an air filter for a site
  static updateAirFilter(filterId, newType, newSize, newQuantity, newInformation) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          connection.release(); // Ensure connection is released
          return reject(err);
        }

        const sql = 'UPDATE site_airfilter SET type = ?, size = ?, quantity = ?, information = ? WHERE id = ?';
        const values = [newType, newSize, newQuantity, newInformation, filterId];

        connection.query(sql, values, (err, result) => {
          connection.release(); // Release connection after query execution

          if (err) {
            return reject(err);
          }

          // Check if any rows were affected
          if (result.affectedRows > 0) {
            resolve();
          } else {
            reject(new Error('Air filter not found or no changes made.'));
          }
        });
      });
    });
  }

  // Method to delete an air filter for a site
  static deleteAirFilter(filterId) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          connection.release(); // Ensure connection is released
          return reject(err);
        }

        const sql = 'DELETE FROM site_airfilter WHERE id = ?';

        connection.query(sql, [filterId], (err, result) => {
          connection.release(); // Release connection after query execution

          if (err) {
            return reject(err);
          }

          // Check if any rows were affected
          if (result.affectedRows > 0) {
            resolve();
          } else {
            reject(new Error('Air filter not found.'));
          }
        });
      });
    });
  }
}

module.exports = AirFilter;
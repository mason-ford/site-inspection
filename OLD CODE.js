ADD SITE

/*try {

      var newCheckpoints = [];
      //this.checkpoints.forEach(checkpoint => {
      //      newCheckpoints.push(new ObjectId(checkpoint));
      //});
      //let newSite = {name: this.name, acronym: this.acronym, number: this.number, address: this.address, airfilter: this.airfilter, contact: this.contact, checkpoints: newCheckpoints};
      //let db = await DbConnection.Get();
      //let result = await db.collection(collection).insertOne(newSite);

      let con = MysqlConnection;
      con.connect(function(err) {
        if (err) throw err;
        console.log(this.name)
        let sql = `INSERT INTO site (name, acronym, number, address, latlong) VALUES ('${this.name}', '${this.acronym}', ${this.number}, '${this.address}', ${this.latlong})`;
        console.log(sql)
        con.query(sql, function (err, result) {
          if (err) throw err;
          return result.insertedId;
        })
      })

      //return result.insertedId;
    } catch (e) {
      console.log(e);
      return e;
    }*/

    GET SITE

    try {
      let db = await DbConnection.Get();
      let result = await db.collection(collection).aggregate([
        {
          '$match': {
            '_id': new ObjectId(id)
          }
        }, {
          '$unwind': {
            'path': '$checkpoints', 
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$lookup': {
            'from': 'checkpoints', 
            'localField': 'checkpoints', 
            'foreignField': '_id', 
            'as': 'checkpoint'
          }
        }, {
          '$unwind': {
            'path': '$checkpoint', 
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$sort': {
            'checkpoint.name': 1
          }
        }, {
          '$group': {
            '_id': '$_id', 
            'name': {
              '$first': '$name'
            }, 
            'acronym': {
              '$first': '$acronym'
            }, 
            'number': {
              '$first': '$number'
            }, 
            'address': {
              '$first': '$address'
            }, 
            'airfilter': {
              '$first': '$airfilter'
            }, 
            'checkpoints': {
              '$push': '$checkpoint'
            }, 
            'contact': {
              '$first': '$contact'
            }
          }
        }
      ]).toArray();
      let s = result[0];
      let newSite = new Site(s._id, s.name, s.acronym, s.number, s.address, "", s.airfilter, s.contact, s.checkpoints);
      return newSite;
    } catch (e) {
      console.log(e);
      return e;
    }

    EDIT SITE

    try {
      var newCheckpoints = [];
      this.checkpoints.forEach(checkpoint => {
          newCheckpoints.push(new ObjectId(checkpoint));
      });
      let newValues = { $set: {name: this.name, acronym: this.acronym, number: this.number, address: this.address, airfilter: this.airfilter, contact: this.contact, checkpoints: newCheckpoints}};
      let db = await DbConnection.Get();
      let result = await db.collection(collection).updateOne({_id: new ObjectId(this.id)}, newValues);

      return result;
    } catch (e) {
      console.log(e);
      return e;
    }

    if(req.body.site_checkpoints === undefined) {
      var checkpoints = [];
    } else {
      var checkpoints = req.body.site_checkpoints;
    }
  
    if(req.body.airfilter_type === undefined) {
      var airfilter = [];
    } else {
      var airfilter_type = req.body.airfilter_type;
      var airfilter_size = req.body.airfilter_size;
      var airfilter_amount = req.body.airfilter_amount;
  
      var airfilter = [];
      for(let i=0; i < airfilter_type.length; i++) {
        if(airfilter_type[i] !== "") {
          airfilter.push({
            type: airfilter_type[i],
            size: airfilter_size[i],
            amount: airfilter_amount[i]
          });
        }
      }
    }
  
    if(req.body.contact_name === undefined) {
      var contact = [];
    } else {
      var contact_name = req.body.contact_name;
      var contact_number = req.body.contact_number;
      var contact_info = req.body.contact_info;
  
      var contact = [];
      for(let i=0; i < contact_name.length; i++) {
        if(contact_name[i] !== "") {
          contact.push({
            name: contact_name[i],
            number: contact_number[i],
            info: contact_info[i]
          });
        }
      }
    }

    EDIT GET
    let id = req.params.id;
    var returnSite;
    Site.getSite(id).then(site => {
      returnSite = site;
      console.log(returnSite);
      return Checkpoint.getAllCheckpoints();
    }).then(checkpoints => {
      checkpoints.forEach(checkpoint => {
        checkpoint.added = false;
        returnSite.checkpoints.forEach(check => {
          if(check._id.equals(checkpoint._id)) checkpoint.added = true;
        })
      });
      returnSite.checkpoints = checkpoints;
      res.render('sites/sites-edit', {page:'Site Edit', menuId: menuId, site: returnSite});
    });
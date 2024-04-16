class Task {

  constructor(id, siteId, complete, taskInfo, completeInfo) {
    this.id = id;
    this.siteId = siteId;
    this.complete = complete;
    this.taskInfo = taskInfo;
    this.completeInfo = completeInfo;
  }

  async addTask() {
    try {
      let siteId = new ObjectId(this.siteId);
      let toDo = {siteId: siteId, complete: this.complete, taskInfo: this.taskInfo, completeInfo: this.completeInfo};
      let db = await DbConnection.Get();
      let result = await db.collection(collection).insertOne(toDo);

      return result.insertedId;
    } catch (e) {
      console.log(e);
      return e;
    }        
  }

  static async getTask(id) {
    try {
      let db = await DbConnection.Get();
      let result = await db.collection(collection).findOne({_id: new ObjectId(id)});

      let task = new Task(result);
      return task;
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  static async getTasksForSite(id) {
    try {
      let db = await DbConnection.Get();
      let result = await db.collection(collection).aggregate([
        {
          '$match': {
            'siteId': new ObjectId(id)
          }
        }
      ]).toArray();

      var taskArray = [];
      //console.log(result);
      result.forEach(task => {
        //console.log(task);
        taskArray.push(new Task(task._id, task.siteId, task.complete, task.taskInfo, task.completeInfo));
      });
      //console.log(taskArray);
      return taskArray;
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  static async getAllTasks() {
    try {
      let db = await DbConnection.Get();
      let result = await db.collection(collection).aggregate( [ { $sort: { 'taskInfo.date': 1 } } ] ).toArray();

      var taskArray = [];
      result.forEach(task => {
        taskArray.push(new Task(task));
      });
      return taskArray;
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  static async getAllCompletedTasks() {
    try {
      let db = await DbConnection.Get();
      let result = await db.collection(collection).aggregate( [
        {
          '$match': {
            'complete': false
          }
        }, {
          '$lookup': {
            'from': 'sites', 
            'localField': 'siteId', 
            'foreignField': '_id', 
            'as': 'site'
          }
        }, {
          '$unwind': {
            'path': '$site', 
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$project': {
            'siteId': 0, 
            'site.address': 0, 
            'site.checkpoints': 0
          }
        }, {
          '$sort': {
            'taskInfo.date': -1
          }
        }
      ] ).toArray();

      /*var taskArray = [];
      result.forEach(task => {
        taskArray.push(new Task(task));
      });*/
      return result;
    } catch (e) {
      console.log(e);
      return e;
    }
  }

}

module.exports = Task;
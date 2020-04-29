import oracledb from "oracledb";
import Constants from "../utility/constants";
import chai from "chai";

let dbInfoPath = Constants.getDBInfoPath();

class Connect {
  /**
   * runs the desired query on the desired database and uses the callback to allow the step calling the query to use the returned data
   * @param {JSON} database The database and connection info.
   * @param {string} query desired query to be run.
   */
  runQuery(database, query) {
    // gets the desired connection
    return new Promise((resolve, reject) => {
      oracledb.getConnection({
        connectString: require(dbInfoPath)[database]["CONNECTION_STRING"],
        user: process.env.SQLDBUSER,
        password: process.env.SQLDBPASS
      }).then((connection) => {
        //executes the passed in query returning a max result of 10 to esnure speed
        connection.execute(query, [], {
          maxRows: 10
        }).then((result) => {
          //grabs the first result and releases the connection
          var firstResult = result.rows[0];
          chai.expect(firstResult, "The query returned zero results").to.be.an("array");
          connection.close().catch(err => reject(err));
          //passes the first result into the callback for use within steps
          resolve(firstResult);
        }).catch(err => {
          connection.close().catch(err => reject(err));
          reject(err);
        });
      });
    });
  }
}

export default new Connect();

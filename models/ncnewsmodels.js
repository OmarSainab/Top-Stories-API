const format = require("pg-format");
const db = require("../db/connection");

exports.selectTopics = () => {
  const selectQuery = format(`SELECT * FROM topics;`);
  return db.query(selectQuery).then((result) => {
    return result.rows
  });
};

exports.selectEndPoints = () => {
  
    const parsedEndPoints = JSON.stringify(endPoints)
  
      //console.log(parsedEndPoints, "model");
    return parsedEndPoints
    
  };
  
import {pool} from './db-connect.js';
import {db_type} from './env-config.js';
import mongoose from 'mongoose';

let query, insert, selectS, selectM, InsertQueryErrorLog;

const sql = pool;

if(db_type === 'mysql')
{

query = (_query, params = []) => {
    return new Promise((resolve, reject) => {
      sql.query(_query, params, (error, results) => {
        if (error)
        {
          return reject(error);
        }
        resolve(results);
      });
    });
};

insert = (_query, params = []) => {
    return new Promise((resolve, reject) => {
      sql.query(_query, params, (error, results) => {
        if (error)
        {
          return reject(error);
        }
        else
        {
            if (results && results.insertId)
            {
                results = { insertId: results.insertId };
                resolve(results);
            }
            else
            {
                results = {};
                resolve(results);
            }
        }
    });
    });
};

selectS = (_query, params = []) => {
  return new Promise((resolve, reject) => {
    sql.query(_query, params, (error, results) => {
      if (error)
      {
        return reject(error);
      }
      else
      {
        results = results[0];
        resolve(results);
      }
    });
  });
};

selectM = (_query, params = []) => {
  return new Promise((resolve, reject) => {
    sql.query(_query, params, (error, results) => {
      if (error)
      {
        return reject(error);
      }
      else
      {
        resolve(results);
      }
    });
  });
};

InsertQueryErrorLog = (_insertQuery) =>
{
    sql.query(_insertQuery, (error, results, fields) =>
    {
        if (error)
        {

        }
        if (results != null) 
        {

        }
        else 
        {

        }
    });
};

}
else if(db_type === 'mongodb')
{
    // // MongoDB related code can be added here if needed
    // query = () => {};
    // insert = () => {};
    // selectS = () => {};
    // selectM = () => {};
    // InsertQueryErrorLog = () => {};

    query = (collection, filter, options, update, ) =>{

    },

  selectS = async (collection, filter, options) => 
  {
    console.log("COL",collection, "fil", filter, "opt", options);
    const col = await pool.collection(collection); // Get collection reference
    const cursor = await col.find(filter).toArray(); // Get cursor
    if(cursor.length > 0)
    { 
      return cursor[0]; // Return first document
    }
    else
    {
      return null; // Return empty object if no document found
    }
  },
  InsertQueryErrorLog = (_insertQuery) =>
  {
  };
}
export default {
  query,
  insert,
  selectS,
  selectM,
  InsertQueryErrorLog
}
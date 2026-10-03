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
  // MongoDB insert / create function
  query = async (collection, data) => {
      try {
          const col = await pool.collection(collection);
          const result = await col.insertOne(data);
          return {
              status: true,
              insertId: result.insertedId,
              data: result
          };
      } catch (error) {
          console.error("MongoDB Insert Error:", error);
          return {
              status: false,
              error: error.message
          };
      }
  };
  insert = query; // insert bhi query ko point karega
  selectS = async (collection, filter, options) => {
      try {
          const col = await pool.collection(collection);
          const doc = await col.findOne(filter);
          return doc || null;
      } catch (error) {
          console.error("MongoDB Find Error:", error);
          return null;
      }
  };
  selectM = async (collection, filter, options) => {
      try {
          const col = await pool.collection(collection);
          const docs = await col.find(filter).toArray();
          return docs;
      } catch (error) {
          console.error("MongoDB Find Error:", error);
          return [];
      }
  };
  InsertQueryErrorLog = (_insertQuery) => {};

}
export default {
  query,
  insert,
  selectS,
  selectM,
  InsertQueryErrorLog
}
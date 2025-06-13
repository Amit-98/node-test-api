import {pool} from './db-connect.js';

let query, SelectS, SelectM, InsertQuery, Updatequery, Deletequery, InsertQueryErrorLog;

const sql = pool;

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

SelectS = (_query, cb) =>{
    sql.query(_query, (err, result) => 
    {
        if(err)
        {
            return cb (err);
        }
        else if(result && result.length > 0) 
        {
            return cb(null, result);
        }
        else
        {
            return cb(null, null);
        }
    });
};

SelectM = (_query, cb) =>{
    sql.query(_query, (err, result) =>
    {
        if(err)
        {
            return cb (err);
        }
        else if(result && result.length > 0) 
        {
            return cb(null, result);
        }
        else
        {
            return cb(null, null);
        }
    });
};

InsertQuery = (_insertQuery, cb) =>
{
    sql.query(_insertQuery, (error, results, fields) =>
    {
      if (error)
      {
        return cb(error);
      }
      if (results != null)
      {
        return cb(null, results);
      }
      else 
      {
        return cb(null, null);
      }
    });
};

Updatequery = (_updatequery, cb) =>
{
    sql.query(_updatequery, (error, results, fields) =>
    {
        if (error)
        {
            return cb(error);
        }
        if (results.length > 0) 
        {
            cb(null, results);
        }
        else
        {
            cb(null, results);
        }
    });
};

Deletequery = (_deletequery, cb) =>
{
    sql.query(_deletequery, (error, results, fields) =>
    {
        if (error) 
        {
            return cb(error);
        }
        if (results.length > 0)
        {
            cb(null, results);
        }
        if (results != null)
        {
            cb(null, results);
        }
        else
        {
            cb(null, null);
        }
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

export default {
    query,
    SelectS,
    SelectM,
    InsertQuery,
    Updatequery,
    Deletequery,
    InsertQueryErrorLog
}
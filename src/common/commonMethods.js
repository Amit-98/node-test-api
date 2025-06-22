import _dbhelper from "../db/db-runner.js";
import bcrypt from 'bcrypt';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs/promises';

export default
{
  encPass: async (password) =>
  {
    const hash = await bcrypt.hash(password,10);
    return hash;
  },

  cmpPass: async (hash, newPass) =>{
    const result = await bcrypt.compare(newPass, hash);
    return result;
  },

  saveErrorLog: (_fileName, _funName, _errorMsg, _reqJson) =>
  {
    let myreqJSON = JSON.stringify(_reqJson.body);
    // console.log(_reqJson.body);
    if (_errorMsg > 1000)
    {
      //let text = "Hello world!";
      _errorMsg = _errorMsg.substring(0, 999);
    }
    if (myreqJSON > 5000)
    {
      myreqJSON = myreqJSON.substring(0, 4999);
    }
    var _query = `INSERT INTO api_error_log_detail(file_name,method_name,error_message,request_json)
    VALUES('${_fileName}','${_funName}',"${_errorMsg}",'${myreqJSON}')`;
    _dbhelper.InsertQueryErrorLog(_query);
    return _query;
  },

  uploadFileTemp: async (file, pathD) =>
  {
    try
    {
      if (file == undefined || file == null)
      {
        throw new Error('No file provided');
      }
      const extensionName = path.extname(file.name);
      const sampleFile = crypto.randomBytes(16).toString("hex") + extensionName;

      // Construct the upload path
      const uploadPath = path.join('./src/public', 'uploads', pathD, sampleFile);
      const fullUploadPath = path.join(process.cwd(), uploadPath);

      // Ensure the directory exists
      await fs.mkdir(path.dirname(fullUploadPath), { recursive: true });

      // Move the file
      await fs.writeFile(fullUploadPath, file.data);

      // Return the path relative to the project root
      return path.join('public', 'uploads', pathD, sampleFile);
    } 
    catch (err)
    {
      console.error("Error saving to local storage:", err);
      throw err;
    }
  },

  uploadFile: async (file, pathD)=> {
      try 
      {
        let sampleFile;
        let uploadPath;

        if (file == undefined || file == null)
        {
          return null;
        }
        const extensionName = path.extname(file.name);
        sampleFile = crypto.randomBytes(16).toString('hex') + extensionName;
        uploadPath = './public/upload/' + pathD + '/' + sampleFile;
        await file.mv(uploadPath);
        return "/upload/"+pathD+'/'+sampleFile;
      } 
      catch (err) 
      {
        console.log(err.message);
      }
    }
}

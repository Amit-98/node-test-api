import _dbhelper from "../db/db-runner.js";

export default
{
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
    }
}

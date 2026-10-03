import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import src from './src/index.js';
import { PORT_CONFIG } from './src/db/env-config.js';
import Response from "./src/common/response/index.js";
import { ErrorMsg } from './src/common/index.js';
import path from 'path';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload({ createParentPath: true, limits: { fileSize: 50 * 1024 * 1024 }})); // 50 MB limit

let errorHandler = (err, req, res, next) =>
{
    if (typeof (err.message[0]) == 'object') 
    {
        res.json(new Response(400)
            .setMessage(err.customMsg)
            .setErrorMessage(err.message).build())
        return
    }

    if (err.name == 'ReferenceError')
    {
        res.json(new Response(503)
            .setMessage(ErrorMsg.internalErrorMsg)
            .setErrorMessage(err.message).build())
        return
    }

    if (err.message === 'Unauthorized_token')
    {
        // jwt authentication error
        res.json(new Response(401)
            .setMessage(ErrorMsg.InvalidTokenMessage)
            .setErrorMessage(ErrorMsg.Invalid_Header_Token_Message).build())
        return
    }

    if (err.message === 'INVALID_KEY')
    {
        return res.status(401).json(new Response(1)
        .setMessage(ErrorMsg.InvalidKey)
        .setErrorMessage(ErrorMsg.InvalidKeyMessage).build())
    }

    if (err.message === 'Unauthorized_auth_token')
    {
        // jwt authentication error
        res.json(new Response(401)
            .setMessage(ErrorMsg.InvalidTokenMessage)
            .setErrorMessage(ErrorMsg.InvalidTokenErrorMessage).build())
        return
    }

    if (err.name == 'Error')
    {
        // custom application error
        res.json(new Response(503)
            .setMessage(ErrorMsg.internalErrorMsg)
            .setErrorMessage(err.message).build())
        return
    }

    if (typeof (err) === 'string')
    {
        // custom application error
        res.json(new Response(200)
            .setMessage(ErrorMsg.internalErrorMsg)
            .setErrorMessage(err).build())
        return
    }

    // default to other errors
    res.s = 1;
    res.json(new Response(1)
        .setMessage(err.customMsg || ErrorMsg.internalErrorMsg)
        .setErrorMessage(err.message).build()
    )
}

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"]
  })
);

// Serve static files from public/upload directory
app.use('/upload', express.static(path.join(process.cwd(), 'public/upload')));

app.get('/', (req, res) => {
  res.send("Hello Sigmaplex API");
});

let resultHandler = (req, res, next) =>
{
  res.sendResult = function() 
  {
    return res.json(new Response(res.s).setMessage(res.m || "Success").
      setPagination(res.tr, res.page, res.pages, res.c).
      setResultData(res.r).build()
    )
  };
  next();
}

app.use(resultHandler);

app.use('/api', src, resultHandler, errorHandler);

export default app;

if (!process.env.NETLIFY && process.env.NODE_ENV !== 'production') {
  app.listen(PORT_CONFIG, () => {
    console.log(`Server is running on port ${PORT_CONFIG}`);
  });
}
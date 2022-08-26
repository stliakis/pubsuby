import Config from "./config";
import {NextFunction, Request, Response,} from "express"

async function requiredSecretApiKey(req: Request, res: Response, next: NextFunction) {
  let secret = req.headers["secret-api-key"] || req.body["secret-api-key"];
  if (!secret) {
    res.status(401).json({
      error: "Missing secret api key",
    });
    return;
  } else if (secret != Config.get("SECRET_API_KEY", "notsecretapikey")) {
    res.status(401).json({
      error: "Invalid secret api key",
    });
    return;
  }
  next();
}


export {
  requiredSecretApiKey,
}
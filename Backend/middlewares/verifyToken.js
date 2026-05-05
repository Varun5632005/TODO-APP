import jwt from "jsonwebtoken";
const { verify } = jwt;

export function verifyToken(req, res, next) {
  //get token from cookie
  const encodedToken = req.cookies.token;
  //if encoded token not found
  if (encodedToken === undefined) {
    res.status(401).json({ message: "Unauthorized" });
  } else {
    try {
      //verify token
      let decodedToken = verify(encodedToken, process.env.JWT_SECRET || "abcdef");
      console.log("decoded token is",decodedToken)
      req.user=decodedToken
      //forward req to next
      next();
    } catch (err) {
      res.status(401).json({ message: "Session expired" });
    }
  }
}
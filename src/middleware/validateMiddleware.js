import Console from "../Lib/Console.js";

const logger= new Console("MiddleWare");

export const validateSchema = (schema) => (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      logger.error(error);
      return res.status(400).json({ message: error.errors.map((err) => err.message) });
    }
  };

  export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
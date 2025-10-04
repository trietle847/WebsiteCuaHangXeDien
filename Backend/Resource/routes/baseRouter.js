// baseRouter.js
const express = require("express");

function createBaseRouter(controller, middlewares = {}, additionalRoutes = []) {
  const router = express.Router();

  router.get("/", middlewares.getAll || [], controller.getAll);
  router.get("/:id", middlewares.getById || [], controller.getById);
  router.post("/", middlewares.create || [], controller.create);
  router.put("/:id", middlewares.update || [], controller.update);
  router.delete("/:id", middlewares.delete || [], controller.delete);

  if (additionalRoutes.length > 0) {
    additionalRoutes.forEach(({ method, path, handler, middlewares = [] }) => {
      router[method](path, middlewares, handler);
    });
  }

  return router;
}

module.exports = createBaseRouter;

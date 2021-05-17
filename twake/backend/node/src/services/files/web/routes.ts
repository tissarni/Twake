import { FastifyInstance, FastifyPluginCallback } from "fastify";
import { FileController } from "./controllers/files";

const filesUrl = "/companies/:company_id/files";

const routes: FastifyPluginCallback<{ service: any }> = (
  fastify: FastifyInstance,
  options,
  next,
) => {
  const fileController = new FileController(options.service);

  fastify.route({
    method: "POST",
    url: filesUrl,
    preValidation: true ? [] : [fastify.authenticate],
    handler: fileController.save.bind(fileController),
  });

  fastify.route({
    method: "POST",
    url: filesUrl + "/:id",
    preValidation: [fastify.authenticate],
    handler: fileController.save.bind(fileController),
  });

  fastify.route({
    method: "GET",
    url: `${filesUrl}/:id/download`,
    preValidation: [fastify.authenticate],
    handler: fileController.download.bind(fileController),
  });

  fastify.route({
    method: "GET",
    url: `${filesUrl}/:id`,
    preValidation: [fastify.authenticate],
    handler: fileController.get.bind(fileController),
  });

  fastify.route({
    method: "DELETE",
    url: `${filesUrl}/:id`,
    preValidation: [fastify.authenticate],
    handler: fileController.delete.bind(fileController),
  });

  next();
};

export default routes;

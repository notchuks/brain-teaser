import { FastifyInstance } from "fastify";
import { UserController } from "./user.controller";
import { CreateUserSchema, UpdateUserSchema, UserSchema } from "./user.schema";
import { Type } from "@sinclair/typebox";

export default async function userRoutes(app: FastifyInstance) {
  app.post("/", { schema: { body: CreateUserSchema, response: { 201: UserSchema } } }, UserController.create);
  app.get("/", { schema: { response: { 200: Type.Array(UserSchema) } } }, UserController.getAll);
  app.get("/:id", { schema: { response: { 200: UserSchema } } }, UserController.getById);
  app.put("/:id", { schema: { body: UpdateUserSchema, response: { 200: UserSchema } } }, UserController.update);
  app.delete("/:id", UserController.delete);
}
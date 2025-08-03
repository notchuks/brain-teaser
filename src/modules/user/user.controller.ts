import { FastifyRequest, FastifyReply } from "fastify";
import { UserService } from "./user.service";

export class UserController {
  static async create(request: FastifyRequest, reply: FastifyReply) {
    const user = await UserService.createUser(request.body as any);
    reply.code(201).send(user);
  }

  static async getAll(request: FastifyRequest, reply: FastifyReply) {
    const users = await UserService.getAllUsers();
    reply.send(users);
  }

  static async getById(request: FastifyRequest, reply: FastifyReply) {
    const user = await UserService.getUserById(Number(request.params["id"]));
    if (!user) return reply.notFound();
    reply.send(user);
  }

  static async update(request: FastifyRequest, reply: FastifyReply) {
    const user = await UserService.updateUser(Number(request.params["id"]), request.body as any);
    reply.send(user);
  }

  static async delete(request: FastifyRequest, reply: FastifyReply) {
    await UserService.deleteUser(Number(request.params["id"]));
    reply.code(204).send();
  }
}
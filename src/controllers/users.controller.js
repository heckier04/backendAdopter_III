import { usersService } from "../services/index.js"

const getAllUsers = async (req, res, next) => {
  try {
    const users = await usersService.getAll();
    req.logger.info('Usuarios listados correctamente');
    res.send({ status: "success", payload: users });
  } catch (error) {
    req.logger.error(`Error al listar usuarios: ${error.message}`);
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if (!user) {
      req.logger.warning(`Usuario no encontrado: ${userId}`);
      return res.status(404).send({ status: "error", error: "User not found" });
    }
    req.logger.info(`Usuario obtenido: ${userId}`);
    res.send({ status: "success", payload: user });
  } catch (error) {
    req.logger.error(`Error al obtener usuario: ${error.message}`);
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const updateBody = req.body;
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if (!user) {
      req.logger.warning(`Usuario no encontrado para actualizar: ${userId}`);
      return res.status(404).send({ status: "error", error: "User not found" });
    }
    await usersService.update(userId, updateBody);
    req.logger.info(`Usuario actualizado: ${userId}`);
    res.send({ status: "success", message: "User updated" });
  } catch (error) {
    req.logger.error(`Error al actualizar usuario: ${error.message}`);
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if (!user) {
      req.logger.warning(`Usuario no encontrado para eliminar: ${userId}`);
      return res.status(404).send({ status: "error", error: "User not found" });
    }
    await usersService.delete(userId);
    req.logger.info(`Usuario eliminado: ${userId}`);
    res.send({ status: "success", message: "User deleted" });
  } catch (error) {
    req.logger.error(`Error al eliminar usuario: ${error.message}`);
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const userData = req.body;
    const newUser = await usersService.create(userData);
    req.logger.info(`Usuario creado: ${newUser.email}`);
    res.status(201).send({ status: "success", payload: newUser });
  } catch (error) {
    req.logger.error(`Error al crear usuario: ${error.message}`);
    next(error);
  }
};

export default {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
  createUser
}
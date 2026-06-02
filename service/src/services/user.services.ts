import bcrypt from "bcrypt";
import { createAccessToken } from "../libs/jwt.js";
import User from "../models/user.model.js";
import {
    createUser,
    createUserByAdmin,
    findByUsername,
    validatePassword,
    findUserById,
    getAllUserFromDB,
    getAllUserNotFilter,
    deleteUser,
    getUserById,
    updateUserById,
    updatePasswordByUsername
} from "../repository/user.repository.js";

interface IUserRecord {
    _id: string;
    name: string;
    username: string;
    email: string;
    age: number;
    role: string;
    telephone: string;
    password?: string;
    createdAt: Date;
    updatedAt: Date;
}

export class UserService {
    /**
     * Registra un nuevo usuario aplicando encriptación a la contraseña.
     */
    public async registerUser(userData: Record<string, unknown>) {
        const { username, password } = userData as Record<string, string>;

        const userFound = await User.findOne({ username });

        if (userFound) {
            throw new Error("El usuario ya existe");
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const userSave = await createUser({ ...userData, password: passwordHash }) as unknown as IUserRecord;

        return {
            user: {
                id: userSave._id,
                name: userSave.name,
                username: userSave.username,
                email: userSave.email,
                age: userSave.age,
                role: userSave.role,
                telephone: userSave.telephone,
                createAt: userSave.createdAt,
                updateAt: userSave.updatedAt
            }
        };
    }

    /**
     * Registra un usuario desde el panel de administración.
     */
    public async registerUserByAdmin(userData: Record<string, unknown>) {
        const { username, password } = userData as Record<string, string>;

        const userFound = await User.findOne({ username });

        if (userFound) {
            throw new Error("El usuario ya existe");
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const userSave = await createUserByAdmin({ ...userData, password: passwordHash }) as unknown as IUserRecord;

        return {
            user: {
                id: userSave._id,
                name: userSave.name,
                username: userSave.username,
                email: userSave.email,
                age: userSave.age,
                role: userSave.role,
                telephone: userSave.telephone,
                createAt: userSave.createdAt,
                updateAt: userSave.updatedAt
            }
        };
    }

    /**
     * Autentica un usuario verificando credenciales y generando JWT.
     */
    public async authUser(username: unknown, password: unknown) {
        console.log("-> Intentando hacer login con username:", username);
        const user = await findByUsername(username as string) as unknown as IUserRecord;

        if (!user) {
            console.error("-> Error de Login: Usuario no encontrado en la base de datos.");
            throw new Error("Usuario no encontrado");
        }

        const passwordValid = await validatePassword(password as string, user.password as string);

        if (!passwordValid) {
            console.error("-> Error de Login: Contraseña incorrecta para el usuario", username);
            throw new Error("Datos incorrectos");
        }

        console.log("-> Login exitoso para el usuario:", username);
        const token = await createAccessToken({ id: user._id });

        return {
            token,
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                age: user.age,
                role: user.role,
                telephone: user.telephone,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        };
    }

    /**
     * Obtiene el perfil de un usuario por su ID.
     */
    public async getUserProfile(userId: unknown) {
        const user = await findUserById(userId as string) as unknown as IUserRecord;

        if (!user) {
            throw new Error("Usuario no encontrado");
        }
        return user;
    }

    /**
     * Obtiene usuarios (excepto administradores) y los formatea.
     */
    public async selectUsers() {
        try {
            const users = await getAllUserFromDB() as unknown as IUserRecord[];

            if (users.length === 0) {
                throw new Error("No se encontraron usuarios");
            }

            const filterUser = users.filter((user) => user.role !== "admin");

            return filterUser.map((user) => ({
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            }));
        } catch (error: unknown) {
            const err = error as Error;
            throw new Error(err.message || "Error en el servicio de usuarios");
        }
    }

    /**
     * Obtiene todos los usuarios sin filtros.
     */
    public async selectUsersNotFilter() {
        try {
            const users = await getAllUserNotFilter() as unknown as IUserRecord[];

            if (users.length === 0) {
                throw new Error("No se encontraron usuarios");
            }

            return users.map((user) => ({
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            }));
        } catch (error: unknown) {
            const err = error as Error;
            throw new Error(err.message || "Error en el servicio de usuarios");
        }
    }

    /**
     * Elimina un usuario por ID.
     */
    public async dropUser(id: unknown) {
        const user = await deleteUser(id as string);
        if (!user) {
            throw new Error("Usuario no encontrado");
        }
        return user;
    }

    /**
     * Obtiene un usuario por ID.
     */
    public async selectUserProfile(id: unknown) {
        const profile = await getUserById(id as string);

        if (!profile) {
            throw new Error("Usuario no encontrado");
        }
        return profile;
    }

    /**
     * Actualiza un usuario incluyendo el proceso de encriptación si cambia contraseña.
     */
    public async updateUserProfile(id: unknown, updateData: Record<string, unknown>) {
        if (updateData.password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(updateData.password as string, salt);
        }

        const updateProfile = await updateUserById(id as string, updateData);

        if (!updateProfile) {
            throw new Error("Usuario no encontrado");
        }
        return updateProfile;
    }

    /**
     * Cambia la contraseña de un usuario usando su username.
     */
    public async changePassword(username: unknown, newPassword: unknown) {
        const user = await findByUsername(username as string);

        if (!user) {
            throw new Error("Usuario no encontrado");
        }

        const hashedPassword = await bcrypt.hash(newPassword as string, 10);
        const updatedUser = await updatePasswordByUsername(username as string, hashedPassword) as unknown as IUserRecord;

        return {
            message: "Contraseña actualizada correctamente",
            updatedAt: updatedUser.updatedAt
        };
    }
}

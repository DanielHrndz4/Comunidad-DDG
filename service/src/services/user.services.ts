import bcrypt from "bcrypt";
import { createAccessToken } from "../libs/jwt.js";
import User from "../models/user.model.js";
import { sendOtpEmail, sendResetOtpEmail } from "../libs/nodemailer.js";
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
    age?: number;
    role: string;
    telephone: string;
    password?: string;
    isVerified?: boolean;
    otpCode?: string;
    otpExpires?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export class UserService {
    /**
     * Registra un nuevo usuario aplicando encriptación a la contraseña.
     */
    public async registerUser(userData: Record<string, unknown>) {
        const { username, email, password } = userData as Record<string, string>;

        const userFound = await User.findOne({ username });
        if (userFound) {
            throw new Error("El usuario ya existe");
        }

        const emailFound = await User.findOne({ email });
        if (emailFound) {
            throw new Error("El correo ya está en uso");
        }

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        const passwordHash = await bcrypt.hash(password, 10);
        const userSave = await createUser({
            ...userData,
            password: passwordHash,
            isVerified: false,
            otpCode,
            otpExpires
        }) as unknown as IUserRecord;

        // Send OTP email asynchronously, catch to prevent registration failure
        sendOtpEmail(email, otpCode).catch((err) => {
            console.error("Error al enviar correo OTP en el registro:", err);
        });

        return {
            user: {
                id: userSave._id,
                name: userSave.name,
                username: userSave.username,
                email: userSave.email,
                age: userSave.age,
                role: userSave.role,
                telephone: userSave.telephone,
                isVerified: false,
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

        if (userData.role === "admin") {
            const adminCount = await User.countDocuments({ role: "admin" });
            if (adminCount >= 1) {
                throw new Error("Solo puede existir un administrador en el sistema.");
            }
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const userSave = await createUserByAdmin({
            ...userData,
            password: passwordHash,
            isVerified: true
        }) as unknown as IUserRecord;

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

        if (user.isVerified === false) {
            console.error("-> Error de Login: Cuenta no verificada para el usuario", username);
            throw new Error("Cuenta no verificada. Por favor verifica tu correo.");
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
     * Verifica el código OTP de un usuario.
     */
    public async verifyOtp(email: string, otp: string) {
        const user = await User.findOne({ email });

        if (!user) {
            throw new Error("Usuario no encontrado");
        }

        if (user.isVerified) {
            return { message: "La cuenta ya ha sido verificada" };
        }

        if (user.otpCode !== otp) {
            throw new Error("Código OTP incorrecto");
        }

        if (user.otpExpires && new Date() > user.otpExpires) {
            throw new Error("El código OTP ha expirado");
        }

        user.isVerified = true;
        user.otpCode = undefined;
        user.otpExpires = undefined;
        await user.save();

        return { message: "Cuenta verificada exitosamente" };
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

            return users.map((user) => ({
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role,
                telephone: user.telephone,
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
                role: user.role,
                telephone: user.telephone,
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

        if (updateData.role === "admin") {
            const adminCount = await User.countDocuments({ role: "admin", _id: { $ne: id } });
            if (adminCount >= 1) {
                throw new Error("Solo puede existir un administrador en el sistema.");
            }
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

    /**
     * Solicita reestablecer la contraseña enviando un código OTP al correo del usuario.
     */
    public async requestPasswordReset(emailOrUsername: string) {
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Atomic update — faster than find + mutate + save
        const user = await User.findOneAndUpdate(
            { $or: [{ email: emailOrUsername }, { username: emailOrUsername }] },
            { $set: { otpCode, otpExpires } },
            { new: true }
        );

        if (!user) {
            throw new Error("Usuario no encontrado");
        }

        // Fire-and-forget: respond immediately, email is sent in background
        sendResetOtpEmail(user.email, otpCode).catch((err) => {
            console.error("Error al enviar correo de recuperación:", err);
        });

        return { message: "Código OTP enviado al correo del usuario", email: user.email };
    }

    /**
     * Confirma el restablecimiento de contraseña con el código OTP.
     */
    public async confirmPasswordReset(emailOrUsername: string, otp: string, newPassword: unknown) {
        // Find and validate OTP before hashing (fail fast)
        const user = await User.findOne({
            $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
        }).select("otpCode otpExpires");

        if (!user) {
            throw new Error("Usuario no encontrado");
        }

        if (user.otpCode !== otp) {
            throw new Error("Código OTP incorrecto");
        }

        if (user.otpExpires && new Date() > user.otpExpires) {
            throw new Error("El código OTP ha expirado");
        }

        // Hash with rounds=8 (good balance for recovery; original login still uses 10)
        const hashedPassword = await bcrypt.hash(newPassword as string, 8);

        // Atomic update — clears OTP and sets password in one round-trip
        await User.updateOne(
            { _id: user._id },
            { $set: { password: hashedPassword }, $unset: { otpCode: "", otpExpires: "" } }
        );

        return { message: "Contraseña restablecida exitosamente" };
    }
}

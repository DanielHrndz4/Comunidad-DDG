export interface LoginFormData {
    username: string;
    password: string;
}

export interface RegisterFormData {
    name: string;
    username: string;
    email: string;
    telephone: string;
    age?: number;
    role: string;
    password: string;
    confirmPassword: string;
}

export interface RegisterPayload {
    name: string;
    username: string;
    email: string;
    telephone: string;
    age?: number;
    role: string;
    password: string;
}

export interface AuthModalProps {
    onClose: () => void;
}
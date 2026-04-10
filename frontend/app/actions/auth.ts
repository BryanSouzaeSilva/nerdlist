"use server";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function registerUser(formData: FormData) {
    const name = formData.get("name") as string;
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !password || !username) {
        return { error: "Preencha todos os campos." };
    }

    const existingUser = await prisma.user.findFirst({
        where: {
        OR: [{ email }, { username }]
        }
    });

    if (existingUser) {
        return { error: "E-mail ou Nome de Usuário já em uso." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
    await prisma.user.create({
        data: {
            name,
            username,
            email,
            password: hashedPassword,
        },
        });
        return { success: true };
    } catch (error) {
        console.error("Erro no banco ao criar usuário:", error);
        return { error: "Erro ao criar conta." };
    }
}
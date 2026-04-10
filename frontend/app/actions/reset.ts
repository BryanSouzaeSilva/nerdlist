"use server";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const prisma = new PrismaClient();

export async function generateResetToken(formData: FormData) {
    const email = formData.get("email") as string;

    if (!email) return { error: "E-mail obrigatório." };

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { error: "Se esse e-mail existir, um link foi enviado." };

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    await prisma.passwordResetToken.deleteMany({ where: { email } });

    await prisma.passwordResetToken.create({
        data: { email, token, expires }
    });

    const resetLink = `http://localhost:3000/nova-senha?token=${token}`;
    console.log("\n=======================================");
    console.log("🚀 EMAIL DE RECUPERAÇÃO ENVIADO PARA:", email);
    console.log("👉 LINK DE ACESSO:", resetLink);
    console.log("=======================================\n");

    return { success: true };
}

export async function resetPassword(token: string, formData: FormData) {
    const password = formData.get("password") as string;
    if (!password) return { error: "Senha obrigatória." };

    const existingToken = await prisma.passwordResetToken.findUnique({ where: { token } });
    
    if (!existingToken) return { error: "Token inválido ou não existe." };
    if (new Date(existingToken.expires) < new Date()) return { error: "Token expirado." };

    const user = await prisma.user.findUnique({ where: { email: existingToken.email } });
    if (!user) return { error: "Usuário não encontrado." };

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
    });

    await prisma.passwordResetToken.delete({ where: { id: existingToken.id } });

    return { success: true };
}
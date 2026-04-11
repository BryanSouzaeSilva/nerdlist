"use server";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Resend } from "resend";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

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

    try {
        await resend.emails.send({
        from: "NerdList <onboarding@resend.dev>",
        to: email,
        subject: "NerdList - Recuperação de Senha",
        html: `
            <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; background-color: #171717; color: #fff; border-radius: 8px;">
            <h2 style="color: #10b981;">Recuperação de Acesso</h2>
            <p style="color: #d4d4d4;">Você solicitou a recuperação de senha para a sua conta no NerdList.</p>
            <p style="color: #d4d4d4;">Clique no botão abaixo para criar uma nova senha. Este link expira em 1 hora.</p>
            <a href="${resetLink}" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: #10b981; color: #171717; text-decoration: none; font-weight: bold; border-radius: 6px;">
                Criar Nova Senha
            </a>
            <p style="color: #737373; font-size: 12px; margin-top: 40px;">Se você não solicitou isso, pode ignorar este e-mail em segurança.</p>
            </div>
        `,
        });

        return { success: true };
    } catch (error) {
        console.error("Erro ao enviar e-mail:", error);
        return { error: "Ocorreu um erro ao tentar enviar o e-mail." };
    }
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
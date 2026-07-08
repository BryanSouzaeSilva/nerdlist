import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../app/login/page';

// --- MOCKS GLOBAIS ---

// 1. MOCK DO NEXT-AUTH
const mockSignIn = jest.fn();
jest.mock('next-auth/react', () => ({
    signIn: (...args: unknown[]) => mockSignIn(...args)
}));

// 2. MOCK DO NEXT/NAVIGATION
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        refresh: jest.fn()
    }),
    useSearchParams: () => ({
        get: jest.fn(() => null) // Retorna null para simular nenhuma query na URL
    })
}));

// 3. MOCK GLOBAL DO LUCIDE-REACT (Garante dinamicamente qualquer ícone do pacote)
jest.mock('lucide-react', () => {
    return new Proxy({}, {
        get: (target, prop) => {
            // Cria uma função de componente válida para qualquer ícone invocado (ex: Mail, Lock, Key, etc)
            return function MockIcon(props: React.SVGProps<SVGSVGElement>) {
                return <svg data-testid={`mock-icon-${String(prop)}`} {...props} />;
            };
        }
    });
});

describe('Página de Login (Integração)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve exibir mensagem de erro se a Server Action de credenciais falhar', async () => {
        mockSignIn.mockResolvedValueOnce({
            error: 'CredentialsSignin',
            status: 200,
            ok: false,
            url: null
        });

        render(<LoginPage />);

        const emailInput = screen.getByPlaceholderText('seu@email.com');
        const passwordInput = screen.getByPlaceholderText('••••••••');

        fireEvent.change(emailInput, { target: { value: 'usuario@errado.com' } });
        fireEvent.change(passwordInput, { target: { value: 'senha123' } });

        const submitButton = screen.getByRole('button', { name: /acessar cofre/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/e-mail ou senha incorretos/i)).toBeInTheDocument();
        });
    });
});
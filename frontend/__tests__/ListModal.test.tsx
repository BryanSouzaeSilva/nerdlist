import React from 'react';
// 1. Adicionamos o waitFor na importação
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ListModal from '../app/components/ListModal';
import { MediaItem } from '../app/types/media-item';

// --- MOCKS GLOBAIS ---

jest.mock('lucide-react', () => ({
    X: () => <span data-testid="mock-icon-x">X</span>,
    Star: () => <span data-testid="mock-icon-star">Star</span>,
    Loader2: () => <span data-testid="mock-icon-loader">Loader</span>
}));

describe('Componente ListModal (Integração)', () => {
    const mockItem = {
        id: '123',
        title: 'God of War Ragnarök',
        type: 'GAME',
        posterUrl: '/gow.jpg',
        releaseDate: '2022-11-09'
    } as unknown as MediaItem;

    const mockOnClose = jest.fn();
    const mockOnSave = jest.fn();
    const mockOnRemove = jest.fn();
    const mockOnTogglePin = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve renderizar as informações da mídia e o título corretamente', () => {
        render(
            <ListModal
                isOpen={true}
                onClose={mockOnClose}
                item={mockItem}
                isPinned={false}
                onSave={mockOnSave}
                onRemove={mockOnRemove}
                onTogglePin={mockOnTogglePin}
            />
        );

        expect(screen.getByText('God of War Ragnarök')).toBeInTheDocument();
        expect(screen.getByText('Estou Jogando')).toBeInTheDocument();
    });

    it('deve disparar a função onSave com o status correto ao clicar em Concluído', async () => {
        render(
            <ListModal
                isOpen={true}
                onClose={mockOnClose}
                item={mockItem}
                isPinned={false}
                onSave={mockOnSave}
                onRemove={mockOnRemove}
                onTogglePin={mockOnTogglePin}
            />
        );

        const completedButton = screen.getByText('Concluído');
        
        // Dispara o clique
        fireEvent.click(completedButton);

        // 2. O waitFor diz: "Espere até que esta afirmação seja verdadeira (dando tempo pro finally rodar)"
        await waitFor(() => {
            expect(mockOnSave).toHaveBeenCalledTimes(1);
        });
        
        expect(mockOnSave).toHaveBeenCalledWith('COMPLETED');
    });
});
import React from 'react';
import { render, screen } from '@testing-library/react';
import SavedBadge from '../app/components/SaveBadge'; // Ajuste o caminho se o seu arquivo estiver em outro local

describe('Componente SavedBadge', () => {
    
    it('deve renderizar o texto "Jogando" corretamente para um jogo em andamento', () => {
        // 1. Renderiza o componente no ambiente virtual (JSDOM)
        render(<SavedBadge type="GAME" status="IN_PROGRESS" />);
        
        // 2. Tenta localizar o texto na tela simulada
        const badgeElement = screen.getByText('Jogando');
        
        // 3. Afirma que ele deve estar presente no documento
        expect(badgeElement).toBeInTheDocument();
    });

    it('não deve renderizar absolutamente nada se o status for nulo ou indefinido', () => {
        // 1. Renderiza o componente sem status
        const { container } = render(<SavedBadge type="MOVIE" status={null} />);
        
        // 2. Afirma que o container HTML gerado está completamente vazio
        expect(container.firstChild).toBeNull();
    });
});
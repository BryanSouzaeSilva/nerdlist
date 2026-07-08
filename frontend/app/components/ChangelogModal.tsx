"use client";

import React from 'react';
import { Shield, CheckCircle, Clock, Zap, AlertCircle } from 'lucide-react';

interface ChangelogModalProps {
    isOpen: boolean;
    onClose: () => void;
}

    export default function ChangelogModal({ isOpen, onClose }: ChangelogModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[85vh]">
                
                {/* Cabeçalho */}
                <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
                <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-500">
                    <Shield className="w-6 h-6" />
                    </div>
                        <div>
                            <h2 className="text-xl font-black text-white uppercase tracking-wider">NerdList Update</h2>
                            <p className="text-xs text-gray-400">Versão Atual: <span className="text-emerald-500 font-bold">v0.3.0-infra</span></p>
                        </div>
                    </div>

                    {/* Corpo das Notas */}
                    <div className="space-y-6">
                
                    {/* Seção 1: O que mudou */}
                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-3">
                        <CheckCircle className="w-4 h-4 text-emerald-500" /> O que há de novo (Segurança & Infra)
                        </h3>
                        <ul className="space-y-2.5 text-sm text-gray-400 pl-6 list-disc marker:text-emerald-500">
                        <li>
                            <strong className="text-gray-200">Motor de Testes Jest:</strong> Ambiente totalmente configurado com React Testing Library para simular cenários de comportamento reais de forma virtual.
                        </li>
                        <li>
                            <strong className="text-gray-200">Blindagem do ListModal:</strong> Testes de integração robustos cobrindo o fluxo de cliques de alteração de status e garantindo as travas anti-duplo clique (`isLoading`).
                        </li>
                        <li>
                            <strong className="text-gray-200">Mocks Dinâmicos Inteligentes:</strong> Implementação de barreira por <code className="bg-neutral-950 px-1 py-0.5 rounded text-emerald-400 text-xs">Proxy</code> para anular erros com pacotes de SVGs externos (Lucide React) no terminal.
                        </li>
                        <li>
                            <strong className="text-gray-200">Integração do Sentry:</strong> Injeção do SDK oficial para monitoramento de telemetria, captura automática de erros assíncronos e Session Replays em produção.
                        </li>
                        </ul>
                    </div>

                    {/* Seção 2: Próxima Sprint */}
                    <div className="bg-neutral-950/50 border border-white/5 rounded-xl p-4">
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-amber-500" /> Próxima Sprint
                        </h3>
                        <p className="text-sm text-gray-500 italic pl-6">
                        Em breve...
                        </p>
                    </div>

                </div>

                {/* Botão de Fechar */}
                <div className="mt-8 pt-4 border-t border-white/10 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black px-6 py-2.5 rounded-xl text-sm transition-all uppercase tracking-wider"
                    >
                        Entendido
                    </button>
                </div>

            </div>
        </div>
    );
}
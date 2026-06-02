/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { X, Shield, FileText, RefreshCw, Truck, Search, HelpCircle, MapPin, BadgePercent } from "lucide-react";

export type LegalTab = "terms" | "privacy" | "refund" | "tracking";

interface LegalPagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LegalTab;
}

export default function LegalPagesModal({ isOpen, onClose, initialTab = "terms" }: LegalPagesModalProps) {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);
  const [trackingCode, setTrackingCode] = useState("");
  const [trackingResult, setTrackingResult] = useState<{
    found: boolean;
    status: string;
    step: number;
    updates: { date: string; status: string; location: string }[];
  } | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Sync activeTab when modal is opened on a specific tab
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingCode.trim()) return;

    setIsSearching(true);
    // Simulate real tracking lookup
    setTimeout(() => {
      setIsSearching(false);
      setTrackingResult({
        found: true,
        status: "Em Trânsito - Encaminhado para a Unidade Distribuidora",
        step: 2,
        updates: [
          {
            date: "Hoje às 10:24",
            status: "Objeto encaminhado para triagem regional",
            location: "Centro de Distribuição Integrada - São Paulo SP",
          },
          {
            date: "Ontem às 14:15",
            status: "Objeto postado pela loja oficial",
            location: "Centro de Distribuição Logística - Barueri SP",
          },
          {
            date: "Ontem às 09:30",
            status: "Pagamento confirmado e Nota Fiscal emitida",
            location: "Jordan x Brasil Outlet",
          },
        ],
      });
    }, 850);
  };

  const tabs = [
    { id: "terms", label: "Termos de Uso", icon: FileText },
    { id: "privacy", label: "Privacidade", icon: Shield },
    { id: "refund", label: "Reembolso", icon: RefreshCw },
    { id: "tracking", label: "Rastreio", icon: Truck },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#090d16] border border-white/10 rounded-2xl shadow-[0_30px_70px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[85vh] animate-scale-in">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 shrink-0">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-sm sm:text-base tracking-widest text-[#FFD400] font-mono uppercase">
              PORTAL DO CLIENTE
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-white/10 overflow-x-auto shrink-0 scrollbar-none bg-black/35">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setTrackingResult(null);
                  setTrackingCode("");
                }}
                className={`flex items-center space-x-2 px-5 py-4 border-b-2 text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap grow text-center justify-center ${
                  isActive
                    ? "border-[#FFD400] text-[#FFD400] bg-white/[0.02]"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#FFD400]" : "text-gray-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area (Scrollable) */}
        <div className="overflow-y-auto p-6 space-y-6 text-gray-300 font-normal leading-relaxed text-sm">
          
          {/* TAB 1: TERMS */}
          {activeTab === "terms" && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="border-l-2 border-[#FFD400] pl-4">
                <h3 className="text-lg font-black text-white uppercase font-sans tracking-wide">Termos de Uso e Serviço</h3>
                <p className="text-xs text-gray-500 mt-1">Última atualização: Junho de 2026</p>
              </div>

              <div className="space-y-4">
                <p>
                  Bem-vindo ao portal de vendas oficial do <strong>Manto Jordan x Brasil</strong>. Ao acessar e efetuar compras em nosso site, você concorda expressamente e aceita vincular-se aos termos e condições estipulados a seguir.
                </p>

                <h4 className="text-white font-bold uppercase text-xs tracking-wider mt-5">1. Objeto do Serviço</h4>
                <p className="text-xs sm:text-sm text-gray-400">
                  O presente site destina-se à intermediação de vendas e comercialização de vestuário esportivo premium especializado, em edições limitadas nacionais e importadas. Toda compra é protegida por nota fiscal eletrônica e garantia de satisfação.
                </p>

                <h4 className="text-white font-bold uppercase text-xs tracking-wider mt-5">2. Políticas de Preço e Desconto</h4>
                <p className="text-xs sm:text-sm text-gray-400">
                  Reservamo-nos o direito de alterar os preços, combos promocionais (como o Combo Especial de 2 mantos por R$ 199,90) e cupons de descontos sem aviso prévio. Os preços anunciados durante o cronômetro oficial de oferta na página principal serão honrados se finalizados dentro do período estabelecido.
                </p>

                <h4 className="text-white font-bold uppercase text-xs tracking-wider mt-5">3. Propriedade Intelectual</h4>
                <p className="text-xs sm:text-sm text-gray-400">
                  O design da página, as fotografias originais tiradas em estúdio de nossos produtos (Manto Jordan x Brasil em seus diferentes ângulos), logotipos e textos são propriedades exclusivas protegidas pelas leis vigentes de direitos autorais. Reproduções não autorizadas serão tratadas conforme medidas legais federais.
                </p>

                <h4 className="text-white font-bold uppercase text-xs tracking-wider mt-5">4. Elegibilidade e Cadastro</h4>
                <p className="text-xs sm:text-sm text-gray-400">
                  Para efetuar compras em nosso ecossistema de Checkout seguro, o cliente declara ser maior de idade civil ou estar devidamente assessorado, fornecendo dados pessoais verídicos (nome completo, e-mail, telefone celular para atualizações do WhatsApp de rastreio e CPF ativo para fins de faturamento fiscal).
                </p>

                <h4 className="text-white font-bold uppercase text-xs tracking-wider mt-5">5. Legislação Aplicável</h4>
                <p className="text-xs sm:text-sm text-gray-400">
                  Estes termos são regidos inteiramente com base nas diretrizes do Código de Defesa do Consumidor (Lei Federal nº 8.078/1990) e legislações vigentes brasileiras.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: PRIVACY */}
          {activeTab === "privacy" && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="border-l-2 border-[#FFD400] pl-4">
                <h3 className="text-lg font-black text-white uppercase font-sans tracking-wide">Diretrizes de Privacidade e LGPD</h3>
                <p className="text-xs text-gray-500 mt-1">Última atualização: Junho de 2026</p>
              </div>

              <div className="space-y-4">
                <p>
                  Sua privacidade e segurança de dados são pilares inegociáveis para a nossa marca. Esta seção detalha como coletamos, tratamos e vedamos o compartilhamento de suas informações pessoais sob a égide da Lei Geral de Proteção de Dados (LGPD).
                </p>

                <h4 className="text-white font-bold uppercase text-xs tracking-wider mt-5">1. Transparência de Dados Coletados</h4>
                <p className="text-xs sm:text-sm text-gray-400">
                  Para emitir seu faturamento e garantir a logística rápida de postagem do manto, coletamos de forma estritamente segura: Nome, E-mail, Celular (para recebimento de código de rastreamento via WhatsApp), CPF e seu Endereço completo de entrega.
                </p>

                <h4 className="text-white font-bold uppercase text-xs tracking-wider mt-5">2. Segurança do Checkout & SSL</h4>
                <p className="text-xs sm:text-sm text-gray-400">
                  Todas as transferências de dados de pagamento ocorrem de forma privada criptografada por meio do protocolo HTTPS/SSL de 128 Bits. Informações de cartões de crédito jamais são arquivadas em nossos servidores - o processamento é direto nas credenciadas financeiras de alta segurança.
                </p>

                <h4 className="text-white font-bold uppercase text-xs tracking-wider mt-5">3. Não Compartilhamento</h4>
                <p className="text-xs sm:text-sm text-gray-400">
                  Garantimos formalmente o compromisso de nunca vender, expor, ou transferir quaisquer dados de cadastro a terceiros não associados ou parceiros publicitários externos. Suas informações são exclusivamente empregadas para a operacionalização logística do seu pedido.
                </p>

                <h4 className="text-white font-bold uppercase text-xs tracking-wider mt-5">4. Seus Direitos</h4>
                <p className="text-xs sm:text-sm text-gray-400">
                  A qualquer momento, o titular pode entrar em contato com o nosso e-mail oficial (<strong>sac@manto-jordan-brasil.com</strong>) para requerer a alteração, checagem ou exclusão definitiva de seus dados cadastrais.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: REFUND */}
          {activeTab === "refund" && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="border-l-2 border-[#FFD400] pl-4">
                <h3 className="text-lg font-black text-white uppercase font-sans tracking-wide">Políticas de Reembolsos e Trocas</h3>
                <p className="text-xs text-gray-500 mt-1">Garantia Absoluta Despreocupada</p>
              </div>

              <div className="space-y-4">
                <div className="bg-[#FFD400]/5 border border-dashed border-[#FFD400]/30 rounded-xl p-4 flex gap-3 items-start">
                  <Shield className="w-5 h-5 text-[#FFD400] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-[#FFD400] font-black uppercase font-mono tracking-wider block">Garantia Blindada de 7 Dias:</span>
                    <span className="text-xs text-gray-300">
                      Segundo o Art. 49 do Código de Defesa do Consumidor, você tem até 7 dias corridos após o recebimento do produto para solicitar a devolução total e reembolso integral caso não se sinta 100% satisfeito, sem qualquer burocracia.
                    </span>
                  </div>
                </div>

                <h4 className="text-white font-bold uppercase text-xs tracking-wider mt-5">1. Trocas por Tamanho Sem Custo</h4>
                <p className="text-xs sm:text-sm text-gray-400">
                  Caso o Manto passe das medidas escolhidas ou fique apertado/largo, garantimos a primeira troca totalmente sem custo algum. Nós enviamos o código de logística reversa para envio gratuito do produto e despachamos o novo tamanho imediatamente.
                </p>

                <h4 className="text-white font-bold uppercase text-xs tracking-wider mt-5">2. Condições para Devolução ou Troca</h4>
                <p className="text-xs sm:text-sm text-gray-400">
                  O produto deverá ser devolvido sem marcas indeléveis de uso, lavagem ou danos acidentais, na embalagem protetora correspondente com as devidas etiquetas de fiação e logos afixados.
                </p>

                <h4 className="text-white font-bold uppercase text-xs tracking-wider mt-5">3. Prazos e Processo Financeiro</h4>
                <p className="text-xs sm:text-sm text-gray-400">
                  <strong>PIX:</strong> Reembolsos em carteira Pix são efetuados em até 2 horas úteis após a conferência inicial de chegada do produto de volta ao CD.<br />
                  <strong>Cartão de Crédito:</strong> O estorno é solicitado em nossa integradora de imediato e constará na sua fatura em até 1 a 2 faturas subsequentes, conforme prazos de fechamento do banco emissor.
                </p>

                <h4 className="text-white font-bold uppercase text-xs tracking-wider mt-5">Como Iniciar o Processo?</h4>
                <p className="text-xs sm:text-sm text-gray-400">
                  Envie uma mensagem em nosso suporte do WhatsApp Oficial ou e-mail <strong>sac@manto-jordan-brasil.com</strong> com o número do seu pedido e nós assumiremos todo o fluxo operacional para te auxiliar de imediato.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: TRACKING */}
          {activeTab === "tracking" && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="border-l-2 border-[#FFD400] pl-4">
                <h3 className="text-lg font-black text-white uppercase font-sans tracking-wide">Rastreamento de Objetos</h3>
                <p className="text-xs text-gray-500 mt-1">Acompanhe seu Manto em Tempo Real</p>
              </div>

              <div className="space-y-4">
                <p className="text-gray-350">
                  Nós valorizamos a agilidade na entrega e a transparência máxima com os nossos compradores. Assim que seu pedido é aprovado, ele passa para triagem e postagem em nosso CD.
                </p>

                {/* Tracking Info Alert */}
                <div className="bg-slate-900 border border-white/5 rounded-xl p-4 space-y-2.5">
                  <div className="flex items-center space-x-2 text-emerald-400">
                    <Truck className="w-5 h-5 shrink-0" />
                    <span className="text-xs font-extrabold uppercase tracking-wider">Como funciona o nosso Rastreio?</span>
                  </div>
                  <ul className="text-xs text-gray-400 space-y-2 list-disc pl-4 leading-relaxed font-medium">
                    <li>
                      <b className="text-white">Envio Automático:</b> Assim que o pacote é expedido no centro de triagem, enviamos de forma automática o seu <b className="text-white">código de rastreio</b> de 13 dígitos para o seu endereço de <b className="text-[#FFD400]">e-mail</b> e para o seu <b className="text-emerald-400">WhatsApp cadastrado</b>.
                    </li>
                    <li>
                      <b className="text-white">Links Oficiais:</b> Junto com seu código, você recebe o link direto dos sistemas integrados nacionais para rastrear o status e a proximidade logística de seu pedido a qualquer hora.
                    </li>
                    <li>
                      <b className="text-white">Parcerias Logísticas:</b> Sempre priorizamos eficiência de prazo. Trabalhamos em forte sinergia com os <b className="text-[#FFD400]">principais métodos de entrega disponíveis no país</b> (Correios Sedex/PAC expresso, Loggi corporativo, Jadlog rodoviário), selecionando automaticamente a transportadora mais rápida e eficaz para o endereço cadastrado do cliente.
                    </li>
                  </ul>
                </div>

                {/* Real interactive form for testing / checking code */}
                <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-4">
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">Verifique o status do pedido de teste:</h4>
                    <span className="text-[10px] text-gray-500 block mt-0.5">Use o código de exemplo <b className="text-[#FFD400] font-mono">JB778401392BR</b> para simular seu fluxo.</span>
                  </div>

                  <form onSubmit={handleTrackSubmit} className="flex gap-2">
                    <input
                      type="text"
                      value={trackingCode}
                      onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                      placeholder="Ex: JB778401392BR"
                      className="bg-black/65 border border-white/10 text-white font-mono uppercase tracking-widest text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-[#FFD400] grow"
                    />
                    <button
                      type="submit"
                      disabled={isSearching}
                      className="bg-[#FFD400] text-black font-black text-xs px-5 py-3 rounded-xl transition-all hover:scale-105 hover:brightness-110 active:scale-95 disabled:opacity-50 flex items-center gap-1.5 shrink-0 cursor-pointer uppercase"
                    >
                      {isSearching ? (
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Search className="w-4 h-4" />
                          <span>Buscar</span>
                        </>
                      )}
                    </button>
                  </form>

                  {/* Tracking result display */}
                  {trackingResult && (
                    <div className="border-t border-white/5 pt-4 space-y-4 animate-scale-in">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-500 font-mono">STATUS DO PACOTE</span>
                        <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                          ✓ EM TRÂNSITO LOGÍSTICO
                        </span>
                      </div>

                      {/* Timeline Steps */}
                      <div className="relative border-l-2 border-[#FFD400]/25 ml-3 pl-5 space-y-4 text-xs font-medium">
                        {trackingResult.updates.map((update, idx) => (
                          <div key={idx} className="relative">
                            <span className={`absolute -left-[27px] top-0.5 w-3 h-3 rounded-full border-2 ${idx === 0 ? "bg-[#FFD400] border-[#FFD400]" : "bg-slate-900 border-white/10"}`} />
                            <div className="space-y-0.5">
                              <span className="text-[10px] text-[#FFD400] font-mono leading-none block">{update.date}</span>
                              <h5 className="font-extrabold text-white text-[13px] leading-tight mt-0.5">{update.status}</h5>
                              <span className="text-[11px] text-gray-500 font-mono flex items-center gap-1.5 mt-1">
                                <MapPin className="w-3.5 h-3.5" />
                                <span>{update.location}</span>
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Footer Area with info text */}
        <div className="bg-black/45 border-t border-white/10 p-4 sm:p-5 text-center shrink-0">
          <span className="text-[10px] font-mono text-gray-500 tracking-wider block uppercase">
            ✉ Precisa de assistência com sua expedição? Escreva para sac@manto-jordan-brasil.com
          </span>
        </div>

      </div>
    </div>
  );
}

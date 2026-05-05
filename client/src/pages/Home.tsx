import { Search } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { properties } from "@/lib/properties";
import { toast } from "sonner";

export default function Home() {
  const [searchCode, setSearchCode] = useState("");
  const [, setLocation] = useLocation();

  const handleSearch = () => {
    const trimmedCode = searchCode.trim().toUpperCase();

    if (!trimmedCode) {
      toast.error("Digite um código para buscar");
      return;
    }

    const property = properties.find((p) => p.code === trimmedCode);

    if (property) {
      setSearchCode("");
      setLocation(`/imoveis/${property.id}`);
    } else {
      toast.error(`Imóvel com código "${trimmedCode}" não encontrado`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      
      {/* NAV */}
      <nav className="fixed top-0 w-full z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          
          <div
            className="text-sm font-extralight tracking-[0.18em] cursor-pointer flex items-center"
            onClick={() => setLocation("/")}
          >
            EXACT
            <span className="ml-0.5 text-[10px] opacity-60">.</span>
          </div>

          <div className="flex gap-10 items-center">
            <a href="/imoveis" className="text-xs font-light text-white/60 hover:text-white">
              Imóveis
            </a>
            <a href="/sobre" className="text-xs font-light text-white/60 hover:text-white">
              Sobre
            </a>
            <a href="/contato" className="text-xs font-light text-white/60 hover:text-white">
              Contato
            </a>
            <a
              href="https://wa.me/554199768371"
              target="_blank"
              className="text-xs font-light border border-white/20 px-4 py-2 rounded-sm hover:border-white/40"
            >
              Atendimento Direto
            </a>
          </div>
        </div>
      </nav>

      {/* HERO COM IMAGEM */}
      <section className="relative min-h-screen flex items-center justify-center">

        {/* IMAGEM DE FUNDO */}
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* OVERLAY ESCURO (AQUI ESTÁ O SEGREDO) */}
        <div className="absolute inset-0 bg-black/80"></div>

        {/* CONTEÚDO */}
        <div className="relative text-center max-w-4xl mx-auto px-6 flex flex-col items-center">

          <p className="text-[10px] tracking-[0.28em] text-white/40 mb-8 uppercase">
            SELEÇÃO IMOBILIÁRIA · CURITIBA
          </p>

          <h1 className="text-[52px] md:text-[72px] lg:text-[82px] font-light mb-6 leading-[1.05] tracking-[-0.04em]">
            Poucos fazem sentido.
          </h1>

          <p className="text-[15px] md:text-[18px] text-white/70 mb-12 font-light leading-relaxed">
            O resto você ignora.
            <br />
            Nós também.
          </p>

          <div className="flex gap-12">
            <a
              href="/imoveis"
              className="text-[11px] tracking-[0.22em] uppercase hover:text-white/70"
            >
              VER IMÓVEIS
            </a>

            <a
              href="/contato"
              className="text-[11px] tracking-[0.22em] uppercase hover:text-white/70"
            >
              FALAR COM A EXACT
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER SIMPLES */}
      <footer className="border-t border-white/10 py-20 text-center text-xs text-white/40 bg-black">
        © 2026 EXACT.
      </footer>
    </div>
  );
}

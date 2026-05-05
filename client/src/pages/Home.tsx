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
    <div className="bg-black text-white">

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
            <a href="/imoveis" className="text-xs text-white/60 hover:text-white">
              Imóveis
            </a>
            <a href="/sobre" className="text-xs text-white/60 hover:text-white">
              Sobre
            </a>
            <a href="/contato" className="text-xs text-white/60 hover:text-white">
              Contato
            </a>
            <a
              href="https://wa.me/554199768371"
              target="_blank"
              className="text-xs border border-white/20 px-4 py-2 rounded-sm hover:border-white/40"
            >
              Atendimento Direto
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center">

        {/* IMAGEM MELHOR (mais arquitetural, menos clichê) */}
        <img
          src="https://images.unsplash.com/photo-1600607686527-6fb886090705"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* OVERLAY CONTROLADO */}
        <div className="absolute inset-0 bg-black/85"></div>

        {/* CONTEÚDO */}
        <div className="relative text-center max-w-3xl mx-auto px-6">

          <p className="text-[10px] tracking-[0.28em] text-white/40 mb-8 uppercase">
            SELEÇÃO IMOBILIÁRIA · CURITIBA
          </p>

          {/* HEADLINE AJUSTADA */}
          <h1 className="text-[40px] md:text-[56px] lg:text-[64px] font-light mb-6 leading-[1.1] tracking-[-0.03em]">
            Poucos fazem sentido.
          </h1>

          <p className="text-[14px] md:text-[16px] text-white/70 mb-12 leading-relaxed">
            O resto você ignora.
            <br />
            Nós também.
          </p>

          <div className="flex justify-center gap-12">
            <a href="/imoveis" className="text-[11px] tracking-[0.22em] uppercase hover:text-white/70">
              VER IMÓVEIS
            </a>

            <a href="/contato" className="text-[11px] tracking-[0.22em] uppercase hover:text-white/70">
              FALAR COM A EXACT
            </a>
          </div>
        </div>
      </section>

      {/* LOCAÇÃO / AQUISIÇÃO */}
      <section className="py-24 border-t border-white/10">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12">

          <a href="/imoveis" className="group block">
            <div className="h-72 mb-6 overflow-hidden border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"
                className="w-full h-full object-cover group-hover:opacity-90"
              />
            </div>
            <h3 className="text-lg font-light">Locação</h3>
          </a>

          <a href="/imoveis" className="group block">
            <div className="h-72 mb-6 overflow-hidden border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1600585152220-90363fe7e115"
                className="w-full h-full object-cover group-hover:opacity-90"
              />
            </div>
            <h3 className="text-lg font-light">Aquisição</h3>
          </a>

        </div>
      </section>

      {/* BUSCA */}
      <section className="py-20 border-t border-white/10">
        <div className="container mx-auto px-6 max-w-xl">

          <h2 className="text-base font-light mb-6">
            Buscar por código
          </h2>

          <div className="flex gap-3">
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder="Código do imóvel"
              className="flex-1 px-4 py-3 border border-white/20 bg-black text-xs"
            />

            <button
              onClick={handleSearch}
              className="px-6 py-3 border border-white/40 text-xs"
            >
              Buscar
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-20 text-center text-xs text-white/40">
        © 2026 EXACT.
      </footer>

    </div>
  );
}

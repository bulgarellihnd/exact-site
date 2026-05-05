import { Search, Phone, Mail, MapPinIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useLocation } from "wouter";
import { properties } from "@/lib/properties";
import { toast } from "sonner";

export default function Home() {
  const [searchCode, setSearchCode] = useState("");
  const [, setLocation] = useLocation();

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAV */}
      <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm z-50 border-b border-border/20">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          
          <div
            className="text-sm font-extralight tracking-[0.18em] cursor-pointer flex items-center"
            onClick={() => setLocation("/")}
          >
            EXACT
            <span className="ml-0.5 text-[10px] opacity-60">.</span>
          </div>

          <div className="flex gap-10 items-center">
            <a href="/imoveis" className="text-xs font-light text-muted-foreground hover:text-foreground tracking-wide">
              Imóveis
            </a>
            <a href="/sobre" className="text-xs font-light text-muted-foreground hover:text-foreground tracking-wide">
              Sobre
            </a>
            <a href="/contato" className="text-xs font-light text-muted-foreground hover:text-foreground tracking-wide">
              Contato
            </a>
            <a
              href="https://wa.me/554199768371"
              target="_blank"
              className="text-xs font-light text-muted-foreground border border-border/40 px-4 py-2 rounded-sm hover:border-border/60"
            >
              Atendimento Direto
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">

        <div className="text-center max-w-4xl mx-auto px-6 flex flex-col items-center">

          <p className="text-[10px] md:text-[11px] tracking-[0.28em] text-muted-foreground/60 mb-8 uppercase">
            SELEÇÃO IMOBILIÁRIA · CURITIBA
          </p>

          <h1 className="text-[52px] md:text-[72px] lg:text-[82px] font-light mb-6 leading-[1.05] tracking-[-0.04em]">
            Poucos fazem sentido.
          </h1>

          <p className="text-[15px] md:text-[18px] text-muted-foreground/80 mb-12 font-light leading-relaxed">
            O resto você ignora.
            <br />
            Nós também.
          </p>

          <div className="flex gap-12">
            <a
              href="/imoveis"
              className="text-[11px] tracking-[0.22em] uppercase hover:text-muted-foreground"
            >
              VER IMÓVEIS
            </a>

            <a
              href="/contato"
              className="text-[11px] tracking-[0.22em] uppercase hover:text-muted-foreground"
            >
              FALAR COM A EXACT
            </a>
          </div>
        </div>
      </section>

      {/* LOCAÇÃO / AQUISIÇÃO */}
      <section className="py-20 border-t border-border/20">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12">

          <a href="/imoveis" className="group block">
            <div className="h-72 mb-6 overflow-hidden border border-border/20">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663481007953/48chfHstyxneY6QiBvkAHj/locacao-premium-SB8T9CyMbLswg9r3drbTXh.webp"
                className="w-full h-full object-cover group-hover:opacity-90"
              />
            </div>
            <h3 className="text-lg font-light">Locação</h3>
          </a>

          <a href="/imoveis" className="group block">
            <div className="h-72 mb-6 overflow-hidden border border-border/20">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663481007953/48chfHstyxneY6QiBvkAHj/aquisicao-premium-jDyVv7f4YExbawLTYJ3kud.webp"
                className="w-full h-full object-cover group-hover:opacity-90"
              />
            </div>
            <h3 className="text-lg font-light">Aquisição</h3>
          </a>

        </div>
      </section>

      {/* BUSCA */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-2xl">

          <h2 className="text-lg font-light mb-6">
            Buscar por Código
          </h2>

          <div className="flex gap-3">
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite o código do imóvel"
              className="flex-1 px-4 py-3 border border-border/40 text-xs"
            />

            <button
              onClick={handleSearch}
              className="px-6 py-3 border border-foreground/40 text-xs"
            >
              Buscar
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/20 py-20 text-center text-xs text-muted-foreground">
        © 2026 EXACT.
      </footer>
    </div>
  );
}

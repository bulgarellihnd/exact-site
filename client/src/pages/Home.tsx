// Home.tsx
// Substitua o arquivo inteiro por este código.

import { Search, Phone, Mail, MapPinIcon, Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useLocation } from "wouter";
import { properties } from "@/lib/properties";
import { toast } from "sonner";

const whatsappLink =
  "https://wa.me/5541999723780?text=Ol%C3%A1.%20Tenho%20interesse%20em%20um%20im%C3%B3vel%20da%20EXACT%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es.";

export default function Home() {
  const [searchCode, setSearchCode] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const goTo = (path: string) => {
    setMenuOpen(false);
    setLocation(path);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm z-50 border-b border-border/20">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-sm font-extralight tracking-normal cursor-pointer"
            style={{
              fontFamily:
                "'SF Pro Rounded', -apple-system, BlinkMacSystemFont, sans-serif",
              letterSpacing: "0.15em",
              fontWeight: 300,
            }}
            onClick={() => goTo("/")}
          >
            EXACT
          </motion.div>

          <div className="hidden md:flex gap-10 items-center">
            <button
              onClick={() => goTo("/imoveis")}
              className="text-xs font-light text-muted-foreground hover:text-foreground transition-colors duration-300 tracking-wide"
            >
              Imóveis
            </button>

            <button
              onClick={() => goTo("/sobre")}
              className="text-xs font-light text-muted-foreground hover:text-foreground transition-colors duration-300 tracking-wide"
            >
              Sobre
            </button>

            <button
              onClick={() => goTo("/contato")}
              className="text-xs font-light text-muted-foreground hover:text-foreground transition-colors duration-300 tracking-wide"
            >
              Contato
            </button>

            <motion.a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-light text-muted-foreground hover:text-foreground transition-colors duration-300 tracking-wide border border-border/40 hover:border-border/60 px-4 py-2 rounded-sm"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              Atendimento Direto
            </motion.a>
          </div>

          <button
            className="md:hidden text-muted-foreground"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label="Abrir menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-border/20 bg-background">
            <div className="container mx-auto px-6 py-5 flex flex-col gap-5">
              <button
                onClick={() => goTo("/imoveis")}
                className="text-left text-xs font-light text-muted-foreground tracking-wide"
              >
                Imóveis
              </button>

              <button
                onClick={() => goTo("/sobre")}
                className="text-left text-xs font-light text-muted-foreground tracking-wide"
              >
                Sobre
              </button>

              <button
                onClick={() => goTo("/contato")}
                className="text-left text-xs font-light text-muted-foreground tracking-wide"
              >
                Contato
              </button>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-light text-muted-foreground tracking-wide border border-border/40 px-4 py-3 rounded-sm w-fit"
              >
                Atendimento Direto
              </a>
            </div>
          </div>
        )}
      </nav>

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#141414]">
        <motion.div
          className="relative z-10 container mx-auto px-6 w-full text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <motion.p
            className="text-[10px] font-light tracking-[0.32em] text-white/45 uppercase mb-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            SELEÇÃO IMOBILIÁRIA · CURITIBA
          </motion.p>

          <motion.p
            className="text-[22px] md:text-[28px] font-light tracking-wide text-white/90 mb-10 leading-snug"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.8 }}
          >
            Só o que importa.
          </motion.p>

          <motion.div
            className="flex gap-4 md:gap-6 flex-wrap justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <button
              onClick={() => goTo("/imoveis")}
              className="inline-flex items-center justify-center border border-white/25 hover:border-white/50 px-6 py-3 text-white/80 hover:text-white text-[11px] font-light rounded-sm transition-all duration-300 tracking-[0.2em] uppercase"
            >
              Ver imóveis
            </button>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center border border-white/25 hover:border-white/50 px-6 py-3 text-white/80 hover:text-white text-[11px] font-light rounded-sm transition-all duration-300 tracking-[0.2em] uppercase"
            >
              Falar com a EXACT
            </a>
          </motion.div>
        </motion.div>
      </section>

      <section id="search" className="py-20 bg-background border-t border-border/20">
        <div className="container mx-auto px-6">
          <motion.div
            className="grid md:grid-cols-2 gap-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.button
              onClick={() => goTo("/imoveis?tipo=locacao")}
              variants={itemVariants}
              className="group cursor-pointer block text-left"
              whileHover={{ y: -2 }}
            >
              <div className="relative overflow-hidden mb-6 h-72 rounded-sm bg-muted/30 border border-border/20 hover:border-border/40 transition-all duration-500">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663481007953/48chfHstyxneY6QiBvkAHj/locacao-premium-SB8T9CyMbLswg9r3drbTXh.webp"
                  alt="Locação"
                  className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-500"
                />
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-light tracking-tight">Locação</h3>
                <p className="text-xs text-muted-foreground font-light leading-relaxed">
                  Imóveis selecionados para locação direta.
                </p>
              </div>
            </motion.button>

            <motion.button
              onClick={() => goTo("/imoveis?tipo=aquisicao")}
              variants={itemVariants}
              className="group cursor-pointer block text-left"
              whileHover={{ y: -2 }}
            >
              <div className="relative overflow-hidden mb-6 h-72 rounded-sm bg-muted/30 border border-border/20 hover:border-border/40 transition-all duration-500">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663481007953/48chfHstyxneY6QiBvkAHj/aquisicao-premium-jDyVv7f4YExbawLTYJ3kud.webp"
                  alt="Aquisição"
                  className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-500"
                />
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-light tracking-tight">Aquisição</h3>
                <p className="text-xs text-muted-foreground font-light leading-relaxed">
                  Aquisição de imóveis com análise e curadoria.
                </p>
              </div>
            </motion.button>
          </motion.div>
        </div>
      </section>

      <section className="pb-20 bg-background">
        <div className="container mx-auto px-6">
          <motion.div
            className="max-w-2xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.div variants={itemVariants} className="mb-8">
              <h2 className="text-lg font-light tracking-tight mb-6">
                Buscar por Código
              </h2>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-3"
            >
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Digite o código do imóvel"
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full px-4 py-3 bg-muted/20 border border-border/40 hover:border-border/60 focus:border-border/80 rounded-sm text-foreground placeholder-muted-foreground focus:outline-none transition-all duration-300 text-xs font-light"
                />

                <Search
                  size={16}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleSearch}
                className="px-6 py-3 border border-foreground/40 hover:border-foreground/60 text-foreground rounded-sm font-light text-xs transition-all duration-300 tracking-wide"
              >
                Buscar
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <footer id="contact" className="bg-background border-t border-border/20 py-24">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 md:gap-20 mb-20">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3
                className="text-sm font-extralight mb-6 tracking-normal"
                style={{
                  fontFamily:
                    "'SF Pro Rounded', -apple-system, BlinkMacSystemFont, sans-serif",
                  letterSpacing: "0.15em",
                  fontWeight: 300,
                }}
              >
                EXACT
              </h3>

              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                Curadoria imobiliária com análise precisa.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              viewport={{ once: true }}
            >
              <h4 className="font-light text-xs mb-6 tracking-wide text-muted-foreground">
                Navegação
              </h4>

              <ul className="space-y-3 text-xs text-muted-foreground">
                <li>
                  <button
                    onClick={() => goTo("/imoveis")}
                    className="hover:text-foreground transition-colors duration-300 font-light"
                  >
                    Imóveis
                  </button>
                </li>

                <li>
                  <button
                    onClick={() => goTo("/sobre")}
                    className="hover:text-foreground transition-colors duration-300 font-light"
                  >
                    Sobre
                  </button>
                </li>

                <li>
                  <button
                    onClick={() => goTo("/contato")}
                    className="hover:text-foreground transition-colors duration-300 font-light"
                  >
                    Contato
                  </button>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="font-light text-xs mb-6 tracking-wide text-muted-foreground">
                Contato
              </h4>

              <ul className="space-y-3 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Phone size={12} className="text-muted-foreground" />
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors duration-300 font-light"
                  >
                    (41) 99972-3780
                  </a>
                </li>

                <li className="flex items-center gap-2">
                  <Mail size={12} className="text-muted-foreground" />
                  <a
                    href="mailto:contato@exactbr.com"
                    className="hover:text-foreground transition-colors duration-300 font-light"
                  >
                    contato@exactbr.com
                  </a>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              viewport={{ once: true }}
            >
              <h4 className="font-light text-xs mb-6 tracking-wide text-muted-foreground">
                Localização
              </h4>

              <ul className="space-y-3 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <MapPinIcon size={12} className="text-muted-foreground" />
                  <span className="font-light">Curitiba, PR</span>
                </li>
              </ul>
            </motion.div>
          </div>

          <div className="border-t border-border/20 pt-12 text-center text-xs text-muted-foreground font-light">
            <p>&copy; 2026 EXACT. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

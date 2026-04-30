import { Button } from "@/components/ui/button";
import { ChevronRight, Search, Phone, Mail, MapPinIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useLocation } from "wouter";
import { properties } from "@/lib/properties";
import { toast } from "sonner";

/**
 * EXACT - Gestão Imobiliária com Inteligência
 * Design Philosophy: QUIET LUXURY
 * 
 * Principles:
 * - Restrained, intentional, exclusive
 * - Confidence without effort
 * - Minimal visual noise
 * - Premium through subtlety, not decoration
 * - Advisory firm aesthetic, not listing portal
 * 
 * Paleta: True black (#0f0f0f) + Charcoal (#1a1a1a) + Neutral silver (#b8b8b8)
 * Tipografia: SF Pro Rounded (EXACT) + Lato (body)
 * Spacing: Generous, breathing room everywhere
 * Animations: Subtle, no flash
 */

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

    const property = properties.find(p => p.code === trimmedCode);
    
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
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm z-50 border-b border-border/20">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-sm font-extralight tracking-normal"
            style={{ fontFamily: "'SF Pro Rounded', -apple-system, BlinkMacSystemFont, sans-serif", letterSpacing: '0.15em', fontWeight: 300 }}
          >
            EXACT
          </motion.div>
          <div className="flex gap-10 items-center">
            <a href="/imoveis" className="text-xs font-light text-muted-foreground hover:text-foreground transition-colors duration-300 tracking-wide">
              Imóveis
            </a>
            <a href="/sobre" className="text-xs font-light text-muted-foreground hover:text-foreground transition-colors duration-300 tracking-wide">
              Sobre
            </a>
            <a href="/contato" className="text-xs font-light text-muted-foreground hover:text-foreground transition-colors duration-300 tracking-wide">
              Contato
            </a>
            <motion.a
              href="https://wa.me/554199768371"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-light text-muted-foreground hover:text-foreground transition-colors duration-300 tracking-wide border border-border/40 hover:border-border/60 px-4 py-2 rounded-sm"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              Atendimento Direto
            </motion.a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <motion.div
          className="text-center max-w-2xl mx-auto px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Subtle location text */}
          <motion.p
            className="text-xs font-light tracking-widest text-muted-foreground mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Gestão Patrimonial em Curitiba
          </motion.p>

          {/* Main headline - refined, smaller, more tension */}
          <h1
            className="text-4xl md:text-5xl font-light mb-8 leading-tight tracking-tight"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            Imóveis certos.
          </h1>

          {/* Subheadline */}
          <p className="text-sm md:text-base text-muted-foreground mb-16 font-light tracking-wide">
            Selecionados com critério.
          </p>

          {/* Buttons - minimal, refined */}
          <motion.div
            className="flex gap-4 justify-center flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <motion.a
              href="/imoveis"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="inline-block px-6 py-2.5 border border-transparent hover:border-foreground/40 text-foreground text-xs font-light rounded-sm transition-all duration-300 tracking-wide uppercase"
            >
              VER IMÓVEIS DISPONÍVEIS
            </motion.a>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => {
                const element = document.getElementById("contact");
                element?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-6 py-2.5 text-foreground text-xs font-light rounded-sm transition-all duration-300 tracking-wide border border-transparent hover:border-foreground/40 hover:text-foreground uppercase"
            >
              FALE COM A EXACT
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* Locação / Aquisição + Buscar por Código Section */}
      <section id="search" className="py-20 bg-background border-t border-border/20">
        <div className="container mx-auto px-6">
          <motion.div
            className="grid md:grid-cols-2 gap-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            {/* Locação Card */}
            <motion.div
              variants={itemVariants}
              className="group cursor-pointer"
              whileHover={{ y: -2 }}
            >
              <div className="relative overflow-hidden mb-6 h-72 rounded-sm bg-muted/30 border border-border/20 hover:border-border/40 transition-all duration-500">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663481007953/48chfHstyxneY6QiBvkAHj/locacao-premium-SB8T9CyMbLswg9r3drbTXh.webp"
                  alt="Locação Premium"
                  className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-500"
                />
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-light tracking-tight">
                  Locação
                </h3>
                <p className="text-xs text-muted-foreground font-light leading-relaxed">
                  Imóveis selecionados para locação direta.
                </p>
              </div>
            </motion.div>

            {/* Aquisição Card */}
            <motion.div
              variants={itemVariants}
              className="group cursor-pointer"
              whileHover={{ y: -2 }}
            >
              <div className="relative overflow-hidden mb-6 h-72 rounded-sm bg-muted/30 border border-border/20 hover:border-border/40 transition-all duration-500">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663481007953/48chfHstyxneY6QiBvkAHj/aquisicao-premium-jDyVv7f4YExbawLTYJ3kud.webp"
                  alt="Aquisição Premium"
                  className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-500"
                />
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-light tracking-tight">
                  Aquisição
                </h3>
                <p className="text-xs text-muted-foreground font-light leading-relaxed">
                  Aquisição de imóveis com análise e curadoria.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Search by Code - Continuation */}
      <section className="py-0 bg-background border-t-0">
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

            <motion.div variants={itemVariants} className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Digite o código do imóvel"
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-3 bg-muted/20 border border-border/40 hover:border-border/60 focus:border-border/80 rounded-sm text-foreground placeholder-muted-foreground focus:outline-none transition-all duration-300 text-xs font-light"
                />
                <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
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

      {/* Footer */}
      <footer id="contact" className="bg-background border-t border-border/20 py-24">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-20 mb-20">
            {/* Brand */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3
                className="text-sm font-extralight mb-6 tracking-normal"
                style={{ fontFamily: "'SF Pro Rounded', -apple-system, BlinkMacSystemFont, sans-serif", letterSpacing: '0.15em', fontWeight: 300 }}
              >
                EXACT
              </h3>
              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                Curadoria imobiliária com análise precisa.
              </p>
            </motion.div>

            {/* Navigation */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              viewport={{ once: true }}
            >
              <h4 className="font-light text-xs mb-6 tracking-wide text-muted-foreground">Navegação</h4>
              <ul className="space-y-3 text-xs text-muted-foreground">
                <li>
                  <a href="#search" className="hover:text-foreground transition-colors duration-300 font-light">
                    Imóveis
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-foreground transition-colors duration-300 font-light">
                    Sobre
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-foreground transition-colors duration-300 font-light">
                    Contato
                  </a>
                </li>
              </ul>
            </motion.div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="font-light text-xs mb-6 tracking-wide text-muted-foreground">Contato</h4>
              <ul className="space-y-3 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Phone size={12} className="text-muted-foreground" />
                  <a href="tel:+554199768371" className="hover:text-foreground transition-colors duration-300 font-light">
                    (41) 99768-3715
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail size={12} className="text-muted-foreground" />
                  <a href="mailto:contato@exact.com.br" className="hover:text-foreground transition-colors duration-300 font-light">
                    contato@exact.com.br
                  </a>
                </li>
              </ul>
            </motion.div>

            {/* Location */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              viewport={{ once: true }}
            >
              <h4 className="font-light text-xs mb-6 tracking-wide text-muted-foreground">Localização</h4>
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

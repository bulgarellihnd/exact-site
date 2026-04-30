import { motion } from "framer-motion";

/**
 * EXACT - Página Sobre
 * Design Philosophy: QUIET LUXURY - MINIMAL
 * Layout simples e editorial com tipografia refinada
 */

export default function Sobre() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm z-50 border-b border-border/20">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <motion.a
            href="/"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-sm font-extralight tracking-normal cursor-pointer"
            style={{
              fontFamily: "'SF Pro Rounded', -apple-system, BlinkMacSystemFont, sans-serif",
              letterSpacing: "0.15em",
              fontWeight: 300,
            }}
          >
            EXACT
          </motion.a>
          <div className="flex gap-10 items-center">
            <a
              href="/imoveis"
              className="text-xs font-light text-muted-foreground hover:text-foreground transition-colors duration-300 tracking-wide"
            >
              Imóveis
            </a>
            <a
              href="/sobre"
              className="text-xs font-light text-foreground transition-colors duration-300 tracking-wide border-b border-foreground"
            >
              Sobre
            </a>
            <a
              href="/contato"
              className="text-xs font-light text-muted-foreground hover:text-foreground transition-colors duration-300 tracking-wide"
            >
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

      {/* Content Section */}
      <section className="relative h-screen flex items-center justify-start pt-20 pb-20 overflow-hidden">
        <motion.div
          className="container mx-auto px-6 max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Micro-title */}
          <motion.p
            className="text-xs font-light tracking-[0.2em] text-muted-foreground mb-8 uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Sobre
          </motion.p>

          {/* Main Title */}
          <motion.h1
            className="text-6xl md:text-7xl font-light mb-8 leading-tight tracking-tight"
            style={{ fontFamily: "'Lato', sans-serif" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            EXACT
          </motion.h1>

          {/* Description */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <p className="text-base text-muted-foreground font-light leading-relaxed tracking-wide max-w-lg">
              Consultoria imobiliária especializada em gestão patrimonial em Curitiba.
            </p>

            {/* Separator */}
            <div className="w-12 h-px bg-border/20"></div>

            {/* Pillar 1 */}
            <p className="text-base font-light leading-relaxed tracking-wide max-w-lg">
              Portfólio selecionado com exatidão.
            </p>

            {/* Separator */}
            <div className="w-12 h-px bg-border/20"></div>

            {/* Pillar 2 */}
            <p className="text-base font-light leading-relaxed tracking-wide max-w-lg">
              Execução precisa.
            </p>

            {/* Separator */}
            <div className="w-12 h-px bg-border/20"></div>

            {/* Pillar 3 */}
            <p className="text-base font-light leading-relaxed tracking-wide max-w-lg">
              Atendimento direto.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <motion.footer 
        className="bg-background border-t border-border/20 py-12"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: false, amount: 0.2 }}
      >
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <h4
                className="text-xs font-light tracking-widest mb-6"
                style={{
                  fontFamily: "'SF Pro Rounded', -apple-system, BlinkMacSystemFont, sans-serif",
                  letterSpacing: "0.15em",
                }}
              >
                EXACT
              </h4>
              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                Curadoria imobiliária com análise precisa.
              </p>
            </div>
            <div>
              <p className="text-xs font-light tracking-widest mb-4">Navegação</p>
              <div className="space-y-2">
                <a
                  href="/imoveis"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors font-light block"
                >
                  Imóveis
                </a>
                <a
                  href="/sobre"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors font-light block"
                >
                  Sobre
                </a>
                <a
                  href="/contato"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors font-light block"
                >
                  Contato
                </a>
              </div>
            </div>
            <div>
              <p className="text-xs font-light tracking-widest mb-4">Contato</p>
              <div className="space-y-2">
                <a
                  href="tel:+5541997683715"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors font-light block"
                >
                  (41) 99768-3715
                </a>
                <a
                  href="mailto:contato@exact.com.br"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors font-light block"
                >
                  contato@exact.com.br
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-border/20 pt-8">
            <p className="text-xs text-muted-foreground font-light text-center">
              © 2026 EXACT. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}

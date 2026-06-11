import { motion } from "framer-motion";
import Header from "@/components/Header";

const whatsappLink =
  "https://wa.me/5541999723780?text=Ol%C3%A1.%20Tenho%20interesse%20em%20um%20im%C3%B3vel%20da%20EXACT%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es.";

const exactPageTitleStyle = {
  fontFamily: "'Avenir Next', 'Avenir', sans-serif",
  fontSize: "5rem",
  fontWeight: 300,
  letterSpacing: "0.04em",
  lineHeight: 1,
};

export default function Sobre() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header activePage="sobre" />

      <section className="min-h-screen flex items-center pt-20 pb-32">
        <div className="container mx-auto px-6 max-w-xl">
          <motion.p
            className="text-[10px] font-light tracking-[0.28em] text-muted-foreground/60 uppercase mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Sobre
          </motion.p>

          <motion.h1
            className="mb-16 text-foreground/90"
            style={exactPageTitleStyle}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            EXACT
          </motion.h1>

          <motion.div
            className="space-y-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.35 }}
          >
            <p className="text-sm text-muted-foreground font-light leading-relaxed tracking-wide mb-12">
              Consultoria imobiliária especializada em gestão patrimonial em Curitiba.
            </p>

            <div className="space-y-0 border-t border-border/20">
              {[
                "Portfólio selecionado com exatidão.",
                "Execução precisa.",
                "Atendimento direto.",
              ].map((text, i) => (
                <motion.div
                  key={i}
                  className="flex items-center py-6 border-b border-border/20"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.45 + i * 0.1 }}
                >
                  <span className="text-[10px] text-muted-foreground/40 font-light tracking-widest mr-8 w-4 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <p className="text-sm font-light tracking-wide text-foreground/85">
                    {text}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="bg-background border-t border-border/15 py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-16 mb-16">
            <div>
              <h4 className="text-xs font-light tracking-[0.18em] mb-6">
                EXACT
              </h4>

              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                Curadoria imobiliária com análise precisa.
              </p>
            </div>

            <div>
              <p className="text-xs font-light tracking-wide text-muted-foreground mb-5">
                Navegação
              </p>

              <div className="space-y-3">
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
              <p className="text-xs font-light tracking-wide text-muted-foreground mb-5">
                Contato
              </p>

              <div className="space-y-3">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors font-light block"
                >
                  (41) 99972-3780
                </a>

                <a
                  href="mailto:contato@exactbr.com"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors font-light block"
                >
                  contato@exactbr.com
                </a>
              </div>
            </div>

            <div>
              <p className="text-xs font-light tracking-wide text-muted-foreground mb-5">
                Localização
              </p>

              <p className="text-xs text-muted-foreground font-light">
                Curitiba, PR
              </p>
            </div>
          </div>

          <div className="border-t border-border/15 pt-8">
            <p className="text-xs text-muted-foreground font-light text-center">
              © 2026 EXACT. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

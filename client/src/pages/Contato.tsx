import { motion } from "framer-motion";
import { useState } from "react";
import Header from "@/components/Header";

export default function Contato() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitted(true);

    setTimeout(() => {
      setFormData({ name: "", phone: "" });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header activePage="contato" />

      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-20">
        <motion.div
          className="container mx-auto px-6 max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-xs font-light tracking-widest text-muted-foreground mb-8">
            ENTRE EM CONTATO
          </p>

          <h1
            className="text-4xl md:text-5xl font-light mb-6 leading-tight tracking-tight"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            Fale com a EXACT
          </h1>

          <p className="text-base text-muted-foreground font-light leading-relaxed tracking-wide mb-12">
            Deixe seus dados para que possamos entrar em contato com você.
            Responderemos em breve.
          </p>

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div>
              <label className="text-xs font-light tracking-widest text-muted-foreground block mb-3">
                NOME
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-background border border-border/40 rounded-sm px-4 py-3 text-sm font-light text-foreground placeholder-muted-foreground focus:outline-none focus:border-border/60 transition-all duration-300"
                placeholder="Seu nome completo"
              />
            </div>

            <div>
              <label className="text-xs font-light tracking-widest text-muted-foreground block mb-3">
                TELEFONE
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full bg-background border border-border/40 rounded-sm px-4 py-3 text-sm font-light text-foreground placeholder-muted-foreground focus:outline-none focus:border-border/60 transition-all duration-300"
                placeholder="(41) 99999-9999"
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full px-6 py-3 border border-foreground/40 hover:border-foreground/60 text-foreground text-xs font-light rounded-sm transition-all duration-300 tracking-wide uppercase mt-8"
            >
              {submitted ? "Mensagem Enviada" : "Enviar"}
            </motion.button>

            {submitted && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-background border border-border/40 rounded-sm p-4"
              >
                <p className="text-xs font-light text-muted-foreground text-center">
                  Obrigado! Entraremos em contato em breve.
                </p>
              </motion.div>
            )}
          </motion.form>

          <div className="mt-16 pt-12 border-t border-border/20">
            <p className="text-xs font-light tracking-widest text-muted-foreground mb-6">
              OU ENTRE EM CONTATO DIRETO
            </p>

            <div className="space-y-3">
              <a
                href="tel:+5541999723780"
                className="text-base font-light text-foreground hover:text-muted-foreground transition-colors block"
              >
                (41) 99972-3780
              </a>

              <a
                href="mailto:contato@exactbr.com"
                className="text-base font-light text-foreground hover:text-muted-foreground transition-colors block"
              >
                contato@exactbr.com
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      <footer className="bg-background border-t border-border/20 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <h4 className="text-xs font-light tracking-widest mb-6">
                EXACT
              </h4>

              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                Curadoria imobiliária com análise precisa.
              </p>
            </div>

            <div>
              <p className="text-xs font-light tracking-widest mb-4">
                Navegação
              </p>

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
              <p className="text-xs font-light tracking-widest mb-4">
                Contato
              </p>

              <div className="space-y-2">
                <a
                  href="tel:+5541999723780"
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
          </div>

          <div className="border-t border-border/20 pt-8">
            <p className="text-xs text-muted-foreground font-light text-center">
              © 2026 EXACT. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

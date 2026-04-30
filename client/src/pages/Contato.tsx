import { motion } from "framer-motion";
import { useState } from "react";

/**
 * EXACT - Página Contato
 * Design Philosophy: QUIET LUXURY
 * Formulário elegante com Nome + Telefone
 */

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
    // Simulate form submission
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: "", phone: "" });
      setSubmitted(false);
    }, 3000);
  };

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
              className="text-xs font-light text-muted-foreground hover:text-foreground transition-colors duration-300 tracking-wide"
            >
              Sobre
            </a>
            <a
              href="/contato"
              className="text-xs font-light text-foreground transition-colors duration-300 tracking-wide"
            >
              Contato
            </a>
            <motion.a
              href="/contato"
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
            Deixe seus dados para que possamos entrar em contato com você. Responderemos em breve.
          </p>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {/* Name Input */}
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

            {/* Phone Input */}
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

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full px-6 py-3 border border-foreground/40 hover:border-foreground/60 text-foreground text-xs font-light rounded-sm transition-all duration-300 tracking-wide uppercase mt-8"
            >
              {submitted ? "Mensagem Enviada" : "Enviar"}
            </motion.button>

            {/* Success Message */}
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

          {/* Contact Info */}
          <div className="mt-16 pt-12 border-t border-border/20">
            <p className="text-xs font-light tracking-widest text-muted-foreground mb-6">
              OU ENTRE EM CONTATO DIRETO
            </p>
            <div className="space-y-3">
              <a
                href="tel:+5541997683715"
                className="text-base font-light text-foreground hover:text-muted-foreground transition-colors block"
              >
                (41) 99768-3715
              </a>
              <a
                href="mailto:contato@exact.com.br"
                className="text-base font-light text-foreground hover:text-muted-foreground transition-colors block"
              >
                contato@exact.com.br
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border/20 py-12">
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
      </footer>
    </div>
  );
}

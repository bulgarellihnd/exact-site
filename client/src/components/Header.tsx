import { motion } from "framer-motion";
import { useLocation } from "wouter";

const whatsappLink =
  "https://wa.me/5541999723780?text=Ol%C3%A1.%20Tenho%20interesse%20em%20um%20im%C3%B3vel%20da%20EXACT%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es.";

const exactLogoStyle = {
  fontFamily: "'Raleway', sans-serif",
  fontSize: "1.28rem",
  fontWeight: 360,
  letterSpacing: "0.11em",
  lineHeight: 1,
};

type HeaderProps = {
  activePage?: "home" | "imoveis" | "sobre" | "contato";
};

export default function Header({ activePage = "home" }: HeaderProps) {
  const [, setLocation] = useLocation();

  const linkClass = (page: HeaderProps["activePage"]) =>
    page === activePage
      ? "text-xs font-light text-white tracking-wide border-b border-white/40 pb-px"
      : "text-xs font-light text-white hover:text-white transition-colors duration-300 tracking-wide";

  return (
    <nav className="fixed top-0 w-full bg-background/60 backdrop-blur-md z-50 border-b border-white/10">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="cursor-pointer text-white"
          style={exactLogoStyle}
          onClick={() => setLocation("/")}
        >
          EXACT
        </motion.div>

        <div className="flex gap-10 items-center">
          <button onClick={() => setLocation("/imoveis")} className={linkClass("imoveis")}>
            Imóveis
          </button>

          <button onClick={() => setLocation("/sobre")} className={linkClass("sobre")}>
            Sobre
          </button>

          <button onClick={() => setLocation("/contato")} className={linkClass("contato")}>
            Contato
          </button>

          <motion.a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-light text-[#F4F4F4] hover:text-white transition-colors duration-300 tracking-wide border border-white/20 hover:border-white/40 px-4 py-2 rounded-sm"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            Atendimento Direto
          </motion.a>
        </div>
      </div>
    </nav>
  );
}
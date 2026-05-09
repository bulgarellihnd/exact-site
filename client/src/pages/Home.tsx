<motion.div
  className="text-center max-w-3xl mx-auto px-6 flex flex-col items-center translate-y-20 md:translate-y-24"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.9 }}
>
  <motion.p
    className="text-[10px] md:text-[11px] font-light tracking-[0.32em] text-muted-foreground/55 uppercase mb-20 md:mb-24"
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.15, duration: 0.7 }}
  >
    SELEÇÃO IMOBILIÁRIA · CURITIBA
  </motion.p>

  <motion.p
    className="text-[15px] md:text-[17px] text-muted-foreground/75 font-light tracking-wide leading-relaxed mb-24 md:mb-28"
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3, duration: 0.7 }}
  >
    Só o que importa.
  </motion.p>

  <motion.div
    className="flex gap-10 md:gap-16 justify-center flex-wrap"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.45, duration: 0.7 }}
  >
    <motion.a
      href="/imoveis"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="inline-block text-foreground text-[11px] md:text-xs font-light rounded-sm transition-all duration-300 tracking-[0.24em] uppercase hover:text-muted-foreground"
    >
      VER IMÓVEIS
    </motion.a>

    <motion.a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="inline-block text-foreground text-[11px] md:text-xs font-light rounded-sm transition-all duration-300 tracking-[0.24em] uppercase hover:text-muted-foreground"
    >
      FALAR COM A EXACT
    </motion.a>
  </motion.div>
</motion.div>

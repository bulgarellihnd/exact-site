import { Link } from "wouter";

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-black text-white">

      {/* HERO */}
      <section className="relative h-screen w-full overflow-hidden">

        {/* IMAGEM DE FUNDO (melhorada) */}
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
          alt="Luxury Interior"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* OVERLAY ESCURO REAL */}
        <div className="absolute inset-0 bg-black/80" />

        {/* CONTEÚDO */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">

          {/* LINHA SUPERIOR (MENOR) */}
          <span className="text-[11px] tracking-[0.35em] text-white/40 mb-8 uppercase">
            Seleção imobiliária · Curitiba
          </span>

          {/* HEADLINE (REDUZIDA E MAIS LIMPA) */}
          <h1 className="text-[42px] md:text-[64px] font-light tracking-tight mb-6">
            Sem excesso.
          </h1>

          {/* SUB */}
          <p className="text-white/60 text-sm md:text-base leading-relaxed mb-10">
            Só o que importa.
          </p>

          {/* BOTÕES */}
          <div className="flex gap-10 text-[11px] tracking-[0.25em] uppercase">

            <Link href="/imoveis">
              <span className="cursor-pointer hover:text-white/70 transition">
                Ver imóveis
              </span>
            </Link>

            <Link href="/contato">
              <span className="cursor-pointer hover:text-white/70 transition">
                Falar com a EXACT
              </span>
            </Link>

          </div>
        </div>
      </section>

      {/* RESTANTE DA HOME (mantido intacto) */}
      <div className="relative z-10">
        {/* Aqui continua tudo que já existia abaixo */}
      </div>

    </div>
  );
}

"use client";
import { useState } from "react";

type Camisa = {
  id: number;
  nome: string;
  preco: string;
  parcelas: string;
  cor: string;
  bg: string;
  img?: string;
};

const camisas: Camisa[] = [
  { id: 1, nome: "Brasil 2026 – Home", preco: "R$ 349,90", parcelas: "3x R$ 116,63", cor: "#009C3B", bg: "#e8f5e9", img: "/camisas/brasil-home.jpg" },
  { id: 2, nome: "Brasil 2024 – Away", preco: "R$ 349,90", parcelas: "3x R$ 116,63", cor: "#002776", bg: "#e8eaf6" },
  { id: 3, nome: "Argentina 2024",     preco: "R$ 329,90", parcelas: "3x R$ 109,96", cor: "#74ACDF", bg: "#e3f2fd" },
  { id: 4, nome: "França 2024",        preco: "R$ 329,90", parcelas: "3x R$ 109,96", cor: "#002395", bg: "#ede7f6" },
];

export default function Home() {
  const [camisa, setCamisa] = useState<Camisa>(camisas[0]);
  const [foto, setFoto] = useState<string | null>(null);
  const [fotoBase64, setFotoBase64] = useState<string | null>(null);
  const [resultado, setResultado] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [adicionado, setAdicionado] = useState(false);

  function handleFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFoto(URL.createObjectURL(file));
    setResultado(null);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setFotoBase64(result.split(",")[1]);
    };
    reader.readAsDataURL(file);
  }

  async function experimentar() {
    if (!fotoBase64) return;
    setLoading(true);
    setErro(null);
    setResultado(null);
    try {
      const res = await fetch("/api/tryon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fotoBase64, camisaId: camisa.id, camisaNome: camisa.nome, camisaImg: camisa.img }),
      });
      const data = await res.json();
      if (data.erro) throw new Error(data.erro);
      setResultado(data.imagem);
    } catch (e) {
      setErro("Erro ao processar imagem. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  function handleAdicionar() {
    setAdicionado(true);
    setTimeout(() => setAdicionado(false), 2000);
  }

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#f5f5f5", minHeight: "100vh", color: "#222" }}>

      {/* Top bar */}
      <div style={{ background: "#1a1a2e", color: "#fff", fontSize: 12, textAlign: "center", padding: "6px 0", letterSpacing: 1 }}>
        🚚 Frete grátis acima de R$ 299 · Parcelamento em até 3x sem juros
      </div>

      {/* Header */}
      <header style={{ background: "#fff", borderBottom: "1px solid #e0e0e0", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 28 }}>⚽</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: 1, color: "#1a1a2e" }}>SELEÇÃO SHOP</div>
            <div style={{ fontSize: 10, color: "#888", letterSpacing: 2, marginTop: -2 }}>CAMISAS OFICIAIS</div>
          </div>
        </div>
        <nav style={{ display: "flex", gap: 28, fontSize: 14, color: "#444" }}>
          <span style={{ cursor: "pointer", fontWeight: 600, color: "#1a1a2e", borderBottom: "2px solid #1a1a2e", paddingBottom: 2 }}>Início</span>
          <span style={{ cursor: "pointer" }}>Camisas</span>
          <span style={{ cursor: "pointer" }}>Promoções</span>
          <span style={{ cursor: "pointer" }}>Contato</span>
        </nav>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <span style={{ fontSize: 20, cursor: "pointer" }}>🛒</span>
          <span style={{ fontSize: 20, cursor: "pointer" }}>👤</span>
        </div>
      </header>

      {/* Breadcrumb */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "12px 24px", fontSize: 13, color: "#888" }}>
        Início › Camisas › <span style={{ color: "#222" }}>{camisa.nome}</span>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 48px", display: "grid", gridTemplateColumns: "1fr 420px", gap: 32 }}>

        {/* Coluna esquerda */}
        <div>
          {/* Card produto selecionado */}
          <div style={{ background: "#fff", borderRadius: 12, padding: 28, marginBottom: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
            <div style={{ display: "flex", gap: 24 }}>
              <div style={{ width: 180, height: 180, background: camisa.bg, borderRadius: 10, overflow: "hidden", flexShrink: 0, border: `2px solid ${camisa.cor}33`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {camisa.img ? (
                  <img src={camisa.img} alt={camisa.nome} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ fontSize: 80 }}>👕</span>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: "#888", letterSpacing: 2, marginBottom: 6, textTransform: "uppercase" }}>Camisa Oficial</div>
                <h1 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 8px", color: "#1a1a2e" }}>{camisa.nome}</h1>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <span style={{ color: "#f59e0b", fontSize: 14 }}>★★★★★</span>
                  <span style={{ fontSize: 13, color: "#888" }}>4.9 (127 avaliações)</span>
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#1a1a2e", marginBottom: 2 }}>{camisa.preco}</div>
                <div style={{ fontSize: 13, color: "#666", marginBottom: 16 }}>ou {camisa.parcelas} no cartão</div>
                <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                  {["P","M","G","GG"].map(s => (
                    <button key={s} style={{ width: 36, height: 36, border: "1.5px solid #ddd", borderRadius: 6, background: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#444" }}>{s}</button>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    onClick={handleAdicionar}
                    style={{ flex: 1, padding: "12px 0", background: adicionado ? "#16a34a" : "#1a1a2e", color: "#fff", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "background 0.3s" }}
                  >
                    {adicionado ? "✓ ADICIONADO!" : "ADICIONAR AO CARRINHO"}
                  </button>
                  <button style={{ padding: "12px 16px", background: "#fff", border: "1.5px solid #1a1a2e", borderRadius: 8, cursor: "pointer", fontSize: 18 }}>🤍</button>
                </div>
              </div>
            </div>
          </div>

          {/* Grid de camisas */}
          <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 16px", color: "#1a1a2e" }}>Outras camisas</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
              {camisas.map((c) => (
                <div
                  key={c.id}
                  onClick={() => { setCamisa(c); setResultado(null); }}
                  style={{
                    border: `2px solid ${camisa.id === c.id ? c.cor : "#eee"}`,
                    borderRadius: 8,
                    padding: 12,
                    cursor: "pointer",
                    background: camisa.id === c.id ? c.bg : "#fafafa",
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{ height: 70, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8, overflow: "hidden", borderRadius: 4 }}>
                    {c.img ? (
                      <img src={c.img} alt={c.nome} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <span style={{ fontSize: 36 }}>👕</span>
                    )}
                  </div>
                  <p style={{ fontSize: 11, fontWeight: 600, color: "#333", margin: "0 0 2px", lineHeight: 1.3 }}>{c.nome}</p>
                  <p style={{ fontSize: 12, color: c.cor, fontWeight: 700, margin: 0 }}>{c.preco}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna direita - provador */}
        <div>
          <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", position: "sticky", top: 80 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, background: "#f0f4ff", borderRadius: 8, padding: "10px 14px" }}>
              <span style={{ fontSize: 20 }}>✨</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e" }}>Provador Virtual com IA</div>
                <div style={{ fontSize: 11, color: "#666" }}>Veja como a camisa fica em você antes de comprar</div>
              </div>
            </div>

            <label style={{
              display: "block",
              border: foto ? "2px solid #1a1a2e" : "2px dashed #d0d0d0",
              borderRadius: 10,
              padding: foto ? "0" : "24px",
              textAlign: "center",
              cursor: "pointer",
              marginBottom: 12,
              background: foto ? "#000" : "#fafafa",
              overflow: "hidden",
              transition: "all 0.2s",
            }}>
              <input type="file" accept="image/*" onChange={handleFoto} style={{ display: "none" }} />
              {foto ? (
                <img src={foto} alt="sua foto" style={{ width: "100%", maxHeight: 280, objectFit: "cover", display: "block" }} />
              ) : (
                <div>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>📷</div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#444" }}>Envie sua foto</p>
                  <p style={{ margin: "4px 0 0", fontSize: 12, color: "#999" }}>Foto de corpo inteiro, fundo neutro</p>
                  <div style={{ marginTop: 12, display: "inline-block", background: "#1a1a2e", color: "#fff", padding: "8px 20px", borderRadius: 6, fontSize: 13, fontWeight: 600 }}>
                    Selecionar foto
                  </div>
                </div>
              )}
            </label>

            {foto && (
              <button
                onClick={experimentar}
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "13px 0",
                  background: loading ? "#ccc" : "linear-gradient(135deg, #667eea, #764ba2)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  marginBottom: 12,
                }}
              >
                {loading ? "⏳ Processando com IA..." : "✨ Experimentar esta camisa"}
              </button>
            )}

            {erro && (
              <div style={{ background: "#fff5f5", border: "1px solid #fca5a5", borderRadius: 8, padding: 12, fontSize: 13, color: "#b91c1c", marginBottom: 12 }}>
                ⚠️ {erro}
              </div>
            )}

            {resultado && (
              <div style={{ borderRadius: 10, overflow: "hidden", border: "2px solid #667eea" }}>
                <div style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", padding: "8px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14 }}>✨</span>
                  <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>Resultado — {camisa.nome}</span>
                </div>
                <img src={`data:image/jpeg;base64,${resultado}`} alt="resultado" style={{ width: "100%", display: "block" }} />
              </div>
            )}

            <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[["🔒","Compra segura"],["🚚","Entrega rápida"],["↩️","Troca grátis"],["✅","Produto oficial"]].map(([icon, txt]) => (
                <div key={txt} style={{ display: "flex", alignItems: "center", gap: 6, background: "#f9f9f9", borderRadius: 6, padding: "8px 10px" }}>
                  <span style={{ fontSize: 14 }}>{icon}</span>
                  <span style={{ fontSize: 11, color: "#555", fontWeight: 500 }}>{txt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <footer style={{ background: "#1a1a2e", color: "#aaa", textAlign: "center", padding: "20px", fontSize: 13 }}>
        © 2025 Seleção Shop · Todos os direitos reservados
      </footer>
    </div>
  );
}

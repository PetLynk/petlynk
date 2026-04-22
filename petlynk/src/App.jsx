import { useState, useRef, useEffect } from "react";

const SUPABASE_URL = "https://nylhrjoayufyghasjygj.supabase.co";
const SUPABASE_KEY = "sb_publishable__VxC6FFNRAyy9BoHJPHvUw_-n6NSEX4";

const api = {
  async get(table) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?order=created_at.desc`, { headers:{ apikey:SUPABASE_KEY, Authorization:`Bearer ${SUPABASE_KEY}` } });
    return res.json();
  },
  async post(table, data) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, { method:"POST", headers:{ apikey:SUPABASE_KEY, Authorization:`Bearer ${SUPABASE_KEY}`, "Content-Type":"application/json", Prefer:"return=representation" }, body:JSON.stringify(data) });
    return res.json();
  },
  async uploadFoto(file, path) {
    await fetch(`${SUPABASE_URL}/storage/v1/object/fotos-pets/${path}`, { method:"POST", headers:{ apikey:SUPABASE_KEY, Authorization:`Bearer ${SUPABASE_KEY}`, "Content-Type":file.type }, body:file });
    return `${SUPABASE_URL}/storage/v1/object/public/fotos-pets/${path}`;
  },
  async loginUser(email, senha) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/usuarios?email=eq.${email}&senha=eq.${senha}`, { headers:{ apikey:SUPABASE_KEY, Authorization:`Bearer ${SUPABASE_KEY}` } });
    const d = await res.json(); return d[0]||null;
  },
  async emailExists(email) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/usuarios?email=eq.${email}`, { headers:{ apikey:SUPABASE_KEY, Authorization:`Bearer ${SUPABASE_KEY}` } });
    const d = await res.json(); return d.length>0;
  },
  async patch(table, id, data) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, { method:"PATCH", headers:{ apikey:SUPABASE_KEY, Authorization:`Bearer ${SUPABASE_KEY}`, "Content-Type":"application/json", Prefer:"return=representation" }, body:JSON.stringify(data) });
    return res.json();
  }
};

const DEMO = [
  { id:"1", tipo:"perdido", nome:"Thor", especie:"Cachorro", raca:"Labrador", cor:"Amarelo", porte:"Grande", cidade:"São Paulo", bairro:"Moema", descricao:"Fugiu durante fogos de artifício. Usa coleira azul com plaquinha.", foto_url:null, usuario_nome:"Carlos Silva", telefone:"(11) 99999-1111", created_at:"2025-04-18", sexo:"Macho", resolvido:false, lat:-23.5937, lng:-46.6694 },
  { id:"2", tipo:"achado", nome:"Desconhecido", especie:"Gato", raca:"Vira-lata", cor:"Preto e branco", porte:"Médio", cidade:"Rio de Janeiro", bairro:"Botafogo", descricao:"Encontrado próximo ao metrô, muito dócil, parece ter dono.", foto_url:null, usuario_nome:"Ana Paula", telefone:"(21) 98888-2222", created_at:"2025-04-19", sexo:"Fêmea", resolvido:false, lat:-22.9519, lng:-43.1729 },
  { id:"3", tipo:"adocao", nome:"Mel", especie:"Cachorro", raca:"SRD", cor:"Caramelo", porte:"Pequeno", cidade:"Belo Horizonte", bairro:"Savassi", descricao:"Resgatada da rua, vacinada, vermifugada e castrada. Adora crianças!", foto_url:null, usuario_nome:"ONG PatinhasFelizes", telefone:"(31) 97777-3333", created_at:"2025-04-15", sexo:"Fêmea", resolvido:false, lat:-19.9352, lng:-43.9386 },
  { id:"4", tipo:"perdido", nome:"Bolinha", especie:"Gato", raca:"Persa", cor:"Branco", porte:"Pequeno", cidade:"Curitiba", bairro:"Batel", descricao:"Gato persa branco, olhos azuis. Fugiu pela janela do apartamento.", foto_url:null, usuario_nome:"Maria Fernanda", telefone:"(41) 96666-4444", created_at:"2025-04-20", sexo:"Macho", resolvido:false, lat:-25.4425, lng:-49.2779 },
  { id:"5", tipo:"adocao", nome:"Rex", especie:"Cachorro", raca:"Pit Bull", cor:"Cinza tigrado", porte:"Grande", cidade:"Porto Alegre", bairro:"Moinhos de Vento", descricao:"Dócil, treinado, ótimo com outros animais. Procura família amorosa.", foto_url:null, usuario_nome:"Canil Esperança", telefone:"(51) 95555-5555", created_at:"2025-04-10", sexo:"Macho", resolvido:false, lat:-30.0277, lng:-51.2287 },
  { id:"6", tipo:"achado", nome:"Desconhecido", especie:"Cachorro", raca:"Beagle", cor:"Tricolor", porte:"Médio", cidade:"Salvador", bairro:"Barra", descricao:"Encontrado na praia da Barra, muito dócil, parece ter dono.", foto_url:null, usuario_nome:"João Henrique", telefone:"(71) 94444-6666", created_at:"2025-04-21", sexo:"Indefinido", resolvido:false, lat:-12.9714, lng:-38.5014 },
];

const TC = {
  perdido:{ label:"Perdido", color:"#E05C5C", bg:"#FFF2F2", border:"#FFD5D5", icon:"💔", grad:"135deg,#E05C5C,#FF8A80" },
  achado: { label:"Achado",  color:"#2BAE9E", bg:"#F0FFFD", border:"#B2EDE8", icon:"🤝", grad:"135deg,#2BAE9E,#4DD0C4" },
  adocao: { label:"Adoção",  color:"#F0922B", bg:"#FFF8F0", border:"#FFE0B2", icon:"🏠", grad:"135deg,#F0922B,#FFB74D" },
};
const EM = { Cachorro:"🐕", Gato:"🐈", Pássaro:"🦜", Coelho:"🐇", Outro:"🐾" };

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Lato:wght@300;400;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:#F7F3EE;}
  .inp{width:100%;background:#fff;border:2px solid #E8DDD4;border-radius:12px;padding:12px 16px;color:#333;font-family:'Lato';font-size:15px;outline:none;transition:all .2s;}
  .inp:focus{border-color:#E05C5C;box-shadow:0 0 0 3px rgba(224,92,92,.08);}
  .inp::placeholder{color:#C5B8AE;}
  select.inp{cursor:pointer;}
  textarea.inp{resize:vertical;min-height:90px;}
  .bp{background:linear-gradient(135deg,#E05C5C,#FF8A80);border:none;border-radius:50px;padding:13px 26px;color:#fff;font-family:'Nunito';font-size:15px;font-weight:800;cursor:pointer;transition:all .2s;box-shadow:0 4px 14px rgba(224,92,92,.3);}
  .bp:hover{transform:translateY(-1px);box-shadow:0 6px 22px rgba(224,92,92,.4);}
  .bp:disabled{opacity:.4;cursor:not-allowed;transform:none;}
  .bg{background:#fff;border:2px solid #E8DDD4;border-radius:50px;padding:11px 22px;color:#888;font-family:'Nunito';font-size:14px;font-weight:700;cursor:pointer;transition:all .2s;}
  .bg:hover{border-color:#E05C5C;color:#E05C5C;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
  @keyframes pop{0%{transform:scale(.93);opacity:0;}70%{transform:scale(1.02);}100%{transform:scale(1);opacity:1;}}
  @keyframes spin{to{transform:rotate(360deg);}}
  .fu{animation:fadeUp .38s ease both;}
  .pop{animation:pop .33s ease both;}
  ::-webkit-scrollbar{width:6px;}::-webkit-scrollbar-track{background:#F7F3EE;}::-webkit-scrollbar-thumb{background:#E0D4C8;border-radius:3px;}
`;

// ── SHARE ─────────────────────────────────────────────────────────
function Share({ animal }) {
  const [copied, setCopied] = useState(false);
  const cfg = TC[animal.tipo];
  const em = EM[animal.especie]||"🐾";
  const txt = `${cfg.icon} Animal ${cfg.label} | ${em} ${animal.nome} | ${animal.especie}${animal.raca?` (${animal.raca})`:""}  | 📍 ${animal.bairro?animal.bairro+", ":""}${animal.cidade} | ${animal.descricao?.slice(0,90)}... | 📱 ${animal.telefone} | #PetLynk #Pet${cfg.label}`;
  const url = `https://petlynk.com.br/pet/${animal.id}`;
  const te = encodeURIComponent(txt), ue = encodeURIComponent(url);

  const redes = [
    { n:"WhatsApp", c:"#25D366", i:"💬", href:`https://wa.me/?text=${te}%0A${ue}` },
    { n:"Facebook", c:"#1877F2", i:"📘", href:`https://www.facebook.com/sharer/sharer.php?u=${ue}&quote=${te}` },
    { n:"Twitter",  c:"#000",    i:"🐦", href:`https://twitter.com/intent/tweet?text=${te}&url=${ue}` },
    { n:"Telegram", c:"#0088CC", i:"✈️", href:`https://t.me/share/url?url=${ue}&text=${te}` },
  ];

  const copy = () => { navigator.clipboard.writeText(`${txt}\n\n${url}`).then(()=>{ setCopied(true); setTimeout(()=>setCopied(false),2500); }); };

  return (
    <div style={{marginTop:18,paddingTop:18,borderTop:"1px solid #F0E8E0"}}>
      <p style={{fontSize:11,color:"#C5B8AE",fontFamily:"'Lato'",textTransform:"uppercase",letterSpacing:.8,fontWeight:700,marginBottom:10}}>📣 Compartilhar e ajudar a encontrar</p>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {redes.map(r=>(
          <a key={r.n} href={r.href} target="_blank" rel="noreferrer"
            style={{display:"flex",alignItems:"center",gap:5,background:r.c,color:"#fff",borderRadius:50,padding:"8px 14px",fontSize:12,fontFamily:"'Nunito'",fontWeight:700,textDecoration:"none",transition:"all .2s",boxShadow:`0 3px 10px ${r.c}40`}}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.opacity=".9";}}
            onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.opacity="1";}}>
            {r.i} {r.n}
          </a>
        ))}
        <button onClick={()=>alert("📸 Para compartilhar no Instagram:\n1. Clique em 'Copiar link' abaixo\n2. Abra o Instagram\n3. Cole nos Stories ou na bio!")}
          style={{display:"flex",alignItems:"center",gap:5,background:"linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",color:"#fff",borderRadius:50,padding:"8px 14px",fontSize:12,fontFamily:"'Nunito'",fontWeight:700,border:"none",cursor:"pointer",transition:"all .2s"}}
          onMouseEnter={e=>e.currentTarget.style.opacity=".85"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
          📸 Instagram
        </button>
        <button onClick={copy}
          style={{display:"flex",alignItems:"center",gap:5,background:copied?"#2BAE9E":"#F7F3EE",color:copied?"#fff":"#888",borderRadius:50,padding:"8px 14px",fontSize:12,fontFamily:"'Nunito'",fontWeight:700,border:`2px solid ${copied?"#2BAE9E":"#E8DDD4"}`,cursor:"pointer",transition:"all .2s"}}>
          {copied?"✅ Copiado!":"🔗 Copiar link"}
        </button>
      </div>
    </div>
  );
}

// ── MAPA NO MODAL ─────────────────────────────────────────────────
function MapaModal({ lat, lng, nome, tipo }) {
  const cfg = TC[tipo];
  if (!lat||!lng) return null;
  return (
    <div style={{marginTop:18,paddingTop:18,borderTop:"1px solid #F0E8E0"}}>
      <p style={{fontSize:11,color:"#C5B8AE",fontFamily:"'Lato'",textTransform:"uppercase",letterSpacing:.8,fontWeight:700,marginBottom:10}}>📍 Localização no mapa</p>
      <div style={{borderRadius:16,overflow:"hidden",border:`2px solid ${cfg.border}`,position:"relative"}}>
        <iframe title={`mapa-${nome}`}
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng-.018}%2C${lat-.012}%2C${lng+.018}%2C${lat+.012}&layer=mapnik&marker=${lat}%2C${lng}`}
          width="100%" height="210" style={{display:"block",border:"none"}} loading="lazy"/>
        <div style={{position:"absolute",top:8,right:8,display:"flex",gap:6}}>
          <a href={`https://maps.google.com/?q=${lat},${lng}`} target="_blank" rel="noreferrer"
            style={{background:"rgba(255,255,255,.95)",backdropFilter:"blur(8px)",borderRadius:50,padding:"5px 12px",fontSize:11,fontFamily:"'Nunito'",fontWeight:700,color:"#333",textDecoration:"none",boxShadow:"0 2px 8px rgba(0,0,0,.12)"}}>
            🗺️ Google Maps
          </a>
        </div>
      </div>
      <p style={{fontSize:11,color:"#C5B8AE",fontFamily:"'Lato'",marginTop:6,textAlign:"center"}}>
        Coordenadas: {lat.toFixed(4)}, {lng.toFixed(4)}
      </p>
    </div>
  );
}

// ── MAPA PICKER NO FORM ───────────────────────────────────────────
function MapaPicker({ lat, lng, onChange }) {
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);

  const buscar = async () => {
    if (!q.trim()) return;
    setBusy(true);
    try {
      const r = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q+", Brasil")}&format=json&limit=1`);
      const d = await r.json();
      if (d[0]) onChange(parseFloat(d[0].lat), parseFloat(d[0].lon));
      else alert("Endereço não encontrado. Tente ser mais específico.");
    } catch { alert("Erro ao buscar. Verifique sua conexão."); }
    setBusy(false);
  };

  const gps = () => {
    if (!navigator.geolocation) { alert("Navegador não suporta GPS."); return; }
    setBusy(true);
    navigator.geolocation.getCurrentPosition(
      p => { onChange(p.coords.latitude, p.coords.longitude); setBusy(false); },
      () => { alert("Não foi possível obter localização."); setBusy(false); }
    );
  };

  return (
    <div style={{background:"#FAF6F2",borderRadius:16,padding:16,border:"2px dashed #E0D4C8"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,flexWrap:"wrap",gap:8}}>
        <span style={{fontFamily:"'Nunito'",fontWeight:700,color:"#888",fontSize:13}}>
          📍 Localização no mapa <span style={{color:"#C5B8AE",fontWeight:400,fontSize:11}}>(opcional)</span>
        </span>
        <button type="button" onClick={gps} disabled={busy}
          style={{background:"#E05C5C",color:"#fff",border:"none",borderRadius:50,padding:"6px 13px",fontSize:11,fontFamily:"'Nunito'",fontWeight:700,cursor:"pointer"}}>
          {busy?"⏳ ...":"📡 Usar GPS"}
        </button>
      </div>
      <div style={{display:"flex",gap:7}}>
        <input
          style={{flex:1,background:"#fff",border:"2px solid #E8DDD4",borderRadius:10,padding:"9px 13px",fontFamily:"'Lato'",fontSize:13,outline:"none",color:"#333",transition:"border .2s"}}
          placeholder="Ex: Av. Paulista, São Paulo ou Moema SP"
          value={q} onChange={e=>setQ(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&buscar()}
          onFocus={e=>e.currentTarget.style.borderColor="#E05C5C"}
          onBlur={e=>e.currentTarget.style.borderColor="#E8DDD4"}
        />
        <button type="button" onClick={buscar} disabled={busy||!q.trim()}
          style={{background:"#E05C5C",color:"#fff",border:"none",borderRadius:10,padding:"9px 16px",fontFamily:"'Nunito'",fontWeight:700,fontSize:13,cursor:"pointer",opacity:busy||!q.trim()?.4:1}}>
          {busy?"...":"Buscar"}
        </button>
      </div>
      {lat&&lng&&(
        <div style={{marginTop:10,borderRadius:12,overflow:"hidden",border:"2px solid #E0D4C8",position:"relative"}}>
          <iframe title="picker"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng-.014}%2C${lat-.009}%2C${lng+.014}%2C${lat+.009}&layer=mapnik&marker=${lat}%2C${lng}`}
            width="100%" height="170" style={{display:"block",border:"none"}} loading="lazy"/>
          <div style={{position:"absolute",bottom:8,left:"50%",transform:"translateX(-50%)",background:"rgba(255,255,255,.94)",borderRadius:50,padding:"4px 12px",fontSize:11,fontFamily:"'Nunito'",fontWeight:700,color:"#2BAE9E",boxShadow:"0 2px 8px rgba(0,0,0,.12)"}}>✅ Localização marcada!</div>
          <button onClick={()=>onChange(null,null)} style={{position:"absolute",top:6,right:6,background:"rgba(255,255,255,.9)",border:"none",borderRadius:"50%",width:26,height:26,cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
      )}
      {!lat&&!lng&&<p style={{fontSize:11,color:"#C5B8AE",fontFamily:"'Lato'",marginTop:6}}>Digite o endereço ou use o GPS para marcar no mapa. Ajuda outras pessoas a encontrarem o local!</p>}
    </div>
  );
}

// ── MAPA GERAL ────────────────────────────────────────────────────
function MapaGeral({ animals, onClick }) {
  const [foco, setFoco] = useState(null);
  const comMapa = animals.filter(a=>a.lat&&a.lng);

  if (comMapa.length===0) return (
    <div style={{textAlign:"center",padding:"60px 0",color:"#C5B8AE"}}>
      <div style={{fontSize:56,marginBottom:12}}>🗺️</div>
      <p style={{fontFamily:"'Nunito'",fontWeight:700,fontSize:18}}>Nenhum animal com localização cadastrada</p>
      <p style={{fontFamily:"'Lato'",fontSize:14,marginTop:6}}>Ao cadastrar um animal, adicione a localização no mapa!</p>
    </div>
  );

  const a = foco || comMapa[0];
  const cfg = TC[a.tipo];

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div>
          <h3 style={{fontSize:17,fontWeight:900,fontFamily:"'Nunito'",color:"#2d2d2d"}}>🗺️ Mapa de ocorrências</h3>
          <p style={{fontSize:12,color:"#C5B8AE",fontFamily:"'Lato'",marginTop:2}}>{comMapa.length} animal(is) com localização</p>
        </div>
        <div style={{display:"flex",gap:8}}>
          {Object.entries(TC).map(([k,c])=>( <span key={k} style={{fontSize:11,fontFamily:"'Lato'",color:c.color,background:c.bg,border:`1px solid ${c.border}`,borderRadius:50,padding:"3px 10px"}}>{c.icon} {c.label}</span> ))}
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:18,alignItems:"start"}}>
        <div style={{borderRadius:20,overflow:"hidden",border:"2px solid #F0E8E0",boxShadow:"0 2px 20px rgba(0,0,0,.06)"}}>
          <iframe title="mapa-geral"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${a.lng-.03}%2C${a.lat-.02}%2C${a.lng+.03}%2C${a.lat+.02}&layer=mapnik&marker=${a.lat}%2C${a.lng}`}
            width="100%" height="420" style={{display:"block",border:"none"}} loading="lazy"/>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10,maxHeight:420,overflowY:"auto"}}>
          {comMapa.map(an=>{
            const c = TC[an.tipo];
            const isAtivo = foco?.id===an.id;
            return (
              <div key={an.id}
                onClick={()=>setFoco(an)}
                style={{background:isAtivo?c.bg:"#fff",border:`2px solid ${isAtivo?c.color:c.border}`,borderRadius:14,padding:"12px 14px",cursor:"pointer",transition:"all .2s"}}
                onMouseEnter={e=>{if(!isAtivo){e.currentTarget.style.borderColor=c.color;e.currentTarget.style.transform="translateX(3px)";}}}
                onMouseLeave={e=>{if(!isAtivo){e.currentTarget.style.borderColor=c.border;e.currentTarget.style.transform="none";}}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:24}}>{EM[an.especie]||"🐾"}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:14,fontWeight:800,fontFamily:"'Nunito'",color:"#2d2d2d",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{an.nome}</div>
                    <div style={{fontSize:11,color:c.color,fontFamily:"'Lato'",fontWeight:700}}>{c.icon} {an.bairro||an.cidade}</div>
                  </div>
                  <button onClick={e=>{e.stopPropagation();onClick(an);}}
                    style={{background:c.color,color:"#fff",border:"none",borderRadius:50,padding:"4px 10px",fontSize:11,fontFamily:"'Nunito'",fontWeight:700,cursor:"pointer",flexShrink:0}}>
                    Ver
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── MODAL ─────────────────────────────────────────────────────────
function Modal({ a, onClose, user, onUpdate, isDemo }) {
  const cfg = TC[a.tipo];
  const em = EM[a.especie]||"🐾";
  const isOwner = user && user.nome === a.usuario_nome;
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ ...a });
  const [novaFoto, setNovaFoto] = useState(null);
  const [novaFoto2, setNovaFoto2] = useState(null);
  const [preview, setPreview] = useState(a.foto_url);
  const [preview2, setPreview2] = useState(a.foto2_url);
  const [fotoAtiva, setFotoAtiva] = useState(0); // 0 = foto1, 1 = foto2
  const [busy, setBusy] = useState(false);
  const [confirmFound, setConfirmFound] = useState(false);
  const [resolvido, setResolvido] = useState(a.resolvido);
  const fileRef = useRef();
  const fileRef2 = useRef();

  const fotos = [preview, preview2].filter(Boolean);
  const fotoExibida = fotos[fotoAtiva] || null;

  const handleFoto = (e, slot) => {
    const file = e.target.files[0];
    if (!file) return;
    const r = new FileReader();
    if (slot===1) { setNovaFoto(file); r.onload=ev=>setPreview(ev.target.result); }
    else { setNovaFoto2(file); r.onload=ev=>setPreview2(ev.target.result); }
    r.readAsDataURL(file);
  };

  const handleSave = async () => {
    setBusy(true);
    try {
      let foto_url = form.foto_url, foto2_url = form.foto2_url;
      if (novaFoto) {
        if (isDemo) { foto_url = preview; }
        else { const ext=novaFoto.name.split(".").pop(); foto_url=await api.uploadFoto(novaFoto,`${Date.now()}_1.${ext}`); }
      }
      if (novaFoto2) {
        if (isDemo) { foto2_url = preview2; }
        else { const ext=novaFoto2.name.split(".").pop(); foto2_url=await api.uploadFoto(novaFoto2,`${Date.now()}_2.${ext}`); }
      }
      const updated = { ...form, foto_url, foto2_url };
      if (!isDemo) { await api.patch("animais", a.id, updated); }
      onUpdate(updated);
      setEditMode(false);
    } catch(e) { alert("Erro ao salvar: "+e.message); }
    setBusy(false);
  };

  const handleFound = async () => {
    setBusy(true);
    try {
      const updated = { ...a, resolvido:true };
      if (!isDemo) { await api.patch("animais", a.id, { resolvido:true }); }
      onUpdate(updated);
      setResolvido(true);
      setConfirmFound(false);
    } catch(e) { alert("Erro: "+e.message); }
    setBusy(false);
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:20,backdropFilter:"blur(4px)"}} onClick={onClose}>
      <div className="pop" style={{background:"#fff",borderRadius:26,maxWidth:550,width:"100%",maxHeight:"94vh",overflowY:"auto",boxShadow:"0 32px 100px rgba(0,0,0,.3)",position:"relative"}} onClick={e=>e.stopPropagation()}>

        {/* GALERIA DE FOTOS */}
        <div style={{height:240,background:`linear-gradient(${cfg.grad})`,borderRadius:"26px 26px 0 0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:86,position:"relative",overflow:"hidden"}}>
          {fotoExibida
            ? <img src={fotoExibida} alt={form.nome} style={{width:"100%",height:"100%",objectFit:"cover",position:"absolute",inset:0,borderRadius:"26px 26px 0 0"}}/>
            : <span style={{filter:"drop-shadow(0 8px 16px rgba(0,0,0,.22))",position:"relative"}}>{em}</span>
          }
          {/* X fechar */}
          <button onClick={onClose} style={{position:"absolute",top:10,right:10,background:"rgba(255,255,255,.95)",border:"2px solid rgba(255,255,255,.6)",borderRadius:"50%",width:38,height:38,fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",zIndex:10,boxShadow:"0 2px 12px rgba(0,0,0,.25)",fontWeight:700,color:"#333"}}>✕</button>
          {/* badge tipo */}
          <div style={{position:"absolute",top:14,left:14,background:"rgba(0,0,0,.32)",backdropFilter:"blur(8px)",color:"#fff",borderRadius:50,padding:"5px 14px",fontSize:12,fontFamily:"'Nunito'",fontWeight:800}}>{cfg.icon} {cfg.label.toUpperCase()}</div>
          {/* resolvido overlay */}
          {(a.resolvido||resolvido)&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:"#fff",fontFamily:"'Nunito'",fontWeight:800,letterSpacing:.5}}>✅ ENCONTRADO / RESOLVIDO</div>}
          {/* miniaturas das 2 fotos */}
          {fotos.length>1&&(
            <div style={{position:"absolute",bottom:12,left:"50%",transform:"translateX(-50%)",display:"flex",gap:8}}>
              {fotos.map((f,i)=>(
                <div key={i} onClick={e=>{e.stopPropagation();setFotoAtiva(i);}}
                  style={{width:44,height:44,borderRadius:10,overflow:"hidden",border:`3px solid ${fotoAtiva===i?"#fff":"rgba(255,255,255,.4)"}`,cursor:"pointer",transition:"all .2s",boxShadow:"0 2px 8px rgba(0,0,0,.3)"}}>
                  <img src={f} alt={`foto ${i+1}`} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                </div>
              ))}
            </div>
          )}
          {/* badge contador */}
          {fotos.length>1&&(
            <div style={{position:"absolute",top:14,right:56,background:"rgba(0,0,0,.35)",backdropFilter:"blur(8px)",color:"#fff",borderRadius:50,padding:"4px 10px",fontSize:11,fontFamily:"'Nunito'",fontWeight:700}}>
              📸 {fotoAtiva+1}/{fotos.length}
            </div>
          )}
          {/* botões trocar foto no modo edição */}
          {editMode&&(
            <div style={{position:"absolute",bottom:14,left:"50%",transform:"translateX(-50%)",display:"flex",gap:8}}>
              <button onClick={()=>fileRef.current.click()} style={{background:"rgba(255,255,255,.92)",border:"none",borderRadius:50,padding:"6px 14px",fontSize:11,fontFamily:"'Nunito'",fontWeight:700,cursor:"pointer"}}>📸 Foto 1</button>
              <button onClick={()=>fileRef2.current.click()} style={{background:"rgba(255,255,255,.92)",border:"none",borderRadius:50,padding:"6px 14px",fontSize:11,fontFamily:"'Nunito'",fontWeight:700,cursor:"pointer"}}>📸 Foto 2</button>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>handleFoto(e,1)}/>
          <input ref={fileRef2} type="file" accept="image/*" style={{display:"none"}} onChange={e=>handleFoto(e,2)}/>
        </div>

        <div style={{padding:26}}>

          {/* BOTÕES DO DONO */}
          {isOwner && !(a.resolvido||resolvido) && (
            <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap"}}>
              <button onClick={()=>setEditMode(!editMode)}
                style={{flex:1,background:editMode?"#F7F3EE":"#2BAE9E",color:editMode?"#888":"#fff",border:`2px solid ${editMode?"#E8DDD4":"#2BAE9E"}`,borderRadius:50,padding:"10px 16px",fontFamily:"'Nunito'",fontWeight:800,fontSize:13,cursor:"pointer",transition:"all .2s"}}>
                {editMode?"✕ Cancelar edição":"✏️ Editar cadastro"}
              </button>
              <button onClick={()=>setConfirmFound(true)}
                style={{flex:1,background:"linear-gradient(135deg,#2BAE9E,#4DD0C4)",color:"#fff",border:"none",borderRadius:50,padding:"10px 16px",fontFamily:"'Nunito'",fontWeight:800,fontSize:13,cursor:"pointer",boxShadow:"0 4px 14px rgba(43,174,158,.3)"}}>
                ✅ Animal encontrado!
              </button>
            </div>
          )}
          {isOwner && (a.resolvido||resolvido) && (
            <div style={{background:"#F0FFFD",border:"2px solid #B2EDE8",borderRadius:14,padding:"12px 16px",marginBottom:20,textAlign:"center",fontFamily:"'Nunito'",fontWeight:700,color:"#2BAE9E",fontSize:14}}>
              ✅ Este cadastro foi marcado como resolvido!
            </div>
          )}

          {/* CONFIRMAÇÃO ENCONTRADO */}
          {confirmFound && (
            <div style={{background:"#F0FFFD",border:"2px solid #2BAE9E",borderRadius:16,padding:18,marginBottom:20}}>
              <p style={{fontFamily:"'Nunito'",fontWeight:700,color:"#2BAE9E",fontSize:15,marginBottom:12}}>🎉 Confirmar que o animal foi encontrado?</p>
              <p style={{fontFamily:"'Lato'",color:"#888",fontSize:13,marginBottom:14}}>O cadastro será marcado como resolvido e ficará visível como "Encontrado" para outros usuários.</p>
              <div style={{display:"flex",gap:10}}>
                <button onClick={handleFound} disabled={busy}
                  style={{flex:1,background:"#2BAE9E",color:"#fff",border:"none",borderRadius:12,padding:"11px",fontFamily:"'Nunito'",fontWeight:800,fontSize:14,cursor:"pointer"}}>
                  {busy?"Salvando...":"✅ Sim, foi encontrado!"}
                </button>
                <button onClick={()=>setConfirmFound(false)}
                  style={{flex:1,background:"#F7F3EE",color:"#888",border:"2px solid #E8DDD4",borderRadius:12,padding:"11px",fontFamily:"'Nunito'",fontWeight:700,fontSize:14,cursor:"pointer"}}>
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* MODO EDIÇÃO */}
          {editMode ? (
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <h3 style={{fontSize:17,fontWeight:900,fontFamily:"'Nunito'",color:"#2d2d2d",marginBottom:4}}>✏️ Editar cadastro</h3>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div style={{gridColumn:"1/-1"}}>
                  <label style={{fontSize:10,color:"#C5B8AE",fontFamily:"'Lato'",display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:.8,fontWeight:700}}>Nome</label>
                  <input className="inp" value={form.nome} onChange={e=>setForm({...form,nome:e.target.value})}/>
                </div>
                {[
                  {l:"Espécie",k:"especie",sel:["Cachorro","Gato","Pássaro","Coelho","Outro"]},
                  {l:"Raça",k:"raca"},
                  {l:"Cor",k:"cor"},
                  {l:"Porte",k:"porte",sel:["Pequeno","Médio","Grande"]},
                  {l:"Sexo",k:"sexo",sel:["Macho","Fêmea","Indefinido"]},
                  {l:"Cidade",k:"cidade"},
                  {l:"Bairro",k:"bairro"},
                ].map(c=>(
                  <div key={c.k}>
                    <label style={{fontSize:10,color:"#C5B8AE",fontFamily:"'Lato'",display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:.8,fontWeight:700}}>{c.l}</label>
                    {c.sel
                      ? <select className="inp" value={form[c.k]} onChange={e=>setForm({...form,[c.k]:e.target.value})}>{c.sel.map(o=><option key={o}>{o}</option>)}</select>
                      : <input className="inp" value={form[c.k]||""} onChange={e=>setForm({...form,[c.k]:e.target.value})}/>
                    }
                  </div>
                ))}
                <div style={{gridColumn:"1/-1"}}>
                  <label style={{fontSize:10,color:"#C5B8AE",fontFamily:"'Lato'",display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:.8,fontWeight:700}}>Descrição</label>
                  <textarea className="inp" rows={3} value={form.descricao} onChange={e=>setForm({...form,descricao:e.target.value})}/>
                </div>
                <div style={{gridColumn:"1/-1"}}>
                  <label style={{fontSize:10,color:"#C5B8AE",fontFamily:"'Lato'",display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:.8,fontWeight:700}}>WhatsApp</label>
                  <input className="inp" value={form.telefone||""} onChange={e=>setForm({...form,telefone:e.target.value})}/>
                </div>
              </div>
              <button onClick={handleSave} disabled={busy}
                style={{background:"linear-gradient(135deg,#E05C5C,#FF8A80)",color:"#fff",border:"none",borderRadius:14,padding:"14px",fontFamily:"'Nunito'",fontWeight:900,fontSize:15,cursor:busy?"not-allowed":"pointer",opacity:busy?.6:1,boxShadow:"0 5px 18px rgba(224,92,92,.3)"}}>
                {busy?"Salvando...":"💾 Salvar alterações"}
              </button>
            </div>
          ) : (
            <>
              <h2 style={{fontSize:26,fontWeight:900,fontFamily:"'Nunito'",color:"#2d2d2d",letterSpacing:-.5,marginBottom:4}}>{a.nome}</h2>
              <p style={{color:"#C5B8AE",fontFamily:"'Lato'",marginBottom:18,fontSize:13}}>Cadastrado por <strong style={{color:"#888"}}>{a.usuario_nome}</strong> · {(a.created_at||"").split("T")[0]}</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:16}}>
                {[{l:"Espécie",v:a.especie},{l:"Raça",v:a.raca},{l:"Cor",v:a.cor},{l:"Porte",v:a.porte},{l:"Sexo",v:a.sexo},{l:"Local",v:`${a.bairro?a.bairro+", ":""}${a.cidade}`}].map((item,i)=>(
                  <div key={i} style={{background:"#FAF6F2",borderRadius:11,padding:"11px 13px",border:"1px solid #F0E8E0"}}>
                    <div style={{fontSize:9,color:"#C5B8AE",fontFamily:"'Lato'",marginBottom:2,textTransform:"uppercase",letterSpacing:.8}}>{item.l}</div>
                    <div style={{fontSize:13,fontWeight:800,fontFamily:"'Nunito'",color:"#333"}}>{item.v||"—"}</div>
                  </div>
                ))}
              </div>
              <div style={{background:"#FAF6F2",borderRadius:13,padding:14,marginBottom:16,border:"1px solid #F0E8E0"}}>
                <div style={{fontSize:9,color:"#C5B8AE",fontFamily:"'Lato'",marginBottom:5,textTransform:"uppercase",letterSpacing:.8}}>Descrição</div>
                <p style={{fontFamily:"'Lato'",color:"#666",lineHeight:1.72,fontSize:14}}>{a.descricao}</p>
              </div>
              <MapaModal lat={a.lat} lng={a.lng} nome={a.nome} tipo={a.tipo}/>
              <div style={{marginTop:18}}>
                <a href={`https://wa.me/55${a.telefone?.replace(/\D/g,"")}`} target="_blank" rel="noreferrer"
                  style={{display:"flex",alignItems:"center",justifyContent:"center",gap:9,background:`linear-gradient(${cfg.grad})`,color:"#fff",borderRadius:14,padding:"15px",fontFamily:"'Nunito'",fontWeight:800,fontSize:15,textDecoration:"none",boxShadow:`0 5px 18px ${cfg.color}38`,transition:"all .2s"}}
                  onMouseEnter={e=>e.currentTarget.style.opacity=".88"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                  📱 Entrar em contato via WhatsApp
                </a>
                <p style={{textAlign:"center",color:"#D0C4BC",fontSize:11,fontFamily:"'Lato'",marginTop:5}}>{a.telefone}</p>
              </div>
              <Share animal={a}/>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── CARD ──────────────────────────────────────────────────────────
function Card({ a, onClick }) {
  const cfg = TC[a.tipo];
  const em = EM[a.especie]||"🐾";
  return (
    <div onClick={()=>onClick(a)} className="fu"
      style={{background:"#fff",borderRadius:20,overflow:"hidden",cursor:"pointer",boxShadow:"0 2px 18px rgba(0,0,0,.06)",border:`1px solid ${a.resolvido?"#B2EDE8":cfg.border}`,transition:"all .22s",opacity:a.resolvido?.8:1}}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-5px)";e.currentTarget.style.boxShadow="0 14px 38px rgba(0,0,0,.12)";}}
      onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 2px 18px rgba(0,0,0,.06)";}}>
      <div style={{height:180,background:a.resolvido?"linear-gradient(135deg,#2BAE9E,#4DD0C4)":`linear-gradient(${cfg.grad})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:70,position:"relative",overflow:"hidden"}}>
        {a.foto_url ? <img src={a.foto_url} alt={a.nome} style={{width:"100%",height:"100%",objectFit:"cover",position:"absolute",inset:0}}/> : <span style={{filter:"drop-shadow(0 5px 10px rgba(0,0,0,.18))",position:"relative"}}>{em}</span>}
        {/* Badge — mostra ENCONTRADO se resolvido, ou o tipo normal */}
        {a.resolvido
          ? <div style={{position:"absolute",top:11,left:11,background:"rgba(0,0,0,.35)",backdropFilter:"blur(8px)",color:"#fff",borderRadius:50,padding:"4px 11px",fontSize:11,fontFamily:"'Nunito'",fontWeight:800}}>✅ Encontrado</div>
          : <div style={{position:"absolute",top:11,left:11,background:"rgba(0,0,0,.3)",backdropFilter:"blur(8px)",color:"#fff",borderRadius:50,padding:"4px 11px",fontSize:11,fontFamily:"'Nunito'",fontWeight:800}}>{cfg.icon} {cfg.label}</div>
        }
        {/* badge 2 fotos */}
        {a.foto_url&&a.foto2_url&&(
          <div style={{position:"absolute",top:11,right:11,background:"rgba(0,0,0,.35)",backdropFilter:"blur(8px)",color:"#fff",borderRadius:50,padding:"4px 10px",fontSize:10,fontFamily:"'Nunito'",fontWeight:700}}>
            📸 2 fotos
          </div>
        )}
        {a.resolvido&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.25)",display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{background:"rgba(43,174,158,.9)",borderRadius:16,padding:"8px 20px",fontSize:13,fontFamily:"'Nunito'",fontWeight:800,color:"#fff",textAlign:"center"}}>✅ RESOLVIDO</div></div>}
        {!a.resolvido&&a.lat&&a.lng&&!a.foto2_url&&<div style={{position:"absolute",bottom:9,right:9,background:"rgba(255,255,255,.88)",backdropFilter:"blur(8px)",borderRadius:50,padding:"3px 9px",fontSize:10,fontFamily:"'Nunito'",fontWeight:700,color:"#555"}}>📍 No mapa</div>}
      </div>
      <div style={{padding:"15px 17px 17px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:3}}>
          <h3 style={{fontSize:16,fontWeight:900,fontFamily:"'Nunito'",color:"#2d2d2d",letterSpacing:-.2}}>{a.nome}</h3>
          <span style={{fontSize:10,color:"#C5B8AE",fontFamily:"'Lato'",whiteSpace:"nowrap",marginLeft:5}}>{(a.created_at||"").split("T")[0]}</span>
        </div>
        <p style={{fontSize:12,color:"#A89990",fontFamily:"'Lato'",marginBottom:7,fontWeight:700}}>{a.especie} · {a.raca} · {a.porte}</p>
        <div style={{display:"flex",gap:4,fontSize:12,color:"#C5B8AE",fontFamily:"'Lato'",marginBottom:7}}>📍 {a.bairro?a.bairro+", ":""}{a.cidade}</div>
        <p style={{fontSize:12,color:"#B0A09A",fontFamily:"'Lato'",lineHeight:1.5,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{a.descricao}</p>
        <div style={{marginTop:11,paddingTop:11,borderTop:`1px solid ${a.resolvido?"#B2EDE8":cfg.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:11,color:"#C5B8AE",fontFamily:"'Lato'"}}>por {a.usuario_nome}</span>
          <span style={{background:a.resolvido?"#F0FFFD":cfg.bg,color:a.resolvido?"#2BAE9E":cfg.color,borderRadius:50,padding:"3px 11px",fontSize:11,fontFamily:"'Nunito'",fontWeight:700,border:`1px solid ${a.resolvido?"#B2EDE8":cfg.border}`}}>
            {a.resolvido?"✅ Resolvido":"Ver →"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── FORM ──────────────────────────────────────────────────────────
function Form({ user, onSave, onCancel, isDemo }) {
  const [f, setF] = useState({ tipo:"perdido", nome:"", especie:"Cachorro", raca:"", cor:"", porte:"Médio", sexo:"Indefinido", cidade:"", bairro:"", descricao:"", telefone:user.telefone||"" });
  const [foto, setFoto] = useState(null);
  const [foto2, setFoto2] = useState(null);
  const [prev, setPrev] = useState(null);
  const [prev2, setPrev2] = useState(null);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [busy, setBusy] = useState(false);
  const [prog, setProg] = useState("");
  const ref = useRef();
  const ref2 = useRef();
  const cfg = TC[f.tipo];

  const onFoto = (e, slot) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size>10*1024*1024) { alert("Máx 10MB!"); return; }
    const r = new FileReader();
    if (slot===1) { setFoto(file); r.onload=ev=>setPrev(ev.target.result); }
    else { setFoto2(file); r.onload=ev=>setPrev2(ev.target.result); }
    r.readAsDataURL(file);
  };

  const save = async () => {
    if (!f.nome||!f.cidade||!f.descricao) { alert("Preencha nome, cidade e descrição!"); return; }
    setBusy(true);
    try {
      let foto_url = null, foto2_url = null;
      if (isDemo) {
        foto_url = prev; foto2_url = prev2;
        setProg("Salvando...");
        await new Promise(r=>setTimeout(r,700));
        onSave({ ...f, id:Date.now().toString(), foto_url, foto2_url, lat, lng, usuario_nome:user.nome, created_at:new Date().toISOString(), resolvido:false });
      } else {
        if (foto) { setProg("📸 Enviando foto 1..."); const ext=foto.name.split(".").pop(); foto_url=await api.uploadFoto(foto,`${Date.now()}_1.${ext}`); }
        if (foto2) { setProg("📸 Enviando foto 2..."); const ext=foto2.name.split(".").pop(); foto2_url=await api.uploadFoto(foto2,`${Date.now()}_2.${ext}`); }
        setProg("💾 Salvando...");
        const res = await api.post("animais",{ ...f, foto_url, foto2_url, lat, lng, usuario_id:user.id, usuario_nome:user.nome, resolvido:false });
        if (res.error) throw new Error(res.error.message);
        onSave(res[0]);
      }
    } catch(e) { alert("Erro: "+e.message); }
    finally { setBusy(false); setProg(""); }
  };

  const campos = [
    {l:"Espécie *",k:"especie",sel:["Cachorro","Gato","Pássaro","Coelho","Outro"]},
    {l:"Raça",k:"raca",p:"Ex: Labrador, SRD..."},
    {l:"Cor / Pelagem",k:"cor",p:"Ex: Amarelo, preto..."},
    {l:"Porte",k:"porte",sel:["Pequeno","Médio","Grande"]},
    {l:"Sexo",k:"sexo",sel:["Macho","Fêmea","Indefinido"]},
    {l:"Cidade *",k:"cidade",p:"Ex: São Paulo"},
    {l:"Bairro",k:"bairro",p:"Ex: Moema"},
  ];

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:20,backdropFilter:"blur(4px)"}} onClick={onCancel}>
      <div className="pop" style={{background:"#fff",borderRadius:26,maxWidth:590,width:"100%",maxHeight:"95vh",overflowY:"auto",boxShadow:"0 32px 100px rgba(0,0,0,.3)"}} onClick={e=>e.stopPropagation()}>
        <div style={{padding:"22px 24px 0",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #F0E8E0",paddingBottom:15}}>
          <div><h2 style={{fontSize:21,fontWeight:900,fontFamily:"'Nunito'",color:"#2d2d2d"}}>Cadastrar Animal</h2><p style={{fontSize:12,color:"#C5B8AE",fontFamily:"'Lato'",marginTop:2}}>* campos obrigatórios</p></div>
          <button onClick={onCancel} style={{background:"#FAF6F2",border:"none",borderRadius:"50%",width:35,height:35,fontSize:17,cursor:"pointer",color:"#888"}}>✕</button>
        </div>
        <div style={{padding:24,display:"flex",flexDirection:"column",gap:16}}>
          {/* tipo */}
          <div>
            <label style={{fontSize:10,color:"#C5B8AE",fontFamily:"'Lato'",display:"block",marginBottom:8,textTransform:"uppercase",letterSpacing:.8,fontWeight:700}}>Tipo *</label>
            <div style={{display:"flex",gap:9}}>
              {Object.entries(TC).map(([k,c])=>(
                <button key={k} onClick={()=>setF({...f,tipo:k})}
                  style={{flex:1,padding:"11px 6px",background:f.tipo===k?c.color:"#FAF6F2",border:`2px solid ${f.tipo===k?c.color:"#F0E8E0"}`,borderRadius:13,color:f.tipo===k?"#fff":"#A89990",fontFamily:"'Nunito'",fontWeight:800,fontSize:12,cursor:"pointer",transition:"all .2s"}}>
                  {c.icon}<br/>{c.label}
                </button>
              ))}
            </div>
          </div>
          {/* fotos */}
          <div>
            <label style={{fontSize:10,color:"#C5B8AE",fontFamily:"'Lato'",display:"block",marginBottom:8,textTransform:"uppercase",letterSpacing:.8,fontWeight:700}}>Fotos do animal <span style={{color:"#D0C4BC",fontWeight:400}}>(até 2 fotos)</span></label>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              {[{slot:1,p:prev,r:ref,label:"Foto 1"},{slot:2,p:prev2,r:ref2,label:"Foto 2 (opcional)"}].map(({slot,p,r,label})=>(
                <div key={slot}>
                  <div onClick={()=>r.current.click()}
                    style={{height:120,background:p?"transparent":"#FAF6F2",border:`2px dashed ${p?cfg.color:"#E0D4C8"}`,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",overflow:"hidden",transition:"all .2s",position:"relative"}}
                    onMouseEnter={e=>{if(!p)e.currentTarget.style.borderColor=cfg.color;}} onMouseLeave={e=>{if(!p)e.currentTarget.style.borderColor="#E0D4C8";}}>
                    {p
                      ? <>
                          <img src={p} alt={label} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                          <div style={{position:"absolute",bottom:0,left:0,right:0,background:"rgba(0,0,0,.4)",padding:"4px 8px",textAlign:"center"}}>
                            <span style={{fontSize:10,color:"#fff",fontFamily:"'Nunito'",fontWeight:700}}>Trocar foto</span>
                          </div>
                        </>
                      : <div style={{textAlign:"center",color:"#D0C4BC",fontFamily:"'Lato'",padding:8}}>
                          <div style={{fontSize:26,marginBottom:4}}>📸</div>
                          <div style={{fontSize:11,fontWeight:700}}>{label}</div>
                          <div style={{fontSize:9,marginTop:2}}>JPG, PNG · Máx 10MB</div>
                        </div>
                    }
                  </div>
                  <input ref={r} type="file" accept="image/jpeg,image/png,image/webp" style={{display:"none"}} onChange={e=>onFoto(e,slot)}/>
                </div>
              ))}
            </div>
          </div>
          {/* campos */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div style={{gridColumn:"1/-1"}}>
              <label style={{fontSize:10,color:"#C5B8AE",fontFamily:"'Lato'",display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:.8,fontWeight:700}}>Nome / Apelido *</label>
              <input className="inp" placeholder={f.tipo==="achado"?"Desconhecido":"Nome do animal"} value={f.nome} onChange={e=>setF({...f,nome:e.target.value})}/>
            </div>
            {campos.map(c=>(
              <div key={c.k}>
                <label style={{fontSize:10,color:"#C5B8AE",fontFamily:"'Lato'",display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:.8,fontWeight:700}}>{c.l}</label>
                {c.sel ? <select className="inp" value={f[c.k]} onChange={e=>setF({...f,[c.k]:e.target.value})}>{c.sel.map(o=><option key={o}>{o}</option>)}</select>
                       : <input className="inp" placeholder={c.p||""} value={f[c.k]} onChange={e=>setF({...f,[c.k]:e.target.value})}/>}
              </div>
            ))}
          </div>
          <div>
            <label style={{fontSize:10,color:"#C5B8AE",fontFamily:"'Lato'",display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:.8,fontWeight:700}}>Descrição *</label>
            <textarea className="inp" placeholder="Descreva marcas, comportamento, onde foi visto..." value={f.descricao} onChange={e=>setF({...f,descricao:e.target.value})}/>
          </div>
          <div>
            <label style={{fontSize:10,color:"#C5B8AE",fontFamily:"'Lato'",display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:.8,fontWeight:700}}>WhatsApp *</label>
            <input className="inp" placeholder="(00) 99999-9999" value={f.telefone} onChange={e=>setF({...f,telefone:e.target.value})}/>
          </div>
          <MapaPicker lat={lat} lng={lng} onChange={(a,b)=>{setLat(a);setLng(b);}}/>
          {busy&&<div style={{background:"#FAF6F2",borderRadius:11,padding:"11px 15px",display:"flex",alignItems:"center",gap:9,border:"1px solid #F0E8E0"}}><div style={{width:16,height:16,border:`2px solid #F0E8E0`,borderTop:`2px solid ${cfg.color}`,borderRadius:"50%",animation:"spin 1s linear infinite",flexShrink:0}}/><span style={{fontFamily:"'Lato'",fontSize:13,color:"#888"}}>{prog||"Processando..."}</span></div>}
          <button onClick={save} disabled={busy}
            style={{background:`linear-gradient(${cfg.grad})`,color:"#fff",border:"none",borderRadius:14,padding:"15px",fontFamily:"'Nunito'",fontWeight:900,fontSize:15,cursor:busy?"not-allowed":"pointer",opacity:busy?.6:1,boxShadow:`0 5px 18px ${cfg.color}30`,transition:"all .2s",marginTop:2}}>
            {busy?"Publicando...":` ${cfg.icon} Publicar cadastro`}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── AUTH ──────────────────────────────────────────────────────────
function Auth({ onLogin, onClose, isDemo, users, setUsers }) {
  const [mode, setMode] = useState("login");
  const [f, setF] = useState({ nome:"", email:"", senha:"", telefone:"" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const go = async () => {
    setErr(""); setBusy(true);
    try {
      if (mode==="login") {
        const u = isDemo ? users.find(u=>u.email===f.email&&u.senha===f.senha) : await api.loginUser(f.email,f.senha);
        if (u) onLogin(u); else setErr("E-mail ou senha incorretos.");
      } else {
        if (!f.nome||!f.email||!f.senha) { setErr("Preencha todos os campos!"); return; }
        if (isDemo) {
          if (users.find(u=>u.email===f.email)) { setErr("E-mail já cadastrado."); return; }
          const n = { id:Date.now().toString(), ...f }; setUsers(u=>[...u,n]); onLogin(n);
        } else {
          if (await api.emailExists(f.email)) { setErr("E-mail já cadastrado."); return; }
          const res = await api.post("usuarios",f); if (res.error) throw new Error(res.error.message); onLogin(res[0]);
        }
      }
    } catch(e) { setErr("Erro: "+e.message); } finally { setBusy(false); }
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:20,backdropFilter:"blur(4px)"}} onClick={onClose}>
      <div className="pop" style={{background:"#fff",borderRadius:26,maxWidth:400,width:"100%",padding:32,boxShadow:"0 32px 100px rgba(0,0,0,.3)"}} onClick={e=>e.stopPropagation()}>
        <div style={{textAlign:"center",marginBottom:24}}><div style={{fontSize:48,marginBottom:10}}>🐾</div><h2 style={{fontSize:22,fontWeight:900,fontFamily:"'Nunito'",color:"#2d2d2d",letterSpacing:-.5}}>{mode==="login"?"Bem-vindo de volta!":"Criar conta grátis"}</h2><p style={{color:"#C5B8AE",fontFamily:"'Lato'",fontSize:12,marginTop:4}}>Para cadastrar animais você precisa estar logado</p></div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {mode==="cadastro"&&<><input className="inp" placeholder="Nome completo" value={f.nome} onChange={e=>setF({...f,nome:e.target.value})}/><input className="inp" placeholder="WhatsApp" value={f.telefone} onChange={e=>setF({...f,telefone:e.target.value})}/></>}
          <input className="inp" placeholder="E-mail" type="email" value={f.email} onChange={e=>setF({...f,email:e.target.value})}/>
          <input className="inp" placeholder="Senha" type="password" value={f.senha} onChange={e=>setF({...f,senha:e.target.value})} onKeyDown={e=>e.key==="Enter"&&go()}/>
          {err&&<p style={{color:"#E05C5C",fontSize:12,fontFamily:"'Lato'",textAlign:"center",background:"#FFF2F2",padding:"8px",borderRadius:9}}>{err}</p>}
          <button onClick={go} disabled={busy} className="bp" style={{width:"100%",borderRadius:13,padding:"13px",fontSize:14,marginTop:3}}>{busy?"Aguarde...":mode==="login"?"Entrar →":"Criar conta →"}</button>
          <p style={{textAlign:"center",fontFamily:"'Lato'",fontSize:13,color:"#C5B8AE"}}>{mode==="login"?"Não tem conta? ":"Já tem conta? "}<span onClick={()=>{setMode(mode==="login"?"cadastro":"login");setErr("");}} style={{color:"#E05C5C",fontWeight:700,cursor:"pointer",textDecoration:"underline"}}>{mode==="login"?"Cadastre-se grátis":"Fazer login"}</span></p>
          {mode==="login"&&isDemo&&<p style={{textAlign:"center",fontSize:10,color:"#D0C4BC",fontFamily:"'Lato'",background:"#FAF6F2",padding:"6px",borderRadius:7}}>Demo: carlos@email.com / 123456</p>}
        </div>
      </div>
    </div>
  );
}

// ── PERFIL USUARIO ────────────────────────────────────────────────
function PerfilModal({ user, onClose, onUpdate, isDemo, users, setUsers }) {
  const [form, setForm] = useState({ nome:user.nome||"", telefone:user.telefone||"", email:user.email||"", senhaAtual:"", novaSenha:"", confirmarSenha:"" });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const [tab, setTab] = useState("dados"); // dados | senha

  const salvarDados = async () => {
    if (!form.nome) { setMsg({t:"erro",v:"Nome não pode estar vazio!"}); return; }
    setBusy(true);
    try {
      const updated = { ...user, nome:form.nome, telefone:form.telefone };
      if (!isDemo) { await api.patch("usuarios", user.id, { nome:form.nome, telefone:form.telefone }); }
      else { setUsers(u=>u.map(u=>u.id===user.id?{...u,nome:form.nome,telefone:form.telefone}:u)); }
      onUpdate(updated);
      setMsg({t:"ok",v:"Dados atualizados com sucesso! ✅"});
    } catch(e) { setMsg({t:"erro",v:"Erro ao salvar: "+e.message}); }
    setBusy(false);
  };

  const salvarSenha = async () => {
    if (!form.senhaAtual) { setMsg({t:"erro",v:"Digite a senha atual!"}); return; }
    if (form.senhaAtual !== user.senha) { setMsg({t:"erro",v:"Senha atual incorreta!"}); return; }
    if (!form.novaSenha || form.novaSenha.length < 6) { setMsg({t:"erro",v:"Nova senha deve ter pelo menos 6 caracteres!"}); return; }
    if (form.novaSenha !== form.confirmarSenha) { setMsg({t:"erro",v:"As senhas não coincidem!"}); return; }
    setBusy(true);
    try {
      const updated = { ...user, senha:form.novaSenha };
      if (!isDemo) { await api.patch("usuarios", user.id, { senha:form.novaSenha }); }
      else { setUsers(u=>u.map(u=>u.id===user.id?{...u,senha:form.novaSenha}:u)); }
      onUpdate(updated);
      setForm({...form, senhaAtual:"", novaSenha:"", confirmarSenha:""});
      setMsg({t:"ok",v:"Senha alterada com sucesso! ✅"});
    } catch(e) { setMsg({t:"erro",v:"Erro ao salvar: "+e.message}); }
    setBusy(false);
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:20,backdropFilter:"blur(4px)"}} onClick={onClose}>
      <div className="pop" style={{background:"#fff",borderRadius:26,maxWidth:460,width:"100%",boxShadow:"0 32px 100px rgba(0,0,0,.3)",overflow:"hidden"}} onClick={e=>e.stopPropagation()}>

        {/* HEADER */}
        <div style={{background:"linear-gradient(135deg,#E05C5C,#FF8A80)",padding:"24px 28px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:52,height:52,borderRadius:"50%",background:"rgba(255,255,255,.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:800,color:"#fff",border:"2px solid rgba(255,255,255,.4)"}}>
              {user.nome?.charAt(0)?.toUpperCase()||"?"}
            </div>
            <div>
              <h2 style={{fontSize:18,fontWeight:900,fontFamily:"'Nunito'",color:"#fff",letterSpacing:-.3}}>{user.nome}</h2>
              <p style={{fontSize:12,color:"rgba(255,255,255,.8)",fontFamily:"'Lato'"}}>{user.email}</p>
            </div>
          </div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,.2)",border:"2px solid rgba(255,255,255,.4)",borderRadius:"50%",width:36,height:36,fontSize:17,cursor:"pointer",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>✕</button>
        </div>

        {/* TABS */}
        <div style={{display:"flex",borderBottom:"1px solid #F0E8E0"}}>
          {[{k:"dados",l:"📋 Meus dados"},{k:"senha",l:"🔑 Alterar senha"}].map(t=>(
            <button key={t.k} onClick={()=>{setTab(t.k);setMsg(null);}}
              style={{flex:1,padding:"13px",background:tab===t.k?"#FAF6F2":"#fff",color:tab===t.k?"#E05C5C":"#A89990",border:"none",borderBottom:tab===t.k?"2px solid #E05C5C":"2px solid transparent",fontFamily:"'Nunito'",fontWeight:700,fontSize:13,cursor:"pointer",transition:"all .2s"}}>
              {t.l}
            </button>
          ))}
        </div>

        <div style={{padding:28}}>
          {msg&&<div style={{background:msg.t==="ok"?"#F0FFFD":"#FFF2F2",border:`1px solid ${msg.t==="ok"?"#B2EDE8":"#FFD5D5"}`,borderRadius:10,padding:"10px 14px",marginBottom:16,fontFamily:"'Lato'",fontSize:13,color:msg.t==="ok"?"#2BAE9E":"#E05C5C"}}>{msg.v}</div>}

          {tab==="dados"&&(
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <div>
                <label style={{fontSize:11,color:"#C5B8AE",fontFamily:"'Lato'",display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:.8,fontWeight:700}}>Nome completo</label>
                <input className="inp" value={form.nome} onChange={e=>setForm({...form,nome:e.target.value})} placeholder="Seu nome completo"/>
              </div>
              <div>
                <label style={{fontSize:11,color:"#C5B8AE",fontFamily:"'Lato'",display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:.8,fontWeight:700}}>WhatsApp</label>
                <input className="inp" value={form.telefone} onChange={e=>setForm({...form,telefone:e.target.value})} placeholder="(00) 99999-9999"/>
              </div>
              <div>
                <label style={{fontSize:11,color:"#C5B8AE",fontFamily:"'Lato'",display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:.8,fontWeight:700}}>E-mail</label>
                <input className="inp" value={form.email} disabled style={{opacity:.5,cursor:"not-allowed"}}/>
                <p style={{fontSize:11,color:"#C5B8AE",fontFamily:"'Lato'",marginTop:4}}>O e-mail não pode ser alterado.</p>
              </div>
              <button onClick={salvarDados} disabled={busy}
                style={{background:"linear-gradient(135deg,#E05C5C,#FF8A80)",color:"#fff",border:"none",borderRadius:14,padding:"14px",fontFamily:"'Nunito'",fontWeight:800,fontSize:15,cursor:busy?"not-allowed":"pointer",opacity:busy?.6:1,boxShadow:"0 4px 14px rgba(224,92,92,.3)",marginTop:4}}>
                {busy?"Salvando...":"💾 Salvar dados"}
              </button>
            </div>
          )}

          {tab==="senha"&&(
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <div>
                <label style={{fontSize:11,color:"#C5B8AE",fontFamily:"'Lato'",display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:.8,fontWeight:700}}>Senha atual</label>
                <input className="inp" type="password" value={form.senhaAtual} onChange={e=>setForm({...form,senhaAtual:e.target.value})} placeholder="Digite sua senha atual"/>
              </div>
              <div>
                <label style={{fontSize:11,color:"#C5B8AE",fontFamily:"'Lato'",display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:.8,fontWeight:700}}>Nova senha</label>
                <input className="inp" type="password" value={form.novaSenha} onChange={e=>setForm({...form,novaSenha:e.target.value})} placeholder="Mínimo 6 caracteres"/>
              </div>
              <div>
                <label style={{fontSize:11,color:"#C5B8AE",fontFamily:"'Lato'",display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:.8,fontWeight:700}}>Confirmar nova senha</label>
                <input className="inp" type="password" value={form.confirmarSenha} onChange={e=>setForm({...form,confirmarSenha:e.target.value})} placeholder="Repita a nova senha"/>
              </div>
              <button onClick={salvarSenha} disabled={busy}
                style={{background:"linear-gradient(135deg,#E05C5C,#FF8A80)",color:"#fff",border:"none",borderRadius:14,padding:"14px",fontFamily:"'Nunito'",fontWeight:800,fontSize:15,cursor:busy?"not-allowed":"pointer",opacity:busy?.6:1,boxShadow:"0 4px 14px rgba(224,92,92,.3)",marginTop:4}}>
                {busy?"Salvando...":"🔑 Alterar senha"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── ADMIN PANEL ───────────────────────────────────────────────────
const ADMIN_EMAIL = "juliomelobr@gmail.com";

function AdminPanel({ animals, users, onClose, onUpdate, onDelete, isDemo }) {
  const [tab, setTab] = useState("animais"); // animais | usuarios | stats
  const [editando, setEditando] = useState(null);
  const [formEdit, setFormEdit] = useState({});
  const [busca, setBusca] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [busy, setBusy] = useState(false);
  const [confirmDel, setConfirmDel] = useState(null);

  const animaisFiltrados = animals.filter(a => {
    const matchTipo = filtroTipo === "todos" || a.tipo === filtroTipo;
    const matchBusca = !busca || a.nome?.toLowerCase().includes(busca.toLowerCase()) || a.cidade?.toLowerCase().includes(busca.toLowerCase()) || a.usuario_nome?.toLowerCase().includes(busca.toLowerCase());
    return matchTipo && matchBusca;
  });

  const handleEdit = (a) => { setEditando(a.id); setFormEdit({ ...a }); };

  const handleSave = async () => {
    setBusy(true);
    try {
      if (!isDemo) await api.patch("animais", editando, formEdit);
      onUpdate(formEdit);
      setEditando(null);
    } catch(e) { alert("Erro: "+e.message); }
    setBusy(false);
  };

  const handleDelete = async (id) => {
    setBusy(true);
    try {
      if (!isDemo) {
        await fetch(`${SUPABASE_URL}/rest/v1/animais?id=eq.${id}`, { method:"DELETE", headers:{ apikey:SUPABASE_KEY, Authorization:`Bearer ${SUPABASE_KEY}` } });
      }
      onDelete(id);
      setConfirmDel(null);
    } catch(e) { alert("Erro: "+e.message); }
    setBusy(false);
  };

  const handleResolvido = async (a) => {
    const novo = { ...a, resolvido: !a.resolvido };
    if (!isDemo) await api.patch("animais", a.id, { resolvido: !a.resolvido });
    onUpdate(novo);
  };

  const stats = {
    total: animals.length,
    perdidos: animals.filter(a=>a.tipo==="perdido").length,
    achados: animals.filter(a=>a.tipo==="achado").length,
    adocao: animals.filter(a=>a.tipo==="adocao").length,
    resolvidos: animals.filter(a=>a.resolvido).length,
    comFoto: animals.filter(a=>a.foto_url).length,
    comMapa: animals.filter(a=>a.lat&&a.lng).length,
    totalUsuarios: users.length,
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2000,padding:16,backdropFilter:"blur(4px)"}}>
      <div style={{background:"#1a1a2e",borderRadius:24,width:"100%",maxWidth:900,maxHeight:"95vh",overflowY:"auto",boxShadow:"0 32px 100px rgba(0,0,0,.5)",border:"1px solid #2e2e4e"}}>

        {/* HEADER */}
        <div style={{padding:"20px 28px",borderBottom:"1px solid #2e2e4e",display:"flex",alignItems:"center",justifyContent:"space-between",background:"linear-gradient(135deg,#E05C5C,#FF8A80)",borderRadius:"24px 24px 0 0"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <span style={{fontSize:28}}>🛡️</span>
            <div>
              <h2 style={{fontSize:20,fontWeight:900,fontFamily:"'Nunito'",color:"#fff",letterSpacing:-.5}}>Painel Administrativo</h2>
              <p style={{fontSize:11,color:"rgba(255,255,255,.8)",fontFamily:"'Lato'"}}>PetLynk · Acesso exclusivo</p>
            </div>
          </div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,.2)",border:"2px solid rgba(255,255,255,.4)",borderRadius:"50%",width:38,height:38,fontSize:18,cursor:"pointer",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>✕</button>
        </div>

        {/* TABS */}
        <div style={{display:"flex",gap:4,padding:"16px 28px 0",borderBottom:"1px solid #2e2e4e"}}>
          {[{k:"stats",l:"📊 Dashboard"},{k:"animais",l:"🐾 Animais"},{k:"usuarios",l:"👥 Usuários"}].map(t=>(
            <button key={t.k} onClick={()=>setTab(t.k)}
              style={{padding:"10px 20px",background:tab===t.k?"#E05C5C":"transparent",color:tab===t.k?"#fff":"#888",border:"none",borderRadius:"10px 10px 0 0",fontFamily:"'Nunito'",fontWeight:700,fontSize:13,cursor:"pointer",transition:"all .2s"}}>
              {t.l}
            </button>
          ))}
        </div>

        <div style={{padding:28}}>

          {/* DASHBOARD */}
          {tab==="stats"&&(
            <div>
              <h3 style={{fontSize:16,fontWeight:800,fontFamily:"'Nunito'",color:"#fff",marginBottom:20}}>Resumo geral</h3>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:24}}>
                {[
                  {l:"Total cadastros",v:stats.total,c:"#E05C5C",i:"🐾"},
                  {l:"Resolvidos",v:stats.resolvidos,c:"#2BAE9E",i:"✅"},
                  {l:"Com foto",v:stats.comFoto,c:"#F0922B",i:"📸"},
                  {l:"Usuários",v:stats.totalUsuarios,c:"#845EC2",i:"👥"},
                ].map((s,i)=>(
                  <div key={i} style={{background:"#12122a",borderRadius:16,padding:"18px 16px",border:`1px solid ${s.c}30`,textAlign:"center"}}>
                    <div style={{fontSize:28,marginBottom:6}}>{s.i}</div>
                    <div style={{fontSize:28,fontWeight:900,color:s.c,fontFamily:"'Nunito'",letterSpacing:-1}}>{s.v}</div>
                    <div style={{fontSize:11,color:"#888",fontFamily:"'Lato'",marginTop:3}}>{s.l}</div>
                  </div>
                ))}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
                {[
                  {l:"💔 Perdidos",v:stats.perdidos,c:"#E05C5C"},
                  {l:"🤝 Achados",v:stats.achados,c:"#2BAE9E"},
                  {l:"🏠 Adoção",v:stats.adocao,c:"#F0922B"},
                ].map((s,i)=>(
                  <div key={i} style={{background:"#12122a",borderRadius:16,padding:"16px",border:`1px solid ${s.c}30`,display:"flex",alignItems:"center",gap:14}}>
                    <div style={{fontSize:32,fontWeight:900,color:s.c,fontFamily:"'Nunito'"}}>{s.v}</div>
                    <div style={{fontSize:13,color:"#aaa",fontFamily:"'Lato'"}}>{s.l}</div>
                  </div>
                ))}
              </div>
              <div style={{marginTop:20,background:"#12122a",borderRadius:16,padding:20,border:"1px solid #2e2e4e"}}>
                <p style={{fontFamily:"'Lato'",color:"#888",fontSize:13,marginBottom:8}}>📍 Com localização no mapa</p>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{flex:1,background:"#2e2e4e",borderRadius:50,height:8}}>
                    <div style={{width:`${stats.total>0?(stats.comMapa/stats.total*100):0}%`,background:"linear-gradient(90deg,#E05C5C,#FF8A80)",borderRadius:50,height:8,transition:"width .5s"}}/>
                  </div>
                  <span style={{color:"#fff",fontFamily:"'Nunito'",fontWeight:700,fontSize:14}}>{stats.comMapa}/{stats.total}</span>
                </div>
              </div>
            </div>
          )}

          {/* ANIMAIS */}
          {tab==="animais"&&(
            <div>
              <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap"}}>
                <input
                  style={{flex:1,minWidth:200,background:"#12122a",border:"1px solid #2e2e4e",borderRadius:10,padding:"9px 14px",color:"#fff",fontFamily:"'Lato'",fontSize:13,outline:"none"}}
                  placeholder="🔍 Buscar por nome, cidade ou usuário..."
                  value={busca} onChange={e=>setBusca(e.target.value)}
                />
                <select value={filtroTipo} onChange={e=>setFiltroTipo(e.target.value)}
                  style={{background:"#12122a",border:"1px solid #2e2e4e",borderRadius:10,padding:"9px 14px",color:"#888",fontFamily:"'Nunito'",fontWeight:700,fontSize:12,cursor:"pointer",outline:"none"}}>
                  <option value="todos">Todos</option>
                  <option value="perdido">💔 Perdidos</option>
                  <option value="achado">🤝 Achados</option>
                  <option value="adocao">🏠 Adoção</option>
                </select>
              </div>
              <p style={{fontFamily:"'Lato'",color:"#666",fontSize:12,marginBottom:14}}>{animaisFiltrados.length} cadastros encontrados</p>

              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {animaisFiltrados.map(a=>{
                  const cfg = TC[a.tipo];
                  const isEdit = editando===a.id;
                  return (
                    <div key={a.id} style={{background:"#12122a",borderRadius:16,border:`1px solid ${isEdit?"#E05C5C":"#2e2e4e"}`,overflow:"hidden",transition:"border .2s"}}>
                      {!isEdit ? (
                        <div style={{display:"flex",alignItems:"center",gap:14,padding:"14px 18px"}}>
                          <div style={{width:52,height:52,borderRadius:12,overflow:"hidden",flexShrink:0,background:`linear-gradient(${cfg.grad})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>
                            {a.foto_url ? <img src={a.foto_url} alt={a.nome} style={{width:"100%",height:"100%",objectFit:"cover"}}/> : <span>{EM[a.especie]||"🐾"}</span>}
                          </div>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                              <span style={{fontSize:15,fontWeight:800,fontFamily:"'Nunito'",color:"#fff"}}>{a.nome}</span>
                              <span style={{background:`${cfg.color}20`,color:cfg.color,borderRadius:50,padding:"2px 9px",fontSize:10,fontFamily:"'Nunito'",fontWeight:700}}>{cfg.icon} {cfg.label}</span>
                              {a.resolvido&&<span style={{background:"rgba(43,174,158,.2)",color:"#2BAE9E",borderRadius:50,padding:"2px 9px",fontSize:10,fontFamily:"'Nunito'",fontWeight:700}}>✅ Resolvido</span>}
                            </div>
                            <div style={{fontSize:12,color:"#666",fontFamily:"'Lato'",marginTop:3}}>{a.especie} · {a.bairro?a.bairro+", ":""}{a.cidade} · por <strong style={{color:"#aaa"}}>{a.usuario_nome}</strong></div>
                          </div>
                          <div style={{display:"flex",gap:7,flexShrink:0}}>
                            <button onClick={()=>handleResolvido(a)}
                              style={{background:a.resolvido?"rgba(43,174,158,.2)":"rgba(43,174,158,.1)",color:"#2BAE9E",border:"1px solid rgba(43,174,158,.3)",borderRadius:8,padding:"6px 12px",fontSize:11,fontFamily:"'Nunito'",fontWeight:700,cursor:"pointer"}}>
                              {a.resolvido?"↩ Reabrir":"✅ Resolver"}
                            </button>
                            <button onClick={()=>handleEdit(a)}
                              style={{background:"rgba(224,92,92,.1)",color:"#E05C5C",border:"1px solid rgba(224,92,92,.3)",borderRadius:8,padding:"6px 12px",fontSize:11,fontFamily:"'Nunito'",fontWeight:700,cursor:"pointer"}}>
                              ✏️ Editar
                            </button>
                            <button onClick={()=>setConfirmDel(a.id)}
                              style={{background:"rgba(255,80,80,.1)",color:"#ff5050",border:"1px solid rgba(255,80,80,.3)",borderRadius:8,padding:"6px 12px",fontSize:11,fontFamily:"'Nunito'",fontWeight:700,cursor:"pointer"}}>
                              🗑️
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{padding:18}}>
                          <p style={{fontFamily:"'Nunito'",fontWeight:700,color:"#E05C5C",fontSize:13,marginBottom:14}}>✏️ Editando: {a.nome}</p>
                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                            {[
                              {l:"Nome",k:"nome"},{l:"Espécie",k:"especie"},{l:"Raça",k:"raca"},{l:"Cor",k:"cor"},
                              {l:"Porte",k:"porte"},{l:"Cidade",k:"cidade"},{l:"Bairro",k:"bairro"},{l:"Telefone",k:"telefone"},
                            ].map(c=>(
                              <div key={c.k}>
                                <label style={{fontSize:10,color:"#666",fontFamily:"'Lato'",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:.8}}>{c.l}</label>
                                <input value={formEdit[c.k]||""} onChange={e=>setFormEdit({...formEdit,[c.k]:e.target.value})}
                                  style={{width:"100%",background:"#0d0d1a",border:"1px solid #2e2e4e",borderRadius:8,padding:"8px 12px",color:"#fff",fontFamily:"'Lato'",fontSize:13,outline:"none"}}/>
                              </div>
                            ))}
                            <div style={{gridColumn:"1/-1"}}>
                              <label style={{fontSize:10,color:"#666",fontFamily:"'Lato'",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:.8}}>Descrição</label>
                              <textarea value={formEdit.descricao||""} onChange={e=>setFormEdit({...formEdit,descricao:e.target.value})}
                                style={{width:"100%",background:"#0d0d1a",border:"1px solid #2e2e4e",borderRadius:8,padding:"8px 12px",color:"#fff",fontFamily:"'Lato'",fontSize:13,outline:"none",resize:"vertical",minHeight:70}}/>
                            </div>
                          </div>
                          <div style={{display:"flex",gap:10}}>
                            <button onClick={handleSave} disabled={busy}
                              style={{flex:1,background:"linear-gradient(135deg,#E05C5C,#FF8A80)",color:"#fff",border:"none",borderRadius:10,padding:"10px",fontFamily:"'Nunito'",fontWeight:800,fontSize:13,cursor:"pointer"}}>
                              {busy?"Salvando...":"💾 Salvar alterações"}
                            </button>
                            <button onClick={()=>setEditando(null)}
                              style={{background:"#2e2e4e",color:"#aaa",border:"none",borderRadius:10,padding:"10px 20px",fontFamily:"'Nunito'",fontWeight:700,fontSize:13,cursor:"pointer"}}>
                              Cancelar
                            </button>
                          </div>
                        </div>
                      )}

                      {/* CONFIRMAR EXCLUSÃO */}
                      {confirmDel===a.id&&(
                        <div style={{padding:"14px 18px",borderTop:"1px solid #2e2e4e",background:"rgba(255,80,80,.05)"}}>
                          <p style={{fontFamily:"'Lato'",color:"#ff5050",fontSize:13,marginBottom:10}}>⚠️ Confirmar exclusão de <strong>"{a.nome}"</strong>? Esta ação não pode ser desfeita.</p>
                          <div style={{display:"flex",gap:8}}>
                            <button onClick={()=>handleDelete(a.id)} disabled={busy}
                              style={{background:"#ff5050",color:"#fff",border:"none",borderRadius:8,padding:"8px 18px",fontFamily:"'Nunito'",fontWeight:700,fontSize:12,cursor:"pointer"}}>
                              {busy?"Excluindo...":"🗑️ Sim, excluir"}
                            </button>
                            <button onClick={()=>setConfirmDel(null)}
                              style={{background:"#2e2e4e",color:"#aaa",border:"none",borderRadius:8,padding:"8px 18px",fontFamily:"'Nunito'",fontWeight:700,fontSize:12,cursor:"pointer"}}>
                              Cancelar
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* USUÁRIOS */}
          {tab==="usuarios"&&(
            <div>
              <p style={{fontFamily:"'Lato'",color:"#666",fontSize:12,marginBottom:16}}>{users.length} usuários cadastrados</p>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {users.map((u,i)=>(
                  <div key={u.id||i} style={{background:"#12122a",borderRadius:14,padding:"14px 18px",border:"1px solid #2e2e4e",display:"flex",alignItems:"center",gap:14}}>
                    <div style={{width:42,height:42,borderRadius:"50%",background:"linear-gradient(135deg,#E05C5C,#FF8A80)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:800,color:"#fff",flexShrink:0}}>
                      {u.nome?.charAt(0)?.toUpperCase()||"?"}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:14,fontWeight:800,fontFamily:"'Nunito'",color:"#fff"}}>{u.nome}</div>
                      <div style={{fontSize:12,color:"#666",fontFamily:"'Lato'"}}>{u.email} · {u.telefone||"Sem telefone"}</div>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <div style={{fontSize:13,fontWeight:700,color:"#E05C5C",fontFamily:"'Nunito'"}}>
                        {animals.filter(a=>a.usuario_nome===u.nome).length} cadastros
                      </div>
                      {u.email===ADMIN_EMAIL&&<div style={{fontSize:10,color:"#FFB74D",fontFamily:"'Lato'",marginTop:2}}>⭐ Admin</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}


export default function PetLynk() {
  const isDemo = SUPABASE_URL.includes("SEU_PROJETO");
  const [animals, setAnimals] = useState(DEMO);
  const [users, setUsers] = useState([{ id:"1", nome:"Carlos Silva", email:"carlos@email.com", senha:"123456", telefone:"(11) 99999-1111" }]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!isDemo);
  const [tipo, setTipo] = useState("todos");
  const [especie, setEspecie] = useState("todos");
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(null);
  const [form, setForm] = useState(false);
  const [auth, setAuth] = useState(false);
  const [view, setView] = useState("grid");
  const [toast, setToast] = useState(null);
  const [adminPanel, setAdminPanel] = useState(false);
  const [perfilPanel, setPerfilPanel] = useState(false);
  const isAdmin = user?.email === ADMIN_EMAIL;

  const toast_ = msg => { setToast(msg); setTimeout(()=>setToast(null),3500); };

  useEffect(()=>{ if (!isDemo) { api.get("animais").then(d=>{ if(!d.error) setAnimals(d); setLoading(false); }); } },[]);

  const list = animals.filter(a=>{
    if (tipo==="resolvido") { if (!a.resolvido) return false; }
    else if (tipo!=="todos") { if (a.tipo!==tipo||a.resolvido) return false; }
    else { /* todos — mostra tudo incluindo resolvidos */ }
    if (especie!=="todos"&&a.especie!==especie) return false;
    if (q) { const s=q.toLowerCase(); return a.nome.toLowerCase().includes(s)||a.cidade?.toLowerCase().includes(s)||a.bairro?.toLowerCase().includes(s)||a.raca?.toLowerCase().includes(s); }
    return true;
  });

  const counts = {
    perdido: animals.filter(a=>a.tipo==="perdido"&&!a.resolvido).length,
    achado:  animals.filter(a=>a.tipo==="achado"&&!a.resolvido).length,
    adocao:  animals.filter(a=>a.tipo==="adocao"&&!a.resolvido).length,
    resolvido: animals.filter(a=>a.resolvido).length,
  };

  return (
    <div style={{minHeight:"100vh",background:"#F7F3EE",fontFamily:"'Nunito',sans-serif"}}>
      <style>{G}</style>

      {isDemo&&<div style={{background:"linear-gradient(135deg,#1a1a2e,#16213e)",borderBottom:"3px solid #E05C5C",padding:"9px 24px"}}><span style={{fontFamily:"'Lato'",fontSize:11,color:"#aaa"}}>⚙️ <strong style={{color:"#FFB74D"}}>Modo Demo</strong> — Configure o Supabase para salvar dados reais. Veja as instruções no topo do arquivo.</span></div>}

      <nav style={{background:"#fff",borderBottom:"1px solid #F0E8E0",padding:"0 28px",display:"flex",alignItems:"center",justifyContent:"space-between",height:66,position:"sticky",top:0,zIndex:200,boxShadow:"0 1px 10px rgba(0,0,0,.04)"}}>
        <div style={{display:"flex",alignItems:"center",gap:9,cursor:"pointer"}} onClick={()=>{setTipo("todos");setEspecie("todos");setQ("");setView("grid");window.scrollTo({top:0,behavior:"smooth"});}}>
          <div style={{width:34,height:34,background:"linear-gradient(135deg,#E05C5C,#FF8A80)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,boxShadow:"0 3px 9px rgba(224,92,92,.28)"}}>🐾</div>
          <div><div style={{fontSize:20,fontWeight:900,color:"#2d2d2d",letterSpacing:-.5,lineHeight:1}}>Pet<span style={{color:"#E05C5C"}}>Lynk</span></div><div style={{fontSize:9,color:"#C5B8AE",fontFamily:"'Lato'",letterSpacing:.3}}>Conectando pets ao caminho de casa</div></div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <button onClick={()=>{setTipo("todos");setEspecie("todos");setQ("");setView("grid");window.scrollTo({top:0,behavior:"smooth"});}}
            style={{background:"#FAF6F2",border:"2px solid #F0E8E0",borderRadius:50,padding:"8px 16px",fontFamily:"'Nunito'",fontWeight:700,fontSize:12,color:"#A89990",cursor:"pointer",transition:"all .2s",display:"flex",alignItems:"center",gap:5}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="#E05C5C";e.currentTarget.style.color="#E05C5C";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="#F0E8E0";e.currentTarget.style.color="#A89990";}}>
            🏠 Início
          </button>
          {user ? <>
            <span style={{fontFamily:"'Lato'",color:"#A89990",fontSize:12}}>Olá, <strong style={{color:"#555"}}>{user.nome.split(" ")[0]}</strong>!</span>
            {isAdmin&&<button onClick={()=>setAdminPanel(true)}
              style={{background:"linear-gradient(135deg,#1a1a2e,#2e2e4e)",color:"#FFB74D",border:"1px solid #FFB74D50",borderRadius:50,padding:"8px 16px",fontFamily:"'Nunito'",fontWeight:800,fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",gap:5,transition:"all .2s"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor="#FFB74D"}
              onMouseLeave={e=>e.currentTarget.style.borderColor="#FFB74D50"}>
              🛡️ Admin
            </button>}
            <button onClick={()=>setPerfilPanel(true)}
              style={{background:"#FAF6F2",border:"2px solid #F0E8E0",borderRadius:50,padding:"8px 16px",fontFamily:"'Nunito'",fontWeight:700,fontSize:12,color:"#A89990",cursor:"pointer",transition:"all .2s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="#E05C5C";e.currentTarget.style.color="#E05C5C";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="#F0E8E0";e.currentTarget.style.color="#A89990";}}>
              👤 Meu perfil
            </button>
            <button onClick={()=>setForm(true)} className="bp" style={{padding:"8px 18px",fontSize:12}}>+ Cadastrar</button>
            <button onClick={()=>setUser(null)} className="bg" style={{padding:"8px 13px",fontSize:12}}>Sair</button>
          </> : <>
            <button onClick={()=>setAuth(true)} className="bg" style={{padding:"8px 16px",fontSize:12}}>Entrar</button>
            <button onClick={()=>setAuth(true)} className="bp" style={{padding:"8px 18px",fontSize:12}}>+ Cadastrar</button>
          </>}
        </div>
      </nav>

      <div style={{background:"linear-gradient(135deg,#E05C5C 0%,#FF8A80 50%,#FFB74D 100%)",padding:"48px 28px 44px",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle at 15% 60%,rgba(255,255,255,.1) 0%,transparent 45%),radial-gradient(circle at 85% 20%,rgba(255,255,255,.08) 0%,transparent 40%)"}}/>
        <div style={{position:"relative"}}>
          <h1 style={{fontSize:"clamp(26px,5vw,50px)",fontWeight:900,color:"#fff",letterSpacing:-1.5,marginBottom:8,lineHeight:1.1,textShadow:"0 2px 18px rgba(0,0,0,.1)"}}>Conectando pets ao<br/>caminho de casa 🐾</h1>
          <p style={{color:"rgba(255,255,255,.86)",fontFamily:"'Lato'",fontSize:15,maxWidth:440,margin:"0 auto 28px",lineHeight:1.65}}>Cadastre animais perdidos, achados e para adoção. Ajude a reunir famílias em todo o Brasil.</p>
          <div style={{display:"flex",justifyContent:"center",gap:11,flexWrap:"wrap"}}>
            {[{t:"perdido",i:"💔",l:"Perdidos"},{t:"achado",i:"🤝",l:"Achados"},{t:"adocao",i:"🏠",l:"Adoção"},{t:"resolvido",i:"✅",l:"Resolvidos"}].map(x=>(
              <div key={x.t} onClick={()=>setTipo(x.t)}
                style={{background:tipo===x.t?"rgba(255,255,255,.35)":"rgba(255,255,255,.18)",backdropFilter:"blur(12px)",borderRadius:16,padding:"13px 22px",border:`1px solid ${tipo===x.t?"rgba(255,255,255,.6)":"rgba(255,255,255,.3)"}`,cursor:"pointer",transition:"all .2s",minWidth:96}}
                onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,.27)";e.currentTarget.style.transform="translateY(-2px)";}}
                onMouseLeave={e=>{e.currentTarget.style.background=tipo===x.t?"rgba(255,255,255,.35)":"rgba(255,255,255,.18)";e.currentTarget.style.transform="none";}}>
                <div style={{fontSize:26,fontWeight:900,color:"#fff",fontFamily:"'Nunito'"}}>{counts[x.t]}</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,.84)",fontFamily:"'Lato'"}}>{x.i} {x.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{background:"#fff",borderBottom:"1px solid #F0E8E0",padding:"11px 28px",display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",position:"sticky",top:66,zIndex:100,boxShadow:"0 2px 7px rgba(0,0,0,.03)"}}>
        <div style={{position:"relative",flex:1,minWidth:170,maxWidth:280}}>
          <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:13,color:"#D0C4BC",pointerEvents:"none"}}>🔍</span>
          <input style={{width:"100%",background:"#FAF6F2",border:"2px solid #F0E8E0",borderRadius:50,padding:"8px 13px 8px 33px",fontFamily:"'Lato'",fontSize:12,outline:"none",color:"#333",transition:"border .2s"}} placeholder="Nome, cidade, raça..." value={q} onChange={e=>setQ(e.target.value)} onFocus={e=>e.currentTarget.style.borderColor="#E05C5C"} onBlur={e=>e.currentTarget.style.borderColor="#F0E8E0"}/>
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {[{k:"todos",l:"Todos"},{k:"perdido",l:"💔 Perdidos"},{k:"achado",l:"🤝 Achados"},{k:"adocao",l:"🏠 Adoção"},{k:"resolvido",l:"✅ Resolvidos"}].map(x=>(
            <button key={x.k} onClick={()=>setTipo(x.k)}
              style={{padding:"7px 13px",background:tipo===x.k?(x.k==="resolvido"?"#2BAE9E":TC[x.k]?.color||"#E05C5C"):"#FAF6F2",border:`2px solid ${tipo===x.k?(x.k==="resolvido"?"#2BAE9E":TC[x.k]?.color||"#E05C5C"):"transparent"}`,borderRadius:50,color:tipo===x.k?"#fff":"#A89990",fontFamily:"'Nunito'",fontWeight:700,fontSize:11,cursor:"pointer",transition:"all .2s",whiteSpace:"nowrap"}}>
              {x.l}
            </button>
          ))}
        </div>
        <select value={especie} onChange={e=>setEspecie(e.target.value)}
          style={{background:"#FAF6F2",border:"2px solid #F0E8E0",borderRadius:50,padding:"7px 30px 7px 12px",fontFamily:"'Nunito'",fontWeight:700,fontSize:11,color:"#A89990",cursor:"pointer",outline:"none",appearance:"none"}}>
          <option value="todos">🐾 Todos</option>
          <option value="Cachorro">🐕 Cães</option>
          <option value="Gato">🐈 Gatos</option>
          <option value="Pássaro">🦜 Pássaros</option>
          <option value="Coelho">🐇 Coelhos</option>
          <option value="Outro">🐾 Outros</option>
        </select>
        <div style={{display:"flex",background:"#FAF6F2",borderRadius:50,padding:3,border:"1px solid #F0E8E0",marginLeft:"auto"}}>
          {[{k:"grid",l:"⊞ Cards"},{k:"mapa",l:"🗺️ Mapa"}].map(x=>(
            <button key={x.k} onClick={()=>setView(x.k)}
              style={{padding:"5px 12px",background:view===x.k?"#E05C5C":"transparent",color:view===x.k?"#fff":"#A89990",border:"none",borderRadius:50,fontFamily:"'Nunito'",fontWeight:700,fontSize:11,cursor:"pointer",transition:"all .2s",whiteSpace:"nowrap"}}>
              {x.l}
            </button>
          ))}
        </div>
      </div>

      <div style={{maxWidth:1200,margin:"0 auto",padding:"28px 28px 64px"}}>
        {loading ? (
          <div style={{textAlign:"center",padding:"60px 0"}}><div style={{width:40,height:40,border:"3px solid #F0E8E0",borderTop:"3px solid #E05C5C",borderRadius:"50%",animation:"spin 1s linear infinite",margin:"0 auto 14px"}}/><p style={{fontFamily:"'Lato'",color:"#C5B8AE",fontSize:13}}>Carregando...</p></div>
        ) : (<>
          {view==="mapa"&&<MapaGeral animals={list} onClick={setSel}/>}
          {view==="grid"&&list.length===0&&(
            <div style={{textAlign:"center",padding:"60px 0"}}>
              <div style={{fontSize:56,marginBottom:12}}>🔍</div>
              <p style={{fontSize:18,fontFamily:"'Nunito'",fontWeight:800,color:"#D0C4BC"}}>Nenhum animal encontrado</p>
              <p style={{fontFamily:"'Lato'",color:"#D0C4BC",marginTop:5,marginBottom:22,fontSize:13}}>Tente outros filtros ou seja o primeiro a cadastrar!</p>
              <button onClick={()=>user?setForm(true):setAuth(true)} className="bp">+ Cadastrar animal</button>
            </div>
          )}
          {view==="grid"&&list.length>0&&(<>
            <p style={{fontFamily:"'Lato'",color:"#C5B8AE",fontSize:12,marginBottom:20}}>{list.length} {list.length===1?"animal encontrado":"animais encontrados"}</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(275px,1fr))",gap:20}}>
              {list.map(a=><Card key={a.id} a={a} onClick={setSel}/>)}
            </div>
          </>)}
          <div style={{marginTop:56,background:"linear-gradient(135deg,#2d2d2d,#1a1a1a)",borderRadius:24,padding:"44px 32px",textAlign:"center",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:-35,right:-35,width:140,height:140,background:"radial-gradient(circle,rgba(224,92,92,.14),transparent)",borderRadius:"50%"}}/>
            <div style={{position:"relative"}}>
              <div style={{fontSize:34,marginBottom:10}}>🐾</div>
              <h2 style={{fontSize:"clamp(18px,4vw,34px)",fontWeight:900,color:"#fff",letterSpacing:-.5,marginBottom:7}}>Viu um animal perdido?</h2>
              <p style={{color:"rgba(255,255,255,.5)",fontFamily:"'Lato'",fontSize:14,maxWidth:380,margin:"0 auto 22px",lineHeight:1.7}}>Cadastre agora e ajude esse pet a voltar para casa. É grátis!</p>
              <button className="bp" onClick={()=>user?setForm(true):setAuth(true)} style={{fontSize:14,padding:"13px 28px"}}>Cadastrar animal agora →</button>
            </div>
          </div>
        </>)}
      </div>

      <footer style={{background:"#fff",borderTop:"1px solid #F0E8E0",padding:"22px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:9}}>
        <div style={{display:"flex",alignItems:"center",gap:7}}><span style={{fontSize:15}}>🐾</span><span style={{fontSize:14,fontWeight:900,color:"#2d2d2d"}}>Pet<span style={{color:"#E05C5C"}}>Lynk</span></span></div>
        <p style={{fontFamily:"'Lato'",color:"#C5B8AE",fontSize:11}}>Conectando pets ao caminho de casa · Brasil 🇧🇷</p>
        <p style={{fontFamily:"'Lato'",color:"#D0C4BC",fontSize:10}}>Feito com ❤️ para os animais</p>
      </footer>

      {sel&&<Modal a={sel} onClose={()=>setSel(null)} user={user} isDemo={isDemo} onUpdate={updated=>{setAnimals(p=>p.map(a=>a.id===updated.id?updated:a));setSel(updated);}}/>}
      {form&&user&&<Form user={user} onSave={a=>{setAnimals(p=>[a,...p]);setForm(false);toast_(`✅ "${a.nome}" publicado!`);}} onCancel={()=>setForm(false)} isDemo={isDemo}/>}
      {auth&&<Auth onLogin={u=>{setUser(u);setAuth(false);toast_(`👋 Bem-vindo, ${u.nome.split(" ")[0]}!`);}} onClose={()=>setAuth(false)} isDemo={isDemo} users={users} setUsers={setUsers}/>}
      {perfilPanel&&user&&<PerfilModal user={user} onClose={()=>setPerfilPanel(false)} onUpdate={u=>{setUser(u);toast_("✅ Perfil atualizado!");}} isDemo={isDemo} users={users} setUsers={setUsers}/>}
      {adminPanel&&isAdmin&&<AdminPanel animals={animals} users={users} isDemo={isDemo} onClose={()=>setAdminPanel(false)} onUpdate={updated=>setAnimals(p=>p.map(a=>a.id===updated.id?updated:a))} onDelete={id=>setAnimals(p=>p.filter(a=>a.id!==id))}/>}

      {toast&&<div className="pop" style={{position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",background:"#2d2d2d",color:"#fff",borderRadius:13,padding:"12px 24px",fontFamily:"'Nunito'",fontWeight:700,fontSize:13,zIndex:2000,boxShadow:"0 8px 38px rgba(0,0,0,.22)",whiteSpace:"nowrap"}}>{toast}</div>}
    </div>
  );
}

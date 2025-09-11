import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";

export default function ProSignup() {
  const nav = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);

  const [first_name, setFirst] = useState("");
  const [last_name, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [full_address, setAddr] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!first_name || !last_name || !email || !password || !confirm) {
      return setError("Please fill out all required fields.");
    }
    if (password !== confirm) return setError("Passwords do not match.");

    try {
      setLoading(true);
      const res = await fetch("https://beautysalon-qq6r.vercel.app/api/pro/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ first_name, last_name, email, password, country, city, postcode, full_address }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }
      // Store userId
      localStorage.setItem("pro_user_id", String(data.user.id));
      // Navigate with state
      nav("/regprofe1", { state: { userId: data.user.id } });
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div className="min-h-screen bg-white flex flex-col items-center px-2 py-8" initial={{opacity:0}} animate={{opacity:1}}>
      <h1 className="text-3xl font-bold mb-6">Create your professional account</h1>

      <form onSubmit={submit} className="w-full max-w-2xl space-y-4">
        <div className="flex gap-4">
          <input className="flex-1 border rounded-lg py-2 px-3" placeholder="First name" value={first_name} onChange={e=>setFirst(e.target.value)} />
          <input className="flex-1 border rounded-lg py-2 px-3" placeholder="Last name" value={last_name} onChange={e=>setLast(e.target.value)} />
        </div>

        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input className="w-full border rounded-lg py-2 pl-10 pr-3" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <input className="w-full border rounded-lg py-2 px-3" type={showPw ? "text":"password"} placeholder="Password" value={password} onChange={e=>setPw(e.target.value)} />
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2" onClick={()=>setShowPw(v=>!v)}>{showPw?<EyeOff size={16}/>:<Eye size={16}/>}</button>
          </div>
          <div className="relative flex-1">
            <input className="w-full border rounded-lg py-2 px-3" type={showPw2 ? "text":"password"} placeholder="Confirm password" value={confirm} onChange={e=>setConfirm(e.target.value)} />
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2" onClick={()=>setShowPw2(v=>!v)}>{showPw2?<EyeOff size={16}/>:<Eye size={16}/>}</button>
          </div>
        </div>

        {/* Address (optional) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select className="border rounded-lg py-2 px-3" value={country} onChange={e=>setCountry(e.target.value)}>
            <option value="">Country (optional)</option>
            <option value="US">United States</option><option value="GB">United Kingdom</option><option value="JP">Japan</option>
          </select>
          <input className="border rounded-lg py-2 px-3" placeholder="City/District" value={city} onChange={e=>setCity(e.target.value)} />
          <input className="border rounded-lg py-2 px-3" placeholder="Postcode" value={postcode} onChange={e=>setPostcode(e.target.value)} />
        </div>
        <input className="w-full border rounded-lg py-2 px-3" placeholder="Full address (optional)" value={full_address} onChange={e=>setAddr(e.target.value)} />

        <button className="w-full bg-puce text-white rounded-lg py-3 font-semibold disabled:opacity-60" disabled={loading}>
          {loading ? "Creating..." : "Create account"}
        </button>
        {error && <div className="text-center text-red-500 text-sm">{error}</div>}
      </form>
    </motion.div>
  );
}

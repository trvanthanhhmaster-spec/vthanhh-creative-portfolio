import Link from "next/link";
import { ArrowLeft, ArrowUpRight, FlaskConical } from "lucide-react";

export const metadata = { title: "Lab — Vthanhh", description: "Thử nghiệm và ý tưởng đang phát triển." };

const experiments = [
  ["LifeMate Voice Agent", "ASR tiếng Việt, hiểu ý định và thực thi tác vụ qua giọng nói.", "AI / SPEECH"],
  ["VTComfy", "Studio AI mã nguồn mở cho chỉnh sửa ảnh, layers, layout và video.", "CREATIVE AI"],
  ["AI-native Product Studio", "Tự động hóa vòng đời sản phẩm từ nghiên cứu cơ hội đến phát triển và vận hành.", "PRODUCT SYSTEMS"],
];

export default function LabPage() {
  return <main className="subpage">
    <header className="subpage-header"><Link href="/" className="back-link"><ArrowLeft size={16}/> Trang chủ</Link><span>VTHANHH / LAB</span></header>
    <section className="subpage-intro"><p className="section-index">EXPERIMENTS / IN PROGRESS</p><h1>Nơi ý tưởng <em>được thử nghiệm.</em></h1><p>Không phải mọi thử nghiệm đều trở thành sản phẩm. Nhưng mỗi thử nghiệm đều giúp mình hiểu rõ hơn điều gì tạo ra giá trị.</p></section>
    <div className="lab-list">{experiments.map((item,index)=><article className="lab-item" key={item[0]}><span className="lab-number">0{index+1}</span><div><p className="section-index">{item[2]}</p><h2>{item[0]}</h2><p>{item[1]}</p></div><FlaskConical size={22}/></article>)}</div>
    <Link href="/projects" className="text-link">Khám phá dự án <ArrowUpRight size={16}/></Link>
  </main>;
}

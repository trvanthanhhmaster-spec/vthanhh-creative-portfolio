import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { posts } from "@/data/content";

export const metadata = { title: "Journal — Vthanhh", description: "Ghi chép về công nghệ, AI và quá trình xây dựng sản phẩm." };

export default function BlogPage() {
  return <main className="subpage">
    <header className="subpage-header"><Link href="/" className="back-link"><ArrowLeft size={16}/> Trang chủ</Link><span>VTHANHH / JOURNAL</span></header>
    <section className="subpage-intro"><p className="section-index">NOTES / RESEARCH / BUILD IN PUBLIC</p><h1>Ghi lại quá trình <em>khám phá.</em></h1><p>Những ghi chú, nghiên cứu và bài học từ quá trình học tập, thử nghiệm và phát triển sản phẩm.</p></section>
    <div className="journal-grid archive-journal">{posts.map((post,index)=><a className="journal-card" key={post.href} href={post.href} target="_blank" rel="noreferrer">
      <div className="journal-topline"><span>0{index+1} / {post.tag}</span><ArrowUpRight size={16}/></div><time>{post.date}</time><h3>{post.title}</h3><p>{post.summary}</p>
    </a>)}</div>
  </main>;
}

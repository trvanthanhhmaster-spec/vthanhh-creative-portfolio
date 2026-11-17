import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { projects, profile } from "@/data/content";

export const metadata = { title: "Dự án — Vthanhh", description: "Các sản phẩm và dự án công nghệ của Trần Văn Thành." };

export default function ProjectsPage() {
  return <main className="subpage">
    <header className="subpage-header"><Link href="/" className="back-link"><ArrowLeft size={16} /> Trang chủ</Link><span>VTHANHH / ARCHIVE</span></header>
    <section className="subpage-intro"><p className="section-index">SELECTED WORK / 2026</p><h1>Những thứ mình <em>đang xây.</em></h1><p>{profile.summary}</p></section>
    <div className="projects-grid archive-grid">{projects.map((project,index)=><a className="project-card" key={project.id} href={project.href} target="_blank" rel="noreferrer">
      <div className="project-art" style={project.image?{backgroundImage:"linear-gradient(180deg, rgba(3,8,12,.08), rgba(3,8,12,.58)), url("+project.image+")"}:undefined}><div className="project-art-meta"><span>0{index+1}</span><span>{project.category}</span></div><span className="project-art-arrow"><ArrowUpRight size={19}/></span></div>
      <div className="project-body"><span className="project-date">{project.date}</span><h3>{project.title}</h3><p>{project.description}</p><div className="project-tags">{project.stack.map(tag=><span key={tag}>{tag}</span>)}</div></div>
    </a>)}</div>
  </main>;
}

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Github, ExternalLink } from "lucide-react";

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tech: string[];
  details?: {
    fullDescription: string;
    features: string[];
    duration: string;
    role: string;
    challenges: string[];
  };
  demoUrl?: string;
  githubUrl?: string;
}

export default function Home() {
  const [activeSection, setActiveSection] = useState("home");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "projects", "skills", "contact"];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              onClick={() => scrollToSection("home")}
              className="text-xl font-bold"
            >
              Portfolio
            </Button>
            <div className="hidden md:flex items-center gap-2">
              {[
                { id: "home", label: "Home" },
                { id: "about", label: "About" },
                { id: "projects", label: "Projects" },
                { id: "skills", label: "Skills" },
                { id: "contact", label: "Contact" },
              ].map(({ id, label }) => (
                <Button
                  key={id}
                  variant={activeSection === id ? "secondary" : "ghost"}
                  onClick={() => scrollToSection(id)}
                  size="sm"
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="min-h-screen flex items-center justify-center px-6 sm:px-8 pt-16 relative overflow-hidden"
      >
        {/* 배경 이미지 */}
        <div className="absolute inset-0 z-0 opacity-10 dark:opacity-5">
          <Image
            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1920&q=80"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* 프로필 이미지 */}
          <div className="mb-8 flex justify-center">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-primary shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces"
                alt="Profile"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-black dark:text-white mb-6 leading-tight">
            안녕하세요,
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              개발자
            </span>
            입니다
          </h1>
          <p className="text-xl sm:text-2xl text-zinc-600 dark:text-zinc-400 mb-8 max-w-2xl mx-auto">
            창의적인 아이디어를 현실로 만들어가는 개발자입니다
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => scrollToSection("projects")}
              size="lg"
              className="rounded-full"
            >
              프로젝트 보기
            </Button>
            <Button
              onClick={() => scrollToSection("contact")}
              variant="outline"
              size="lg"
              className="rounded-full"
            >
              연락하기
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="min-h-screen flex items-center justify-center px-6 sm:px-8 py-20"
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
              alt="About Me"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-4xl sm:text-5xl font-bold text-black dark:text-white mb-8">
              About Me
            </h2>
            <div className="space-y-6 text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed">
              <p>
                저는 사용자 경험을 중시하며, 깔끔하고 효율적인 코드를 작성하는
                것을 좋아합니다.
              </p>
              <p>
                새로운 기술을 배우고 적용하는 것을 즐기며, 지속적으로 성장하고
                있습니다.
              </p>
              <p>
                다양한 프로젝트를 통해 문제 해결 능력과 협업 능력을 키워왔습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section
        id="projects"
        className="min-h-screen flex items-center justify-center px-6 sm:px-8 py-20 bg-zinc-50 dark:bg-zinc-900"
      >
        <div className="max-w-7xl mx-auto w-full">
          <h2 className="text-4xl sm:text-5xl font-bold text-black dark:text-white mb-12 text-center">
            Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 프로젝트 카드 예시 - 이 부분을 실제 프로젝트로 교체하세요 */}
            {[
              {
                id: 1,
                title: "웹 애플리케이션",
                description: "모던한 UI/UX를 갖춘 반응형 웹 애플리케이션",
                image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
                tech: ["React", "TypeScript", "Next.js"],
                details: {
                  fullDescription:
                    "사용자 경험을 최우선으로 고려한 모던한 웹 애플리케이션입니다. 반응형 디자인을 통해 모든 디바이스에서 최적의 경험을 제공하며, 최신 웹 기술을 활용하여 빠르고 안정적인 성능을 구현했습니다.",
                  features: [
                    "반응형 디자인으로 모바일/태블릿/데스크톱 지원",
                    "실시간 데이터 업데이트",
                    "사용자 인증 및 권한 관리",
                    "다크 모드 지원",
                    "SEO 최적화",
                  ],
                  duration: "2024.01 - 2024.03 (3개월)",
                  role: "풀스택 개발자",
                  challenges: [
                    "대용량 데이터 처리 최적화",
                    "크로스 브라우저 호환성 확보",
                    "사용자 경험 개선을 위한 UI/UX 설계",
                  ],
                },
                demoUrl: "https://example.com",
                githubUrl: "https://github.com/example",
              },
              {
                id: 2,
                title: "모바일 app",
                description: "사용자 친화적인 모바일 애플리케이션",
                image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
                tech: ["React Native", "TypeScript"],
                details: {
                  fullDescription:
                    "iOS와 Android를 모두 지원하는 크로스 플랫폼 모바일 애플리케이션입니다. 네이티브 앱과 유사한 성능과 사용자 경험을 제공하며, 하나의 코드베이스로 두 플랫폼을 모두 지원합니다.",
                  features: [
                    "iOS 및 Android 동시 지원",
                    "오프라인 모드 지원",
                    "푸시 알림 기능",
                    "소셜 로그인 통합",
                    "애니메이션 및 전환 효과",
                  ],
                  duration: "2024.04 - 2024.06 (3개월)",
                  role: "프론트엔드 개발자",
                  challenges: [
                    "플랫폼별 UI/UX 차이 해결",
                    "성능 최적화",
                    "네이티브 모듈 통합",
                  ],
                },
                demoUrl: "https://example.com",
                githubUrl: "https://github.com/example",
              },
              {
                id: 3,
                title: "E-commerce 플랫폼",
                description: "온라인 쇼핑몰 플랫폼 개발",
                image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
                tech: ["Next.js", "Node.js", "MongoDB"],
                details: {
                  fullDescription:
                    "완전한 기능을 갖춘 전자상거래 플랫폼입니다. 상품 관리, 주문 처리, 결제 시스템, 사용자 관리 등 온라인 쇼핑몰 운영에 필요한 모든 기능을 포함하고 있습니다.",
                  features: [
                    "상품 검색 및 필터링",
                    "장바구니 및 주문 관리",
                    "결제 시스템 통합",
                    "관리자 대시보드",
                    "고객 리뷰 및 평점 시스템",
                  ],
                  duration: "2024.07 - 2024.10 (4개월)",
                  role: "풀스택 개발자",
                  challenges: [
                    "결제 보안 구현",
                    "대용량 트래픽 처리",
                    "재고 관리 시스템 구축",
                  ],
                },
                demoUrl: "https://example.com",
                githubUrl: "https://github.com/example",
              },
              {
                id: 4,
                title: "대시보드 시스템",
                description: "데이터 시각화 대시보드",
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
                tech: ["React", "D3.js", "TypeScript"],
                details: {
                  fullDescription:
                    "복잡한 데이터를 직관적으로 시각화하는 대시보드 시스템입니다. 다양한 차트와 그래프를 통해 데이터를 분석하고 인사이트를 도출할 수 있도록 설계되었습니다.",
                  features: [
                    "실시간 데이터 시각화",
                    "다양한 차트 타입 지원",
                    "데이터 필터링 및 정렬",
                    "대시보드 커스터마이징",
                    "데이터 내보내기 기능",
                  ],
                  duration: "2024.02 - 2024.04 (3개월)",
                  role: "프론트엔드 개발자",
                  challenges: [
                    "대용량 데이터 렌더링 최적화",
                    "복잡한 차트 구현",
                    "사용자 친화적인 인터페이스 설계",
                  ],
                },
                demoUrl: "https://example.com",
                githubUrl: "https://github.com/example",
              },
              {
                id: 5,
                title: "소셜 미디어 앱",
                description: "실시간 채팅 기능이 있는 소셜 앱",
                image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
                tech: ["React", "Socket.io", "Express"],
                details: {
                  fullDescription:
                    "실시간 채팅과 소셜 네트워킹 기능을 갖춘 소셜 미디어 애플리케이션입니다. 사용자들이 실시간으로 소통하고 콘텐츠를 공유할 수 있는 플랫폼을 제공합니다.",
                  features: [
                    "실시간 채팅 및 메시징",
                    "게시물 작성 및 공유",
                    "좋아요 및 댓글 기능",
                    "사용자 프로필 관리",
                    "알림 시스템",
                  ],
                  duration: "2024.05 - 2024.08 (4개월)",
                  role: "풀스택 개발자",
                  challenges: [
                    "실시간 통신 최적화",
                    "서버 부하 관리",
                    "메시지 동기화",
                  ],
                },
                demoUrl: "https://example.com",
                githubUrl: "https://github.com/example",
              },
              {
                id: 6,
                title: "포트폴리오 웹사이트",
                description: "개인 포트폴리오 웹사이트",
                image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80",
                tech: ["Next.js", "Tailwind CSS", "TypeScript"],
                details: {
                  fullDescription:
                    "개인 포트폴리오를 소개하는 웹사이트입니다. 프로젝트, 기술 스택, 경력 등을 시각적으로 보여주며, 모던하고 세련된 디자인으로 제작되었습니다.",
                  features: [
                    "반응형 디자인",
                    "다크 모드 지원",
                    "프로젝트 상세 모달",
                    "부드러운 스크롤 애니메이션",
                    "SEO 최적화",
                  ],
                  duration: "2024.11 - 2024.11 (1개월)",
                  role: "프론트엔드 개발자",
                  challenges: [
                    "성능 최적화",
                    "접근성 개선",
                    "디자인 시스템 구축",
                  ],
                },
                demoUrl: "https://example.com",
                githubUrl: "https://github.com/example",
              },
            ].map((project) => (
              <Card
                key={project.id}
                className="hover:shadow-lg transition-all duration-300 overflow-hidden group hover:scale-105 cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <div className="relative w-full h-48 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex gap-4">
                  <Button
                    variant="link"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (project.demoUrl) {
                        window.open(project.demoUrl, "_blank");
                      }
                    }}
                  >
                    Live Demo
                  </Button>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (project.githubUrl) {
                        window.open(project.githubUrl, "_blank");
                      }
                    }}
                  >
                    GitHub
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {/* 프로젝트 상세 모달 */}
          <Dialog
            open={selectedProject !== null}
            onOpenChange={(open: boolean) => !open && setSelectedProject(null)}
          >
            {selectedProject && (
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <div className="relative w-full h-64 rounded-lg overflow-hidden mb-4">
                    <Image
                      src={selectedProject.image}
                      alt={selectedProject.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <DialogTitle className="text-3xl">
                    {selectedProject.title}
                  </DialogTitle>
                  <DialogDescription className="text-base">
                    {selectedProject.description}
                  </DialogDescription>
                </DialogHeader>

                {selectedProject.details && (
                  <div className="space-y-6 mt-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">프로젝트 개요</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {selectedProject.details.fullDescription}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-2">주요 기능</h3>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {selectedProject.details.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">개발 기간</h3>
                        <p className="text-muted-foreground">
                          {selectedProject.details.duration}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">역할</h3>
                        <p className="text-muted-foreground">
                          {selectedProject.details.role}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-2">기술 스택</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.tech.map((tech) => (
                          <Badge key={tech} variant="secondary">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {selectedProject.details.challenges && (
                      <div>
                        <h3 className="text-xl font-semibold mb-2">주요 도전 과제</h3>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          {selectedProject.details.challenges.map((challenge, index) => (
                            <li key={index}>{challenge}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="space-y-4 pt-4 border-t">
                      <h3 className="text-xl font-semibold mb-3">프로젝트 링크</h3>
                      <div className="space-y-3">
                        {selectedProject.demoUrl && (
                          <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors">
                            <div className="flex items-center gap-3">
                              <ExternalLink className="h-5 w-5 text-primary" />
                              <div>
                                <p className="font-medium">Live Demo</p>
                                <p className="text-sm text-muted-foreground break-all">
                                  {selectedProject.demoUrl}
                                </p>
                              </div>
                            </div>
                            <Button asChild size="sm">
                              <a
                                href={selectedProject.demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                방문하기
                              </a>
                            </Button>
                          </div>
                        )}
                        {selectedProject.githubUrl && (
                          <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors">
                            <div className="flex items-center gap-3">
                              <Github className="h-5 w-5 text-primary" />
                              <div>
                                <p className="font-medium">GitHub Repository</p>
                                <p className="text-sm text-muted-foreground break-all">
                                  {selectedProject.githubUrl}
                                </p>
                              </div>
                            </div>
                            <Button variant="outline" asChild size="sm">
                              <a
                                href={selectedProject.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                코드 보기
                              </a>
                            </Button>
                          </div>
                        )}
                        {!selectedProject.demoUrl && !selectedProject.githubUrl && (
                          <p className="text-muted-foreground text-sm">
                            링크 정보가 없습니다.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </DialogContent>
            )}
          </Dialog>
        </div>
      </section>

      {/* Skills Section */}
      <section
        id="skills"
        className="min-h-screen flex items-center justify-center px-6 sm:px-8 py-20"
      >
        <div className="max-w-6xl mx-auto w-full">
          <h2 className="text-4xl sm:text-5xl font-bold text-black dark:text-white mb-12 text-center">
            Skills
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                name: "JavaScript",
                image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&q=80",
              },
              {
                name: "TypeScript",
                image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&q=80",
              },
              {
                name: "React",
                image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&q=80",
              },
              {
                name: "Next.js",
                image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80",
              },
              {
                name: "Node.js",
                image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80",
              },
              {
                name: "Python",
                image: "https://images.unsplash.com/photo-1526374965328-7f61d4a18d5e?w=400&q=80",
              },
              {
                name: "Git",
                image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=400&q=80",
              },
              {
                name: "Tailwind CSS",
                image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80",
              },
            ].map((skill) => (
              <Card
                key={skill.name}
                className="text-center hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden group"
              >
                <div className="relative h-32 overflow-hidden">
                  <Image
                    src={skill.image}
                    alt={skill.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <CardContent className="pt-4">
                  <div className="text-lg font-semibold">{skill.name}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="min-h-screen flex items-center justify-center px-6 sm:px-8 py-20 bg-zinc-50 dark:bg-zinc-900 relative overflow-hidden"
      >
        {/* 배경 이미지 */}
        <div className="absolute inset-0 z-0 opacity-5 dark:opacity-10">
          <Image
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80"
            alt="Contact Background"
            fill
            className="object-cover"
          />
        </div>
        
        <div className="max-w-4xl mx-auto w-full relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 rounded-lg overflow-hidden shadow-xl hidden md:block">
              <Image
                src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80"
                alt="Contact"
                fill
                className="object-cover"
              />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-4xl sm:text-5xl font-bold text-black dark:text-white mb-8">
                Contact
              </h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-12">
                프로젝트 협업이나 문의사항이 있으시면 언제든지 연락주세요.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button size="lg" className="rounded-full" asChild>
                  <a href="mailto:your.email@example.com">이메일 보내기</a>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full"
                  asChild
                >
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center text-zinc-600 dark:text-zinc-400">
          <p>© 2024 Portfolio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

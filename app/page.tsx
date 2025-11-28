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
import { Github, ExternalLink, MessageSquare, Heart, Sparkles, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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

interface GuestbookEntry {
  id: number;
  name: string;
  message: string;
  createdAt: string;
}

export default function Home() {
  const [activeSection, setActiveSection] = useState("home");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // 방명록 상태
  const [guestbookEntries, setGuestbookEntries] = useState<GuestbookEntry[]>([]);
  const [guestbookName, setGuestbookName] = useState("");
  const [guestbookMessage, setGuestbookMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 좋아요 상태
  const [likeCount, setLikeCount] = useState(42); // 기본 더미 숫자
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isLoadingLike, setIsLoadingLike] = useState(false);
  const [clientId] = useState(() => {
    // 클라이언트 ID 생성 (브라우저별로 고유)
    if (typeof window !== "undefined") {
      let id = localStorage.getItem("clientId");
      if (!id) {
        id = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem("clientId", id);
      }
      return id;
    }
    return "anonymous";
  });

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "projects", "skills", "api-demo", "contact"];
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

  // 방명록 조회
  const fetchGuestbook = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/guestbook");
      const data = await response.json();
      if (data.success) {
        setGuestbookEntries(data.data);
      }
    } catch (error) {
      console.error("방명록 조회 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 방명록 작성
  const submitGuestbook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestbookName.trim() || !guestbookMessage.trim()) {
      alert("이름과 메시지를 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/guestbook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: guestbookName,
          message: guestbookMessage,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setGuestbookName("");
        setGuestbookMessage("");
        fetchGuestbook(); // 목록 새로고침
        alert("방명록이 작성되었습니다!");
      } else {
        alert(data.message || "방명록 작성에 실패했습니다.");
      }
    } catch (error) {
      console.error("방명록 작성 실패:", error);
      alert("방명록 작성에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 방명록 삭제
  const deleteGuestbook = async (id: number) => {
    if (!confirm("정말 이 방명록을 삭제하시겠습니까?")) {
      return;
    }

    try {
      const response = await fetch(`/api/guestbook?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        fetchGuestbook(); // 목록 새로고침
        alert("방명록이 삭제되었습니다!");
      } else {
        alert(data.message || "방명록 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("방명록 삭제 실패:", error);
      alert("방명록 삭제에 실패했습니다.");
    }
  };

  // 좋아요 조회
  const fetchLike = async () => {
    setIsLoadingLike(true);
    try {
      const response = await fetch("/api/like", {
        headers: {
          "x-client-id": clientId,
        },
      });
      const data = await response.json();
      if (data.success) {
        setLikeCount(data.data.count);
        setIsLiked(data.data.isLiked);
      }
    } catch (error) {
      console.error("좋아요 조회 실패:", error);
    } finally {
      setIsLoadingLike(false);
    }
  };

  // 좋아요 토글
  const toggleLike = async () => {
    setIsLiking(true);
    try {
      const action = isLiked ? "unlike" : "like";
      const response = await fetch("/api/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-id": clientId,
        },
        body: JSON.stringify({ action }),
      });

      const data = await response.json();
      if (data.success) {
        setLikeCount(data.data.count);
        setIsLiked(data.data.isLiked);
      } else {
        alert(data.message || "좋아요 처리에 실패했습니다.");
      }
    } catch (error) {
      console.error("좋아요 처리 실패:", error);
      alert("좋아요 처리에 실패했습니다.");
    } finally {
      setIsLiking(false);
    }
  };

  // 랜덤 추천 상태
  const [randomRecommendation, setRandomRecommendation] = useState("");
  const [isLoadingRecommendation, setIsLoadingRecommendation] = useState(false);

  // 랜덤 추천 조회
  const fetchRecommendation = async () => {
    setIsLoadingRecommendation(true);
    try {
      const response = await fetch("/api/recommend");
      const data = await response.json();
      if (data.success) {
        setRandomRecommendation(data.data.message);
      }
    } catch (error) {
      console.error("추천 조회 실패:", error);
    } finally {
      setIsLoadingRecommendation(false);
    }
  };

  // 컴포넌트 마운트 시 방명록, 좋아요, 추천 조회
  useEffect(() => {
    fetchGuestbook();
    fetchLike();
    fetchRecommendation();
  }, []);

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
                { id: "api-demo", label: "API 실습" },
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
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=faces"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                title: "모바일 앱",
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

      {/* API 실습 섹션 */}
      <section
        id="api-demo"
        className="min-h-screen flex items-center justify-center px-6 sm:px-8 py-20 bg-zinc-50 dark:bg-zinc-900"
      >
        <div className="max-w-6xl mx-auto w-full">
          <h2 className="text-4xl sm:text-5xl font-bold text-black dark:text-white mb-12 text-center">
            API 실습
          </h2>
          
          <Tabs defaultValue="guestbook" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="guestbook" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                방명록
              </TabsTrigger>
              <TabsTrigger value="like" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                좋아요
              </TabsTrigger>
              <TabsTrigger value="recommend" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                랜덤 추천
              </TabsTrigger>
            </TabsList>

            {/* 방명록 탭 */}
            <TabsContent value="guestbook" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>방명록 작성</CardTitle>
                  <CardDescription>
                    이름과 메시지를 남겨주세요
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={submitGuestbook} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="text-sm font-medium mb-2 block">
                        이름
                      </label>
                      <Input
                        id="name"
                        placeholder="이름을 입력하세요"
                        value={guestbookName}
                        onChange={(e) => setGuestbookName(e.target.value)}
                        maxLength={50}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="text-sm font-medium mb-2 block">
                        메시지
                      </label>
                      <Textarea
                        id="message"
                        placeholder="메시지를 입력하세요"
                        value={guestbookMessage}
                        onChange={(e) => setGuestbookMessage(e.target.value)}
                        maxLength={500}
                        rows={4}
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {guestbookMessage.length}/500
                      </p>
                    </div>
                    <Button type="submit" disabled={isSubmitting} className="w-full">
                      {isSubmitting ? "작성 중..." : "방명록 남기기"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>방명록 목록</CardTitle>
                  <CardDescription>
                    총 {guestbookEntries.length}개의 방명록
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8 text-muted-foreground">
                      로딩 중...
                    </div>
                  ) : guestbookEntries.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      아직 방명록이 없습니다.
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {guestbookEntries.map((entry) => (
                        <Card key={entry.id} className="bg-background">
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between mb-2">
                              <div className="font-semibold">{entry.name}</div>
                              <div className="flex items-center gap-2">
                                <div className="text-xs text-muted-foreground">
                                  {new Date(entry.createdAt).toLocaleDateString("ko-KR", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteGuestbook(entry.id)}
                                  className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                              {entry.message}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                  <Button
                    variant="outline"
                    onClick={fetchGuestbook}
                    disabled={isLoading}
                    className="w-full mt-4"
                  >
                    {isLoading ? "새로고침 중..." : "새로고침"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 좋아요 탭 */}
            <TabsContent value="like" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Vibe Coding 투표 결과</CardTitle>
                  <CardDescription>
                    실시간으로 업데이트되는 투표 결과입니다
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <button
                      onClick={toggleLike}
                      disabled={isLiking}
                      className={`
                        flex items-center justify-between w-full p-4 border rounded-lg transition-colors
                        ${isLiked ? "bg-red-500/10 hover:bg-red-500/20" : "hover:bg-accent/50"}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`
                          w-12 h-12 rounded-full flex items-center justify-center transition-all
                          ${isLiked 
                            ? "bg-red-500/10 animate-pulse" 
                            : "bg-primary/10"
                          }
                        `}>
                          <Heart 
                            className={`
                              h-6 w-6 transition-all
                              ${isLiked ? "text-red-500 fill-red-500" : "text-primary"}
                            `}
                          />
                        </div>
                        <div>
                          <p className="font-semibold">Vibe Coding 프로젝트</p>
                          <p className="text-sm text-muted-foreground">
                            이 포트폴리오 웹사이트가 마음에 드시나요?
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{likeCount.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">표</div>
                      </div>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 랜덤 추천 탭 */}
            <TabsContent value="recommend" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>오늘의 Vibe Coding 추천</CardTitle>
                  <CardDescription>
                    Vibe Coding을 처음 경험하는 분들을 위한 한 줄 추천입니다.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-12 space-y-6">
                    {isLoadingRecommendation ? (
                      <div className="text-center text-muted-foreground">
                        <Sparkles className="h-12 w-12 mx-auto mb-4 animate-spin opacity-50" />
                        <p>추천 로딩 중...</p>
                      </div>
                    ) : (
                      <div className="text-center text-lg md:text-xl font-medium text-foreground leading-relaxed italic max-w-lg">
                        <Sparkles className="h-8 w-8 mx-auto mb-4 text-primary" />
                        <p>"{randomRecommendation}"</p>
                      </div>
                    )}
                    
                    <Button
                      onClick={fetchRecommendation}
                      disabled={isLoadingRecommendation}
                      size="lg"
                      className="rounded-full px-8 py-3"
                    >
                      {isLoadingRecommendation ? (
                        <>
                          <Sparkles className="h-5 w-5 mr-2 animate-pulse" />
                          새로운 추천 로딩 중...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5 mr-2" />
                          새로운 추천 받기
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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

# Portfolio API 문서

포트폴리오 정보를 제공하는 RESTful API입니다.

## Base URL

```
http://localhost:3000/api/portfolio
```

프로덕션 환경에서는 실제 도메인으로 변경하세요.

## 엔드포인트

### 전체 포트폴리오 정보 조회

전체 포트폴리오 데이터를 조회합니다.

**요청:**
```http
GET /api/portfolio
```

**응답:**
```json
{
  "developer": {
    "name": "개발자",
    "title": "개발자",
    "description": "창의적인 아이디어를 현실로 만들어가는 개발자입니다",
    "profileImage": "https://...",
    "about": {
      "introduction": [
        "저는 사용자 경험을 중시하며...",
        "새로운 기술을 배우고...",
        "다양한 프로젝트를 통해..."
      ]
    }
  },
  "projects": [
    {
      "id": 1,
      "title": "웹 애플리케이션",
      "description": "모던한 UI/UX를 갖춘 반응형 웹 애플리케이션",
      "image": "https://...",
      "tech": ["React", "TypeScript", "Next.js"],
      "details": {
        "fullDescription": "...",
        "features": [...],
        "duration": "2024.01 - 2024.03 (3개월)",
        "role": "풀스택 개발자",
        "challenges": [...]
      },
      "demoUrl": "https://example.com",
      "githubUrl": "https://github.com/example"
    }
  ],
  "skills": [
    {
      "name": "JavaScript",
      "image": "https://...",
      "category": "프로그래밍 언어"
    }
  ],
  "contact": {
    "email": "your.email@example.com",
    "github": "https://github.com"
  }
}
```

### 특정 섹션만 조회

쿼리 파라미터를 사용하여 특정 섹션만 조회할 수 있습니다.

**요청:**
```http
GET /api/portfolio?section=developer
GET /api/portfolio?section=projects
GET /api/portfolio?section=skills
GET /api/portfolio?section=contact
```

**응답 예시 (section=projects):**
```json
{
  "projects": [
    {
      "id": 1,
      "title": "웹 애플리케이션",
      ...
    }
  ]
}
```

### 방명록 API

방명록 항목을 조회하거나 새로 작성합니다.

**GET 요청:**
```http
GET /api/guestbook
```

**응답:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "방문자1",
      "message": "멋진 포트폴리오네요!",
      "createdAt": "2024-01-01T12:00:00.000Z"
    }
  ],
  "count": 1
}
```

**POST 요청:**
```http
POST /api/guestbook
Content-Type: application/json

{
  "name": "새로운 방문자",
  "message": "좋은 포트폴리오입니다."
}
```

**응답:**
```json
{
  "success": true,
  "data": {
    "id": 3,
    "name": "새로운 방문자",
    "message": "좋은 포트폴리오입니다.",
    "createdAt": "2024-01-01T12:30:00.000Z"
  },
  "message": "방명록이 성공적으로 작성되었습니다."
}
```

**DELETE 요청:**
```http
DELETE /api/guestbook?id=1
```

**응답:**
```json
{
  "success": true,
  "message": "방명록이 성공적으로 삭제되었습니다."
}
```

### 좋아요 API

'Vibe Coding' 프로젝트에 대한 좋아요 수를 조회하고 토글합니다.

**GET 요청:**
```http
GET /api/like
```

**헤더:**
```
X-Client-ID: [클라이언트_고유_ID]
```

**응답:**
```json
{
  "success": true,
  "data": {
    "count": 43,
    "isLiked": true,
    "lastUpdated": "2024-01-01T12:00:00.000Z"
  }
}
```

**POST 요청:**
```http
POST /api/like
Content-Type: application/json
X-Client-ID: [클라이언트_고유_ID]

{
  "action": "like"  // 또는 "unlike"
}
```

**응답:**
```json
{
  "success": true,
  "data": {
    "count": 43,
    "isLiked": true,
    "lastUpdated": "2024-01-01T12:00:00.000Z"
  },
  "message": "좋아요가 추가되었습니다."
}
```

### 랜덤 추천 API

'Vibe Coding'을 처음 경험하는 사람들을 위한 랜덤 한 줄 추천 메시지를 제공합니다.

**GET 요청:**
```http
GET /api/recommend
```

**응답:**
```json
{
  "success": true,
  "data": {
    "message": "처음은 누구나 어렵습니다. 하지만 당신의 열정은 코드를 움직이는 가장 강력한 엔진입니다!"
  }
}
```

## 사용 예시

### cURL

```bash
# 전체 포트폴리오 조회
curl http://localhost:3000/api/portfolio

# 프로젝트만 조회
curl http://localhost:3000/api/portfolio?section=projects

# 개발자 정보만 조회
curl http://localhost:3000/api/portfolio?section=developer

# 랜덤 추천 조회
curl http://localhost:3000/api/recommend
```

### JavaScript (Fetch API)

```javascript
// 전체 포트폴리오 조회
fetch('http://localhost:3000/api/portfolio')
  .then(response => response.json())
  .then(data => console.log(data));

// 프로젝트만 조회
fetch('http://localhost:3000/api/portfolio?section=projects')
  .then(response => response.json())
  .then(data => console.log(data.projects));

// 랜덤 추천 조회
fetch('/api/recommend')
  .then(response => response.json())
  .then(data => console.log(data));
```

### Python

```python
import requests

# 전체 포트폴리오 조회
response = requests.get('http://localhost:3000/api/portfolio')
data = response.json()
print(data)

# 프로젝트만 조회
response = requests.get('http://localhost:3000/api/portfolio?section=projects')
projects = response.json()['projects']
print(projects)

# 랜덤 추천 조회
response = requests.get('http://localhost:3000/api/recommend')
data = response.json()
print(data)
```

## 데이터 구조

### Developer
- `name`: 개발자 이름
- `title`: 직책/타이틀
- `description`: 간단한 소개
- `profileImage`: 프로필 이미지 URL
- `about.introduction`: 자기소개 배열

### Project
- `id`: 프로젝트 ID
- `title`: 프로젝트 제목
- `description`: 프로젝트 설명
- `image`: 프로젝트 이미지 URL
- `tech`: 사용 기술 스택 배열
- `details`: 상세 정보 (선택사항)
  - `fullDescription`: 전체 설명
  - `features`: 주요 기능 배열
  - `duration`: 개발 기간
  - `role`: 역할
  - `challenges`: 도전 과제 배열
- `demoUrl`: 데모 URL (선택사항)
- `githubUrl`: GitHub URL (선택사항)

### Skill
- `name`: 기술 이름
- `image`: 기술 이미지 URL
- `category`: 기술 카테고리 (선택사항)

### Contact
- `email`: 이메일 주소
- `github`: GitHub 프로필 URL

## CORS

API는 CORS를 지원하므로 다른 도메인에서도 접근할 수 있습니다.

## 에러 처리

### 400 Bad Request
잘못된 쿼리 파라미터가 전달된 경우:
```json
{
  "error": "Invalid section parameter"
}
```

### 500 Internal Server Error
서버 오류가 발생한 경우:
```json
{
  "error": "Internal Server Error",
  "message": "Error details"
}
```


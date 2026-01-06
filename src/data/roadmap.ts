export type RoadmapStepBase = {
    id: string;
    title: string;
    description: string;
};

/**
 * Расширяемый тип: можно добавлять любые дополнительные поля
 * (duration, tags, links, difficulty, checklist и т.д.).
 */
export type RoadmapStep<Extra extends Record<string, unknown> = Record<string, unknown>> =
    RoadmapStepBase & Extra;

export type RoadmapStepExtras = {
    tags?: string[];
    difficulty?: "easy" | "mid" | "hard";
    duration?: string; // "1–2 недели"
    links?: Array<{ label: string; url: string }>;
    checklist?: string[];
};

export const roadmapSteps: Array<RoadmapStep<RoadmapStepExtras>> = [
    {
        id: "math-culture",
        title: "Математическая культура и доказательства",
        description:
            "Логика, множества, кванторы, методы доказательств. Формирование математического мышления и привычки к строгим определениям.",
        tags: ["math", "proofs", "logic"],
        difficulty: "easy",
        duration: "3–4 недели",
        links: [
            {
                label: "Математическая логика — ВШЭ (К. Кноблок)",
                url: "https://www.youtube.com/playlist?list=PLcsjsqLLSfNDX6hXn2JqQ6Jt8v0hXnqfH",
            },
            {
                label: "MIT Mathematics for Computer Science",
                url: "https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/",
            },
        ],
        checklist: [
            "Понимаю кванторы ∀ и ∃",
            "Умею доказывать от противного и по индукции",
            "Могу формально записать определение и контрпример",
        ],
    },

    {
        id: "linear-algebra",
        title: "Линейная алгебра (строгая)",
        description:
            "Векторные пространства, линейные отображения, собственные значения, ортогональность. Основа всех моделей ML.",
        tags: ["linear-algebra", "math", "core-ml"],
        difficulty: "mid",
        duration: "6–8 недель",
        links: [
            {
                label: "Линейная алгебра — ФКН ВШЭ (А. Кузнецов)",
                url: "https://www.youtube.com/playlist?list=PLcsjsqLLSfNDP8m0Ssv7Hc5sGz4lZp4Yk",
            },
            {
                label: "MIT 18.06 Linear Algebra (Strang)",
                url: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/",
            },
            {
                label: "Axler — Linear Algebra Done Right",
                url: "https://linear.axler.net/",
            },
        ],
        checklist: [
            "Понимаю векторные пространства и базисы",
            "Могу доказать теорему о ранге",
            "Понимаю спектральную теорему и SVD",
            "Знаю, что такое положительно определённые матрицы",
        ],
    },

    {
        id: "analysis",
        title: "Математический анализ (1D и многомерный)",
        description:
            "Пределы, непрерывность, производные, градиенты, гессианы. Строгая база для оптимизации и обучения моделей.",
        tags: ["analysis", "math", "optimization"],
        difficulty: "hard",
        duration: "8–10 недель",
        links: [
            {
                label: "Математический анализ — МФТИ",
                url: "https://www.youtube.com/playlist?list=PLcsjsqLLSfNDpJcZCkzYz9bA9YjKX5qfP",
            },
            {
                label: "Apostol — Calculus Vol. 1–2",
                url: "https://www.amazon.com/dp/0471000051",
            },
            {
                label: "Spivak — Calculus on Manifolds",
                url: "https://www.amazon.com/dp/0805390219",
            },
        ],
        checklist: [
            "Понимаю строгие определения предела и непрерывности",
            "Работаю с градиентом как линейным отображением",
            "Понимаю условия экстремума через гессиан",
        ],
    },

    {
        id: "measure-probability",
        title: "Теория меры и вероятность",
        description:
            "Вероятность как теория меры: ожидание, сходимости, LLN, CLT, концентрация. Критично для теории ML.",
        tags: ["probability", "measure-theory", "math"],
        difficulty: "hard",
        duration: "8–10 недель",
        links: [
            {
                label: "Теория вероятностей — МФТИ",
                url: "https://www.youtube.com/playlist?list=PLcsjsqLLSfNCrPp4S4z5h6f7nF3GxJ5xM",
            },
            {
                label: "Durrett — Probability: Theory and Examples",
                url: "https://www.amazon.com/dp/1108473687",
            },
            {
                label: "Terry Tao — Measure Theory Notes",
                url: "https://terrytao.wordpress.com/books/an-introduction-to-measure-theory/",
            },
        ],
        checklist: [
            "Понимаю вероятность как меру",
            "Умею работать с математическим ожиданием",
            "Знаю виды сходимости и их связи",
            "Понимаю концентрационные неравенства",
        ],
    },

    {
        id: "statistics",
        title: "Математическая статистика",
        description:
            "Оценивание, ММП, байесовский вывод, асимптотика. Основа обобщения и интерпретации моделей.",
        tags: ["statistics", "inference", "ml-theory"],
        difficulty: "mid",
        duration: "6–8 недель",
        links: [
            {
                label: "Математическая статистика — ВШЭ",
                url: "https://www.youtube.com/playlist?list=PLcsjsqLLSfNDqzZ8QG9H8b5Fz3zXnq0mB",
            },
            {
                label: "Casella & Berger — Statistical Inference",
                url: "https://www.amazon.com/dp/0534243126",
            },
        ],
        checklist: [
            "Понимаю ММП и MAP",
            "Знаю свойства оценок (несмещённость, состоятельность)",
            "Понимаю доверительные интервалы и гипотезы",
        ],
    },

    {
        id: "optimization",
        title: "Оптимизация для ML",
        description:
            "Выпуклость, KKT, градиентные методы, SGD. Математика обучения моделей.",
        tags: ["optimization", "convex", "ml-core"],
        difficulty: "hard",
        duration: "6–8 недель",
        links: [
            {
                label: "Выпуклая оптимизация — ВШЭ",
                url: "https://www.youtube.com/playlist?list=PLcsjsqLLSfNDuY0m8z5QJzvF3ZbLJr2Pp",
            },
            {
                label: "Boyd & Vandenberghe — Convex Optimization",
                url: "https://web.stanford.edu/~boyd/cvxbook/",
            },
            {
                label: "Nesterov — Convex Optimization",
                url: "https://www.springer.com/gp/book/9780387006655",
            },
        ],
        checklist: [
            "Понимаю выпуклые функции и множества",
            "Умею применять условия KKT",
            "Понимаю сходимость градиентных методов",
        ],
    },

    {
        id: "transition-to-ml",
        title: "Переход к машинному обучению",
        description:
            "После полной математической базы — классический и теоретический ML без пробелов.",
        tags: ["ml", "theory", "transition"],
        difficulty: "mid",
        duration: "4–6 недель",
        links: [
            {
                label: "Сергей Николенко — Машинное обучение",
                url: "https://www.youtube.com/playlist?list=PL6lj3g9Y2Hk9x3YqFzqZ8KxYz3XnPp2rM",
            },
            {
                label: "Shalev-Shwartz — Understanding Machine Learning",
                url: "https://www.cs.huji.ac.il/~shais/UnderstandingMachineLearning/",
            },
            {
                label: "Bishop — Pattern Recognition and Machine Learning",
                url: "https://www.springer.com/gp/book/9780387310738",
            },
        ],
        checklist: [
            "Понимаю вывод формул в ML",
            "Могу читать ML-статьи с математикой",
            "Понимаю, что и почему оптимизируется",
        ],
    },
];

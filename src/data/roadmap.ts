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
        id: "foundations-math",
        title: "Математика без боли",
        description:
            "Линейная алгебра (вектора, матрицы), базовый анализ (производные), вероятность/статистика — ровно настолько, чтобы понимать модели и метрики.",
        tags: ["math", "stats"],
        difficulty: "mid",
        duration: "1–2 недели",
    },
    {
        id: "python-stack",
        title: "Python + стек данных",
        description:
            "NumPy/Pandas, визуализация, работа с данными и типичный пайплайн: загрузка → очистка → признаки → модель → оценка.",
        tags: ["python", "numpy", "pandas"],
        difficulty: "easy",
        duration: "1 неделя",
    },
    {
        id: "ml-basics",
        title: "База ML: постановка задачи",
        description:
            "Классификация/регрессия, train/val/test, утечки данных, baseline, кросс-валидация. Учимся задавать правильные вопросы к данным.",
        tags: ["ml", "baseline"],
        difficulty: "easy",
        duration: "1 неделя",
    },
    {
        id: "metrics",
        title: "Метрики и валидация",
        description:
            "Accuracy/Precision/Recall/F1, ROC-AUC/PR-AUC, RMSE/MAE, калибровка. Подбирать метрику под бизнес-смысл и не обманывать себя.",
        tags: ["metrics"],
        difficulty: "mid",
        duration: "3–5 дней",
    },
    {
        id: "classic-models",
        title: "Классические модели",
        description:
            "Линейные модели, деревья, случайный лес, градиентный бустинг. Понимать, когда что работает, и почему бустинг — твой друг.",
        tags: ["sklearn", "trees", "boosting"],
        difficulty: "mid",
        duration: "1–2 недели",
    },
    {
        id: "feature-engineering",
        title: "Признаки и подготовка данных",
        description:
            "Импутация, масштабирование, кодирование категорий, текстовые признаки, leakage, pipeline в sklearn. Делать данные удобными для модели.",
        tags: ["features", "pipelines"],
        difficulty: "mid",
        duration: "1 неделя",
    },
    {
        id: "model-debug",
        title: "Диагностика и улучшение",
        description:
            "Learning curves, bias/variance, overfitting, подбор гиперпараметров, early stopping. Улучшать осмысленно, а не «на удачу».",
        tags: ["debug", "tuning"],
        difficulty: "mid",
        duration: "1 неделя",
    },
    {
        id: "deep-learning-intro",
        title: "Порог в Deep Learning",
        description:
            "Понимание нейросетей: слои, активации, оптимизация, регуляризация. Достаточно, чтобы уверенно читать туториалы и статьи.",
        tags: ["dl", "nn"],
        difficulty: "hard",
        duration: "1–2 недели",
    },
    {
        id: "cv-or-nlp",
        title: "Выбери ветку: CV или NLP",
        description:
            "Компьютерное зрение (CNN, аугментации) или NLP (токенизация, трансформеры). Выбирай то, что ближе сердцу (и лего-вселенной).",
        tags: ["cv", "nlp"],
        difficulty: "mid",
        duration: "1–2 недели",
    },
    {
        id: "embeddings",
        title: "Эмбеддинги и представления",
        description:
            "Векторные представления, similarity search, базовые идеи retrieval. Это часто делает проекты «умными» без магии.",
        tags: ["embeddings"],
        difficulty: "mid",
        duration: "3–7 дней",
    },
    {
        id: "interpretability",
        title: "Интерпретация и доверие",
        description:
            "Feature importance, SHAP (идея), ошибки и их анализ. Уметь объяснить модель и не бояться «почему она так решила».",
        tags: ["xai", "analysis"],
        difficulty: "mid",
        duration: "3–7 дней",
    },
    {
        id: "mlops-lite",
        title: "MLOps-лайт без боли",
        description:
            "Версионирование данных/моделей, воспроизводимость, контроль экспериментов, простая структура проекта. Дисциплина — суперсила.",
        tags: ["mlops", "repro"],
        difficulty: "mid",
        duration: "1 неделя",
    },
    {
        id: "production",
        title: "Продакшен-мышление",
        description:
            "Инференс, latency, мониторинг качества, дрейф данных, A/B-тесты. Делать так, чтобы модель жила, а не умирала после ноутбука.",
        tags: ["prod", "monitoring"],
        difficulty: "hard",
        duration: "1–2 недели",
    },
    {
        id: "capstone",
        title: "Капстоун-проект под луной ✨",
        description:
            "Собери мини-проект: данные → пайплайн → модель → оценка → выводы. Красиво оформи README как историю: «я прошёл путь».",
        tags: ["project", "portfolio"],
        difficulty: "mid",
        duration: "1–2 недели",
    }
];

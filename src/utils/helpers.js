export const normalizeAnswer = (str) => {
    if (!str) return "";
    return str
        .toUpperCase()
        .replace(/\s/g, "")
        .replace(/['`]/g, '"')
        .replace(/;/g, ",")
        .trim();
};

export const calculateGrade = (score, totalMaxScore) => {
    const percentage = totalMaxScore > 0 ? (score / totalMaxScore) * 100 : 0;
    if (percentage >= 90) return "A";
    if (percentage >= 80) return "B";
    if (percentage >= 70) return "C";
    if (percentage >= 60) return "D";
    return "E";
};

export const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

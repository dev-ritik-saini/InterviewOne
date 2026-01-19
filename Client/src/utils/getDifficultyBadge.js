export const getDifficultyBadge = (difficulty) => {
    switch (difficulty.toLowerCase()) {
        case "easy":
            return "bg-success text-success-content";
        case "medium":
            return "bg-warning text-warning-content";
        case "hard":
            return "bg-error text-error-content";
        default:
            return "bg-neutral text-neutral-content";
    }
};
